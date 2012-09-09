if (typeof(BML) == 'undefined') throw('BML.js not loaded yet');
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var browser = (typeof(browser) != 'undefined') ? browser : {};
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
BML.Util.extend(browser, (function() {
  /** @class Uregを実装する内部クラス ** シングルトンとしてbrowser.Uregにインスタンス化される．
   *  @name  browser-UregClass */  
  function UregClass() { this.data = new Array(64); }
  // browser.Uregの擬似オブジェクト
  // 仕様は下記のとおりなので，getteer/setterを用いて擬似的な配列を作成し，
  // 文字列長判定などをハンドルする．
  // @Todo：UserDataとしてブラウザ側に保存する
  //
  // B24 第二編 7.6.15 Ureg 疑似オブジェクト特性
  // 「Ureg は、0〜63 までの64 個の値を保持し、」「文字列のサイズは最大256 バイト
  // である。」「256 バイトまでを格納する。256 バイト目が2 バイト文字の1 バイト目
  // だった場合は、当該文字は格納されない。」
  for(var i = 0; i < 64; i++) {
    /** 配列と同様にUregの各値(Ureg[i])にアクセスするためのgetter/setterプロパティ．iは0〜63の数値． @propertyEx browser-UregClass.prototype.i|String|read/write */
    /** UregClassの各値(Ureg[i])にアクセスするためのgetter無名関数． @name browser.$anonymous0 @methodOf browser */
    UregClass.prototype.__defineGetter__(i, function() {
      return(this.data[i]);
    });
    /** UregClassの各値(Ureg[i])にアクセスするためのsetter無名関数． @name browser.$anonymous1 @methodOf browser */
    UregClass.prototype.__defineSetter__(i, function(val) {
      if (val.length <= 128) {
        // 文字列長判定が不要な場合
        this.data[i] = val;
      } else {
        // 文字列長判定
        var pos = 0;
        for(var cl, len = 0, max = val.length; pos < max; pos++) {
          cl = val.charCodeAt(pos);
          if ((len + cl) > 256) break;
          len += cl;
        }
        this.data[i] = val.substring(0, pos - 1);
      }
    });
  }
  
  return({
    /** Ureg疑似オブジェクト特性 @propertyEx browser.Ureg|browser-UregClass|new UregClass @static */
    Ureg : new UregClass()
  });
})());


/** @class BinaryTableクラス
 *  実体はBinaryTable-BinaryTableClass
 *  @name  BinaryTable
 *  @param {Sting} table_ref 表ファイルの指定
 *  @param {Sting} structure 表のフォーマット指定
 *  @throw {BinaryTableInvalidStructure} フォーマットの記述が正しくない場合
 */
var BinaryTable = (function() {
  /** @class バイト列から任意のバイト/ビット列を取得するための内部クラス @inner
   *  @name  BinaryTable-ByteHandler
   *  @param {Array<Number>} [bytes] バイト列の各バイト値を整数値表現した配列
   */
  function ByteHandler(bytes) {
    /**#@+ @memberOf BinaryTable-ByteHandler.prototype */
    /** 対象バイト列の各バイト単位を整数値表現した配列． @propertyEx  BinaryTable-ByteHandler.prototype.bytes  |Array<Number>|new Array() */
    this.bytes   = bytes || [];
    /** バイト列内の現在のバイト位置．最左が0．          @propertyEx  BinaryTable-ByteHandler.prototype.byteIdx|Number|0 */
    this.byteIdx = 0;
    /** 現在のバイト位置におけるビット位置．最左が0．    @propertyEx  BinaryTable-ByteHandler.prototype.bitPos |Number|0 */
    this.bitPos  = 0;
    /**#@-*/
  }
  /**#@+ @methodOf BinaryTable-ByteHandler */
  /** 保持するバイト列の最後尾に指定のバイト値を追加する．
   *  @name    BinaryTable-ByteHandler.prototype.push
   *  @param   {Number} b 追加するバイト値の整数値表現(0〜255)
   */
  ByteHandler.prototype.push = function(b) {
    this.bytes.push(b);
  };
  /** バイト列から次に取得するビット値が存在するかを判定する．
   *  @name    BinaryTable-ByteHandler.prototype.hasNextBit
   *  @returns {Boolean} ビット値が存在有無(有=true)
   */
  ByteHandler.prototype.hasNextBit = function() {
    var max = this.bytes.length - 1;
    return( (this.byteIdx <  max) ||
           ((this.byteIdx == max) && (this.bitPos < 8)));
  };
  /** バイト列から次に取得するバイト値が存在するかを判定する．
   *  @name    BinaryTable-ByteHandler.prototype.hasNextByte
   *  @returns {Boolean} バイト値が存在有無(有=true)
   */
  ByteHandler.prototype.hasNextByte = function() {
    var max = this.bytes.length - 1;
    return( (this.byteIdx <  max) ||
           ((this.byteIdx == max) && (this.bitPos === 0)));
  };
  /** バイト列から指定の長さのバイト列を，各バイト単位の整数値表現を格納した配列として取得する．
   *  @name    BinaryTable-ByteHandler.prototype.getBytes
   *  @param   {Number}        len バイト長
   *  @returns {Array<Number>} 各バイト単位の整数値表現を格納する配列
   */
  ByteHandler.prototype.getBytes = function(len) {
    len = isNaN(len) ? 1 : len;

    var ret = [], i;
    var bytes = this.bytes, idx = this.byteIdx, pos = this.bitPos;
    if (pos === 0) {
      for(i = 0; i < len; i++) {
        ret[i] = (bytes[idx++] || 0x00);
      }
    } else {
      for(i = 0; i < len; i++) {
        var buf = ((bytes[idx++] || 0x00) << 8) | (bytes[idx] || 0x00);
        ret[i] = (buf >> (8 - pos)) & 0xff;
      }
    }
    this.byteIdx = idx;
    
    return(ret);
  };
  /** バイト列から1バイト値の整数値表現を取得する．
   *  @name    BinaryTable-ByteHandler.prototype.getByte
   *  @returns {Number} バイト値の整数値表現
   */
  ByteHandler.prototype.getByte = function() {
    return(this.getBytes(1)[0]);
  };
  /** バイト列から指定の長さのバイト列を，符号付き整数値として取得する．
   *  @name    BinaryTable-ByteHandler.prototype.getBytesAsInteger
   *  @param   {Number} len バイト数
   *  @returns {Number}     バイト値の符号付き整数値表現
   */
  ByteHandler.prototype.getBytesAsInteger = function(len) {
    var bytes = this.getBytesAsUnsignedInteger(len);

    var msb = 0x80;
    for(var i = 1; i < len; i++) {
      msb  = (msb  << 8) | 0x00;
    }
    // 最上位ビットチェック(負数チェック)
    if ((ret & msb) > 0) ret = (ret & ~msb) - msb;
    
    return(ret);
  };
  /** バイト列から指定の長さのバイト列を，符号なし整数値として取得する．
   *  @name    BinaryTable-ByteHandler.prototype.getBytesAsUnsignedInteger
   *  @param   {Number} len バイト数
   *  @returns {Number}     バイト値の符号なし整数値表現
   */
  ByteHandler.prototype.getBytesAsUnsignedInteger = function(len) {
    var bytes = this.getBytes(len);
    var ret = 0;
    for(var i = 0; i < len; i++) {
      ret = (ret << 8) | (bytes[i] || 0x00);
    }
    return(ret);
  };
  /** バイト列からビット列を符号なし整数値表現で取得する．
   *  @name    BinaryTable-ByteHandler.prototype.getBits
   *  @param   {Number} len    ビット長
   *  @param   {Number} [mask] ビット長のマスク表現
   *  @returns {Number}        ビット列の符号なし整数値表現
   */
  ByteHandler.prototype.getBits = function(len, mask) {
    var i, l;
    if (!mask) {
      for(mask = 0x01, i = 1; i < len; i++) { mask = (mask << 1) | 0x01; }
    }
  
    var ret, shift;
    var bytes = this.bytes, idx = this.byteIdx, pos = this.bitPos;
    if (len < 8) { // 1byte未満なら
      shift = 8 - pos - len;
      if (shift >= 0) {
        ret = (bytes[idx] || 0x00);
        ret = (ret >>> shift) & mask;
        this.bitPos += len;
      } else {
        ret = ((bytes[idx++] || 0x00) << 8) & (bytes[idx] || 0x00);
        ret = (ret >>> (8 + shift)) & mask;
        this.pos = -shift;
      }
      this.byteIdx = idx;
    } else { // 1byte以上なら
      ret = (bytes[idx] || 0x00);
      for(i = 1, l = Math.ceil((pos + len) / 8); i < l; i++) {
        ret = (ret << 8) & (bytes[++idx] || 0x00);
      }
      this.bitPos  = (pos + len) % 8;
      shift        = (8 - this.bitPos) % 8;
      ret          = (ret >>> shift) & mask;
      this.byteIdx = idx;
    }
    return(ret);
  };
  /** バイト列からビット列を符号なし整数値表現で取得する．
   *  @name    BinaryTable-ByteHandler.prototype.getBitsAsUnsignedInteger
   *  @param   {Number} len    ビット長
   *  @param   {Number} [mask] ビット長のマスク表現
   *  @returns {Number}        ビット列の符号なし整数値表現
   */
  ByteHandler.prototype.getBitsAsUnsignedInteger = function(len, mask) {
    return(this.getBits(len, mask));
  };
  /** バイト列からビット列を符号付き整数値表現で取得する．<br>
   *  ビット長の最上位ビットを符号ビットとして判定し，バイトアライメントは考慮しない．
   *  @name    BinaryTable-ByteHandler.prototype.getBitsAsInteger
   *  @param   {Number} len    ビット長
   *  @param   {Number} [mask] ビット長のマスク表現
   *  @returns {Number}        ビット列の符号付き整数値表現
   */
  ByteHandler.prototype.getBitsAsInteger = function(len) {
    var msb = 0x01;
    for(i = 1; i < len; i++) {
      msb  = (msb  << 1) | 0x00;
    }
    var mask = ~msb;
    
    var bits = this.getBits(len, msb | mask);
    // 最上位ビットチェック(負数チェック)
    if ((bits & msb) > 0) bits = (bits & mask) - msb;
    
    return(bits);
  };
  /**#@-*/

  /**#@+ @methodOf BinaryTable @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  /** BinaryTableのフォーマットを解析する．
   *  @name    BinaryTable.parseStructure
   *  @param   {String}        structure     BinaryTableのフォーマットを記述した文字列
   *  @returns {Array<Object>}               次の値をプロパティに持つオブジェクトの集合<br>
   *                                         [.type]    フィールドの型(B/U/I/S/Z/P)
   *                                         [.length]  フィールドの長さ
   *                                         [.unit]    フィールドの長さを表す単位(B/b/V)
   *                                         [.mask]    ビット長のマスク表現(unitがb(ビット)の場合)
   *  @throw   {BinaryTableInvalidStructure} フォーマットの記述が正しくない場合
   */
  function parseStructure(structure) {
    var columns    = structure.split(',');
    var lengthByte = columns.shift();

    structure = [];
    var length, unit, mask;
    for(i = 0, l = columns.length; i < l; i++) {
      var match = /^(\w):(\d+)(\w)$/.exec(columns[i]);
      if (!match) throw('[BinaryTableInvalidStructure] : '+columns[i]);

      
      length = parseInt(match[2], 10);
      unit   = match[3];
      mask   = 0x01;
      
      if (unit == 'b') {
        for(i = 1; i < length; i++) {
          mask = ((mask << 1) | 0x01);
        }
      }
      structure.push({
        type   : match[1],
        length : length,
        unit   : unit,
        mask   : mask
      });
    }
    structure.lengthByte = lengthByte;
    return(structure);
  }
  /** 郵便番号を整数値表現に変換する．
   *  @name    BinaryTable.zipCodeToInteger
   *  @param   {Number} digit 郵便番号の上位2桁
   *  @param   {Number} a     郵便番号の上位3桁目
   *  @param   {Number} b     郵便番号の下位1桁目
   *  @param   {Number} c     郵便番号の下位2桁目
   *  @param   {Number} d     郵便番号の下位3桁目
   *  @param   {Number} e     郵便番号の下位4桁目
   *  @returns {Number}       郵便番号の整数値表現
   */
  function zipCodeToInteger(digit, a, b, c, d, e) {
    return(digit * 100000 + a * 10000 + b * 1000 + c * 100 * d * 10 * e);
  }
  /** 郵便番号の整数値表現がlist内に含まれているかを判定する．
   *  @name    BinaryTable.includeZipCode
   *  @param   {Number}        zipCode 郵便番号の整数値表現
   *  @param   {Array<Object>} list    次の値を持つオブジェクトのリスト<br>
   *                                   [.from] 範囲の下限値
   *                                   [.to]   範囲の上限値
   *  @returns {Boolean}               包含有無(有=true)
   */
  function includeZipCode(zipCode, list) {
    for(var i = 0, l = list.length; i < l; i++) {
      var condition = list[i];
      if ((condition.from <= zipCode) && (zipCode <= condition.to)) return(true);
    }
    return(false);
  }

//  String.prototype.toBoolean = function() { return((this.toString() !== '')); };
//  Number.prototype.toBoolean = function() { return(this !== 0); };
  /** Stringオブジェクトを数値表現に変換する．
   *  @name BinaryTable.stringToNumber
   *  @param   {String} s 対象のStringオブジェクト
   *  @returns {Number}   Stringオブジェクトの数値表現
   */
  var stringToNumber  = function(s) { return((s.toString() === '') ? 0 : parseInt(s, 10)); };
  /** Booleanオブジェクトを数値表現に変換する．
   *  @name BinaryTable.booleanToNumber
   *  @param   {Boolean} b 対象のBooleanオブジェクト
   *  @returns {Number}    Booleanオブジェクトの数値表現
   */
  var booleanToNumber = function(b) { return(b ? 1 : 0); };
  /**#@-*/
  
  // BinaryTableの実装
  // @param {Sting} table_ref 表ファイルの指定
  // @param {Sting} structure 表のフォーマット指定
  // @throw {BinaryTableInvalidStructure} フォーマットの記述が正しくない場合
  function BinaryTableClass(table_ref, structure) {
    // ARIB STD-B24 第二編「7.5.2.2 BinaryTable オブジェクトのコンストラクタ」
    // データの取得
    var uri = BML.Util.combinePath(table_ref, BML.uri);
    var ajax = new BML.Ajax(uri, {
    overrideMimeType : 'text/plain; charset=x-user-defined',
    asynchronous     : false,
    method           : 'GET'
    });
    // @Todo：ステータスコードの扱いがゾンザイ
    if (ajax.response.statusCode != 200) throw('[FileNotFound] :'+uri);

    // バイト列としてバッファ
    var byteHandler = new ByteHandler(), i, l;
    var stream = ajax.response.responseText;
    for(i = 0, l = stream.length; i < l; i++) {
      byteHandler.push(stream._charCodeAt_(i) & 0x00ff);
    }
    
    // structureの解析
    structure = parseStructure(structure);
    
    // テーブルの作成
    var table = [], entry;
    while(1) {
      if (!byteHandler.hasNextBit()) break;
      // @Todo：lengthByteを数えていないが問題ないか?
      
      entry = [];
      for(i = 0, l = structure.length; i < l; i++) {
        var field = structure[i];
        
        switch(field.type) {
          case('B') : {
            // Boolean
            entry.push(new Boolean((byteHandler.getBits(1) > 0)));
          } break;
          case('U') : {
            // Unsigned Integer
            entry.push(new Number((field.unit == 'b') ?
                                  byteHandler.getBitsAsUnsignedInteger (field.length, field.mask) :
                                  byteHandler.getBytesAsUnsignedInteger(field.length)));
            } break;
          case('I') : {
            entry.push(new Number(byteHandler.getBytesAsInteger(field.length)));
          } break;
          case('S') : {
            if (field.unit == 'B') { // 固定長で文字列を取得する
              entry.push(String.charCodeFrom.apply(null,
                                                      byteHandler.getBytes(field.length)));
            } else { // 'V'：可変長→文字列の順番で取得する
              length = byteHandler.getBytesAsUnsignedInteger(field.length);
              entry.push(String.charCodeFrom.apply(null,
                                                   byteHandler.getBytes(length)));
            }
          } break;
          case('P') : {
            (field.unit == 'b') ?
              byteHandler.getBitsAsUnsignedInteger (field.length, field.mask) :
              byteHandler.getBytesAsUnsignedInteger(field.length);
          } break;
          case('Z') : {
            length    = byteHandler.getBytesAsUnsignedInteger(field.length);
            var whole = { include : {}, exclude : {} };

            var includeListNum = byteHandler.getBytesAsUnsignedInteger(1) - 1;
            var excludeListNum = byteHandler.getBytesAsUnsignedInteger(1) / 4;
            includeListNum = includeListNum / 4 - excludeListNum;

            BML.Util.each.call([[whole.exclude, excludeListNum],
                                [whole.include, includeListNum]], function(param) {
              var list = param[0], rangeFrom, msb, from, to, digits, flag, a, b, c, d, e;
              for(var i = 0, l = param[1];  i < l; i++) {
                msb = byteHandler.getBits(1);

                if (!msb) {
                  from = byteHandler.getBitsAsUnsignedInteger(7) * 10;
                  msb  = byteHandler.getBits(1);
                  to   = byteHandler.getBitsAsUnsignedInteger(7) * 10;
                  list.push({
                    from  : (from + 0) * 10000 +     0,
                    to    : (to   + 9) * 10000 +  9999
                  });
                  if (msb) {
                    from = byteHandler.getBitsAsUnsignedInteger(7) * 10;
                    msb  = byteHandler.getBits(1);
                    to   = byteHandler.getBitsAsUnsignedInteger(7) * 10;
                    list.push({
                      from  : (from + 0) * 10000 +     0,
                      to    : (to   + 9) * 10000 +  9999
                    });
                  } else {
                    byteHandler.getBytesAsInteger(2);
                  }

                } else {
                  digits = byteHandler.getBitsAsUnsignedInteger(7);
                  flag   = byteHandler.getBitsAsUnsignedInteger(4);
                  a      = byteHandler.getBitsAsUnsignedInteger(4);
                  b      = byteHandler.getBitsAsUnsignedInteger(4);
                  c      = byteHandler.getBitsAsUnsignedInteger(4);
                  d      = byteHandler.getBitsAsUnsignedInteger(4);
                  e      = byteHandler.getBitsAsUnsignedInteger(4);
                  
                  switch(flag) {
                    case(0x08) : {  // 3digit list
                      BML.Util.each.call([a, b, c, d, e], function(num) {
                        if (num == 0x0f) return;
                        list.push({
                          from  : zipCodeToInteger(digits, num, 0, 0, 0, 0),
                          to    : zipCodeToInteger(digits, num, 9, 9, 9, 9)
                        });
                      });
                      rangeFrom = null;
                    } break;
                    case(0x09) : { // 3digit range
                      BML.Util.each.call([[b, c], [d, e]], function(num) {
                        if ((num[0] == 0x0f) || (num[1] == 0x0f)) return;
                        list.push({
                          from  : zipCodeToInteger(digits, num[0], 0, 0, 0, 0),
                          to    : zipCodeToInteger(digits, num[1], 9, 9, 9, 9)
                        });
                      });
                      rangeFrom = null;
                    } break;
                    case(0x0a) : { // 5digit list
                      BML.Util.each.call([[b, c], [d, e]], function(num) {
                        if ((num[0] == 0x0f) || (num[1] == 0x0f)) return;
                        list.push({
                          from  : zipCodeToInteger(digits, a, num[0], num[1], 0, 0),
                          to    : zipCodeToInteger(digits, a, num[0], num[1], 9, 9)
                        });
                      });
                      rangeFrom = null;
                    } break;
                    case(0x0b) : { // 5digit range from
                      rangeFrom = zipCodeToInteger(digits, a, b, c, 0, 0);
                    } break;
                    case(0x0c) : { // 5digit range to
                      if (!rangeFrom) throw('[InvalidFieldFormat] : 5 digit range from not defined');
                      list.push({
                        from  : rangeFrom,
                        to    : zipCodeToInteger(digits, a, b, c, 9, 9)
                      });
                      rangeFrom = null;
                    } break;
                    case(0x0d) : { // 7digit range from
                      rangeFrom = zipCodeToInteger(digits, a, b, c, d, e);
                    } break;
                    case(0x0e) : { // 7digit range to
                      if (!rangeFrom) throw('[InvalidFieldFormat] : 7 digit range from not defined');
                      list.push({
                        from  : rangeFrom,
                        to    : zipCodeToInteger(digits, a, b, c, d, e)
                      });
                      rangeFrom = null;
                    } break;
                    case(0x0f) : { // 7digit list
                      list.push({
                        from  : zipCodeToInteger(digits, a, b, c, d, e),
                        to    : zipCodeToInteger(digits, a, b, c, d, e)
                      });
                      rangeFrom = null;
                    } break;
                    default : { break; }
                  }
                }
              }
            });
            entry.push(whole);
          } break;
        default : { break; }
        }
      }
      table.push(entry);
    }
    var buf = []; // remove padding field
    for(i = 0, l = structure.length; i < l; i++) {
      entry = structure[i];
      if (entry.type != 'P') buf.push(entry);
    }
    /**#@+ @memberOf BinaryTable.prototype */
    /** テーブルのフォーマットの解析結果を保持する．     @propertyEx BinaryTable.prototype.structure|Array<Object>       |解析結果 */
    this.structure = buf;
    /** 表ファイルの解析結果を二次元配列として保持する． @propertyEx BinaryTable.prototype.table    |Array<Array<Object>>|解析結果 */
    this.table     = table;
    /** 表ファイルの行数を保持する．                     @propertyEx BinaryTable.prototype.nrow     |Number              |表ファイルの行数 */
    this.nrow      = table.length;
    /** 表ファイルの列数を保持する．                     @propertyEx BinaryTable.prototype.ncolumn  |Number              |表ファイルの列数 */
    this.ncolumn   = buf.length;
    
    return(this);
  }

  /**#@+ @methodOf BinaryTable.prototype */
  /** BinaryTableオブジェクトの扱いの終了を宣言する．
   *  @name BinaryTable.prototype.close
   */
  BinaryTableClass.prototype.close = function() {
    this.structure = null;
    this.table     = null;
    return(1);
  };
  /** 表の1フィールドを文字列として出力する．
   *  @name    BinaryTable.prototype.toString
   *  @param   {Number} row    対象フィールドの行位置
   *  @param   {Number} column 対象フィールドの列位置
   *  @returns {String}        フィールドの文字列表現
   */
  BinaryTableClass.prototype.toString = function(row, column) {
    if (((row    < 0) || (this.nrow    <= row   )) ||
        ((column < 0) || (this.ncolumn <= column))) return(null);

    var value = this.table[row][column];
    switch(this.structure[column].type) {
      case('B') : return(value.toString());
      case('U') : return(value.toString());
      case('I') : return(value.toString());
//    case('S') : return(value);
      case('Z') : return(null);
      default   : return(value);
    }
    return(value);
  };
  /** 表の1フィールドを数値として出力する．
   *  @name    BinaryTable.prototype.toNumber
   *  @param   {Number} row    対象フィールドの行位置
   *  @param   {Number} column 対象フィールドの列位置
   *  @returns {Number}        フィールドの数値表現
   */
  BinaryTableClass.prototype.toNumber = function(row, column) {
    if (((row    < 0) || (this.nrow    <= row   )) ||
        ((column < 0) || (this.ncolumn <= column))) return(NaN);

    var value = this.table[row][column];
    switch(this.structure[column].type) {
      case('B') : return(booleanToNumber());
//    case('U') : return(value);
//    case('I') : return(value);
      case('S') : return(stringToNumber());
      case('Z') : return(NaN);
      default   : return(value);
    }
    return(value);
  };
  /** 表中のレコードを配列として出力する．
   *  @name    BinaryTable.prototype.toArray
   *  @param   {Number} startRow 抜き出すレコードの開始行位置
   *  @param   {Number} numRow   抜き出すレコード数
   *  @returns {Array}           連続するレコードを格納した配列
   */
  BinaryTableClass.prototype.toArray = function(startRow, numRow) {
    if (startRow < 0) return(null);

    var ret = [], structure = this.structure;
    var i = startRow, max = startRow + numRow, l = structure.length;
    while((i < this.nrow) && (i < max)) {
      var entry = [], row = this.table[i];
      for(var j = 0; j < l; j++) {
        entry.push((structure[j].type != 'Z') ? row[j] : null);
      }
      ret.push(entry);
      i++;
    }
    for(i = ret.length; i < numRow; i++) {
      ret.push(null); // padding
    }
    
    return(ret);
  };
  /** 条件を満たす表中のレコードを出力する．
   *  @name    BinaryTable.prototype.search
   *  @param   {Number}  startRow       検索を開始するレコードの行位置
   *  @param   {Number}  searchedColumn 検索の対象となる列の位置
   *  @param   {Object}  compared       比較の対象(String/Number/Boolean)
   *  @param   {Number}  operator       比較条件
   *  @param   {Boolean} logic          複数の検索条件の関係(true:OR/false:AND)
   *  @param   {Number}  limitCount     検索で抜き出されるレコード数の制限値
   *  @param   {Array}   resultArray    出力レコードを格納する配列
   *  @returns {Number}                 連続するレコードを格納した配列
   *  @throw   {InvalidArguments}       引数が正しくない場合
   */
  BinaryTableClass.prototype.search = function() {
    var args = arguments.slice(0);

    var startRow    = args.shift();
    var resultArray = args.pop();
    var limitCount  = args.pop();
    var logic       = args.pop();
    if (args.length % 3) throw('[InvalidArguments] : not enough arguments');

    var conditionList = [];
    for(var i = 0, l = args.length / 3; i < l; i++) {
      conditionList.push({
        searchedColumn : args[i * 3 + 0],
        compared       : args[i * 3 + 1],
        operator       : args[i * 3 + 2]
      });
    }

    for(i = startRow, l = this.nrow; i < l; i++) {
      if (limitCount <= 0) break;

      var row = this.table[i], flag = true;
      for(var j = 0, m = conditionList.length; j < m; j++) {
        var condition = conditionList[j];
        var value     = row[condition.searchedColumn];
        var compared  = condition.compared;

        switch(condition.operator) {
          // Unsigned Integer or Signed Integer
          case( 0) : { flag = value == compared; } break;
          case( 1) : { flag = value != compared; } break;
          case( 2) : { flag = value <  compared; } break;
          case( 3) : { flag = value <= compared; } break;
          case( 4) : { flag = value >  compared; } break;
          case( 5) : { flag = value >= compared; } break;
          case( 6) : { flag = value &  compared; } break;
          case( 7) : { flag = value |  compared; } break;
          case( 8) : { flag = value ^  compared; } break;
          case( 9) : { flag = value & ~compared; } break;
          case(10) : { flag = value | ~compared; } break;
          case(11) : { flag = value ^ ~compared; } break;
          // String
          case(32) : { flag = value == compared;             } break;
          case(33) : { flag = value.indexOf(compared) >=  0; } break;
          case(34) : { flag = value.indexOf(compared) === 0; } break;
          case(35) : { flag =
            value.lastIndexOf(compared) == value.length - compared.length; } break;
          case(36) : { flag = value != compared;             } break;
          case(37) : { flag = value.indexOf(compared) <   0; } break;
          // Boolean
          case(64) : { flag = value == compared; } break;
          case(65) : { flag = value != compared; } break;
          // ZipCode
          case(96) : { flag =  includeZipCode(compared, value.include) &&
                              !includeZipCode(compared, value.exclude); } break;
          case(97) : { flag = !includeZipCode(compared, value.include) &&
                               includeZipCode(compared, value.exclude); } break;
          default  : { flag = true; } break;
        }
//        if ((logic && flag) || (!logic && !flag)) break;
        if (logic == flag) break;
      }

      if (flag) resulutArray.push(row);
      limitCount--;
    }

    return((resultArray.length <=  0) ? NaN : (limitCount <= 0) ? --i : -1);
  };
  /**#@-*/
  return(BinaryTableClass);
})();
