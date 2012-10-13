//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** 
 * @fileOverview BML文書をxhtml文書として再構築して駆動するための関数群を定義するファイル
 * @author       NTT Syber Solution Labs.
 * @version      0.1.5
 */
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 前提：
//   ・String.prototype.charCodeAt()などにおいて，表面上，文字コードをEUC-JPで
//     扱う必要があるため外部ライブラリ(ecl.js)を使用している．BML.jsを読み込む
//     前に読み込むこと．
// 注意：
//   ・String.prototype.charCodeAt()，String.fromCharCode()はoverrideしている
//     ので使用しないこと．元のメソッドには，String.prototype._charCodeAt_()，
//     String._fromCharCode_()でアクセスすること．
// 制約：
//   ・各colorIndexのα値は要素の透過率(CSSのopacity特性)で共通とする．よって，
//     文字，背景，ボーダの上下左右の透明度を別々に持つことはできない．
//     #まじめに対応するとsytle要素の解析，各要素に対する再評価などが必要となる
//     #ため実装は今のところ見送り
//   ・colorIndex値は最大で2値(文字色と背景色)を記述可能(なように見える)が，背景
//     色は無視する
//   ・Number.MAX_VALUE != 2147483647(上書き不可)
//   ・Number.MIN_VALUE != 1(上書き不可)
//   ・PNGファイルのヘッダ書き換えはできないのでPLTEチャンクが入ったPNGを
//     配置する必要がある(ARIB B24?あたりでは"PLTEチャンクを無視する"はず
//     なのでDTVでも動作すると思われるが，ファイルデータ量が増えるので読み
//     込みが遅くなる問題はある)
//   ・IEは下記が使用できないので非対応(この時点で詳細検討未)
//     - getter/setterが未実装
//     - XHR.overrideMimetypeが未実装
//   ・Opera10.53(最新版以前)で次の不具合があり非対応
//     - XHR.overrideMimetypeが有効に動作しないため，下記が対応できない
//       = バイナリデータ(CLUT)が取得できない
//       = 外部ファイルの文字コードを(上書きできないため)正しく認識できない
//       = サーバ側で下記のような内容の.htaccessを作成しておけば一応動きそう?
//         (jsの文字コードがまだおかしい部分がある．調査要)
//           AddCharset EUC-JP .tsv
//           AddCharset x-user-defined .clt
//           AddType text/plain .clt
//   ・ユーザ定義のObject等にdataプロパティを運用しないこと
//     - ECMAScriptソース中の.dataは.dataInterfaceに書き換えられる
// 非対応：
//   ・grayscale-color-index特性はすべて無視
//     - grayscale-color-index特性による表示制御は行わない
//     - normalStyle/focusStyle/activeStyle.grayscaleColorIndex のgetterはdefault値を返す
//     - normalStyle/focusStyle/activeStyle.grayscaleColorIndex のsetterは未実装(何もしない)
// 検討事項：
//   ・ページを遷移させずに(ブラウザのリロードを使用せずに)画面遷移が可能か?
//     → ECMAScriptではすべてグローバルな変数/関数が定義されるのみなので，ECMAの
//        評価前後にwindowのスナップショットを取れば削除すべき変数/関数は分かるはず．
//        body以下のnodeもremoveすれば良いので，リロード無しの遷移は可能な気が...
//   ・Styleファイルのロードを同期処理で行っているため，取得中はJavaScriptの処理が
//     ロックされ，処理時間が長くなると思われる．非同期で読み込み，読み込み完了後
//     に処理を行うようにした方が良いが，Styleは定義順が値の"継承"に影響するので
//     順番性に考慮が必要．ただし，BML文書から外部CSSファイルを参照することは稀な
//     ため，実装優先順位は低い．
// やること：
//   ・Bevent周りの実装(少なくともDataButtonPressed)
//   ・Ureg/GregのUserDataへの格納
//   ・IPTVFJなBMLとARIBなBMLとで(バージョン判定によって)動作を変えるべきか?
//   ・inputの実装(フォーカス制御を含めて)
//   ・margin/padding同様にBMLで運用されない(固定値になっているもの)CSS特性の除外処理
//     (BMLコンテンツ側のミスで運用されない値が設定されている場合があり，チェック機構
//     が無いと無条件で適用されてしまう -> 画面表示が意図しないものになる
// 履歴：
//  0.1.0：2010/06/09：ぷららデモコンテンツが動作する版(IPTVFJ+IptvUUI対応)
//  0.1.1：2010/06/15：DNPデモコンテンツが動作する版(UregなどのB24対応)
//  0.1.2：2010/06/25：ECMAScriptの取得を非同期化して全体を高速化
//  0.1.3：2010/06/28：CSS定義からmargin/padding特性の定義行を削除するように実装
//                     getInlineCurrentXPosition()の修正(親がp要素ならば無条件に
//                     0を返していた)
//                     handleInlineCtrlString()の修正(開始直後/終了タグ直前の制御
//                     符号処理の条件設定ミス)
//  0.1.4：2010/07/02：BML.Clut.load()の修正(パース時のalpha値の取得ミス)
//  0.1.5：2010/08/09：BML.Builder.onunloadの呼び出しをwindow.addEventListenerに移譲
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/**  BML文書駆動用の関数/クラス/設定値群のネームスペース @namespace @name BML */
var BML = (typeof(BML) == 'undefined') ? {} : BML;

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** スクリプト解釈開始時刻(ms)を保持する．<br>
 *  時刻は1970年1月1日0時0分0秒(UTC)からのミリ秒数．<br>
 *  BML.Debug.startTime代入後はdeleteされる．<br>
 *  HTML文書側で定義されていない場合は，ファイルのロード完了後の時刻となる点に注意．
 *  @name _bml_start_time_ @type Number */
var _bml_start_time_ = (typeof(_bml_start_time_) == 'undefined') ? (new Date).getTime() : _bml_start_time_;

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
(function(dst, src) { for(var key in src) { dst[key] = src[key]; } })(BML, {
  /** BML文書のパース済みURI             @type Object @default {}   @memberOf BML @name uri       */
  uri         : {},
  /** BML文書の呼び出し元のパース済みURI @type Object @default {}   @memberOf BML @name loaderUri */
  loaderUri   : {},
  /** BML文書のVersion                   @type String @default null @memberOf BML @name version   */
  version     : null,
  /** BML文書のデフォルトの設定値 @type Object @memberOf BML @name config */
  config      : /** @lends BML.config */ {
    /** 設定可能なfont-familyへの変換用ハッシュ                       @name usableFontName      @memberOf BML.config
     *  @type Object  @default { '丸ゴシック' : 'ARISAKA-等幅', '太丸ゴシック' : 'ARISAKA-等幅', '角丸ゴシック' : 'ARISAKA-等幅' } */
    usableFontMap       : { '丸ゴシック' : 'ARISAKA-等幅', '太丸ゴシック' : 'ARISAKA-等幅', '角丸ゴシック' : 'ARISAKA-等幅' },
    /** BML文書のScriptタグ読み込み前に読み込む外部スクリプト定義配列 @name prefixScriptIncPath @memberOf BML.config
      * @type Array<String>   @default ['../scripts/prefix.js'] */
    prefixScriptIncPath : ['../scripts/prefix.js'],
    /** BML文書のScriptタグ読み込み後に読み込む外部スクリプト定義配列 @name suffixScriptIncPath @memberOf BML.config
      * @type Array<String>   @default ['../scripts/prefix.js'] */
    suffixScriptIncPath : ['../scripts/suffix.js'],
    /** デバッグ表示の有無フラグ                                      @name debug               @memberOf BML.config
     *  @type Boolean @default true */
    debug               : true
  }
});
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
(function() {
  ///////////////////////////////////////////////////////////////////////////////////////////
  // 未実装なBML関連Class群
  /** Bevent関連のメソッド群を束ねるネームスペース
   *  @namespace
   *  @memberOf BML.
   */
  BML.Bevent = {
    /** イベント登録用の関数
     * @param {Object} property    beitem要素に関するメンバ変数を持ったオブジェクト(予)
     * @param {String} property.id beitem要素に関するプロパティ(予)
     */
    entry : function(property) {},
    /** イベント登録無効化
     */
    clear : function() {},
    execEvent : function(type) {
    }
  };
})();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** ユーティリティ関数群のネームスペース @namespace @name BML.Util */
BML.Util = (function() {
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.Util @inner @constant @description (無名関数内の変数であり外部参照不可)<br> */
  /** URIパース用の正規表現． @type RegExp @name uriMatcher */
  var uriMatcher = /^(?:(https?:\/\/[^\/]+)?(\/?(?:[^\/\?]*\/)*))?((?:([^\?\#]*)\.([^\.\?\#]*))|([^\?\#\.]*))?(?:\?([^\#]*))?(?:#(.*))?/;
  /** Array.prototype.sliceへのショートカット． @type Function @name slice */
  var slice      = Array.prototype.slice;
  /**#@-*/

  /**#@+ @memberOf BML.Util @constant */
  /** ブラウザ(IE)判定結果                    @type Boolean @name isIE */
  var isIE     = !!(window.attachEvent && (navigator.userAgent.indexOf('opera') === -1));
  /** ブラウザ(Opera)判定結果                 @type Boolean @name isOpera */
  var isOpera  = Object.prototype.toString.call(window.opera) == '[object Opera]';
  /** ブラウザ(Safari)判定結果                @type Boolean @name isSafari */
  var isSafari = navigator.userAgent.indexOf('AppleWebKit/') > -1;
  /** 特殊なHTMLElementのサポート判定結果 @type Boolean @name supportSpecificHTMLElement */
  var supportSpecificHTMLElement = !(isUndefined(window.HTMLSpanElement));
  /** each/hashEachのループ終了用ターミネータ @type object  @name $break */
  var $break   = {};
  /**#@-*/

  /**#@+ @methodOf BML.Util @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない)<br> */
  /** クラス名取得用内部関数．
   *  @name    BML.Util.getClass
   *  @param   {Object} obj クラス名の取得対象オブジェクト
   *  @returns {String}     クラス名(Array/Data/Math/Number/Object/RegExp/String/...?)
   */
  function getClass(obj) {
    return(Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1]);
  }
  /** 配列コピー用内部関数．<br>
   *  引数の配列の要素を自身(配列)の末尾に追加する．
   *  append.call()/append.apply()で実行，あるいはArray.prototypeのメンバメソッドとしても良い．
   *  @name    BML.Util.append
   *  @param   {Array<Object>} array コピー元の配列
   *  @returns {Array<Object>} 自身
   */
  function append(array) {
    var thisLength = this.length, length = array.length;
    while(length--) this[thisLength + length] = array[length];
    return(this);
  }
  /**#@-*/

  /**#@+ @methodOf BML.Util @public */
  /** 空関数
   *  @name    BML.Util.emptyFunction
   */
  function emptyFunction()   { }
  /** 引数を返す関数
   *  @name    BML.Util.K
   */
  function K(arg)   { return(arg); }
  /** 配列判定用関数
   *  @name    isArray
   *  @param   {Object}  obj 判定対象
   *  @returns {Boolean}     判定結果
   */
  function isArray(obj)      { return(getClass(obj) == 'Array'); }
  /** undefined判定用関数
   *  @name    isFunction
   *  @param   {Object}  obj 判定対象
   *  @returns {Boolean}     判定結果
   */
  function isFunction(obj)   { return(typeof(obj) == 'function'); }
  /** undefined判定用関数
   *  @name    isUndefined
   *  @param   {Object}  obj 判定対象
   *  @returns {Boolean}     判定結果
   */
  function isUndefined(obj)  { return(typeof(obj) == 'undefined'); }
  /** srcの全てのプロパティ(名と値)をdstに上書きする
   *  @name    extend
   *  @param   {Object} dst 上書き先のオブジェクト
   *  @param   {Object} src 上書き元のオブジェクト
   *  @returns {Object}     プロパティを上書きされたdst
   */
  function extend(dst, src)  { for(k in src) { dst[k] = src[k]; } return(dst); }
  /** 引数をthisとして関数(自身)を実行する．<br>
   *  bind.call()/bind.apply()で実行，あるいはFunction.prototypeのメンバメソッドとしても良い．
   *  @name    bind
   *  @param   {Object} context thisに設定するオブジェクト
   *  @returns {Void}           関数(自身)の実行結果
   */
  function bind(context) {
    if ((arguments.length < 2) && isUndefined(arguments[0])) return(this);
    
    var __method = this, args = slice.call(arguments, 1);
    return(function() {
      var a = append.call(slice.call(args, 0), arguments);
      return(__method.apply(context, a));
    });
  }
  /** 引数に設定した時間経過後に関数(自身)を実行する．<br>
   *  wait.call()/wait.apply()で実行，あるいはFunction.prototypeのメンバメソッドとしても良い．
   *  @name    wait
   *  @param   {Number} timeout   待ち時間(sec)
   *  @param   {Object} [context] 実行する関数のthisに設定するオブジェクト．未指定時はnull．
   *  @returns {Number}           window.setTimeout()実行時のタイマID
   */
  function wait(timeout, context) {
    var __method = this, args = slice.call(arguments, 2);
    return(window.setTimeout(function() {
      return(__method.apply(context || null, args));
    }, timeout * 1000));
  }
  /** 配列(自身)の各要素を引数として指定した関数を実行する．<br>
   *  each.call()/each.apply()で実行，あるいはArray.prototypeのメンバメソッドとしても良い．
   *  @name    each
   *  @param   {Function} iterator  配列の各要素に適用する関数．関数の引数は[要素, 要素の位置]．
   *  @param   {Object}   [context] 実行する関数のthisに設定するオブジェクト．未指定時は配列(自身)．
   *  @returns {Array<Object>}      配列(自身)
   */
  function each(iterator, context) {
   context = context || this;
    try {
      for(var i = 0, l = this.length; i < l; i++) {
        iterator.call(context, this[i], i);
      }
    } catch(e) {
      if (e != $break) throw(e);
    }
    return(this);
  }
  /** オブジェクト(自身)の各プロパティを引数として指定した関数を実行する．<br>
   *  hashEach.call()/hashEach.apply()で実行，あるいはObject.prototypeのメンバメソッドとしても良い．
   *  @name    hashEach
   *  @param   {Function} iterator  各プロパティに適用する関数．関数の引数は[プロパティ名，プロパティ値]．
   *  @param   {Object}   [context] 実行する関数のthisに設定するオブジェクト．未指定時は配列(自身)．
   *  @returns {Array<Object>}      オブジェクト(自身)
   */
  function hashEach(iterator, context) {
    context = context || this;
    try {
      for(var key in this) {
        iterator.call(context, key, this[key]);
      }
    } catch(e) {
      if (e != $break) throw(e);
    }
    return(this);
  }
  /** 引数をURIとして解釈してhost/path/file名などに分解する．<br>
   *  @name    paraseURI
   *  @param   {String} uri 解析対象のURI<br> ex.) http(s)://host(:port)/some/.../path/file.ext?query#fragment
   *  @returns {Object}     解析結果を保持するハッシュ．<br>
                            [.host] URIのホスト部分．ポートも含む ex.) http(s)://host(:port)<br>
                            [.path] URIのパス部分 ex.) /some/.../path/<br>
                            [.file] URIのファイル名部分．拡張子含む ex.) file.ext<br>
                            [.name] URIのファイル名の拡張子以外 ex.) file<br>
                            [.ext]  URIのファイル名の拡張子部分 ex.) ext<br>
                            [.query]    URIのクエリ部分．URIデコード済み ex.) query<br>
                            [.fragment] URIのファイル名の拡張子以外 ex.) fragment
   */
  function parseURI(uri) {
    if (!uri) return({});

    var org = uri;
    uri = uri.replace(/\\/g, '/');
    var match = uriMatcher.exec(uri);

    return(match ? {
      full     : uri,
      host     : match[1] || '',
      path     : match[2] || '',
      file     : match[3] || '',
      name     : match[4] || match[6] || '',
      ext      : match[5] || '',
      query    : decodeURIComponent(match[7] || ''),
      fragment : match[8] || ''}
    : {
      full     : uri
    });
  }
  /** カレントパスとカレントからの相対パスを合成したパスを生成する．<br>
   *  @name    combinePath
   *  @param   {String} relative カレントからの相対パス
   *  @param   {Object} current  パース済みのカレントパス
   *  @returns {String}          合成後のパス．relativeが絶対パス(先頭がhttp)の場合はrelativeを返す．
   */
  function combinePath(relative, current) {
    if (relative.indexOf('http') >= 0) return(relative);

    var path = current.host+current.path+relative;
    path = path.split('/');

    var buf = [];
    for(var i = 0, l = path.length; i < l; i++) {
      var p = path[i];
      ((p == '..') && (buf.length > 0)) ? buf.pop() : buf.push(p);
    }
    return(buf.join('/'));
  }
  /** 指定した長さに満たない文字列の左側を指定の文字列で埋める．<br>
   *  @name    toPaddedString
   *  @param   {String} str       対象文字列
   *  @param   {String} [pad=' '] 空白を埋める文字
   *  @param   {Number} [len=2]   文字列に期待される長さ
   *  @returns {String}           空白を埋めた文字列
   */
  function toPaddedString(str, pad, len) {
    var ret = ''; str = String(str); pad = pad || ' ';
    for(var i = str.length, l = len || 2; i < l; i++) ret += pad;
    return(ret + str);
  }
  /** RGBを示す各整数値(0〜255)を各々16進2桁(2桁未満の場合は0埋め)に変換して結合する．
   *  @name    toColorCode
   *  @param   {Number} r 赤(R)を示す整数値
   *  @param   {Number} g 緑(G)を示す整数値
   *  @param   {Number} b 青(B)を示す整数値
   *  @returns {String}   RGB色を示す16進6桁の文字列
   */
  function toColorCode(r, g, b) {
    return(toPaddedString(Number(r).toString(16), '0')+
           toPaddedString(Number(g).toString(16), '0')+
           toPaddedString(Number(b).toString(16), '0'));
  }
  /** 文字列の先頭文字を大文字化する．<br>
   *  ex) anchor -> Anchor
   *  @name    capitalize
   *  @param   {String} str 対象文字列
   *  @returns {String}     変換後の文字列
   */
  function capitalize(str) {
    return(str.charAt(0).toUpperCase() + str.substring(1).toLowerCase());
  }
  /** '-'で結合された文字列を分解し，'-'直後の1文字を大文字化して結合する．<br>
   *  ex) color-index -> colorIndex
   *  @name    camelize
   *  @param   {String} str 対象文字列
   *  @returns {String}     変換後の文字列
   */
  function camelize(str) {
    var parts = str.split('-');
    if (parts.length <= 1) return(str);

    var buf = String(parts[0]).toLowerCase();
    for(var i = 1, l = parts.length; i < l; i++) {
      var part = String(parts[i]);
      if (!part) continue;
      part = part.toLowerCase();
      buf += part.charAt(0).toUpperCase() + part.substring(1);
    }
    return(buf);
  }
  /** オブジェクトの全プロパティを'[key:value]'の形で連結した文字列を生成する．
   *  @name    hashToString
   *  @param   {Object} obj 対象オブジェクト
   *  @returns {String}     対象オブジェクトの全プロパティの文字列表現
   */
  function hashToString(obj) {
    var s = '';
    for(var k in obj) { s += '['+k+':'+obj[k]+'] '; }
    return(s);
  }
  /** Elementの指定のスタイル特性値を取得する．<br>
   *  currentStyle(IE)とgetComputedStyle(Firefox/Opera/Safari)を用いたクロスブラウザスクリプト．
   *  @name    getStyle
   *  @param   {HTMLElement} elm   対象Element
   *  @param   {String}      style スタイル特性名
   *  @returns {String}            スタイル特性値
   */
  function getStyle(elm, style) {
    var value = elm.style[style];
    if (!value || (value == 'auto')) {
      var css = elm.currentStyle || document.defaultView.getComputedStyle(elm, null);
      value = css ? css[style] : null;
    }
    return((value == 'auto') ? null : value);
  }
  /**#@-*/
  return({
    $break         : $break,
    isIE           : isIE,
    isOpera        : isOpera,
    isSafari       : isSafari,
    emptyFunction  : emptyFunction,
    K              : K,
    isArray        : isArray,
    isFunction     : isFunction,
    isUndefined    : isUndefined,
    extend         : extend,
    bind           : bind,
    wait           : wait,
    each           : each,
    hashEach       : hashEach,
    parseURI       : parseURI,
    combinePath    : combinePath,
    toPaddedString : toPaddedString,
    toColorCode    : toColorCode,
    capitalize     : capitalize,
    camelize       : camelize,
    hashToString   : hashToString,
    getStyle       : getStyle,
    supportSpecificHTMLElement : supportSpecificHTMLElement
  });
})();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
(function() { // 基本オブジェクトのメソッドのOverride
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** オリジナルのString.prototype.charCodeAtビルトイン関数を保持するメンバメソッド
   *  @name String.prototype._charCodeAt_ @methodOf String.prototype @public */
  String.prototype._charCodeAt_ = String.prototype.charCodeAt;
  /** オリジナルのString.fromCodeAtビルトイン関数を保持するメンバメソッド
   *  @name String._fromCharCode_         @type function @memberOf String. @public */
  String._fromCharCode_         = String.fromCharCode;

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @inner @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない)<br> */
  /** String.prototype.charCodeAt関数の変更に伴うecl.jsの関連関数のWrapper．<br>
   *  毎回関数の入替えがあるため性能的にはあまり好ましく無いが，外部ライブラリを弄らないための処置．
   *  @function
   *  @name    escapeECUJPWrapper
   *  @param   {String} c EUC-JP文字コードを取得する対象文字
   *  @returns {Number}   対象文字のEUC-JP文字コード(整数値)
   */
  function escapeEUCJPWrapper(c) {
    var old = String.prototype.charCodeAt;
    String.prototype.charCodeAt = String.prototype._charCodeAt_;
    var ret = EscapeEUCJP(c);
    String.prototype.charCodeAt = old;
    return(ret);
  }
  /** String.fromCharCode関数の変更に伴うecl.jsの関連関数のWrapper．<br>
   *  毎回関数の入替えがあるため性能的にはあまり好ましく無いが，外部ライブラリを弄らないための処置．
   *  @function
   *  @name    unescapeECUJPWrapper
   *  @param   {String} c EUC-JP文字コード列
   *  @returns {String}   UTF-8文字コード列
   */
  function unescapeEUCJPWrapper(c) {
    var old = String.fromCharCode;
    String.fromCharCode = String._fromCharCode_;
    var ret = UnescapeEUCJP(c);
    String.fromCharCode = old;
    return(ret);
  }
  /**#@-*/
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** EUC-JP文字コードに対応したString.prototype.charCodeAt．<br>
   *  ビルトイン関数を使用する場合はString.prototype._charCodeAt_を使用すること．
   *  @name     charCodeAt
   *  @methodOf String.prototype
   *  @param    {Number} pos 文字コードを取得する文字の位置
   *  @returns  {String} 該当文字のEUC-JP文字コード
   */
  String.prototype.charCodeAt = function(pos) {
    var c = this.charAt(pos);
    return(/[\*+.-9A-Z_a-z-]/.test(c) ?
           c._charCodeAt_(0) : parseInt(escapeEUCJPWrapper(c).replace(/%/g, ''), 16));
  };
  /** EUC-JP文字コードに対応したString.fromCharCode．<br>
   *  ビルトイン関数を使用する場合はString._fromCharCode_を使用すること．
   *  @name     fromCharCode
   *  @methodOf String.
   *  @param    {String} code[，code…] EUC-JP文字コード
   *  @returns  {String} 文字列
   */
  String.fromCharCode = function() {
    var buf = '';
    for(var i = 0, l = arguments.length; i < l; i++) {
      var n = Number(arguments[i]).toString(16);
      if (n.length % 2) n = '0' + n;
      // ecl.jsに喰わせるための整形(%エスケープ)．このあたりは少し冗長だが...
      for(var j = 0, m = n.length; j < m; j += 2) {
        buf += '%' + n.substring(j, j + 2);
      }
    }
    return(unescapeEUCJPWrapper(buf));
  };

  var ps = BML.Util.toPaddedString; // ショートカット
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf Date.prototype @public */
  /** オリジナルのDate.prototype.toStringビルトイン関数を保持するメンバメソッド
   *  @name Date.prototype._toString_ @public */
  Date.prototype._toString_ = Date.prototype.toString;
  /** ARIB仕様の日付文字列を出力する．<br>
   *  ビルトイン関数を使用する場合はDate.prototype._toString_を使用すること．
   *  @name     Date.prototype.toString
   *  @returns  {String} ARIB仕様の日付文字列
   */
  Date.prototype.toString = function() {
    return(this.getFullYear()         + '-' + 
           ps(this.getMonth()+1, '0') + '-' + 
           ps(this.getDate(),    '0') + 'T' + 
           ps(this.getHours(),   '0') + ':' + 
           ps(this.getMinutes(), '0') + ':' + 
           ps(this.getSeconds(), '0'));
  };
  /** ARIB仕様のtoLocalString(ARIB仕様のtoStringを参照) @name toLocalString @returns {String} ARIB仕様の日付文字列 */
  Date.prototype.toLocalString = Date.prototype.toString;
  /** ARIB仕様のtoUTCString(ARIB仕様のtoStringを参照)   @name toUTCString   @returns {String} ARIB仕様の日付文字列 */
  Date.prototype.toUTCString   = Date.prototype.toString;
  /**#@-*/

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf Function.prototype @public */
  /** オリジナルのFunction.prototype.toStringビルトイン関数を保持するメンバメソッド
   *  @name Function.prototype._toString_ @public */
  Function.prototype._toString_ = Function.prototype.toString;
  /** ARIB仕様の関数オブジェクトの文字列表現を出力する．<br>
   *  ビルトイン関数を使用する場合はFunction.prototype._toString_を使用すること．
   *  @name     Function.prototype.toString
   *  @returns  {String} ARIB仕様の文字列化表現
   */
  Function.prototype.toString = function() {
    var str = Function.prototype._toString_.call(this);
    str = str.replace(/\{[^\}]*?\}/, '{}');
    return(str);
  };
  /**#@-*/
//  Object.prototype.toBoolean = function() { return(true); };
//  Object.prototype.toNumber  = function() { return(this.valueOf()); };
})();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** Ajax(同期/非同期HTTP通信インタフェース)用クラス．<br>
 * optionsによるパラメタの初期化処理を行い，urlが指定されている場合はrequest処理を行う.<br>
 * 実体はBML.Ajax-Ajax．
 * @class Ajax(同期/非同期HTTP通信インタフェース)用クラス
 * @name BML.Ajax
 * @param {String}  [url]     リクエスト先URL
 * @param {Object}  [options] リクエストに関するオプション
 * @param {String}  [options.method='POST']                送信時のメソッド(POST|GET)
 * @param {Boolean} [options.asynchronous=true]            同期/非同期通信フラグ(true:非同期)
 * @param {String}  [options.contentType='application/x-www-form-urlencoded'] リクエストのMIMEタイプ
 * @param {String}  [options.overrideMimeType='']          応答のMIMEタイプの指定．ただし，transportがoverrideMimeTypeメソッドを有しない場合は無視する．
 * @param {String}  [options.encoding='UTF-8']             送信時の文字コードの指定．
 * @param {Object}  [options.parameters={}]                URLのクエリ部(GET)あるいはbody(POST)に設定する引数群．プロパティ名をkey，プロパティ値をvalueとする．
 * @param {String}  [options.postBody='']                  POST時のbodyに設定する文字列．options.parametersより優先される．
 * @param {Funcion} [options.onSuccess=undefined]          リクエスト成功時に実行するコールバック関数の指定．コールバック関数の引数は[BML.Ajax-Response]．
 * @param {Funcion} [options.onFailure=undefined]          リクエスト失敗時に実行するコールバック関数の指定．コールバック関数の引数は[BML.Ajax-Response]．
 * @param {Funcion} [options.onUninitialized=undefined]    リクエスト初期化前に実行するコールバック関数の指定．コールバック関数の引数は[BML.Ajax-Response]．
 * @param {Funcion} [options.onLoading=undefined]          リクエスト応答受信中に実行するコールバック関数の指定．コールバック関数の引数は[BML.Ajax-Response]．
 * @param {Funcion} [options.onLoaded=undefined]           リクエスト応答受信完了時に実行するコールバック関数の指定．コールバック関数の引数は[BML.Ajax-Response]．
 * @param {Funcion} [options.onInteractive=undefined]      リクエスト応答解析後に実行するコールバック関数の指定．コールバック関数の引数は[BML.Ajax-Response]．
 * @param {Funcion} [options.onComplete=undefined]         リクエスト完了時に実行するコールバック関数の指定．コールバック関数の引数は[BML.Ajax-Response]．
 * @param {Funcion} [options.on"HTTPStatusCode"=undefined] readyState変化時のHTTPのステータスコードに対応するコールバック関数の指定．コールバック関数の引数は[BML.Ajax-Response]．
 * @param {Funcion} [options.onError=undefined]            例外発生時に実行するコールバック関数の指定．コールバック関数の引数は[BML.Ajax, Exception]．
 */
BML.Ajax = (function() {
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.Ajax @inner @static @constant @description (無名関数内の定数であり外部参照不可)<br> */
  /** リクエスト時のreadyStateに対応した名称を保持する配列 @name EVENTS  @type Array<String> */
  var EVENTS = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

  /** BML.Utilへのショートカット @name util @type Function */
  var util = BML.Util;
  /**#@-*/

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf BML.Ajax @inner @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  /** URIエンコードされたkey-valueペア文字列を作成する．
   *  @name    toQueryPair
   *  @param   {String} k   key．URIエンコードされている前提．
   *  @param   {String} [v] value．URIエンコード対象．
   *  @returns {String} "key=value"を返す．valueがundefinedの場合は"key"のみ．
   */
  function toQueryPair(k, v) {
    return(util.isUndefined(v)? k : k+'='+encodeURIComponent(v===null? '' : v));
  }
  /** HTTP通信用の組み込みオブジェクトを取得する．
   *  @name    getTransport
   *  @returns {Object} HTTP通信用の組み込みオブジェクト
   */
  function getTransport() {
    var transport = ['XMLHttpRequest()',
                     "ActiveXObject('Msxml2.XMLHTTP')",
                     "ActiveXObject('Microsoft.XMLHTTP')"];
    for(var i = 0, l = transport.length; i < l; i++) {
      try      { return(eval('new ' + transport[i])); }
      catch(e) { }
    }
    return(null);
  }
  /**#@-*/
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** Ajax(同期/非同期HTTP通信インタフェース)用クラスのコンストラクタ．*/
  var Ajax = function(url, options) {
    /**#@+ @memberOf BML.Ajax.prototype @private */
    /** リクエスト応答完了フラグ          @propertyEx _complete|Boolean|false */
    this._complete  = false;
    /** リクエスト先URL                   @propertyEx _url     |String |'' */
    this._url       = '';
    /** リクエスト時のオプション<br> ** 設定値とデフォルト値はコンストラクタの引数を参照． @propertyEx _options|Object|(省略) */
    this._options = util.extend({
      method           : 'POST',
      asynchronous     : true,
      contentType      : 'application/x-www-form-urlencoded',
      overrideMimeType : '',
      encoding         : 'UTF-8',
      parameters       : {},
      postBody         : ''
    }, options || {});
    /** 送信時のメソッド                  @propertyEx _method  |String |'POST' */
    this._method    = this._options.method.toUpperCase() || 'POST';
    /**#@-*/
    /**#@+ @memberOf BML.Ajax.prototype */
    /** HTTP通信用の組み込みオブジェクト  @propertyEx BML.Ajax.prototype.transport|Object |BML.Ajax.getTransport()の返り値 */
    this.transport = getTransport();
    /** リクエストに対する応答<br>        @propertyEx BML.Ajax.prototype.response |BML.Ajax-Response|null */
    this.response  = null;
    /**#@-*/

    if (url) this.request(url);
  };
  /**#@+ @methodOf BML.Ajax.prototype */
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** リクエスト先URLに対してリクエストを発呼する．<br>
   *  実体はBML.Ajax-Ajax.prototype.request．
   *  @name     BML.Ajax.prototype.request
   *  @methodOf BML.Ajax.prototype
   *  @param    {String} url リクエスト先URL
   */
  Ajax.prototype.request = function(url) {
    if (!url) return;

    this._url      = url;
    this.response  = null;

    var accessUrl  = url;
    var query      = '';
    var body       = null;
    
    // クエリの作成
    var p = [], params = this._options.parameters || {}, val;
    for(var key in params) {
      val = params[key];
      key = encodeURIComponent(key);
      if (!BML.Util.isArray(val)) {
        util.each.call(val, function(v) { p.push(toQueryPair(key, v)); });
      } else {
        p.push(toQueryPair(key, val));
      }
    }
    query = p.join('&');

    // クエリの送出準備(GET:URIクエリ/POST:body部)
    if ((this._method == 'GET') && (query.length > 0))  {
      accessUrl += ((url.indexOf('?') > 0) ? '&' : '?') + query;
    } else {
      if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) query += '&_=';
      body = this._options.postBody || query;
    }

    try {
      var transport = this.transport;
      // 応答MIMEタイプの設定(transportのopen前に実施要)
      if (this._options.overrideMimeType && transport.overrideMimeType)
        transport.overrideMimeType(this._options.overrideMimeType);
      // リクエスト先URLへの接続(非同期の場合はreadyStateを一旦取得)
      transport.open(this._method, accessUrl, this._options.asynchronous);
      if (this._options.asynchronous) util.wait.call(this._respondToReadyState, 0.01, this, 1);

      // ヘッダの設定
      var headers = this._getRequestHeaders();
      for(key in headers) transport.setRequestHeader(key, headers[key]);
      // callback関数の設定
      transport.onreadystatechange = util.bind.call(this._onStateChange, this);

      // リクエストの送出
      transport.send(body);
      if (!this._options.asynchronous && transport.overrideMimeType) this._onStateChange();

    } catch(e) {
      this._dispatchException(e);
    }
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** transportのonreadystatechangeに対するコールバック関数．<br>
   *  実体はBML.Ajax-Ajax.prototype._onStateChange．
   *  @name     BML.Ajax.prototype._onStateChange
   */
  Ajax.prototype._onStateChange = function() {
    var readyState = this.transport.readyState;
    if ((readyState > 1) && ((readyState != 4) || !this._complete))
      this._respondToReadyState(readyState);
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** transportのステータス(readyState)に対応するコールバック処理を実施．<br>
   *  実体はBML.Ajax-Ajax.prototype._respondToReadyState．
   *  @name     BML.Ajax.prototype._respondToReadyState
   */
  Ajax.prototype._respondToReadyState = function(readyState) {
    var state     = EVENTS[readyState];
    var response  = new Response(this);

    try {
      (this._options['on' + state] || util.emptyFunction)(response);
    } catch(e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this._options['on' + response.statusCode] ||
         this._options['on' + (this.isSuccess() ? 'Success' : 'Failure')] ||
         util.emptyFunction)(response);
      } catch(e) {
        this.dispatchException(e);
      }

      this.transport.onreadystatechange = util.emptyFunction;

      BML.Debug('[Ajax]:'+this._url+' ->['+(this.isSuccess() ? 'OK' : 'NG')+']');
    }
    this.response = response;
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** HTTPステータスコードからHTTP通信の成否を判定する．<br>
   *  実体はBML.Ajax-Ajax.prototype.isSuccess．
   *  @name     BML.Ajax.prototype.isSuccess
   *  @returns  {Boolean} HTTPステータスコードが200以上300未満の場合は真．
   */
  Ajax.prototype.isSuccess = function() {
    var status = this._getHttpStatusCode();
    return(!status || ((status >= 200) && (status < 300)));
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** リクエスト送信時にHTTPヘッダに設定すべきヘッダ名と値を取得する．<br>
   *  実体はBML.Ajax-Ajax.prototype._getRequestHeaders
   *  @name     BML.Ajax.prototype._getRequestHeaders
   *  @returns  {Object} ヘッダ名をプロパティ名，ヘッダに設定する値をプロパティ値に持つ無名オブジェクト
   */
  Ajax.prototype._getRequestHeaders = function() {
    var headers = {
      'X-Requested-With' : 'XMLHttpRequest',
      'Accept'           : "text/javascript, text/html, application/xml, text/xml, */*"
    };
    if (this._method == 'POST') {
      headers['Content-type'] = this._options.contentType +
        (this._options.encoding ? '; charset=' + this._options.encoding : '');
      // Force "Connection: close" for older Mozilla browsers to work. see Mozilla Bugzilla #246651.
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    return(headers);
  };
  /**#@-*/
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf BML.Ajax.prototype @private */
  /** HTTPステータスコードを取得する．          @name _getHttpStatusCode @return {Number} HTTPステータスコード．取得できない場合は0．*/
  Ajax.prototype._getHttpStatusCode = function()  { try { return(this.transport.status || 0); } catch(e) { return(0); } };
  /** 例外発生時のコールバック関数を実行する．  @name _dispatchException @param {Exception} e 例外 */
  Ajax.prototype._dispatchException = function(e) { (this._options.onError || util.emptyFunction)(this, e); };
  /**#@-*/
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** Ajaxのレスポンスを扱うBML.Ajaxの内部クラス
   * @class Ajax(同期/非同期HTTP通信インタフェース)におけるレスポンス用クラス
   * @name  BML.Ajax-Response
   * @param {BML.Ajax} request リクエストを行うajaxクラスのインスタンス
   */
  var Response = function(request) {
    /**#@+ @memberOf BML.Ajax-Response.prototype @public */
    /** リクエスト時のHTTPステータスコード                     @propertyEx statusCode  |Number     |0 */
    this.statusCode   = 0;
    /** リクエスト時のHTTPステータスを表す文字列               @propertyEx statusText  |String     |'' */
    this.statusText   = '';
    /** リクエスト応答の文字列表現                             @propertyEx responseText|String     |'' */
    this.responseText = '';
    /** リクエスト応答をXMLとして解釈した場合のDOMオブジェクト @propertyEx responseXML |XMLDocument|null */
    this.responseXML  = null;
    /**#@-*/
      
    var transport   = request.transport;
    var readyState  = transport.readyState;

    if (((readyState > 2) && !util.isIE) || (readyState == 4)) {
      // to avoid firebugs error(cannot access optimized closure)
      var f = function() { try {return(transport.statusText); } catch(e){} return(''); };

      this.statusCode   = Ajax.prototype._getHttpStatusCode.call(request);
      this.statusText   = f();
      this.responseText = (transport.responseText === null) ? '' : transport.responseText;
    }

    if (readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML = util.isUndefined(xml) ? null : xml;
    }
  };
  
  return(Ajax);
})();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** デバッグ用文字列表示関数群のネームスペース @static @namespace @name BML.Debug */
BML.Debug = (function() {
  /**#@+ @memberOf BML.Debug @inner @static @description (無名関数内の定数であり外部参照不可)<br> */
  /** BML.jsのスクリプト評価開始時刻 @name startTime @type Number @default _global_._bml_start_time_ */
  var startTime  = _bml_start_time_; delete(_bml_start_time_);
  /** ログ表示用の要素 @name plane @type HTMLElement @default null */
  var plane      = null;
  /** ログ表示時の背景用の要素 @name bgPlane @type HTMLElement @default null */
  var bgPlane    = null;
  /** 最大行数 @name maxLine @type Number @default 20 */
  var maxLine    = 20;
  /** ログメッセージバッファ @name strBuf @type Array<String> @default new Array() */
  var strBuf     = [];
  /** ログ出力行数 @name count @type Number @default 0 */
  var count      = 0;
  /** 表示状態 @name visible @type Boolean @default false */
  var visible    = false;
  /** initialize()のloadイベントリスナへの登録有無 @name entryEvent @type Boolean @default false */
  var entryEvent = false;
  /** ログレベル毎の表示可否 @name level @type Object
    * @field {Boolean}(false) .debug debugレベル
    * @field {Boolean}(true)  .info  infoレベル
    * @field {Boolean}(true)  .warn  warningレベル
    * @field {Boolean}(true)  .error errorレベル
    */
  var level      = { debug : false, info : true, warn : true, error : true };
  /**#@-*/
  /**#@+ @methodOf BML.Debug @public @static */
  /** 初期化関数．<br>
   *  デバッグログ表示用のplane(div要素)を動的に作成し，キー操作(Esc押下)をフックする．<br>
   *  planeが作成できない場合は，文書のロードイベントが発火された際に自身を再呼び出しする．
   * @name initialize
   */
  function initialize() {
    if (plane) return;

    var body = document.getElementsByTagName('body');
    if (body.length > 0) {
      bgPlane = document.createElement('div');
      bgPlane.setAttribute('id', '_bml_debug_bgplane_');

      plane = document.createElement('div');
      plane.setAttribute('id', '_bml_debug_plane_');

      body[0].appendChild(bgPlane);
      body[0].appendChild(plane);

      setVisible(visible);

      document.addEventListener('keydown', function(event) {
        if (event.keyCode == 0x1b) {
          setVisible(!visible);
          event.cancelBubble = true;
        }
      }, false);
      draw();
    } else if (!entryEvent) {
      window.addEventListener('load', arguments.callee, false);
      entryEvent = true;
    }
  }
  /** デバッグログを消去し画面表示をリセットする． @name reset */
  function reset() { strBuf = []; count = 0; draw(); }
  /** 指定したデバッグレベルでの表示可否を設定する．
   *  @name  setDebugLevel
   *  @param {String} type 指定するデバッグレベル(debug/info/warn/error)
   *  @param {String} bool 表示可否
   */
  function setDebugLevel(type, bool) { level[type] = bool || false; }
  /** BML.jsファイルの評価開始時刻を取得する．
   *  @name    getLoadStartTime
   *  @returns {Number} 実行開始時刻(ms)
   */
  function getLoadStartTime() { return(startTime); }
  /**#@-*/

  /**#@+ @methodOf BML.Debug @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  /** デバッグ画面の表示/非表示を制御する．
   *  @name  setVisible
   *  @param {Boolean} bool 表示非表示フラグ(表示=真)
   */
  function setVisible(bool) {
    visible = bool;
    if (plane) bgPlane.style.visibility = plane.style.visibility =
      visible ? 'visible' : 'hidden';
    draw();
  }
  /** 指定した長さに満たない文字列の左側を'&amp;nbsp;'で埋める．<br>
   *  BML.Util.toPaddedStringのカリー化．
   *  @name    padNBSP
   *  @param   {String} str   対象文字列
   *  @param   {String} [len] 文字列に期待される長さ
   *  @returns {String}       '&amp;nbsp;'でパディングした文字列
   */
   function padNBSP(str, len) { return(BML.Util.toPaddedString(str, '&#160;', len)); }
  /** 指定した長さに満たない文字列の左側を' 'で埋める．<br>
   *  BML.Util.toPaddedStringのカリー化．
   *  @name    padBrank
   *  @param   {String} str   対象文字列
   *  @param   {String} [len] 文字列に期待される長さ
   *  @returns {String}       ' 'でパディングした文字列
   */
  function padBrank(str, len) { return(BML.Util.toPaddedString(str, ' ',      len)); }
  /** デバッグ画面にデバッグログを描画する．
   *  @name draw */
  function draw() {
    if (plane && visible) {
      plane.innerHTML = (BML.config.debug) ? strBuf.join("<br/>\n") : '';
    }
  }
  /** HTMLとして評価される文字列内の特殊文字を実体参照に変更する．
   *  @name escapeHTML */
  function escapeHTML(str) {
    return(String(str || '').replace(/[&\"<>]/g, function(c) {
      return {
        "&": "&amp;",
        '"': "&quot;",
        "<": "&lt;",
        ">": "&gt;"
        }[c];
    }));
  }
  /** メッセージをログレベルに合わせて整形し，デバッグ画面に出力する．<br>
   *  firebugなどの外部コンソール(window.console)が存在する場合にはそちらにも出力する．
   *  @name  write
   *  @param {String} msg            デバッグ用のメッセージ
   *  @param {String} [type='debug'] デバッグログ出力時のログレベル(debug/info/warn/error)
   */
  function write(msg, type) {
    type = type || 'debug';

    var t = (new Date).getTime();
    if (!BML.Util.isUndefined(window.console) &&
        !BML.Util.isUndefined(window.console[type])) {
      window.console[type]('['+padBrank(count++, 4)+']('+padBrank(t - startTime, 8)+'ms)'+msg);
    }
    if (level[type]) {
      msg = escapeHTML(msg);
      strBuf.push('<span class="_bml_debug_'+type+'_">'+
                  '['+padNBSP(count++, 4)+']('+padNBSP(t - startTime, 8)+'ms)'+msg+
                  '</span>');
      if (strBuf.length > maxLine) strBuf.shift();
      draw();
    }
  }
  /**#@-*/

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf BML.Debug @public @static */
  /** debugレベルでのデバッグログ出力用関数．<br>
   *  BML.Debug.writeのカリー化関数であり，BML.Debugの実体．
   *  @name  BML.Debug.debug
   *  @param {String} msg デバッグ用のメッセージ
   */
  function debug(msg) { write(msg, 'debug'); }

  BML.Util.extend(debug, /* @lends BML.Debug */ {
    initialize       : initialize,
    /** デバッグ画面を表示する．    @name show */
    show             : function() { setVisible(true);  },
    /** デバッグ画面を非表示にする．@name hide */
    hide             : function() { setVisible(false); },
    reset            : reset,
    setDebugLevel    : setDebugLevel,
    getLoadStartTime : getLoadStartTime,
    debug            : debug,
    /** infoレベルでのデバッグログ出力用関数．<br>   ** BML.Debug.writeのカリー化関数． @name info    @param {String} msg デバッグ用のメッセージ */
    info             : function(msg) { write(msg, 'info' ); },
    /** warningレベルでのデバッグログ出力用関数．<br> ** BML.Debug.writeのカリー化関数． @name warning @param {String} msg デバッグ用のメッセージ */
    warning          : function(msg) { write(msg, 'warn' ); },
    /** errorレベルでのデバッグログ出力用関数．<br>  ** BML.Debug.writeのカリー化関数． @name error   @param {String} msg デバッグ用のメッセージ */
    error            : function(msg) { write(msg, 'error'); }
  });
  /**#@-*/
  
  return(debug);
})();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** CLUTを扱う関数群のネームスペース @namespace @name BML.Clut */
BML.Clut = (function() {
  /**#@+ @memberOf BML.Clut @inner @static @description (無名関数内の定数であり外部参照不可)<br> */
  /** 受信機共通固定色およびCLUTファイルに記述された色情報を保持するパレット @name palette @type Array<Array<Number|String>> @default 受信機共通固定色 */
  var palette = [
    // ARIB TR-B14 第三編「第2部 付録1 受信機共通固定色」参照
    [  0,  0,  0,255,1.0,'000000'], [255,  0,  0,255,1.0,'ff0000'], [  0,255,  0,255,1.0,'00ff00'], [255,255,  0,255,1.0,'ffff00'],
    [  0,  0,255,255,1.0,'0000ff'], [255,  0,255,255,1.0,'ff00ff'], [  0,255,255,255,1.0,'00ffff'], [255,255,255,255,1.0,'ffffff'],
    [  0,  0,  0,  0,0.0,'000000'],
    [170,  0,  0,255,1.0,'aa0000'], [  0,170,  0,255,1.0,'00aa00'], [170,170,  0,255,1.0,'aaaa00'], [  0,  0,170,255,1.0,'0000aa'],
    [170,  0,170,255,1.0,'aa00aa'], [  0,170,170,255,1.0,'00aaaa'], [170,170,170,255,1.0,'aaaaaa'], [  0,  0, 85,255,1.0,'000055'],
    [  0, 85,  0,255,1.0,'005500'], [  0, 85, 85,255,1.0,'005555'], [  0, 85,170,255,1.0,'0055aa'], [  0, 85,255,255,1.0,'0055ff'],
    [  0,170, 85,255,1.0,'00aa55'], [  0,170,255,255,1.0,'00aaff'], [  0,255, 85,255,1.0,'00ff55'], [  0,255,170,255,1.0,'00ffaa'],
    [ 85,  0,  0,255,1.0,'550000'], [ 85,  0, 85,255,1.0,'550055'], [ 85,  0,170,255,1.0,'5500aa'], [ 85,  0,255,255,1.0,'5500ff'],
    [ 85, 85,  0,255,1.0,'555500'], [ 85, 85, 85,255,1.0,'555555'], [ 85, 85,170,255,1.0,'5555aa'], [ 85, 85,255,255,1.0,'5555ff'],
    [ 85,170,  0,255,1.0,'55aa00'], [ 85,170, 85,255,1.0,'55aa55'], [ 85,170,170,255,1.0,'55aaaa'], [ 85,170,255,255,1.0,'55aaff'],
    [ 85,255,  0,255,1.0,'55ff00'], [ 85,255, 85,255,1.0,'55ff55'], [ 85,255,170,255,1.0,'55ffaa'], [ 85,255,255,255,1.0,'55ffff'],
    [170,  0, 85,255,1.0,'aa0055'], [170,  0,255,255,1.0,'aa00ff'], [170, 85,  0,255,1.0,'aa5500'], [170, 85, 85,255,1.0,'aa5555'],
    [170, 85,170,255,1.0,'aa55aa'], [170, 85,255,255,1.0,'aa55ff'], [170,170, 85,255,1.0,'aaaa55'], [170,170,255,255,1.0,'aaaaff'],
    [170,255,  0,255,1.0,'aaff00'], [170,255, 85,255,1.0,'aaff55'], [170,255,170,255,1.0,'aaffaa'], [170,255,255,255,1.0,'aaffff'],
    [255,  0, 85,255,1.0,'ff0055'], [255,  0,170,255,1.0,'ff00aa'], [255, 85,  0,255,1.0,'ff5500'], [255, 85, 85,255,1.0,'ff5555'],
    [255, 85,170,255,1.0,'ff55aa'], [255, 85,255,255,1.0,'ff55ff'], [255,170,  0,255,1.0,'ffaa00'], [255,170, 85,255,1.0,'ffaa55'],
    [255,170,170,255,1.0,'ffaaaa'], [255,170,255,255,1.0,'ffaaff'], [255,255, 85,255,1.0,'ffff55'], [255,255,170,255,1.0,'ffffaa'],
    [  0,  0,  0,128,0.5,'000000'], [255,  0,  0,128,0.5,'ff0000'], [  0,255,  0,128,0.5,'00ff00'], [255,255,  0,128,0.5,'ffff00'],
    [  0,  0,255,128,0.5,'0000ff'], [255,  0,255,128,0.5,'ff00ff'], [  0,255,255,128,0.5,'00ffff'], [255,255,255,128,0.5,'ffffff'],
    [170,  0,  0,128,0.5,'aa0000'], [  0,170,  0,128,0.5,'00aa00'], [170,170,  0,128,0.5,'aaaa00'], [  0,  0,170,128,0.5,'0000aa'],
    [170,  0,170,128,0.5,'aa00aa'], [  0,170,170,128,0.5,'00aaaa'], [170,170,170,128,0.5,'aaaaaa'], [  0,  0, 85,128,0.5,'000055'],
    [  0, 85,  0,128,0.5,'005500'], [  0, 85, 85,128,0.5,'005555'], [  0, 85,170,128,0.5,'0055aa'], [  0, 85,255,128,0.5,'0055ff'],
    [  0,170, 85,128,0.5,'00aa55'], [  0,170,255,128,0.5,'00aaff'], [  0,255, 85,128,0.5,'00ff55'], [  0,255,170,128,0.5,'00ffaa'],
    [ 85,  0,  0,128,0.5,'550000'], [ 85,  0, 85,128,0.5,'550055'], [ 85,  0,170,128,0.5,'5500aa'], [ 85,  0,255,128,0.5,'5500ff'],
    [ 85, 85,  0,128,0.5,'555500'], [ 85, 85, 85,128,0.5,'555555'], [ 85, 85,170,128,0.5,'5555aa'], [ 85, 85,255,128,0.5,'5555ff'],
    [ 85,170,  0,128,0.5,'55aa00'], [ 85,170, 85,128,0.5,'55aa55'], [ 85,170,170,128,0.5,'55aaaa'], [ 85,170,255,128,0.5,'55aaff'],
    [ 85,255,  0,128,0.5,'55ff00'], [ 85,255, 85,128,0.5,'55ff55'], [ 85,255,170,128,0.5,'55ffaa'], [ 85,255,255,128,0.5,'55ffff'],
    [170,  0, 85,128,0.5,'aa0055'], [170,  0,255,128,0.5,'aa00ff'], [170, 85,  0,128,0.5,'aa5500'], [170, 85, 85,128,0.5,'aa5555'],
    [170, 85,170,128,0.5,'aa55aa'], [170, 85,255,128,0.5,'aa55ff'], [170,170, 85,128,0.5,'aaaa55'], [170,170,255,128,0.5,'aaaaff'],
    [170,255,  0,128,0.5,'aaff00'], [170,255, 85,128,0.5,'aaff55'], [170,255,170,128,0.5,'aaffaa'], [170,255,255,128,0.5,'aaffff'],
    [255,  0, 85,128,0.5,'ff0055'], [255,  0,170,128,0.5,'ff00aa'], [255, 85,  0,128,0.5,'ff5500'], [255, 85, 85,128,0.5,'ff5555'],
    [255, 85,170,128,0.5,'ff55aa'], [255, 85,255,128,0.5,'ff55ff'], [255,170,  0,128,0.5,'ffaa00'], [255,170, 85,128,0.5,'ffaa55'],
    [255,170,170,128,0.5,'ffaaaa'], [255,170,255,128,0.5,'ffaaff'], [255,255, 85,128,0.5,'ffff55']
  ];
  /** α値を含むcolorCode値(RRGGBBAA)からcolorIndex値へのハッシュ． @name codeToIdxHash @type Object @default newObject() */
  var codeToIdxHash = {};
  /**#@-*/
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf BML.Clut @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  /** α値(0〜255)を透過率(0.00〜1.00)に変換する．
   *  @name alphaToOpacity @param {Number} a α値 */
  function alphaToOpacity(a) { return(Math.round( a * 100 / 255) / 100); }
  /** 数値を16進2桁の文字列へ変換する．
   *  @name toHexStr @param {Number} n 対象数値 @returns {String} 16進2桁の文字列 */
  function toHexStr(n) { return(BML.Util.toPaddedString(Number(n).toString(16), '0')); }
  /** 2桁に満たない16進文字列の左側に'0'を埋め16進2桁の文字列を生成する．
   *  @name padHex @param {String} h 対象16進文字列 @returns {String} 16進2桁の文字列 */
  function padHex(h)   { return(BML.Util.toPaddedString(h, '0')); }
  /**#@-*/
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.Clut @inner @static @constant @description (無名関数内の定数であり外部参照不可)<br> */
  /** BML.Util.toColorCodeへのショートカット @name toCode @type Function */
  var toCode = BML.Util.toColorCode;
  /**#@-*/
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** paletteの初期値(受信機共通固定色)をcodeToIdxHashに登録する無名関数． @name BML.Clut.$anonymous @methodOf BML.Clut @inner */
  BML.Util.each.call(palette, function(entry, idx) {
    var code = (entry[5] + toHexStr(entry[3])).toLowerCase();
    if (!codeToIdxHash[code]) codeToIdxHash[code] = idx;
  });
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  return({
    /**#@+ @methodOf BML.Clut @public @static */
    /** CLUTファイルを取得，解析し，内部パレットデータとして保持する．
     *  @name   load
     *  @param  {String} uri   CLUTファイル取得先URL
     *  @throws {FileNotFound} CLUTファイルが存在しない
     */
    load : function(uri, pattern) {
      BML.CSS.bmlStyle['clut'] = pattern || uri;

      uri = BML.Util.combinePath(uri, BML.uri);
      var ajax = new BML.Ajax(uri, {
        overrideMimeType : 'text/plain; charset=x-user-defined',
        asynchronous     : false,
        method           : 'GET'
      });
      // @Todo：ステータスコードの扱いがゾンザイ
      if (ajax.response.statusCode != 200) throw('[FileNotFound] :'+uri);

      // バイト列としてバッファ
      // @Todo：わざわざ配列に入れる必要が無いと言えば無い．
      var bytes = [];
      var stream = ajax.response.responseText;
      for(var i = 0, l = stream.length; i < l; i++) {
        bytes[i] = stream._charCodeAt_(i) & 0x00ff;
      }
      
      var flags  = bytes.shift(); // flagは無視する @Todo：処理するか?
      var sIdx   = bytes.shift(); // 開始インデックス値
      var eIdx   = bytes.shift(); // 終了インデックス値
      while(sIdx <= eIdx) {
        var y  = bytes.shift();
        var cb = bytes.shift();
        var cr = bytes.shift();
        // YCbCr値をRGB値に変換
        var r  = Math.floor(1.164 * (y-16)                    + 1.596 * (cr-128));
        var g  = Math.floor(1.164 * (y-16) - 0.391 * (cb-128) - 0.813 * (cr-128));
        var b  = Math.floor(1.164 * (y-16) + 2.018 * (cb-128));

        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        var code                  = toCode(r,g,b);
        var alpha                 = bytes.shift();
        palette[sIdx]             = [r, g, b, alpha, alphaToOpacity(alpha), code];
        codeToIdxHash[code+alpha] = sIdx++;
      }
    },
    /** colorIndex値に該当する色情報を取得する．<br>
     *  内部パレットに該当の色情報が無い場合はnullを返す．
     *  @name    getRGB
     *  @param   {Number} idx colorIndex値
     *  @returns {Object}     色情報<br>
                              [.r] 赤(0〜255)<br>
                              [.g] 緑(0〜255)<br>
                              [.b] 青(0〜255)<br>
                              [.a] α値(0〜255)<br>
                              [.opacity] 透過率(0.00〜1.00)<br>
                              [.code] colorCode(RGBの各値を16進2桁で表現した16進6桁の文字列)
     */
    getRGB : function(idx) {
      idx = Math.floor(idx);
      return(((idx < 0) || (idx >= palette.length)) ? null : 
             (function() {
               var p = palette[idx];
               return({ r : p[0], g : p[1], b : p[2], a : p[3], opacity : p[4], code : p[5] });
             })());
    },
    /** 色情報(RGB値および透過率)に該当パレットのインデクス値(colorIndex値)を取得する．<br>
     *  該当するcolorIndex値が存在しない場合は-1を返す．
     *  @name    colorToIdx
     *  @param   {Number} r       赤(0〜255)
     *  @param   {Number} g       緑(0〜255)
     *  @param   {Number} b       青(0〜255)
     *  @param   {Number} opacity 透過率(0.00〜1.00)
     *  @returns {Number}         colorIndex値(0〜内部パレットの最大インデクス値)
     */
    colorToIdx : function(r, g, b, opacity) {
      // @Todo：毎回計算しないようにハッシュの作り方を変えた方が良いかもしれない．
      var code = toHexStr(r) + toHexStr(g) + toHexStr(b) + toHexStr(Math.floor(opacity * 255));
      var idx = codeToIdxHash[code.toLowerCase()];
      return((idx >= 0)? idx : -1);
    }
    /**#@-*/
  });
})();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** CSS関連を扱う関数群のネームスペース @namespace @name BML.CSS */
BML.CSS = (function() {
  /** BML文書のスタイル値 @type Object @memberOf BML.CSS @name bmlStyle */
  var bmlStyle = {
    /** BML文書のresolution特性         @name resolution         @memberOf BML.CSS.bmlStyle @type String @default '960x540' @constant */
    resolution          : '960x540',
    /** BML文書のdisplayAspectRatio特性 @name displayAspectRatio @memberOf BML.CSS.bmlStyle @type String @default '16v9' */
    displayAspectRatio  : '16v9',
    /** BML文書のusedKeyList特性        @name usedKeyList        @memberOf BML.CSS.bmlStyle @type String @default 'basic data-button' */
    usedKeyList         : 'basic data-button',
    /** BML文書のclut特性               @name clut               @memberOf BML.CSS.bmlStyle @type String @default null */
    clut                : null
  };
  /** BML文書の:active擬似クラス値<br> ** セレクタをハッシュキー，各特性名および特性値を保持するハッシュをハッシュ値として持つ． @type Object @memberOf BML.CSS @name activeStyle */
  var activeStyle = {};
  /** BML文書の:focus擬似クラス値<br> **  セレクタをハッシュキー，各特性名および特性値を保持するハッシュをハッシュ値として持つ．   @type Object @memberOf BML.CSS @name focusStyle */
  var focusStyle  = {};
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.CSS @public @static */
  function setAspectRatio(str) {
    bmlStyle.displayAspectRatio = str;
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.CSS @public @static */
  function setFocusStyle(selector, property) {
    if (!focusStyle[selector]) focusStyle[selector] = {};
    BML.Util.extend(focusStyle[selector], property || {});
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.CSS @public @static */
  function setActiveStyle(selector, property) {
    if (!activeStyle[selector]) activeStyle[selector] = {};
    BML.Util.extend(activeStyle[selector], property || {});
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.CSS @public @static */
  function getFocusStyle(element) {
    var ret = {};
    // NetFrontBMLViewerは*:focusをE:focusで上書きするように見えるため，
    // 実装をそれに合わせる(すなわち，定義の出現順に依存しない)
    BML.Util.extend(ret, focusStyle['all'] || {});
    BML.Util.extend(ret, focusStyle[element.nodeName] || {});
    return(ret);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.CSS @public @static */
  function getActiveStyle(element) {
    var ret = {};
    // NetFrontBMLViewerは*:focusをE:focusで上書きするように見えるため，
    // 実装をそれに合わせる(すなわち，定義の出現順に依存しない)
    BML.Util.extend(ret, activeStyle['all'] || {});
    BML.Util.extend(ret, activeStyle[element.nodeName] || {});
    return(ret);
  }
  /**#@-*/
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.CSS @inner @static @constant @description (無名関数内の定数であり外部参照不可)<br> */
  /** BML.Util.getStyleへのショートカット． @type Function  @name BML.CSS.getStyle */
  var getStyle = BML.Util.getStyle;
  /** BML.Util.supportSpecificHTMLElementへのショートカット． @type Boolean  @name BML.CSS.supportSpecificHTMLElement */
  var supportSpecificHTMLElement = BML.Util.supportSpecificHTMLElement;
  /** normalStyle属性を有するHTMLElementのDOMインタフェース名の集合． @type Array<String>  @name normalStyleDOMInterface */
  var normalStyleDOMInterface = supportSpecificHTMLElement ?
    [ HTMLDivElement,    HTMLSpanElement,  HTMLParagraphElement, HTMLBRElement,
      HTMLAnchorElement, HTMLInputElement, HTMLObjectElement,    HTMLBodyElement ] :
    [ HTMLElement ];
  /** focusStyle/activeStyle属性を有するHTMLElementのDOMインタフェース名の集合． @type Array<String>  @name pseudoStyleDOMInterface */
  var pseudoStyleDOMInterface = supportSpecificHTMLElement ?
    [ HTMLDivElement,    HTMLSpanElement,  HTMLParagraphElement,
      HTMLAnchorElement, HTMLInputElement, HTMLObjectElement ] :
    [ HTMLElement ];
  /** normalStyle経由で読み書き可能な特性名の判定用正規表現． @type RegExp  @name pseudoClassReadWritePropertyMatcher */
  var pseudoClassReadWritePropertyMatcher = new RegExp('(:?left|top|width|height|visibility|'+
                                                     'fontFamily|fontSize|fontWeight|colorIndex|'+
                                                     'backgroundColorIndex|borderTopColorIndex|'+
                                                     'borderRightColorIndex|borderLeftColorIndex|'+
                                                     'borderBottomColorIndex|grayscaleColorIndex)');
  /** normalStyle経由で書き込み不可な特性名の判定用正規表現． @type RegExp  @name pseudoClassReadOnlyPropertyMatcher */
  var pseudoClassReadOnlyPropertyMatcher  = new RegExp('(:?borderStyle|borderWidth)');
  /**#@-*/

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** normalStyle特性にアクセスするCSSインタフェースを提供するクラス
   *  @class 擬似normalStyleオブジェクトクラス
   *  @name  BML.CSS-NormalStyle
   *  @param {HTMLElement} elm normalStyle特性の提供対象の要素
   */
  function NormalStyle(elm) {
    /**#@+ @memberOf BML.CSS-NormalStyle.prototype @public */
    /** normalStyle特性の提供対象の要素 @propertyEx element|HTMLElement|コンストラクタの引数 */
    this.element = elm;
    /** 対象の要素のタグ名              @propertyEx tagName|String     |コンストラクタの引数のタグ名 */
    this.tagName = elm.tagName.toLowerCase();
    /**#@-*/
  }
  BML.Util.hashEach.call({ // readOnly properties
    /**#@+ @memberOf BML.CSS-NormalStyle.prototype */
    /** paddingTop特性(div,p,input,object要素のみ)         @propertyEx paddingTop   |String|readOnly */
    paddingTop    : /(?:div|p|input|object)/,
    /** paddingBottom特性(div,p,input,object要素のみ)      @propertyEx paddingBottom|String|readOnly */
    paddingBottom : /(?:div|p|input|object)/,
    /** paddingLeft特性(div,p,input,object要素のみ)        @propertyEx paddingLeft  |String|readOnly */
    paddingLeft   : /(?:div|p|input|object)/,
    /** paddingRight特性(div,p,input,object要素のみ)       @propertyEx paddingRight |String|readOnly */
    paddingRight  : /(?:div|p|input|object)/,
    /** broderWidth特性(div,p,span,a,input,object要素のみ) @propertyEx borderWidth  |String|readOnly */
    borderWidth   : /(?:div|p|span|a|input|object)/,
    /** broderStyle特性(div,p,span,a,input,object要素のみ) @propertyEx borderStyle  |String|readOnly */
    borderStyle   : /(?:div|p|span|a|input|object)/,
    /** lineHeight特性(p,br,span,a,input要素のみ)          @propertyEx lineHeight   |String|readOnly */
    lineHeight    : /(?:p|br|span|a|input)/,
    /** textAlign特性(p,input要素のみ)                     @propertyEx textAlign    |String|readOnly */
    textAlign     : /(?:p|input)/,
    /** letterSpacing特性(p,span,a,input要素のみ)          @propertyEx letterSpacing|String|readOnly */
    letterSpacing : /(?:p|span|a|input)/
    /**#@-*/
    /** ReadOnlyのCSS特性をNormalStyle.prototypeのgetterとして設定する無名関数．
     *  @name  BML.CSS.$anonymous1 @methodOf BML.CSS @inner
     *  @param {String} proeprtyName CSS特性名
     *  @param {RegExp} validTagName CSS特性を適用可能な要素のタグ名群の正規表現 */
  }, function(propertyName, validTagName) {
    /** style属性からCSS特性名に該当する値を返すgetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous2 @methodOf BML.CSS @inner
     *  @returns {String} CSS特性名に該当するstyle特性値 */
    NormalStyle.prototype.__defineGetter__(propertyName, function() {
      return(validTagName.test(this.tagName) ? getStyle(this.element, propertyName) : '');
    });
  });
  
  BML.Util.hashEach.call({ // readable/writable property
    /**#@+ @memberOf BML.CSS-NormalStyle.prototype */
    /** left特性(div,p,input,object要素のみ)                   @propertyEx left       |String|read/write */
    left       : /(?:div|p|input|object)/,
    /** top特性(div,p,input,object要素のみ)                    @propertyEx top        |String|read/write */
    top        : /(?:div|p|input|object)/,
    /** width特性(div,p,input,object要素のみ)                  @propertyEx width      |String|read/write */
    width      : /(?:div|p|input|object)/,
    /** height特性(div,p,input,object要素のみ)                 @propertyEx height     |String|read/write */
    height     : /(?:div|p|input|object)/,
    /** visibility特性(div,p,span,a,input,object,body要素のみ) @propertyEx visibility |String|read/write */
    visibility : /(?:div|p|span|a|input|object|body)/,
    /** fontFamily特性(p,span,a,input要素のみ)                 @propertyEx fontFamily |String|read/write */
    fontFamily : /(?:p|span|a|input)/,
    /** fontSize特性(p,span,a,input要素のみ)                   @propertyEx fontSize   |String|read/write */
    fontSize   : /(?:p|span|a|input)/,
    /** fontWeight特性(p,span,a,input要素のみ)                 @propertyEx fontWeight |String|read/write */
    fontWeight : /(?:p|span|a|input)/
    /**#@-*/
    /** 読み書き可能なCSS特性をNormalStyle.prototypeのgetter/setterとして設定する無名関数．
     *  @name  BML.CSS.$anonymous3 @methodOf BML.CSS @inner
     *  @param {String} proeprtyName CSS特性名
     *  @param {RegExp} validTagName CSS特性を適用可能な要素のタグ名群の正規表現 */
  }, function(propertyName, validTagName) {
    /** style属性からCSS特性名に該当する値を返すgetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous4 @methodOf BML.CSS @inner
     *  @returns {String} CSS特性名に該当するstyle特性値 */
    NormalStyle.prototype.__defineGetter__(propertyName, function() {
      return(validTagName.test(this.tagName) ? getStyle(this.element, propertyName) : '');
    });
    /** style属性に対してCSS特性名に該当する値を設定するsetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous5 @methodOf BML.CSS @inner
     *  @param   {String} value CSS特性に設定するCSS特性値 */
    NormalStyle.prototype.__defineSetter__(propertyName, function(value) {
      if (validTagName.test(this.tagName)) this.element.style[propertyName] = value;
    });
  });

  BML.Util.each.call([
    /**#@+ @memberOf BML.CSS-NormalStyle.prototype */
    /** navUp特性(div,p,span,a,input,object要素のみ)    @propertyEx navUp   |String|readOnly */
    'navUp',
    /** navDown特性(div,p,span,a,input,object要素のみ)  @propertyEx navDown |String|readOnly */
    'navDown',
    /** navLeft特性(div,p,span,a,input,object要素のみ)  @propertyEx navLeft |String|readOnly */
    'navLeft',
    /** navRight特性(div,p,span,a,input,object要素のみ) @propertyEx navRight|String|readOnly */
    'navRight',
    /** navIndex特性(div,p,span,a,input,object要素のみ) @propertyEx navIndex|String|readOnly */
    'navIndex'
    /**#@-*/
    /** navigation特性に関わるReadOnlyのCSS特性をNormalStyle.prototypeのgetterとして設定する無名関数．
     *  @name  BML.CSS.$anonymous6 @methodOf BML.CSS @inner
     *  @param {String} proeprtyName CSS特性名 */
  ], function(propertyName) {
    /** _navPropertyプロパティからnavigation特性名に該当する値を返すgetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous7 @methodOf BML.CSS @inner
     *  @returns {String} navigation特性名に該当するnavigation特性値 */
    NormalStyle.prototype.__defineGetter__(propertyName, function() {
      return(/(?:div|p|span|a|input|object)/.test(this.tagName) ? 
             this.element._navigation[propertyName.substring(3).toLowerCase()] : '');
    });
  });
  
  BML.Util.each.call([
    /**#@+ @memberOf BML.CSS-NormalStyle.prototype */
    /** clut特性(body要素のみ)               @propertyEx BML.CSS-NormalStyle.prototype.clut              |String|readOnly */
    'clut',
    /** resolution特性(body要素のみ)         @propertyEx BML.CSS-NormalStyle.prototype.resolution        |String|readOnly */
    'resolution',
    /** displayAspectRatio特性(body要素のみ) @propertyEx BML.CSS-NormalStyle.prototype.displayAspectRatio|String|readOnly */
    'displayAspectRatio'
    /**#@-*/
    /** body要素特有のReadOnlyのCSS特性をNormalStyle.prototypeのgetterとして設定する無名関数．
     *  @name  BML.CSS.$anonymous8 @methodOf BML.CSS @inner
     *  @param {String} proeprtyName CSS特性名 */
  ], function(propertyName) {
    /** BML.CSS.bmlStyleプロパティからCSS特性名に該当する値を返すgetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous9 @methodOf BML.CSS @inner
     *  @returns {String}    CSS特性名に該当するCSS特性値 */
    NormalStyle.prototype.__defineGetter__(propertyName, function() {
      return(/body/.test(this.tagName) ? BML.CSS.bmlStyle[propertyName] : null);
    });
  });
    
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.CSS-NormalStyle.prototype */
  /** usedKeyList特性(body要素のみ) @propertyEx BML.CSS-NormalStyle.prototype.usedKeyList|String|read/write */
  NormalStyle.prototype.__defineGetter__('usedKeyList', function() {
    return(/body/.test(this.tagName) ? BML.CSS.bmlStyle.usedKeyList : null);
  });
  NormalStyle.prototype.__defineSetter__('usedKeyList', function(val) {
    if (/body/.test(this.tagName)) BML.Navigation.setUsedKeyList(val);
  });
  /**#@-*/

  BML.Util.hashEach.call({
    /**#@+ @memberOf BML.CSS-NormalStyle.prototype */
    /** colorIndex特性(p,span,a,input要素のみ)                           @propertyEx colorIndex            |String|read/write */
    colorIndex             : ['color',             /(?:p|span|a|input)/],
    /** backgroundColorIndex特性(div,p,span,a,input,object,body要素のみ) @propertyEx backgroundColorIndex  |String|read/write */
    backgroundColorIndex   : ['backgroundColor',   /(?:div|p|span|a|input|object|body)/],
    /** borderTopColorIndex特性(div,p,span,a,input要素のみ)              @propertyEx borderTopColorIndexw  |String|read/write */
    borderTopColorIndex    : ['borderTopColor',    /(?:div|p|span|a|input)/],
    /** borderRightColorIndex特性(div,p,span,a,input要素のみ)            @propertyEx borderRightColorIndex |String|read/write */
    borderRightColorIndex  : ['borderRightColor',  /(?:div|p|span|a|input)/],
    /** borderLeftColorIndex特性(div,p,span,a,input要素のみ)             @propertyEx borderLeftColorIndex  |String|read/write */
    borderLeftColorIndex   : ['borderLeftColor',   /(?:div|p|span|a|input)/],
    /** borderBottomColorIndex特性(div,p,span,a,input要素のみ)           @propertyEx borderBottomColorIndex|String|read/write */
    borderBottomColorIndex : ['borderBottomColor', /(?:div|p|span|a|input)/]
    /**#@-*/
    /** 読み書き可能なcolorIndexに関わるCSS特性をNormalStyle.prototypeのgetter/setterとして設定する無名関数．
     *  @name  BML.CSS.$anonymous10 @methodOf BML.CSS @inner
     *  @param {String} proeprtyName    CSS特性名
     *  @param {Array}  condition       CSS特性名に対応するstyle属性名，およびCSS特性を適用可能な要素のタグ名群の正規表現を持つ配列．*/
  }, function(propertyName, condition) {
    /** style属性に対してCSS特性名に該当する値(RGB値及び透過率)を取得しcolorIndex値を返すgetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous11 @methodOf BML.CSS @inner
     *  @param   {String} value colorIndexに関わるCSS特性名
     *  @returns {Number}       CSS特性名に該当するcolorIndex値 */
    NormalStyle.prototype.__defineGetter__(propertyName, function() {
      if (!condition[1].test(this.tagName)) return('');
      
      var r = 0, g = 0, b = 0, opacity = 0;
      var color = getStyle(this.element, condition[0]);
      if (/transparent/) {
        r = 0; g = 0; b = 0; opacity = 0;
      } else if (/rgb\((\d+)[^\d]+(\d+)[^\d]+(\d+)(?:[^\d]+(\d+))?\)/.test(color)) {
        r = RegExp.$1; g = RegExp.$2; b = RegExp.$3;
        opacity = (RegExp.$4) ? RegExp.$4: (getStyle(this.element, 'opacity') || 0);
      }
      return(Number(BML.Clut.colorToIdx(r, g, b, opacity)));
    });
    /** style属性に対してCSS特性名に該当するcolorIndex値をRGB値及び透過率に変換し設定するsetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous12 @methodOf BML.CSS @inner
     *  @param   {Number} value CSS特性に設定するcolorIndex値 */
    NormalStyle.prototype.__defineSetter__(propertyName, function(value) {
      if (!condition[1].test(this.tagName)) return;
      var rgb = BML.Clut.getRGB(value);
      if (!rgb) rgb = { code : '000000', opacity : 1.0 };

      if ((rgb.code === '000000') && (rgb.opacity === 0)) {
        this.element.style[condition[0]] = '';
        this.element.style.opacity       = '';
      } else {
        this.element.style[condition[0]] = '#'+rgb.code;
        this.element.style.opacity       = rgb.opacity;
      }
    });
  });
  /**#@+ @memberOf BML.CSS-NormalStyle.prototype */
  /** grayscaleColorIndex特性(p,span,a,input要素のみ)<br>
   *  擬似実装であり，grayscaleColorIndex特性として動作しない．
   *  @propertyEx grayscaleColorIndex|String|read/write */
  /**#@-*/
  NormalStyle.prototype.__defineGetter__('grayscaleColorIndex', function() {
    /** grayscaleColorIndex特性を扱うgetter用無名関数．<br>**擬似実装でありデフォルト値を返す．
     *  @name     BML.CSS.$anonymous13 @methodOf BML.CSS @inner
     *  @returns  {String} デフォルトのgrayscaleColorIndex値('30 15') */
    return(/(?:p|span|a|input)/.test(this.tagName) ? '30 15' : ''); // return default value
  });
    /** grayscaleColorIndex特性を扱うsetter用無名関数．<br>**擬似実装であり何も行わない．
     *  @name    BML.CSS.$anonymous14 @methodOf BML.CSS @inner
     *  @param   {String} value grayscaleColorIndex特性に設定するcolorIndex値 */
  NormalStyle.prototype.__defineSetter__('grayscaleColorIndex', function(value) {
  });

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** :active/:focus擬似クラスのCSS特性に対するインタフェースを提供するクラス
   *  @class :active/:focus擬似クラスのCSS特性アクセス用共通オブジェクトクラス
   *  @name  BML.CSS-PseudoClassStyle
   *  @param {HTMLElement} elm :active/:focus擬似クラスにおけるCSS特性の提供対象要素
   */
  function PseudoClassStyle(elm, isFocusStyle) {
    /**#@+ @memberOf BML.CSS-PseudoClassStyle.prototype @public */
    /** :active/:focusにおけるCSS特性の提供対象の要素                         @propertyEx BML.CSS-PseudoClassStyle.prototype.element     |HTMLElement|コンストラクタの引数 */
    this.element      = elm;
    /** 対象の要素のタグ名                                                    @propertyEx BML.CSS-PseudoClassStyle.prototype.tagName     |String     |コンストラクタの引数のタグ名 */
    this.tagName      = elm.tagName.toLowerCase();
    /** :active/:focusにおけるCSS特性のいずれかを示すフラグ                   @propertyEx BML.CSS-PseudoClassStyle.prototype.isFocusStyle|Boolean    |コンストラクタの引数 */
    this.isFocusStyle = isFocusStyle;
    /** :active/:focusにおける自身のCSS特性を保持するハッシュ                 @propertyEx BML.CSS-PseudoClassStyle.prototype.sytle       |Object     |null */
    this.style        = null;
    /** :active/:focusを適用した際に置きかえられたsytle特性を保持するハッシュ @propertyEx BML.CSS-PseudoClassStyle.prototype.prevSytle   |Object     |null */
    this.prevStyle    = null;
    /**#@-*/
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf BML.CSS-PseudoClassStyle.prototype @public */
  /** :active/:focus擬似クラスにおける自身のCSS特性を取得する．<br>
   *  @name    BML.CSS-PseudoClassStyle.prototype.getStyle
   *  @returns {Object} :active/:focus擬似クラスにおけるCSS特性のハッシュ
   */
  PseudoClassStyle.prototype.getStyle = function() {
    var obj = this.isFocusStyle ? this.element._focusStyleObj : this.element._activeStyleObj;
    if (!obj.style) obj.style = this.isFocusStyle ?
      BML.CSS.getFocusStyle(this.element) : BML.CSS.getActiveStyle(this.element);
    return(obj.style);
  };
  /**#@-*/
  BML.Util.hashEach.call({ // readable/writable property
    /**#@+ @memberOf BML.CSS-PseudoClassStyle.prototype */
    /** left特性(div,p,input,object要素のみ)                   @propertyEx BML.CSS-PseudoClassStyle.prototype.left       |String|read/write */
    left       : /(?:div|p|input|object)/,
    /** top特性(div,p,input,object要素のみ)                    @propertyEx BML.CSS-PseudoClassStyle.prototype.top        |String|read/write */
    top        : /(?:div|p|input|object)/,
    /** width特性(div,p,input,object要素のみ)                  @propertyEx BML.CSS-PseudoClassStyle.prototype.width      |String|read/write */
    width      : /(?:div|p|input|object)/,
    /** height特性(div,p,input,object要素のみ)                 @propertyEx BML.CSS-PseudoClassStyle.prototype.height     |String|read/write */
    height     : /(?:div|p|input|object)/,
    /** visibility特性(div,p,span,a,input,object,body要素のみ) @propertyEx BML.CSS-PseudoClassStyle.prototype.visibility |String|read/write */
    visibility : /(?:div|p|span|a|input|object|body)/,
    /** fontFamily特性(p,span,a,input要素のみ)                 @propertyEx BML.CSS-PseudoClassStyle.prototype.fontFamily |String|read/write */
    fontFamily : /(?:p|span|a|input)/,
    /** fontSize特性(p,span,a,input要素のみ)                   @propertyEx BML.CSS-PseudoClassStyle.prototype.fontSize   |String|read/write */
    fontSize   : /(?:p|span|a|input)/,
    /** fontWeight特性(p,span,a,input要素のみ)                 @propertyEx BML.CSS-PseudoClassStyle.prototype.fontWeight |String|read/write */
    fontWeight : /(?:p|span|a|input)/
    /**#@-*/
    /** 読み書き可能なCSS特性をPseudoClassStyle.prototypeのgetter/setterとして設定する無名関数．
     *  @name  BML.CSS.$anonymous15 @methodOf BML.CSS @inner
     *  @param {String} proeprtyName CSS特性名
     *  @param {RegExp} validTagName CSS特性を適用可能な要素のタグ名群の正規表現 */
  }, function(propertyName, validTagName) {
    /** style属性からCSS特性名に該当する値を返すgetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous16 @methodOf BML.CSS @inner
     *  @returns {String} CSS特性名に該当するstyle特性値 */
    PseudoClassStyle.prototype.__defineGetter__(propertyName, function() {
      return(validTagName.test(this.tagName) ? this.getStyle()[propertyName] : '');
    });
    /** style属性に対してCSS特性名に該当する値を設定するsetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous17 @methodOf BML.CSS @inner
     *  @param   {String} value CSS特性に設定するCSS特性値 */
    PseudoClassStyle.prototype.__defineSetter__(propertyName, function(value) {
      if (validTagName.test(this.tagName)) this.getStyle()[propertyName] = value;
    });
  });
  BML.Util.hashEach.call({
    /**#@+ @memberOf BML.CSS-PseudoClassStyle.prototype */
    /** colorIndex特性(p,span,a,input要素のみ)                           @propertyEx BML.CSS-PseudoClassStyle.prototype.colorIndex            |String|read/write */
    colorIndex             : /(?:p|span|a|input)/,
    /** backgroundColorIndex特性(div,p,span,a,input,object,body要素のみ) @propertyEx BML.CSS-PseudoClassStyle.prototype.backgroundColorIndex  |String|read/write */
    backgroundColorIndex   : /(?:div|p|span|a|input|object|body)/,
    /** borderTopColorIndex特性(div,p,span,a,input要素のみ)              @propertyEx BML.CSS-PseudoClassStyle.prototype.borderTopColorIndexw  |String|read/write */
    borderTopColorIndex    : /(?:div|p|span|a|input)/,
    /** borderRightColorIndex特性(div,p,span,a,input要素のみ)            @propertyEx BML.CSS-PseudoClassStyle.prototype.borderRightColorIndex |String|read/write */
    borderRightColorIndex  : /(?:div|p|span|a|input)/,
    /** borderLeftColorIndex特性(div,p,span,a,input要素のみ)             @propertyEx BML.CSS-PseudoClassStyle.prototype.borderLeftColorIndex  |String|read/write */
    borderLeftColorIndex   : /(?:div|p|span|a|input)/,
    /** borderBottomColorIndex特性(div,p,span,a,input要素のみ)           @propertyEx BML.CSS-PseudoClassStyle.prototype.borderBottomColorIndex|String|read/write */
    borderBottomColorIndex : /(?:div|p|span|a|input)/
    /**#@-*/
    /** 読み書き可能なcolorIndexに関わるCSS特性をPseudoClassStyle.prototypeのgetter/setterとして設定する無名関数．
     *  @name  BML.CSS.$anonymous18 @methodOf BML.CSS @inner
     *  @param {String} proeprtyName    CSS特性名
     *  @param {Array}  condition       CSS特性を適用可能な要素のタグ名群の正規表現．*/
  }, function(propertyName, condition) {
    /** style属性に対してCSS特性名に該当する値(RGB値及び透過率)を取得しcolorIndex値を返すgetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous19 @methodOf BML.CSS @inner
     *  @param   {String} value colorIndexに関わるCSS特性名
     *  @returns {Number}       CSS特性名に該当するcolorIndex値 */
    PseudoClassStyle.prototype.__defineGetter__(propertyName, function() {
      if (!condition.test(this.tagName)) return(8);

      var index = this.getStyle()[propertyName];
      return(BML.Util.isUndefined(index) ? 8 : Number(index));
    });
    /** style属性に対してCSS特性名に該当するcolorIndex値をRGB値及び透過率に変換し設定するsetter用無名クロージャ関数．
     *  @name    BML.CSS.$anonymous20 @methodOf BML.CSS @inner
     *  @param   {Number} value CSS特性に設定するcolorIndex値 */
    PseudoClassStyle.prototype.__defineSetter__(propertyName, function(value) {
      if (!condition.test(this.tagName)) return;
      this.getStyle()[propertyName] = value;
    });
  });
  /**#@+ @memberOf BML.CSS-PseudoClassStyle.prototype */
  /** grayscaleColorIndex特性(p,span,a,input要素のみ)<br>
   *  擬似実装であり，grayscaleColorIndex特性として動作しない．
   *  @propertyEx BML.CSS-PseudoClassStyle.prototype.grayscaleColorIndex|String|read/write */
  /**#@-*/
  PseudoClassStyle.prototype.__defineGetter__('grayscaleColorIndex', function() {
    /** grayscaleColorIndex特性を扱うgetter用無名関数．<br>**擬似実装でありデフォルト値を返す．
     *  @name     BML.CSS.$anonymous21 @methodOf BML.CSS @inner
     *  @returns  {String} デフォルトのgrayscaleColorIndex値('30 15') */
    return(/(?:p|span|a|input)/.test(this.tagName) ? '30 15' : ''); // return default value
  });
    /** grayscaleColorIndex特性を扱うsetter用無名関数．<br>**擬似実装であり何も行わない．
     *  @name    BML.CSS.$anonymous22 @methodOf BML.CSS @inner
     *  @param   {String} value grayscaleColorIndex特性に設定するcolorIndex値 */
  PseudoClassStyle.prototype.__defineSetter__('grayscaleColorIndex', function(value) {
  });

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** normalStyle特性(div,p,br,a,span,input,object,body要素のみ)． @propertyEx HTMLElement.prototype.normalStyle|BML.CSS-NormalStyle|readOnly */
  /** 設定可能な要素に対してnormalStyle特性をHTMLElement.prototypeのgetterとして設定する無名関数．
   *  @name  BML.CSS.$anonymous23 @methodOf BML.CSS @inner
   *  @param {DOMInterface} dom normalStyle特性を設定可能なDOMインタフェース */
  BML.Util.each.call(normalStyleDOMInterface, function(dom) {
    try {
      /** normalStyle特性に対するgetter用無名関数．
       *  @name  BML.CSS.$anonymous24 @methodOf BML.CSS @inner */
      dom.prototype.__defineGetter__('normalStyle', function() {
        /** NormalStyleオブジェクトを保持するプライベートプロパティ．  @public @propertyEx HTMLElement.prototype._normalStyleObj|BML.CSS-NormalStyle|new NormalStyle */
        if (!this._normalStyleObj) this._normalStyleObj = new NormalStyle(this);
        return(this._normalStyleObj);
      });
    } catch(e) { BML.Debug.error(e); }
  });
  /** 設定可能な要素に対してfocusStyle/activeStyle特性をHTMLElement.prototypeのgetterとして設定する無名関数．
   *  @name  BML.CSS.$anonymous25 @methodOf BML.CSS @inner
   *  @param {DOMInterface} dom normalStyle特性を設定可能なDOMインタフェース */
  BML.Util.each.call(pseudoStyleDOMInterface, function(dom) {
    try {
      /** focusStyle特性(div,p,a,span,input,object要素のみ)． @propertyEx HTMLElement.prototype.focusStyle|BML.CSS-PseudoClassStyle|readOnly */
      /** focusStyle特性に対するgetter用無名関数．
       *  @name  BML.CSS.$anonymous26 @methodOf BML.CSS @inner */
      dom.prototype.__defineGetter__('focusStyle',  function() {
        /** PseudoClassStyleオブジェクトを保持するプライベートプロパティ．  @public @propertyEx HTMLElement.prototype._focusStyleObj|BML.CSS-PseudoClassStyle|new PseudoClassStyle */
        if (!this._focusStyleObj)  this._focusStyleObj  = new PseudoClassStyle(this, true);
        return(this._focusStyleObj);
      });
      /** activeStyle特性(div,p,a,span,input,object要素のみ)． @propertyEx HTMLElement.prototype.activeStyle|BML.CSS-PseudoClassStyle|readOnly */
      /** activeStyle特性に対するgetter用無名関数．
       *  @name  BML.CSS.$anonymous27 @methodOf BML.CSS @inner */
      dom.prototype.__defineGetter__('activeStyle', function() {
        /** PseudoClassStyleオブジェクトを保持するプライベートプロパティ．  @public @propertyEx HTMLElement.prototype._activeStyleObj|BML.CSS-PseudoClassStyle|new PseudoClassStyle */
        if (!this._activeStyleObj) this._activeStyleObj = new PseudoClassStyle(this, false);
        return(this._activeStyleObj);
      });
      
      /** :focus擬似クラスによるCSS特性を自身に適用する．
       *  @name HTMLElement.prototype.setFocusStyle @methodOf HTMLElement.prototype */
      dom.prototype.setFocusStyle = function() {
        var style = this.focusStyle.getStyle(), prev = {};
        
        for(var key in style) {
          // @Todo：tagNameなども見た方が良いかもしれないが...
          if (pseudoClassReadWritePropertyMatcher.test(key)) {
            prev[key] = this.normalStyle[key];
            this.normalStyle[key] = style[key];
          } else if (pseudoClassReadOnlyPropertyMatcher.test(key)) {
            prev[key] = this.normalStyle[key];
            this.style[key] = style[key];
          }
        }
        this._focusStyleObj.prevStyle = prev;
      };
      /** 自身に対する:focus擬似クラスによるCSS特性を解除する．
       *  @name HTMLElement.prototype.unsetFocusStyle @methodOf HTMLElement.prototype */
      dom.prototype.unsetFocusStyle = function() {
        var style = this.focusStyle.prevStyle || {};
        for(var key in style) {
          if (pseudoClassReadWritePropertyMatcher.test(key)) {
            this.normalStyle[key] = style[key];
          } else if (pseudoClassReadOnlyPropertyMatcher.test(key)) {
            this.style[key] = style[key];
          }
        }
        this._focusStyleObj.prevStyle = null;
      };
      /** :active擬似クラスによるCSS特性を自身に適用する．
       *  @name HTMLElement.prototype.setActiveStyle @methodOf HTMLElement.prototype */
      dom.prototype.setActiveStyle = function() {
        var style = this.activeStyle.getStyle(), prev = {};
        for(var key in style) {
          if (pseudoClassReadWritePropertyMatcher.test(key)) {
            prev[key] = this.normalStyle[key];
            this.normalStyle[key] = style[key];
          } else if (pseudoClassReadOnlyPropertyMatcher.test(key)) {
            prev[key] = this.normalStyle[key];
            this.style[key] = style[key];
          }
        }
        this._activeStyleObj.prevStyle = prev;
      };
      /** 自身に対する:active擬似クラスによるCSS特性を解除する．
       *  @name HTMLElement.prototype.unsetActiveStyle @methodOf HTMLElement.prototype */
      dom.prototype.unsetActiveStyle = function() {
        var style = this.activeStyle.prevStyle || {};
        for(var key in style) {
          if (pseudoClassReadWritePropertyMatcher.test(key)) {
            this.normalStyle[key] = style[key];
          } else if (pseudoClassReadOnlyPropertyMatcher.test(key)) {
            this.style[key] = style[key];
          }
        }
        this._activeStyleObj.prevStyle = null;
      };
    } catch(e) { BML.Debug.error(e); }
  });

  return({
    bmlStyle       : bmlStyle,
    setActiveStyle : setActiveStyle,
    setFocusStyle  : setFocusStyle,
    getActiveStyle : getActiveStyle,
    getFocusStyle  : getFocusStyle,
    setAspectRatio : setAspectRatio
  });
})();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** キー操作やフォーカス制御などを扱う関数群のネームスペース @namespace @name BML.Navigation */
BML.Navigation = (function() {
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.Navigation @inner @static @constant @description (無名関数内の定数であり外部参照不可)<br> */
  /** キー名称をハッシュキーとして，対応するARIBキーコードの集合をハッシュ値として保持する． @type Object  @name ARIB_KEYCODE */
  var ARIB_KEYCODE  = {
    UP      :  1,    DOWN    :  2,    LEFT    :  3,    RIGHT   :  4,
    0       :  5,    1       :  6,    2       :  7,    3       :  8,
    4       :  9,    5       : 10,    6       : 11,    7       : 12,
    8       : 13,    9       : 14,    10      : 15,    11      : 16,
    12      : 17,
    ENTER   : 18,    BACK    : 19,    DBUTTON : 20,
    BLUE    : 21,    RED     : 22,    GREEN   : 23,    YELLOW  : 24
  };
  /** ARIBキーコードをハッシュキーとして，キー名の集合をハッシュ値として保持する． @type Object  @name KEYCODE_NAME */
  var KEYCODE_NAME = {};
  for(var key in ARIB_KEYCODE) { KEYCODE_NAME[ARIB_KEYCODE[key]] = key; }
  /** アクセスキーに設定される文字をハッシュキーとして，ARIB_KEYCODEの集合をハッシュ値として保持する． @type Object  @name ACCESS_KEY_TO_KEYCODE */
  // ARIB STD B-24 第二編 付属2 5.1.8 リモコンキーの運用
  var ACCESS_KEY_TO_KEYCODE = {
    X : ARIB_KEYCODE.BACK,
    B : ARIB_KEYCODE.BLUE,  R : ARIB_KEYCODE.RED,
    G : ARIB_KEYCODE.GREEN, Y : ARIB_KEYCODE.YELLOW
  };
  /** key-group名をハッシュキーとして，対応するキーコードの集合を配列として保持する． @type Object  @name KEY_GROUP */
  var KEY_GROUP = {
    'basic'          : [ // ↑,↓,←,→,決定,戻る
      ARIB_KEYCODE.UP,    ARIB_KEYCODE.DOWN,
      ARIB_KEYCODE.LEFT,  ARIB_KEYCODE.RIGHT,
      ARIB_KEYCODE.ENTER, ARIB_KEYCODE.BACK ], 
    'data-button'    : [ // 青,赤,緑,黄,d
      ARIB_KEYCODE.BLUE,  ARIB_KEYCODE.RED,
      ARIB_KEYCODE.GREEN, ARIB_KEYCODE.YELLOW, ARIB_KEYCODE.DBUTTON ],
    'numeric-tuning' : [ // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
      ARIB_KEYCODE[0],  ARIB_KEYCODE[1],  ARIB_KEYCODE[2],  ARIB_KEYCODE[4],
      ARIB_KEYCODE[5],  ARIB_KEYCODE[6],  ARIB_KEYCODE[7],  ARIB_KEYCODE[8],
      ARIB_KEYCODE[9],  ARIB_KEYCODE[10], ARIB_KEYCODE[11], ARIB_KEYCODE[12] ],
    'other-tuning'   : [],
    'special-1'      : [],
    'special-2'      : [],
    'special-3'      : [],
    'special-4'      : [],
    'misc'           : []
  };
  /** HTMLブラウザのキーコードをARIBのキーコードに対応づけるハッシュ． @type Object  @name BROWSER_TO_ARIB_KEYCODE */
  var BROWSER_TO_ARIB_KEYCODE = {
    // see: ARIB-B24 Appendix.2 5.1.8
     38 : ARIB_KEYCODE.UP,     40 : ARIB_KEYCODE.DOWN,    // ↑,↓
     37 : ARIB_KEYCODE.LEFT,   39 : ARIB_KEYCODE.RIGHT,   // ←,→
     48 : ARIB_KEYCODE[0],     49 : ARIB_KEYCODE[1],      50 : ARIB_KEYCODE[2],  // 0],1],2
     51 : ARIB_KEYCODE[3],     52 : ARIB_KEYCODE[4],      53 : ARIB_KEYCODE[5],  // 3],4],5
     54 : ARIB_KEYCODE[6],     55 : ARIB_KEYCODE[7],      56 : ARIB_KEYCODE[8],  // 6],7],8
     57 : ARIB_KEYCODE[9],    109 : ARIB_KEYCODE[10],    222 : ARIB_KEYCODE[11], // 9],-],^
    220 : ARIB_KEYCODE[12],                               // \
     13 : ARIB_KEYCODE.ENTER,  46 : ARIB_KEYCODE.BACK,    // enter,del
     68 : ARIB_KEYCODE.DBUTTON,                           // d
     66 : ARIB_KEYCODE.BLUE,   82 : ARIB_KEYCODE.RED,     // b,r
     71 : ARIB_KEYCODE.GREEN,  89 : ARIB_KEYCODE.YELLOW   // g,y
  };
  /** BML.Util.supportSpecificHTMLElementへのショートカット． @type Boolean  @name BML.Navigation.supportSpecificHTMLElement */
  var supportSpecificHTMLElement = BML.Util.supportSpecificHTMLElement;
  /** focus/blur関数を有するHTMLElementのDOMインタフェース名の集合． @type Array<String>  @name focusBlurDOMInterface */
  var focusBlurDOMInterface = supportSpecificHTMLElement  ?
    [ HTMLDivElement,    HTMLSpanElement,  HTMLParagraphElement, 
      HTMLAnchorElement, HTMLInputElement, HTMLObjectElement ] :
    [ HTMLElement ];
  /** navigation特性を有するHTMLElementのDOMインタフェース名の集合． @type Array<String>  @name navigationDOMInterface */
  var navigationDOMInterface = supportSpecificHTMLElement  ?
    [ HTMLDivElement,    HTMLSpanElement,  HTMLParagraphElement, 
      HTMLAnchorElement, HTMLInputElement, HTMLObjectElement ] :
    [ HTMLElement ];
  /**#@-*/
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.Navigation @inner @static @description (無名関数内の定数であり外部参照不可)<br> */
  /** navIndex値と該当する要素を対応づける配列． @type Array<HTMLElement>  @name navIdxToElement @default new Array() */
  var navIdxToElement     = [];
  /** accessKey属性と該当する要素を対応づけるハッシュ． @type Object  @name accessKeyToElement @default new Object() */
  var accessKeyToElement  = {};
  /** onKeydown/onKeyup/onClick属性を持つ要素を出現順に保持する配列． @type Array<HTMLElement>  @name focusableElement @default new Array() */
  var focusableElement    = [];
  /** 現在UsedKeyList特性に設定されているkey-groupによってマスクされている(ブラウザで扱う)キーコード群をハッシュキーとして保持する． @name keyHash @type Object @default new Object() */
  var validKeyCodeHash    = {};
  /** 現在フォーカスが設定されている要素を保持する． @name focusedElement      @type HTMLElement @default null */
  var focusedElement      = null;
  /** 前回入力されたキーイベントタイプ．             @name prevEventType       @type String      @default '' */
  var prevEventType       = '';
  /** 前回入力されたキーコード．                     @name prevKeyCode         @type String      @default '' */
  var prevKeyCode         = '';
  /** 同期事象キュー．                               @name syncEventQueue      @type Array       @default new Array() */
  var syncEventQueue      = [];
  /** 事象を同期する要否判定フラグ．                 @name isEventSynchronized @type Boolean     @default false */
  var isEventSynchronized = false;
  /**#@-*/

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf BML.Navigation @public @static */
  /** フォーカス制御可能な要素群から最初にフォーカスすべき要素を取得し，フォーカスする．<br>
   *  navIndex値が小さい要素，onKeydown属性などを持つ要素，アクセスキーが設定されている要素
   *  の順にフォーカスすべき要素を検索する．
   *  @name BML.Navigation.initialize
   */
  function initialize() {
    document.currentFocus = null; // HTMLElement
    document.currentEvent = {     // BMLEvent
      type   : {}.undefined,
      target : null
    };
    
    var elm, key, i;
    for(i = 0, l = navIdxToElement.length; i < l; i++) {
      elm = navIdxToElement[i];
      if (elm) break;
    }
    if (!elm && (focusableElement.length > 0)) {
      elm = focusableElement[0];
    }
    if (!elm && (accessKeyToElement.length > 0)) {
      key = []; for(i in accessKeyToElement) { key.push(i); } key = key.sort();
      elm = accessKeyToElement[key[0]];
    }
    if (elm) elm.focus();
    // @Todo：?
  }
  /** usedKeyList特性を登録する．<br>
   *  登録された特性に応じて有効なキーコードの集合を内部に保持する．
   *  @name  setUsedKeyList
   *  @param {String} list usedKeyList特性に設定された文字列．複数の値を持つ場合は' 'で区切る．未指定時は'basic data-button'．
   */
  function setUsedKeyList(list) {
    list = list || 'basic  data-button';
    BML.CSS.bmlStyle.usedKeyList = list;

    validKeyCodeHash = {};
    BML.Util.each.call(list.split(/\s+/), function(group) {
      BML.Util.each.call(KEY_GROUP[group] || [], function(code) {
        validKeyCodeHash[code] = 1;
      });
    });
  }
  /** キーイベントをフックする．<br>
   *  キーイベントはBML.Navigation.processKeyEventに渡す．
   *  @name grabInput
   */
  function grabInput()    {
    document.addEventListener('keydown', processKeyEvent, true);
    document.addEventListener('keyup',   processKeyEvent, true);
    document.addEventListener('click',   processKeyEvent, true);
    BML.Debug('[grab input]');
  }
  /** キーイベントのフックを解除する．
   *  @name releaseInput
   */
  function releaseInput() {
    document.removeEventListener('keydown', processKeyEvent);
    document.removeEventListener('keyup',   processKeyEvent);
    document.removeEventListener('click',   processKeyEvent);
    BML.Debug('[release input]');
  }
  /** navIndex値を持つ要素を内部で保持する．
   *  @name  entryNavIndex
   *  @param {HTMLElement} elm navIndex値を持つ要素
   *  @param {Number}      idx navIndex値
   */
  function entryNavIndex(elm, idx) {
    navIdxToElement[idx] = elm;
  }
  /** アクセスキー属性を持つ要素を内部で保持する．
   *  @name  entryAccessKey
   *  @param {HTMLElement} elm navIndex値を持つ要素
   *  @param {String}      key アクセスキーを示す文字列
   */
  function entryAccessKey(elm, key) {
    accessKeyToElement[ACCESS_KEY_TO_KEYCODE[key]] = elm;
  }
  /** onKeydown/onKeyup/onClick属性のいずれか1つ以上を持つ要素を内部で保持する．
   *  @name  entryFocusable
   *  @param {HTMLElement} elm navIndex値を持つ要素
   */
  function entryFocusable(elm) {
    focusableElement.push(elm);
  }
  /** 指定の要素をフォーカスする．<br>
   *  要素のfocus関数から呼ばれる，focus関数の実体．
   *  @name  BML.Navigation.focus
   *  @param {HTMLElement} element フォーカスする要素(focus関数をcallした要素)
   */
  function focus(element) {
    if (focusedElement && (focusedElement == element)) return;
    
    var doSync = false;
    if (!isEventSynchronized) doSync = isEventSynchronized = true;
    
    if (focusedElement && (focusedElement != element)) {
      // フォーカス遷移(X,Y)
      focusedElement.unsetFocusStyle();
      syncEventQueue.push({ type : 'blur', target : focusedElement });
    }
    // フォーカス遷移(X)
    element.setFocusStyle();
    document.currentEvent = { type : 'focus', target : element };
    document.currentFocus = focusedElement = element;
    syncEventQueue.push(document.currentEvent);

    if (doSync) {
      processSynchronizedEvent();
      isEventSynchronized = false;
    }
  }
  /** 指定の要素のフォーカスを外す．<br>
   *  要素のblur関数から呼ばれる，blur関数の実体．
   *  @name  BML.Navigation.blur
   *  @param {HTMLElement} elm フォーカスを外す要素(blur関数をcallした要素)
   */
  function blur(element) {
    if (!fousedElement || (focusedElement != element)) return;

    var doSync = false;
    if (!isEventSynchronized) doSync = isEventSynchronized = true;

    focusedElement = null;
    // フォーカス消失(X)
    element.unsetFocusStyle();
    document.currentEvent = { type : 'blur', target : element };
    document.currentFocus = focusedElement = null;
    syncEventQueue.push(document.currentEvent);

    if (doSync) {
      processSynchronizedEvent();
      isEventSynchronized = false;
    }
  }
  /**#@-*/
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf BML.Navigation @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  /** 現在設定されているusedKeyList特性上，キーコードが有効であるかを判定する．
   *  @name    isValidCode
   *  @param   {String} code 「ARIB-B24 Appendix.2 5.1.8」で定義されるキーコード
   *  @returns {Boolean}     有効/無効判定結果(有効=真)
   */
  function isValidCode(code) {
    return(!BML.Util.isUndefined(validKeyCodeHash[code]));
  }
  /** 同期イベントキューに蓄積された同期イベントを処理する．<br>
   *  同期イベントキューが空になるまでイベントを取り出して処理を行う．<br>
   *  本関数を実行するタイミングでブラウザ側のイベントキューに溜まった処理が
   *  実行されてしまうが，実装上無視することとする(ARIB的には，例えばsetInterval
   *  のコールバック関数も同期イベントの処理が終わるまで待つ必要があるが，本実装
   *  では本関数をcallする段階で処理が行われてしまう，はず)
   *  @name  BML.Navigation.processSynchronizedEvent
   */
  function processSynchronizedEvent() {
    // focus/blurの再入は行われない前提だが念のため保存しておく
    var currentFocus = document.currentFocus;
    var currentEvent = document.currentEvent;
    
    while(1) {
      var event  = syncEventQueue.shift();
      if (!event) break;

      var target = event.target;
      switch(event.type) {
        case('focus') : {
          if (target.onFocus) {
            document.currentFocus = event.target;
            document.currentEvent = event;
            target.onFocus();
          }
        } break;
        case('blur') : {
          if (target.onBlur) {
            document.currentFocus = event.target;
            document.currentEvent = event;
            target.onBlur();
          }
        } break;
        case('click') : {
          if (target.onClick) {
            document.currentFocus = event.target;
            document.currentEvent = event;
            target.onClick();
          }
        } break;
        default : break;
      }
    }

    document.currentFocus = currentFocus;
    document.currentEvent = currentEvent;
  }
  /** キー入力イベントを処理する．<br>
   *  イベントは本機能に依り終端され，他のイベントリスナにはdispatchされない．
   *  @name processKeyEvent
   *  @param {KeyboardEvent} event キーイベント
   */
  function processKeyEvent(event) {
    var type = event.type.toLowerCase();
    var code = event.keyCode;

    // キーリピート/マウスクリックを除外
    if (((prevEventType == type) && (prevKeyCode == code)) || (type == 'click')) return;
    // キー同時押し状態の無視
    if ((prevEventType == type) ||
        ((prevEventType == 'keydown') && (prevKeyCode != code))) return;

    prevEventType = type;
    prevKeyCode   = code;

    // ARIBキーコードの取得とUsedKeyListによる有効/無効チェック
    code = BROWSER_TO_ARIB_KEYCODE[code];
    if (!isValidCode(code)) return;

//    event.cancelBubble = true;
    isEventSynchronized = true;
    var accessElement = accessKeyToElement[code];
    switch(type) {
      case('keydown') : {
        if (code == ARIB_KEYCODE.DBUTTON) {
          // DataButtonPressedイベントの発生
          BML.Bevent.execEvent('DataButtonPressed'); // currentEventは関数側で実施
          
        } else if (accessElement && (BML.Util.getStyle(accessElement, 'visibility') == 'visible')) {
          // A要素のkeydown割り込み事象の発生
          if (focusedElement && focusedElement.onKeydown) {
            document.currentFocus = focusedElement;
            document.currentEvent = { type : 'keydown', target : focusedElement, keyCode : code };
            focusedElement.onKeydown();
          }
          // A'(A)要素からB要素へのフォーカス遷移
          accessElement.focus();
          processSynchronizedEvent();

          // B要素への擬似的なkeyup割り込み事象の発生
          if (accessElement.onKeyup) {
            document.currentEvent = { type : 'keyup', target : accessElement, keyCode : code };
            document.currentFocus = accessElement;
            accessElement.onKeyup();
            processSynchronizedEvent(); // ここは必要?
          }
          accessElement.setActiveStyle();
          // B要素への擬似的なkeydown割り込み事象の発生
          if (accessElement.onKeydown) {
            document.currentEvent = { type : 'keydown', target : accessElement, keyCode : ARIB_KEYCODE.ENTER };
            document.currentFocus = accessElement;
            accessElement.onKeydown();
            processSynchronizedEvent();
          }
          // B'(B)要素のclick割り込み事象の同期イベントキューへの投入
          if (focusedElement) {
            document.currentEvent = { type : 'click', target : focusedElement, keyCode : ARIB_KEYCODE.ENTER };
            document.currentFocus = focusedElement;
            syncEventQueue.push(document.currentEvent);
          }

        } else {
          // A要素へのkeydown割り込み事象の発生
          if (focusedElement && focusedElement.onKeydown) {
            document.currentEvent = { type : 'keydown', target : focusedElement, keyCode : code };
            document.currentFocus = focusedElement;
            focusedElement.onKeydown();
            processSynchronizedEvent();
          }
          // A'要素が存在する場合
          if (focusedElement) {
            if (code == ARIB_KEYCODE.ENTER) {
              // フォーカス状態での決定キー押下時
              focusedElement.setActiveStyle();
              if (focusedElement.onClick) {
                document.currentFocus = focusedElement;
                document.currentEvent = { type : 'click', target : focusedElement, keyCode : code };
                focusedElement.onClick();
              }
            } else if ((1 <= code) && (code <= 4)) {
              // ナビゲーション関連特性の適用
              var navElement = navIdxToElement[
                focusedElement._navigation[KEYCODE_NAME[code].toLowerCase()]
              ];
              if (navElement) {
                navElement.focus();
              }
            }
          }
        }
      } break;
      case('keyup') : {
        if (code == ARIB_KEYCODE.DBUTTON) {
          // nothing to do
        } else if (accessElement && (BML.Util.getStyle(accessElement, 'visibility') == 'visible')) {
          if (focusedElement) {
            if (focusedElement.onKeyup) {
              document.currentFocus = focusedElement;
              document.currentEvent = { type : 'keyup', target : focusedElement, keyCode : ARIB_KEYCODE.ENTER };
              focusedElement.onKeyup();
            }
            focusedElement.unsetActiveStyle();
            focusedElement.setFocusStyle();
          }
        } else {
          if (focusedElement) {
            if (focusedElement.onKeyup) {
              document.currentFocus = focusedElement;
              document.currentEvent = { type : 'keyup', target : focusedElement, keyCode : code };
              focusedElement.onKeyup();
            }
            if (code == ARIB_KEYCODE.ENTER) {
              focusedElement.unsetActiveStyle();
              focusedElement.setFocusStyle();
            }
          }
        }
      } break;
      default : break;
    }
    // 同期割り込み事象に対応するイベントの実行
    processSynchronizedEvent();
    isEventSynchronized = false;
  }

  /** focus/blur関数をHTMLElementに設定する無名関数．
   *  @name  $anonymous1
   *  @param {DOMInterface} dom focus/blur関数を設定するDOMインタフェース
   */
  /**#@-*/
  BML.Util.each.call(focusBlurDOMInterface, function(dom) {
    try {
      /** フォーカスを得る(div,p,a,span,input,object要素のみ)． @name HTMLElement.prototype.focus @methodOf HTMLElement.prototype */
      dom.prototype.focus = function() { BML.Navigation.focus(this); };
      /** フォーカスを外す(div,p,a,span,input,object要素のみ)． @name HTMLElement.prototype.blur  @methodOf HTMLElement.prototype */
      dom.prototype.blur  = function() { BML.Navigation.blur (this); };
    } catch(e) { BML.Debug.error(e); }
  });
  BML.Util.each.call(navigationDOMInterface, function(dom) {
    try {
      /** ナビゲーション特性を保持するローカルオブジェクト(div,p,a,span,input,object要素のみ)．<br>
       *  @type Object @name _navigation @memberOf HTMLElement.prototype
       *  @field {Number} .index navIndex値
       *  @field {Number} .up    navUp値
       *  @field {Number} .down  navDown値
       *  @field {Number} .left  navLeft値
       *  @field {Number} .right navRight値
       */
      dom.prototype.__defineGetter__('_navigation', function() {
        if (!this._navigationObj) {
          this._navigationObj = { 
            index : -1,
            up    : -1,
            down  : -1,
            left  : -1,
            right : -1
          };
        }
        return(this._navigationObj);
      });
    } catch(e) { BML.Debug.error(e); }
  });

  setUsedKeyList(BML.CSS.bmlStyle.usedKeyList);
  
  return({
    /**#@+ @methodOf BML.Navigation @public @static */
    initialize     : initialize,
    setUsedKeyList : setUsedKeyList,
    grabInput      : grabInput,
    releaseInput   : releaseInput,
    entryNavIndex  : entryNavIndex,
    entryAccessKey : entryAccessKey,
    entryFocusable : entryFocusable,
    focus          : focus, 
    blur           : blur
    /**#@-*/
  });
})();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** BML文書の取得，パース，構築を行う関数群のネームスペース @namespace @name BML.Builder */
BML.Builder = (function() {
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.Builder @inner @static @constant @description (無名関数内の定数であり外部参照不可)<br> */
  /** ノード種別を示す固定値の集合を定義したハッシュ． @name NODETYPE @type Object */
  var NODETYPE = {
    UNKNOWN_NODE           :  0,
    ELEMENT_NODE           :  1,
    ATTRIBUTE_NODE         :  2,
    TEXT_NODE              :  3,
    CDATA_SECTION_NODE     :  4,
    ENTITY_REFERENCE_NODE  :  5,
    ENTITY_NODE            :  6,
    PROC_INSTRUCTION_NODE  :  7,
    COMMENT_NODE           :  8,
    DOCUMENT_NODE          :  9,
    DOCUMENT_TYPE_NODE     : 10,
    DOCUMENT_FRAGMENT_NODE : 11,
    NOTATION_NODE          : 12
  };
  /** ARIBにおけるMIMEタイプとW3CのMIMEタイプの対応関係を定義したハッシュ． @name MIME_TYPE_MAP @type Object */
  var MIME_TYPE_MAP = {
    'image/jpeg'                            : 'image/jpeg',
    'image/X-arib-png'                      : 'image/png', 
    'image/X-arib-mng'                      : 'video/mng',
    'audio/X-arib-mpeg2-aac'                : null,
//    'audio/X-arib-aiff'                     : 'audio/aiff',
    'audio/X-arib-aiff'                     : null,
    'application/X-arib-contentPlayControl' : null,
    'application/X-aribmpeg2-tts'           : null
  };
  /** ARIB/IPTVFJにおけるDTD(publicID/systemID)とBML Versionの対応を定義した配列集合． @name DTD_DECLARATIONS @type Array<Array<String>> */
  var DTD_DECLARATIONS    = [
    ['-//ARIB STD-B24:1999//DTD BML Document for IPTV//JA', 'http://www.arib.or.jp/B24/DTD/bml_x_x_iptv.dtd', '100.0'], // IPTVFJ
    ['+//ARIB STD-B24:1999//DTD BML Document//JA',          'http://www.arib.or.jp/B24/DTD/bml_1_1.dtd',      '3.0'],   // B-14
    ['-//ARIB//DTD BML Document//JA',                       'http://www.arib.or.jp/B24/DTD/bml_1_0.dtd',      '1.0'],   // B-24
    ['+//ARIB STD-B24:1999//DTD BML Document//JA',          'bml_1_0.dtd',                                    '1.0']    // B-24???
  ];
  /** HTMLブラウザのJavaScriptエンジンでは予約名と思われる関数名の集合． @name RESERVED_FUNC_NAME @constant @type Array<String> */
  var RESERVED_FUNC_NAME  = [ 'onload', 'onunload' ];

  /** CSS定義内のclut特性パース用の正規表現． @type RegExp @name clutMatcher */
  var clutMatcher         = /([^\w])clut[^\w:]*:[^\w]*(url\([^\w]*([^\)\s]+\s*)\));?/m;
  /** CSS定義内のusedKyeList特性パース用の正規表現．         @type RegExp @name usedKeyListMatcher */
  var usedKeyListMatcher  = /([^\w])used-key-list[^\w:]*:\s*([^;\}]+)\s*;?/m;
  /** CSS定義内のresolution特性パース用の正規表現．          @type RegExp @name resolutionMatcher */
  var resolutionMatcher   = /([^\w])resolution[^\w:]*:[^;\}]*;?/mg;
  /** CSS定義内のaspectRatio特性パース用の正規表現．         @type RegExp @name aspectRatioMatcher */
  var aspectRatioMatcher  = /([^\w])display-aspect-ratio[^\w:]*:\s*([^;\}]+)\s*;?/mg;
  /** CSS定義内のmargin/padding特性削除用の正規表現．        @type RegExp @name marginPaddingMatcher */
  var marginPaddingMatcher= /([^\w])(?:margin|padding)[^\w:]*:[^;\}]*;?/mg;
  /** CSS定義内のgrayscaleColorIndex特性パース用の正規表現． @type RegExp @name grayscaleMatcher */
  var grayscaleMatcher    = /([^\w])grayscale-color-index[^\w:]*:[^;\}]*;?/mg;
  /** CSS定義内のcolorIndex関連特性パース用の正規表現．        @type RegExp @name colorIndexMatcher */
  var colorIndexMatcher   = /color-index[^\w:]*:\s*(\d+)(?:\s+(?:\d+))?[^;\}]*;?/m;
  /** CSS定義内のfontFamily特性パース用の正規表現．            @type RegExp @name fontFamilyMatcher */
  var fontFamilyMatcher   = /([^\w]font-family[^\w:]*:)\s*([^;\}]+)\s*;?/m;
  /** CSS定義内のnavigation関連特性パース用の正規表現．        @type RegExp @name navAttributeMatcher */
  var navAttributeMatcher = /nav-(\w+)[^:]*:[^\d]*(\d+)[^;\}]*;?/m;
  /** CSS定義内の:focus擬似クラスパース用の正規表現．          @type RegExp @name focusPropMatcher */
  var focusPropMatcher    = /[^\w](\w+)?:focus[^\w]*\{([^\}]+)\}/m;
  /** CSS定義内の:active擬似クラスパース用の正規表現．         @type RegExp @name activePropMatcher */
  var activePropMatcher   = /[^\w](\w+)?:active[^\w]*\{([^\}]+)\}/m;
  /**#@-*/
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.Builder @inner @static @description (無名関数内の定数であり外部参照不可)<br> */
  /** Script要素出現有無フラグ．出現前=真．           @type Boolean @name isFirstScript      @default true */
  var isFirstScript       = true;
  /** インラインECMAScript出現有無フラグ．出現前=真． @type Boolean @name isFirstInnerScript @default true */
  var isFirstInnerScript  = true;
  /** 予約名と被った関数名を保持するハッシュ．        @type Object  @name reservedNameFuncs  @default new Object() */
  var reservedNameFuncs   = {};
  /** onload/onunloadイベントハンドラとして指定された関数名を保持するハッシュ．                         @type Object @name eventHandlers @default new Object() */
  var eventHandlers       = {};
  /** すべてのECMA(Java)ScriptをBML文書ロード後に一括して評価・実行するためのECMAScript保持用バッファ． @type Array  @name scriptBuffer  @default new Array() */
  var scriptBuffer        = [];
  /** 取得中のECMAS(Java)criptファイル数を保持するカウンタ．                                            @type Number @name scriptBuffer.count  @default 0 */
  scriptBuffer.count      = 0;
  /**#@-*/

  /**#@+ @methodOf BML.Builder @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** style属性値を示す文字列を要素に設定する．<br>
   *  style.cssText(IE)とsetAttribute(Firefox/Opera/Safari)を用いたクロスブラウザスクリプト．
   *  @name  setCssStyle
   *  @param {HTMLElement} elm   style属性を設定する要素
   *  @param {String}      style style属性値を記述した文字列('name:value;...')
   */
  function setCssStyle(elm, style) {
    if (BML.Util.isIE) elm.style.cssText = style;
    else               elm.setAttribute('style', style);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** getElementsByTagNameで取得される要素群の最初の要素を取得する．
   *  @name    getFirstElementByTagName
   *  @param   {String}      name            検索する要素のタグ名
   *  @param   {Node}        [node=document] 要素を検索するルートのノード
   *  @returns {HTMLElement}                 検索された要素群の最初の要素．見取得の場合はnull．
   */
  function getFirstElementByTagName(name, node) {
    node = node || document;
    var children = node.getElementsByTagName(name);
    return((children.length > 0) ? children[0] : null);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** ECMAScript文書をJavaScriptとして実行できるように不具合部分を修正する．
   *  @name    toValidJavaScript
   *  @param   {String} script ECMAScript文書
   *  @returns {String}        修正されたECMAScript文書(JavaScript文書)
   */
  function toValidJavaScript(script) {
    if (!script) return('');

    // @Todo：潜在的なバグの可能性有り．ユーザ定義のdataプロパティとの区別がつかない．
    script = script.replace(/\.data([^\w])/g, "\.dataInterface$1");

    // onload属性などと同一名称の関数は無限ループしてしまうため改名する．
    // @Todo：潜在的なバグの可能性有り．
    // @Todo：スクリプトをすべて舐めるため非常に重い．なんとかならないものか...
    BML.Util.each.call(RESERVED_FUNC_NAME, function(name) {
      // 予約名が関数として定義されているかをチェック
      var defMatcher = new RegExp('[^\w]function\s+'+name+'[^\w]', 'm');
      if (!defMatcher.test(script)) return;

      // 予約名が関数として定義されている場合，該関数の呼び出し場所を書き換え
      var buf = '';
      var funcMatcher = new RegExp('([^\w]'+name+')([^\w])', 'm');
      while(1) {
        if (!funcMatcher.test(script)) break;
        buf   += RegExp.leftContext + RegExp.$1 + '_mod' + RegExp.$2;
        script = RegExp.rightContext;
      }
      script = buf + script;
      
      // 定義されていた関数名称と改名称を保持
      reservedNameFuncs[name] = name+'_mod';
      BML.Debug.warning('[rename function :"'+name+'"->"'+name+'_mod"]');
      
    });

    return(script);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** イベントハンドラに指定されている関数名から余分な文字を削除する．<br>
   *  IPTVFJではイベントハンドラを"func();"として指定するため，"func"部分だけを抜き出す．
   *  @name    stripEventHandlerString
   *  @param   {String} str イベントハンドラ定義文字列
   *  @returns {String}     イベントハンドラに指定された関数名
   */
  function stripEventHandlerString(str) {
    return(str.replace(/^\s*([^\s\(]+)\([^\)]*\)\s*;/, "$1"));
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** style属性値に記述されたcolorIndex特性をcolor特性に上書きする．<br>
   *  "xxx-color-index:n" → "xxx-color:#cccccc;opacity:α;"となる．<br>
   *  colorIndex値に該当する色情報がない場合は"xxx-color:#000000;opacity:1.0"とする．
   *  @name    colorIndexToColorCode
   *  @param   {String} style style属性値を記述した文字列
   *  @returns {String}       colorIndex特性をcolor特性に変換したstyle属性値文字列
   */
  function colorIndexToColorCode(style) {
    var buf = '';
    while(1) {
      if (!colorIndexMatcher.test(style)) break;
      var rgb = BML.Clut.getRGB(RegExp.$1) || { code : '000000', opacity : 1.0 };

      buf  += RegExp.leftContext + 
        (((rgb.code === '000000') && (rgb.opacity === 0)) ?
          '' : 'color:#' + rgb.code + ';opacity:' + rgb.opacity) + ';';
      style = RegExp.rightContext;
    }
    return(buf + style);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** CSS特性を記述した文字列を各特性名と特性値をペアとしたハッシュに分解する．<br>
   *  @name    parseStyleString
   *  @param   {String}      style CSS特性を記述した文字列
   *  @returns {Object}            特性名と特性値をペアとしたハッシュ
   */
  function parseStyleString(style) {
    if (!style) return({});

    var ret = {}, camelize = BML.Util.camelize;
    var matcher = /([\w-]+)[^:]*:([^;]+)/;
    while(1) {
      if (!matcher.test(style)) break;
      style = RegExp.rightContext;
      ret[camelize(RegExp.$1)] = RegExp.$2;
    }

    return(ret);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** style属性値あるいはstyle要素の要素(link要素のソースファイル含む)に記述されたCSS特性を処理する．<br>
   *  body要素特有の特性値やnavigation特性値は，取得後に解析，保持などを別処理に依頼する．
   *  @name    processARIBCSSProperty
   *  @param   {String}      style CSS特性を記述した文字列
   *  @param   {HTMLElement} [elm] style属性を設定する要素<br>省略された場合は第1引数が"style属性値では無い"と判断する．
   *  @returns {String}            処理済みのstyle属性値あるいはstyle要素文字列
   */
  function processARIBCSSProperty(style, elm) {
    //grayscaleColorIndex特性は削除する @Todo：いいのか?
    style = style.replace(grayscaleMatcher,     "$1");
    style = style.replace(marginPaddingMatcher, "$1");
    
    var buf = '';
    if (!elm || (elm.nodeName.toLowerCase() == 'body')) {
      // style要素あるいはbodyのstyle属性値の場合
      if (clutMatcher.test(style)) {
        // CLUT特性を取得し，BML.Clutに値(ファイルパス)を渡す
        style = RegExp.leftContext + RegExp.$1 + RegExp.rightContext;
        var pattern = RegExp.$2, file = RegExp.$3;
        BML.Clut.load(file, pattern);
        BML.Debug.info('[CLUT:'+pattern+'] -> BML.Clut.load('+file+')');
      }
      if (usedKeyListMatcher.test(style)) {
        // usedKeyList特性を取得し，BML.UsedKeyListに値を渡す
        style = RegExp.leftContext + RegExp.$1 + RegExp.rightContext;
        var k = RegExp.$2;
        BML.Navigation.setUsedKeyList(k);
        BML.Debug.info('[UsedKeyList:'+k+']');
      }
      if (aspectRatioMatcher.test(style)) {
        // displayAspectRatio特性を取得し，BML.CSS.bmlStyleとして値を保持する
        // @Todo：画面動作制御的に何かをしなくてよいか?
        style = RegExp.leftContext + RegExp.$1 + RegExp.rightContext;
        BML.CSS.setAspectRatio(RegExp.$2);
      }
      // resolution特性は固定値なので削除する
      style = style.replace(resolutionMatcher, "$1");

      // :foucs擬似クラス定義を取得しBML.CSS.focusStyleに保持する
      buf = '';
      var selector;
      while(1) {
        if (!focusPropMatcher.test(style)) break;
        buf  += RegExp.leftContext;
        style = RegExp.rightContext;
        selector = (RegExp.$1 || 'all').toLowerCase();
        if (selector == '*') selector = 'all';

        BML.CSS.setFocusStyle(selector, parseStyleString(RegExp.$2));
      }
      style = buf + style;

      // :active擬似クラス定義を取得しBML.CSS.activeStyleに保持する
      buf = '';
      while(1) {
        if (!activePropMatcher.test(style)) break;
        buf  += RegExp.leftContext;
        style = RegExp.rightContext;
        selector = (RegExp.$1 || 'all').toLowerCase();
        if (selector == '*') selector = 'all';

        BML.CSS.setActiveStyle(selector, parseStyleString(RegExp.$2));
      }
      style = buf + style;
    }

    if (elm) {
      // navigation特性を取得してBML.Navigationに登録する
      buf = '';
      var nav = {}, camelize = BML.Util.camelize;
      while(1) {
        if (!navAttributeMatcher.test(style)) break;
        nav[(RegExp.$1).toLowerCase()] = Number(RegExp.$2);
        buf  += RegExp.leftContext;
        style = RegExp.rightContext;
      }
      style = buf + style;
      
      BML.Util.extend(elm._navigation, nav);
      if (nav['index'] >= 0) BML.Navigation.entryNavIndex(elm, nav['index']);
    }

    // @Todo：font-familyの扱いがいい加減．
    // 複数定義されている場合，ARIBで定義可能な文字列の場合の処理について考慮が必要
    if (fontFamilyMatcher.test(style)) {
      style = RegExp.leftContext + RegExp.$1;
      var r = RegExp.rightContext;
      buf     = [];
      BML.Util.each.call((RegExp.$2).split("\s*,\s*"), function(fontName) {
        if      (/^\'([^\']+)\'$/.test(fontName)) fontName = RegExp.$1;
        else if (/^\"([^\']+)\"$/.test(fontName)) fontName = RegExp.$1;

        var newName = BML.config.usableFontMap[fontName];
        buf.push(newName ? newName : fontName);

      });
      style = style + "'" + buf.join("','") + "';" + r;
    }
    style = colorIndexToColorCode(style);

    return(style);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 有効なJavaScript文書としてスクリプトとして外部スクリプトファイルの内容を取得する．
   *  @name    getExternalScript
   *  @param   {String} src                     外部スクリプトファイルのURI
   *  @param   {Object} [currentPath='BML.uri'] 外部スクリプトファイルのパース済みカレントパス
   *  @returns {String}                         修正済みのJavaScript文書
   *  @throws  {FileNotFound}                   外部スクリプトファイルが存在しない
   */
  function getExternalScript(src, currentPath) {
    currentPath = currentPath || BML.uri;
    src = BML.Util.combinePath(src, currentPath);

    var idx = scriptBuffer.length;
    scriptBuffer[idx]  = '// not loaded:'+src+"\n";
    scriptBuffer.count++;
    var ajax = new BML.Ajax(src, {
      overrideMimeType : 'application/javascript; charset=EUC-JP',
      method           : 'GET',
      onSuccess        : function(response) {
        scriptBuffer[idx] = '//'+src+"\n" + toValidJavaScript(response.responseText);
        scriptBuffer.count--;

        // 外部ファイル取得よりもBML文書の構築が先に終わっていた場合
        if ((scriptBuffer.count <= 0) && BML.Builder.complete) {
          BML.Builder.finish();
        }
      },
      onFailure        : function(response) {
        BML.Debug.error('[JavaScript : load failed('+src+'): '+
                        response.statusCode + ':'+response.statusText+']');
      }
    });
  }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 複数の属性を要素に設定する．
   *  @name    setDefaultAttributes
   *  @param   {HTMLElement} elm  属性を設定する要素
   *  @param   {Object}      prop 属性名をプロパティ名，属性値をプロパティ値に持つオブジェクト
   *  @returns {HTMLElement}      属性を設定した要素
   */
  function setDefaultAttributes(elm, prop) {
    for(var k in prop) { elm.setAttribute(k, prop[k]); }
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** ARIB TR-B14「5.7.3 属性」で定義されるCore Attributesを要素に設定する．
   *  @name    setCoreAttributes
   *  @param   {HTMLElement} htmlElm  属性を設定するHTML要素
   *  @param   {Element}     bmlElm   属性値の参照先のBML(XML)要素
   *  @returns {HTMLElement}          属性を設定したHTML要素
   */
  function setCoreAttributes(htmlElm, bmlElm) {
    var tmp;
    tmp = bmlElm.getAttribute('id');    if (tmp) htmlElm.setAttribute('id',    tmp);
    tmp = bmlElm.getAttribute('class'); if (tmp) htmlElm.setAttribute('class', tmp);
    return(htmlElm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** ARIB TR-B14「5.7.3 属性」で定義されるI18N Attributesを要素に設定する．
   *  @name    setI18nAttributes
   *  @param   {HTMLElement} htmlElm  属性を設定するHTML要素
   *  @param   {Element}     bmlElm   属性値の参照先のBML(XML)要素
   *  @returns {HTMLElement}          属性を設定したHTML要素
   */
  function setI18nAttributes(htmlElm, bmlElm) {
    htmlElm.setAttribute('xml:lang', 'ja');
    return(htmlElm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** ARIB TR-B14「5.7.3 属性」で定義されるStyle Attributesを要素に設定する．
   *  @name    setStyleAttributes
   *  @param   {HTMLElement} htmlElm  属性を設定するHTML要素
   *  @param   {Element}     bmlElm   属性値の参照先のBML(XML)要素
   *  @returns {HTMLElement}          属性を設定したHTML要素
   */
  function setStyleAttributes(htmlElm, bmlElm) {
    var style = bmlElm.getAttribute('style');
    if (!style) return(htmlElm);

    setCssStyle(htmlElm, processARIBCSSProperty(style, htmlElm));
    return(htmlElm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** ARIB TR-B14「5.7.3 属性」で定義されるScript要素の属性値を要素に設定する．
   *  @name    setScriptAttributes
   *  @param   {HTMLElement} htmlElm  属性を設定するHTML要素
   *  @param   {String}      srcUri   Script要素が外部ファイルを参照する場合のファイル取得先URI<br>ただし，現在は利用していない．
   *  @returns {HTMLElement}          属性を設定したHTML要素
   */
  function setScriptAttributes(htmlElm, srcUri) {
    htmlElm.setAttribute('charset', 'EUC-JP');
    htmlElm.setAttribute('type',    'text/javascript'); // 'text/X-arib-ecmascript; charset="euc-jp"'
    if (srcUri) htmlElm.setAttribute('src', srcUri);
    return(htmlElm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** ARIB TR-B14「5.7.3 属性」で定義されるEvent Attributesを要素に設定する．
   *  @name    setKeyEventsAttributes
   *  @param   {HTMLElement} htmlElm  属性を設定するHTML要素
   *  @param   {Element}     bmlElm   属性値の参照先のBML(XML)要素
   *  @returns {HTMLElement}          属性を設定したHTML要素
   */
  function setKeyEventsAttributes(htmlElm, bmlElm) {
    var onClick   = bmlElm.getAttribute('onclick');
    var onKeydown = bmlElm.getAttribute('onkeydown');
    var onKeyup   = bmlElm.getAttribute('onkeyup');

    // 本関数実行時にはイベントハンドラへの関数ポインタが張れないため(JavaScriptは
    // bml文書解析後に評価されるため)，onClick実行時に遅延評価する．
    if (onClick)   htmlElm.onClick   = function() {
      htmlElm.onClick = window[stripEventHandlerString(onClick)];
      htmlElm.onClick();
    };
    if (onKeydown) htmlElm.onKeydown = function() {
      htmlElm.onKeydown = window[stripEventHandlerString(onKeydown)];
      htmlElm.onKeydown();
    };
    if (onKeyup)   htmlElm.onKeyup   = function() {
      htmlElm.onKeyup = window[stripEventHandlerString(onKeyup)];
      htmlElm.onKeyup();
    };

    // フォーカスが可能な要素としてBML.Navigationに登録する
    if (onClick || onKeydown || onKeyup)
      BML.Navigation.entryFocusable(htmlElm);
    
    return(htmlElm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** ARIB TR-B14「5.7.3 属性」で定義されるフォーカス制御用の属性(Event Attributes以外)を要素に設定する．
   *  @name    setFocusCtrlAttributes
   *  @param   {HTMLElement} htmlElm  属性を設定するHTML要素
   *  @param   {Element}     bmlElm   属性値の参照先のBML(XML)要素
   *  @returns {HTMLElement}          属性を設定したHTML要素
   */
  function setFocusCtrlAttributes(htmlElm, bmlElm) {
    var aKey    = bmlElm.getAttribute('accesskey');
    var onFocus = bmlElm.getAttribute('onfocus');
    var onBlur  = bmlElm.getAttribute('onblur');

    // アクセスキーの設定はBML.Navigationに登録する．
    if (aKey)    BML.Navigation.entryAccessKey(htmlElm, aKey);
    if (onFocus) htmlElm.onFocus = stripEventHandlerString(onFocus);
    if (onBlur)  htmlElm.onBlur  = stripEventHandlerString(onBlur);
    
    return(htmlElm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** Documentノードの正当性をチェックする．<br>
   *  無効な場合は例外を投げる．
   *  @name    checkDocNode
   *  @param   {Node}               node  文書のノード
   *  @returns {Boolean}                  ノードの正当性
   *  @throws  {InvalidXmlEncoding}       文字エンコーディングがEUC-JPではない
   *  @throws  {InvalidXmlVersion}        XMLのバージョンが1.0ではない
   */
  function checkDocNode(node) {
    // Operaの場合正当性がチェックできないためtrueを返す．
    if (BML.Util.isOpera) return(true);
    
    if (String(node.xmlEncoding).toUpperCase() != 'EUC-JP')
      throw('[InvalidXmlEncoding] : '+node.xmlEncoding);
    if (node.xmlVersion != '1.0')
      throw('[InvalidXmlVersion] : ' +node.Version);

    return(true);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** DocumentTypeノードの正当性をチェックする．<br>
   *  無効な場合は例外を投げる．
   *  @name    checkDocTypeNode
   *  @param   {Node}               node  文書のノード
   *  @returns {Boolean}                  ノードの正当性
   *  @throws  {InvalidDocTypeName}       文書型がBMLではない
   *  @throws  {InvalidDocTypeID}         文書型のPublicIDかSystemIDが不正
   */
  function checkDocTypeNode(node) {
    if (String(node.name).toLowerCase() != 'bml')
      throw('[InvalidDocTypeName] : '     +node.name);

    BML.Util.each.call(DTD_DECLARATIONS, function(dtd) {
      if ((node.publicId == dtd[0]) && (node.systemId == dtd[1])) {
        BML.version = dtd[2];
        BML.Util.$break;
      }
    });
    if (!BML.version)
      throw('[InvalidDocTypeID] : publicID : "'+node.publicId +
            '" / systemID : "' + node.systemId +'"');

    return(true);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** ProcessingInstructionノードの正当性をチェックする．<br>
   *  無効な場合は例外を投げる．
   *  @name    checkPINode
   *  @param   {Node}               node  文書のノード
   *  @returns {Boolean}                  ノードの正当性
   *  @throws  {InvalidPITraget}          ターゲット属性がBMLではない
   *  @throws  {InvalidPINodeValue}       BML文書のバージョンが不正
   */
  function checkPINode(node) {
    if (String(node.target).toLowerCase() != 'bml')
      throw('InvalidPITarget] : target:['+node.target+']');

    var versionMatcher = /bml-version=\"([\d\.]+)\"/;
    var match = versionMatcher.exec(node.nodeValue);
    if (!match || (match[1] != BML.version))
      throw('[InvalidPINodeValue] : '+node.nodeValue);

    return(true);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** Commentノードの正当性をチェックする．<br>
   *  実際には何も処理を行わない．
   *  @name    checkCommentNode
   *  @param   {Node}               node  文書のノード
   *  @returns {Boolean}                  ノードの正当性
   */
  function checkCommentNode(node) { return(true); }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // structure module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のBody要素を解析してHTML文書のBody要素を生成し，親ノードの子として追加する．
   *  @name    processBodyElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processBodyElement(bmlElm, parentHtmlNode) {
    var elm = getFirstElementByTagName('body', parentHtmlNode);
    if (!elm) elm = document.appendChild(document.createElement('body'));

    setCoreAttributes (elm, bmlElm);
    setI18nAttributes (elm, bmlElm);
    setStyleAttributes(elm, bmlElm);

    var func;
    func = bmlElm.getAttribute('onload');
    if (func) { // onloadイベントハンドラを保持する
      func = stripEventHandlerString(func);
      eventHandlers['onload'] = reservedNameFuncs[func] || func;
    }
    func = bmlElm.getAttribute('onunload');
    if (func) { // onunloadイベントハンドラを保持する
      func = stripEventHandlerString(func);
      eventHandlers['onunload'] = reservedNameFuncs[func] || func;
      window.addEventListener('unload', BML.Builder.onunload, false);
    }
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のHead要素を解析してHTML文書のHead要素を生成し，親ノードの子として追加する．
   *  @name    processHeadElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processHeadElement(bmlElm, parentHtmlNode) {
    var elm  = getFirstElementByTagName('head', parentHtmlNode) ||
               parentHtmlNode.appendChild(document.createElement('head'));
    setI18nAttributes(elm, bmlElm);
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のTitle要素を解析してHTML文書のTitle要素を生成し，親ノードの子として追加する．
   *  @name    processTitleElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processTitleElement(bmlElm, parentHtmlNode) {
    var elm = getFirstElementByTagName('title', parentHtmlNode) ||
              parentHtmlNode.appendChild(document.createElement('title'));
    setI18nAttributes(elm, bmlElm);
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // text module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のDiv要素を解析してHTML文書のDiv要素を生成し，親ノードの子として追加する．
   *  @name    processDivElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processDivElement(bmlElm, parentHtmlNode) {
    var elm = parentHtmlNode.appendChild(document.createElement('div'));
    setCoreAttributes (elm, bmlElm);
    setI18nAttributes (elm, bmlElm);
    setStyleAttributes(elm, bmlElm);
    setKeyEventsAttributes(elm, bmlElm);
    setFocusCtrlAttributes(elm, bmlElm);
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のBR要素を解析してHTML文書のBR要素を生成し，親ノードの子として追加する．
   *  @name    processBrElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processBrElement(bmlElm, parentHtmlNode) {
    var elm = parentHtmlNode.appendChild(document.createElement('br'));
    setCoreAttributes (elm, bmlElm);
    setStyleAttributes(elm, bmlElm);
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のParagraph要素を解析してHTML文書のParagraph要素を生成し，親ノードの子として追加する．
   *  @name    processPElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processPElement(bmlElm, parentHtmlNode) {
    var elm = parentHtmlNode.appendChild(document.createElement('p'));
    setCoreAttributes (elm, bmlElm);
    setI18nAttributes (elm, bmlElm);
    setStyleAttributes(elm, bmlElm);
    setKeyEventsAttributes(elm, bmlElm);
    setFocusCtrlAttributes(elm, bmlElm);
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のSpan要素を解析してHTML文書のSpan要素を生成し，親ノードの子として追加する．
   *  @name    processSpanElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processSpanElement(bmlElm, parentHtmlNode) {
    var elm = parentHtmlNode.appendChild(document.createElement('span'));
    setCoreAttributes (elm, bmlElm);
    setI18nAttributes (elm, bmlElm);
    setStyleAttributes(elm, bmlElm);
    setKeyEventsAttributes(elm, bmlElm);
    setFocusCtrlAttributes(elm, bmlElm);
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // hypertext module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のAnchor要素を解析してHTML文書のAnchor要素を生成し，親ノードの子として追加する．
   *  @name    processAElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processAElement(bmlElm, parentHtmlNode) {
    // @Todo：a要素は十分な検証が行われていない．NetFrontViewerとの検証が必要
    var elm = parentHtmlNode.appendChild(document.createElement('a'));
    setCoreAttributes (elm, bmlElm);
    setI18nAttributes (elm, bmlElm);
    setStyleAttributes(elm, bmlElm);
    setKeyEventsAttributes(elm, bmlElm);
    setFocusCtrlAttributes(elm, bmlElm);

    elm.setAttribute('charset', 'EUC-JP');
    var href = bmlElm.getAttribute('href');
    if (href) elm.setAttribute('href', href);
    
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // form module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のInput要素を解析してHTML文書のInput要素を生成し，親ノードの子として追加する．
   *  @name    processInputElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processInputElement(bmlElm, parentHtmlNode) {
    // @Todo：input要素は十分な検証が行われていない．NetFrontViewerとの検証が必要
    var elm = parentHtmlNode.appendChild(document.createElement('input'));
    setCoreAttributes (elm, bmlElm);
    setI18nAttributes (elm, bmlElm);
    setStyleAttributes(elm, bmlElm);
    setKeyEventsAttributes(elm, bmlElm);
    setFocusCtrlAttributes(elm, bmlElm);

    var tmp;
//  tmp = bmlElm.getAttribute('defaultValue'); elm.setAttribute('defaultValue', tmp);
    tmp = bmlElm.getAttribute('disabled');     elm.setAttribute('disabled',     tmp);
    tmp = bmlElm.getAttribute('maxLength');    elm.setAttribute('maxLength',    tmp);
    tmp = bmlElm.getAttribute('readOnly');     elm.setAttribute('readOnly',     tmp);
    tmp = bmlElm.getAttribute('type');         elm.setAttribute('type',         tmp);
    tmp = bmlElm.getAttribute('value');        elm.setAttribute('value',        tmp);
    
    return(elm);
  }
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // object module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のObject要素を解析してHTML文書のObject要素を生成し，親ノードの子として追加する．
   *  @name    processObjectElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processObjectElement(bmlElm, parentHtmlNode) {
    var elm = parentHtmlNode.appendChild(document.createElement('object'));
    setCoreAttributes (elm, bmlElm);
    setI18nAttributes (elm, bmlElm);
    setStyleAttributes(elm, bmlElm);
    setKeyEventsAttributes(elm, bmlElm);
    setFocusCtrlAttributes(elm, bmlElm);

    // @Todo：Object要素の属性について精査と扱い方について検討が必要
    var tmp;
    tmp = MIME_TYPE_MAP[bmlElm.getAttribute('type')]; if (tmp) elm.setAttribute('type', tmp);
    tmp = bmlElm.getAttribute('data');                if (tmp) elm.dataInterface = tmp;
    // streamposition
    // streamlooping : 1
    // streamstatus
    // remain

    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // metainformation module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のMeta要素を解析してHTML文書のMeta要素を生成し，親ノードの子として追加する．<br>
   *  ただし，Meta要素は何も処理を行わない．
   *  @name    processMetaElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processMetaElement(bmlElm, parentHtmlNode) {
    return(parentHtmlNode);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // scripting module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のScript要素を解析してHTML文書のScript要素を生成し，親ノードの子として追加する．<br>
   *  @name    processScriptElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processScriptElement(bmlElm, parentHtmlNode) {
    if (isFirstScript) {
      // Script要素が初めて出現した場合は，その前に指定のScriptファイルを読み込む．
      BML.Util.each.call(BML.config.prefixScriptIncPath, function(v) {
        getExternalScript(v, BML.loaderUri);
      });
      isFirstScript = false;
    }

    var elm = null;
    var src = bmlElm.getAttribute('src');
    if (src) {
      getExternalScript(src, BML.uri);
    } else {
      if (isFirstInnerScript) {
        // 要素を持つScript要素が出現した場合，その前に指定のScriptファイルを読み込む．
        BML.Util.each.call(BML.config.suffixScriptIncPath, function(v) {
          getExternalScript(v, BML.loaderUri);
        });
        isFirstInnerScript = false;
      }
      // 子要素(Script本体)が存在する可能性があるため，エラーを回避するためにScript要素を子ノードとして追加する．
      // Script要素内の(TextNodeかCDATASectionNodeの)Script本体は別途scriptBufferに追加されるため，
      // 本Script要素自体はあまり意味が無い．
      elm = setScriptAttributes(document.createElement('script'));
      parentHtmlNode.appendChild(elm);
    }

    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // style module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のStyle要素を解析してHTML文書のStyle要素を生成し，親ノードの子として追加する．<br>
   *  @name    processStyleElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processStyleElement(bmlElm, parentHtmlNode) {
    var elm = parentHtmlNode.appendChild(document.createElement('style'));
    setI18nAttributes(elm, bmlElm);
    setDefaultAttributes(elm, {
      type  : 'text/css',
      media : 'all' // 'tv'
    });
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // link module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のLink要素を解析してHTML文書のStyle要素を生成し，親ノードの子として追加する．<br>
   *  Link要素が参照する外部Styleファイルを取得し，内容をARIB CSSからW3C CSSに変換して子要素として追加したstyle要素を生成する．
   *  @name    processLinkElement
   *  @param   {Element}      bmlElm          参照するBML文書の要素
   *  @param   {Node}         parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                  生成したHTML要素
   *  @throws  {FileNotFound}                 Link要素が参照する外部ファイルが存在しない
   */
  function processLinkElement(bmlElm, parentHtmlNode) {
    var elm  = document.createElement('style');
    setI18nAttributes(elm, bmlElm);
    setDefaultAttributes(elm, {
      type  : 'text/css',
      media : 'all' // 'tv'
    });
    
    var href = BML.Util.combinePath(bmlElm.getAttribute('href'), BML.uri);
    var ajax = new BML.Ajax(href, {
      overrideMimeType : 'text/css; charset=EUC-JP',
      asynchronous     : false,
      method           : 'GET'
    });
    // @Todo：ステータスコードの扱いがゾンザイ -> ajax.isSuccess()
    if (ajax.response.statusCode != 200) throw('[FileNotFound] :'+href);

    elm.appendChild(document.createTextNode('/*'+href+'*'+"/\n"+
                                            processARIBCSSProperty(ajax.response.responseText)));
    parentHtmlNode.appendChild(elm);
    elm = parentHtmlNode;
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // bml module
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のBml要素を解析してHTML文書のHtml要素を生成し，親ノードの子として追加する．<br>
   *  @name    processBmlElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 生成したHTML要素
   */
  function processBmlElement(bmlElm, parentHtmlNode) {
    var elm = getFirstElementByTagName('html', parentHtmlNode) ||
              parentHtmlNode.appendChild(document.createElement('html'));
    setI18nAttributes(elm, bmlElm);
    setDefaultAttributes(elm, {
      xmlns : 'http://www.w3.org/1999/xhtml',
      lang  : 'ja'
    });
    return(elm);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のBevent要素を解析する．<br>
   *  Bevent要素については何も処理を行わず，親ノードをそのまま返す．
   *  @name    processBeventElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 HTML要素(親ノード)
   */
  function processBeventElement(bmlElm, parentHtmlNode) { return(parentHtmlNode); }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のBeitem要素を解析してBML.Beventに登録する．<br>
   *  要素については何も処理を行わず，親ノードを返す．
   *  @name    processBeitemElement
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {HTMLElement}                 HTML要素(親ノード)
   */
  function processBeitemElement(bmlElm, parentHtmlNode) {
    var prop = {};
    BML.Util.each.call([
      'id',      'time_mode',  'message_id',       'language_tag',
      'type',    'time_value', 'message_group_id', 'module_ref',
      'onoccur', 'object_id',  'message_version',  'subscribe',    'es_ref'
    ], function(v) {
      prop[v] = bmlElm.getAttribute(v);
    });
    BML.Bevent.entry(prop);
    return(parentHtmlNode);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のTextノードを解析してHTML文書のTextノードを生成し，親ノードの子として追加する．<br>
   *  @name    processTextNode
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {Node}                        生成したHTML要素
   */
  function processTextNode(bmlNode, parentHtmlNode) {
    var node = document.createTextNode(bmlNode.nodeValue);
    parentHtmlNode.appendChild(node);
    return(node);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のCDATASectionノードを解析してHTML文書のCDATASectionノードを生成し，親ノードの子として追加する．<br>
   *  @name    processCDATASection
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {Node}                        生成したHTML要素
   */
  function processCDATASection(bmlNode, parentHtmlNode) {
    var node = (BML.Util.supportSpecificHTMLElement) ? 
      document.createCDATASection(bmlNode.nodeValue) :
      document.createTextNode    (bmlNode.nodeValue);
    parentHtmlNode.appendChild(node);
    return(node);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のStyle要素の子要素であるCDATASectionノードを解析してHTML文書のCDATASectionノードを生成し，親ノードの子として追加する．<br>
   *  @name    processStyleCDATASection
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {Node}                        生成したHTML要素
   */
  function processStyleCDATASection(bmlNode, parentHtmlNode) {
    var style = bmlNode.nodeValue;
    var node = (BML.Util.supportSpecificHTMLElement) ? 
      document.createCDATASection(processARIBCSSProperty(style)) :
      document.createTextNode    (processARIBCSSProperty(style));
    parentHtmlNode.appendChild(node);
    return(node);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のScript要素の子要素であるCDATASectionノードを解析する．<br>
   *  CDATASectionノードのノード値(Script本体)はscriptBufferに保持し，要素については何も処理を行わず，親ノードを返す．
   *  @name    processScriptCDATASection
   *  @param   {Element}     bmlElm          参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode  bmlElmの親ノードに対応するHTML文書側のノード
   *  @returns {Node}                        HTML要素(親ノード)
   */
  function processScriptCDATASection(bmlNode, parentHtmlNode) {
    scriptBuffer[scriptBuffer.length] = toValidJavaScript(bmlNode.nodeValue);
    return(parentHtmlNode);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 要素自身のフォントサイズと，自身が属するブロック要素の幅を取得する．<br>
   *  幅はp要素である自身か祖先の幅から算出する．
   *  @name    getInlineStyleProperties
   *  @param   {Element}     elm   HTML要素
   *  @param   {String}      name  HTML要素のノード名(タグ名)
   *  @returns {Array}             取得した特性値<br>
   *                               [0] フォントサイズ(Number)<br>
   *                               [1] 幅(Number)
   */

  function getInlineStyleProperties(elm, name) {
    if (!elm) return([0, 0]);

    var getStyle = BML.Util.getStyle;
    var fontSize = getStyle(elm, 'fontSize') || '';
    var width    = 0;
    while(1) {
      if (name == 'p') {
        width = getStyle(elm, 'width') || 0;
        break;
      }
      elm = elm.parentNode;
      if (elm === null) break;
      name = elm.nodeName.toLowerCase();
    }

    var isUndefined = BML.Util.isUndefined;
    return([!fontSize ? 24  : parseInt(fontSize, 10),
            !width    ? 960 : parseInt(width,    10)]);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 親ブロック要素に対する要素のX軸方向の位置を取得する．<br>
   *  位置は，自身あるいは祖先の左隣(previousSibling)から取得する．<br>
   *  自身あるいは祖先の左隣がなく，かつ，親がp要素の場合は0となる．
   *  @name    getInlineCurrentXPosition
   *  @param   {Node}   node       位置を取得したいHTML要素
   *  @param   {Node}   parent     HTML要素の親ノード
   *  @param   {String} parentName 親ノードのノード名(タグ名)
   *  @returns {Number}            X軸方向における位置
   */
  function getInlineCurrentXPosition(node, parent, parentName) {
    var sibling = (!node || !node.parentNode) ? parent.lastChild : node.previousSibling;
    if (!sibling) {
      if (parentName == 'p') return(0);

      while(1) {
        sibling = parent.previousSibling;
        if (sibling) break;
        parent = parent.parentNode;
        if (!parent || (parent.nodeName.toLowerCase() == 'p')) break;
      }
    }
    if (!sibling) return(0);

    var xpos = sibling._curXPos;
    return(isNaN(xpos) ? 0 : xpos);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 文字列内の制御符号(空白/改行/タブ)を前後の要素に従い処理する．<br>
   *  開始タグ直後/終了タグ直前の制御符号列を無視するなどのルールに則る．<br>
   *  ルールについては，ARIB STD-B24 第二部 付属2「5.3.2 制御符号（空白、改行、タブ）の扱い」参照．
   *  @name    handleInlineCtrlString
   *  @param   {String} str    対象文字列
   *  @param   {Node}   node   対象文字列を有するNode(TextNode/CDATASectionNode)
   *  @returns {Number}        制御符号を処理した文字列
   */
  function handleInlineCtrlString(str, node) {
    var prevName  = ((node.previousSibling || {}).nodeName || '').toLowerCase();
    var nextName  = ((node.nextSibling     || {}).nodeName || '').toLowerCase();

    // 開始タグ直後/終了タグ直前の制御符号の処理
    var prev = (/^[\s\r\n]/.test(str) &&
                ((prevName == 'span') || (prevName == 'a'))) ? ' ' : '';
    var next = (/[\s\r\n]$/.test(str) &&
                ((nextName == 'span') || (nextName == 'a') || (nextName == 'br'))) ? ' ' : '';

    // 不要な制御符号の置換/削除
    str = str.replace(/^\s+/,     '');
    str = str.replace(/\s+$/,     '');
    str = str.replace(/[\r\n]/mg, ' ');

    // 文字間の制御符号処理(2バイト文字間の制御符号は無視．それ以外は空白1文字)
    var buf = '';
    while(1) {
      if (!(/([^\s])\s+([^\s])/.test(str))) break;
      var l = RegExp.$1;
      var r = RegExp.$2;
      str  = RegExp.rightContext;
      buf += RegExp.leftContext + l +
        (((l._charCodeAt_(l.length-1) <= 0xff) || (r._charCodeAt_(0) <= 0xff)) ? ' ' : '') + r;
    }
    return(prev + buf + str + next);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** ブロック要素の幅に合わせた文字列の能動的改行を行い改行結果を取得する．<br>
   *  改行文字あるいは幅を超える場合に改行を行う．幅は親ノードから取得する．
   *  @name    iterateWordBreak
   *  @param   {String} str        対象文字列
   *  @param   {Node}   node       対象文字列を有するノード(TextNode/CDATASectionNode)
   *  @param   {Node}   parent     ノードの親ノード
   *  @param   {String} parentName 親ノードのノード名(タグ名)
   *  @returns {Array}             改行結果<br>
   *                               [0] 改行を行った文字列(String)
   *                               [1] ブロック要素内における文字列終端のX軸方向の位置(Number)
   */
  function iterateWordBreak(str, node, parent, parentName) {
    var tmp      = getInlineStyleProperties(parent, parentName);
    var fontSize = tmp[0];
    var width    = tmp[1];
    var pos      = getInlineCurrentXPosition(node, parent, parentName);

    // 幅に合わせた文字列の能動的改行．文字は等幅フォントである前提．
    // @Todo：character spacingは未実装(親styleから取得できればできそう)
    // @Todo：1文字ずつ文字をappendしていくのは効率が悪いので最適化要．
    var buf = '', halfSize = Math.floor(fontSize / 2);
    for(var i = 0, l = str.length; i < l; i++) {
      var c = str.charAt(i);
      
      if (c == "\n") {
        buf += c;
        pos  = 0;
      } else {
        var cl = (str._charCodeAt_(i) <= 0xff) ? halfSize : fontSize;
        pos   += cl;
        if (pos > width) {
          buf += "\n" + c;
          pos  = cl;
        } else {
          buf += c;
        }
      }
    }
    
    return([buf, pos]);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 要素内の文字列を処理し，要素に設定する．<br>
   *  要素がTextNodeかCDATASectionNodeかによって処理を変える．
   *  @name    processInlineString
   *  @param   {String}  str        対象文字列
   *  @param   {Node}    node       対象文字列を設定するノード
   *  @param   {Node}    refNode    nodeに対応する参照ノード
   *  @param   {Node}    parent     参照ノードの親ノード
   *  @param   {String}  parentName 親ノードのノード名(タグ名)
   *  @param   {Boolean} isCDATA    参照ノードがCDATASectionNodeかTextNodeかを示すフラグ(CDATASectionNode=真)
   */
  /**#@-*/
  function processInlineString(str, node, ref, parent, parentName, isCDATA) {
    var broken = str || '';
    broken = isCDATA ? broken.replace(/\r\n?/g, "\n") : handleInlineCtrlString(broken, ref);
    
    var tmp = iterateWordBreak(broken, node, parent, parentName);
    var pos = tmp[1];
    broken  = tmp[0];

    // 親要素における最後の子要素で合った場合は親に位置を伝播する
    if (!ref.nextSibling) {
      var p = parent;
      while(1) {
        p._curXPos = pos;
        if (p.nextSibling) break;
        p = p.parentNode;
        if (!p || p.nodeName.toLowerCase() == 'p') break;
      }
    }

    /** 親ブロック要素内における要素終端のX軸方向の位置． @public @propertyEx HTMLElement.prototype._curXPos |Number|undefined */
    node._curXPos  = pos;
    /** 要素に設定された本来のnodeValueのキャッシュ．     @public @propertyEx HTMLElement.prototype._orgValue|String|undefined  */
    node._orgValue = str;

    node.nodeValue = broken;
  }
  /**#@+ @methodOf BML.Builder @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のブロック要素内のTextNodeノードを解析してHTML文書のTextNodeノードを生成し，親ノードの子として追加する．<br>
   *  @name    processTextNodeInBlockElement
   *  @param   {Element}     bmlElm         参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode bmlElmの親ノードに対応するHTML文書側のノード
   *  @param   {String}      parentName     親ノードのノード名(タグ名)
   *  @returns {Node}                       生成したHTML要素
   */
  /**#@-*/
  function processTextNodeInBlockElement(bmlElm, parentHtmlNode, parentName) {
    var elm = document.createTextNode('');
    elm._cdata_section = false;
    parentHtmlNode.appendChild(elm);
    processInlineString(bmlElm.nodeValue, elm, bmlElm, parentHtmlNode, parentName, false);
    return(elm);
  }
  /**#@+ @methodOf BML.Builder @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のブロック要素内のCDATASectionNodeノードを解析してHTML文書のCDATASectionNodeノードを生成し，親ノードの子として追加する．<br>
   *  @name    processCDATASectionInBlockElement
   *  @param   {Element}     bmlElm         参照するBML文書の要素
   *  @param   {Node}        parentHtmlNode bmlElmの親ノードに対応するHTML文書側のノード
   *  @param   {String}      parentName     親ノードのノード名(タグ名)
   *  @returns {Node}                       生成したHTML要素
   */
  /**#@-*/
  function processCDATASectionInBlockElement(bmlElm, parentHtmlNode, parentName) {
    var elm = (BML.Util.supportSpecificHTMLElement) ? 
      document.createCDATASection('') : document.createTextNode('');
    /** 要素がCDATASectionNodeであることを示すフラグ． @public @propertyEx HTMLElement.prototype._cdata_section |Boolean|undefined */
    elm._cdata_section = true;
    parentHtmlNode.appendChild(elm);
    processInlineString(bmlElm.nodeValue, elm, bmlElm, parentHtmlNode, parentName, true);
    return(elm);
  }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @memberOf BML.Builder @inner @static @constant @description (無名関数内の定数であり外部参照不可)<br> */
  /** CharacterDataを継承するDOMInterface群と親ノードに対応するDOMInterface群を保持する配列．<br>
   *  @name CharacterDataDOMInterface @type Array<String|Array> */
  var CharacterDataDOMInterface =
    BML.Util.isSafari ?
      [ [Text],                [ HTMLElement ]                                             ] :
   !BML.Util.supportSpecificHTMLElement ? 
      [ [Text, CDATASection ], [ HTMLElement ]                                             ] :
      [ [Text, CDATASection ], [ HTMLSpanElement, HTMLParagraphElement, HTMLAnchorElement] ];
  /**#@-*/

  /** CharacterDataを継承する要素に対して文字を設定するためのdata属性のwrapperプロパティ．<br>
   *  @name CharacterData.prototype.dataInterface @memberOf CharacterData.prototype @type Function */
  /**#@+ @methodOf BML.Builder @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** CharacterDataを継承するDOMInterface群に対して文字設定用のインタフェースを定義する無名関数．
   *  @name  BML.Builder.$anonymous1 @methodOf BML.Builder @inner
   *  @param {DOMInterface} dom 文字設定要インタフェースを設定可能なDOMインタフェース */
  BML.Util.each.call(CharacterDataDOMInterface[0], function(elm) {
    try {
      //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      /** CharacterDataを継承する要素に設定された文字を取得するgetter用無名関数．
       *  @name    BML.Builder.$anonymous2 @methodOf BML.Builder @inner
       *  @returns {String} 要素に設定された文字列 */
      elm.prototype.__defineGetter__('dataInterface', function() { return(this._orgValue); });
      //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      /** CharacterDataを継承する要素に対して文字を設定するsetter用無名関数．
       *  @name  BML.Builder.$anonymous3 @methodOf BML.Builder @inner
       *  @param {String} str 設定対象文字列 */
      /**#@-*/
      elm.prototype.__defineSetter__('dataInterface', function(str) {
        if (str == this._orgValue) return;
        
        var parent     = this.parentNode;
        var parentName = parent.nodeName.toLowerCase();
        processInlineString(str, this, this, parent, parentName, this._cdata_section);
        
        // 自身(pivot)以降の隣接Nodeに対して親を遡りながら再Layoutを実施
        var pivot = this;
        while(1) {
          var nextSibling = pivot.nextSibling;
          while(1) {
            if (!nextSibling) break;
            nextSibling.layout(parent, parentName);
            nextSibling = nextSibling.nextSibling;
          }
          if (parentName == 'p') break;
          
          pivot  = parent;
          parent = pivot.parentNode;
          if (!parent) break;
          parentName = parent.nodeName.toLowerCase();
        }
      });
      /** 自身の文字の再配置(改行位置の再計算)を行う．
       *  @name CharacterData.prototype.layout @methodOf CharacterData.prototype
       *  @param {Node}   parent     自身の親ノード
       *  @param {String} parentName 親ノードのノード名(タグ名) */
      elm.prototype.layout = function(parent, parentName) {
        processInlineString(this._orgValue || '', this, this,
                            parent, parentName, this._cdata_section || false);
      };
    } catch(e) {
      BML.Debug.error(e);
    }
  });
  /**#@+ @methodOf BML.Builder @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** CharacterDataを継承する要素の親要素のDOMInterface群に対して文字再配置用関数を定義する無名関数．
   *  @name  BML.Builder.$anonymous4 @methodOf BML.Builder @inner
   *  @param {DOMInterface} dom 文字再配置関数を設定可能なDOMインタフェース */
  /**#@-*/
  BML.Util.each.call(CharacterDataDOMInterface[1], function(elm) {
    try {
      /** 子要素に対して文字の再配置(改行位置の再計算)を依頼する．
       *  @name HTMLElement.prototype.layout @methodOf HTMLElement.prototype
       *  @param {Node}   parent     自身の親ノード
       *  @param {String} parentName 親ノードのノード名(タグ名) */
      elm.prototype.layout = function(parent, parentName) {
        var name       = this.nodeName.toLowerCase();
        var childNodes = this.childNodes;
        for(var i = 0, l = childNodes.length; i < l; i++) {
          childNodes[i].layout(this, name);
        }
      };
    } catch(e) {
      BML.Debug.error(e);
    }
  });

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** Object要素に対してデータソースを設定するためのdata属性のwrapperプロパティ．<br>
   *  @name HTMLObjectElement.prototype.dataInterface @memberOf HTMLObjectElement.prototype @type Function */
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** Object要素に設定されたデータソースを取得するgetter用無名関数．
   *  @name    BML.Builder.$anonymous5 @methodOf BML.Builder @inner
   *  @returns {String} 要素に設定されたデータソース */
  HTMLObjectElement.prototype.__defineGetter__('dataInterface', function()    {
    return(this._orgData);
  });
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** Object要素に設定されたデータソースを設定するsetter用無名関数．
   *  @name  BML.Builder.$anonymous6 @methodOf BML.Builder @inner
   *  @param {String} 要素に設定するデータソース */
  HTMLObjectElement.prototype.__defineSetter__('dataInterface', function(str) {
    this._orgData = str;
    if (!this.getAttribute('type')) return;
    this.data = BML.Util.combinePath(str, BML.uri);
  });

  if (!BML.Util.isSafari) {
    HTMLBRElement.prototype.layout = function() {};
//  } else if (!BML.Util.supportSpecificHTMLElement) {
//  } else {
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /**#@+ @methodOf BML.Builder @inner @static @description (無名関数内でのユーティリティ関数であり，スコープ外からは見えない．)<br> */
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** BML文書のノードを自身と子ノードに対して再帰的に解析して対応するHTML文書のノードを生成し，親ノードの子として追加する．<br>
   *  @name   buildNode
   *  @param  {Node}   bmlNode             参照するBML文書のノード
   *  @param  {Node}   parentHtmlNode      bmlElmの親ノードに対応するHTML文書側のノード
   *  @param  {String} parentName          親ノードのノード名(タグ名)
   *  @throws {UnexpectedElementNodeFound} 予期しない要素が出現
   *  @throws {UnexpectedNodeFound}        予期しないノードが出現
   */
  function buildNode(bmlNode, parentHtmlNode, parentName) {
    if (!bmlNode) return;

    var nType = bmlNode.nodeType, func;
    switch(nType) {
      case(NODETYPE.DOCUMENT_NODE)         : checkDocNode    (bmlNode); break;
      case(NODETYPE.DOCUMENT_TYPE_NODE)    : checkDocTypeNode(bmlNode); break;
      case(NODETYPE.PROC_INSTRUCTION_NODE) : checkPINode     (bmlNode); break;
      case(NODETYPE.COMMENT_NODE)          : checkCommentNode(bmlNode); break;
      case(NODETYPE.ELEMENT_NODE)          : {
        var nName = bmlNode.nodeName.toLowerCase();
        switch(nName) {
          case('body'  ) : parentHtmlNode = processBodyElement  (bmlNode, parentHtmlNode); break;
          case('head'  ) : parentHtmlNode = processHeadElement  (bmlNode, parentHtmlNode); break;
          case('title' ) : parentHtmlNode = processTitleElement (bmlNode, parentHtmlNode); break;
          case('div'   ) : parentHtmlNode = processDivElement   (bmlNode, parentHtmlNode); break;
          case('br'    ) : parentHtmlNode = processBrElement    (bmlNode, parentHtmlNode); break;
          case('p'     ) : parentHtmlNode = processPElement     (bmlNode, parentHtmlNode); break;
          case('span'  ) : parentHtmlNode = processSpanElement  (bmlNode, parentHtmlNode); break;
          case('a'     ) : parentHtmlNode = processAElement     (bmlNode, parentHtmlNode); break;
          case('input' ) : parentHtmlNode = processInputElement (bmlNode, parentHtmlNode); break;
          case('object') : parentHtmlNode = processObjectElement(bmlNode, parentHtmlNode); break;
          case('meta'  ) : parentHtmlNode = processMetaElement  (bmlNode, parentHtmlNode); break;
          case('script') : parentHtmlNode = processScriptElement(bmlNode, parentHtmlNode); break;
          case('style' ) : parentHtmlNode = processStyleElement (bmlNode, parentHtmlNode); break;
          case('link'  ) : parentHtmlNode = processLinkElement  (bmlNode, parentHtmlNode); break;
          case('bml'   ) : parentHtmlNode = processBmlElement   (bmlNode, parentHtmlNode); break;
          case('bevent') : parentHtmlNode = processBeventElement(bmlNode, parentHtmlNode); break;
          case('beitem') : parentHtmlNode = processBeitemElement(bmlNode, parentHtmlNode); break;
          default        : throw((/^\[/.test(e) ?
            e : '[UnexpectedElementNodeFound] : "'+nName+'"(parent:"'+parentHtmlNode.nodeName+'"'));
        }
      } break;
      case(NODETYPE.TEXT_NODE)             : {
        switch(parentName) {
          case('title') : parentHtmlNode = processTextNode              (bmlNode, parentHtmlNode, parentName); break;
          case('p'    ) : parentHtmlNode = processTextNodeInBlockElement(bmlNode, parentHtmlNode, parentName); break;
          case('span' ) : parentHtmlNode = processTextNodeInBlockElement(bmlNode, parentHtmlNode, parentName); break;
          case('a'    ) : parentHtmlNode = processTextNodeInBlockElement(bmlNode, parentHtmlNode, parentName); break;
//          case('style') : parentHtmlNode = BML.Util.K(bmlNode, parentHtmlNode, parentName); break; // @Todo：style要素の子要素は必ずCDATASectionか?
//          case('html' ) : parentHtmlNode = BML.Util.K(bmlNode, parentHtmlNode, parentName); break; // @Todo：script要素の子要素は必ずCDATASectionか?
          default       : break;
        }
      } break;
      case(NODETYPE.CDATA_SECTION_NODE)    : {
        switch(parentName) {
          case('title' ) : parentHtmlNode = processCDATASection              (bmlNode, parentHtmlNode, parentName); break;
          case('p'     ) : parentHtmlNode = processCDATASectionInBlockElement(bmlNode, parentHtmlNode, parentName); break;
          case('span'  ) : parentHtmlNode = processCDATASectionInBlockElement(bmlNode, parentHtmlNode, parentName); break;
          case('a'     ) : parentHtmlNode = processCDATASectionInBlockElement(bmlNode, parentHtmlNode, parentName); break;
          case('script') : parentHtmlNode = processScriptCDATASection        (bmlNode, parentHtmlNode, parentName); break;
          case('style' ) : parentHtmlNode = processStyleCDATASection         (bmlNode, parentHtmlNode, parentName); break;
          default        : break;
        }
      } break;
      default : throw('[UnexpectedNodeFound] : "'+bmlNode.nodeName+'"(parent:"'+parentHtmlNode.nodeName+'")');
    }
  
    var children = bmlNode.childNodes;
    for(var i = 0, l = children.length; i < l; i++) {
      buildNode(children[i], parentHtmlNode, parentHtmlNode.nodeName.toLowerCase());
    }
  }
  /**#@-*/
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  return({
    /**#@+ @memberOf BML.Builder @static @public */
    /** BML文書の構築完了フラグ @propertyEx BML.Builder.complete|Boolean|false */
    complete : false,
    /**#@-*/
    /**#@+ @methodOf BML.Builder @static */
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    /** BML文書を取得・解析し，HTML文書として構築する．<br>
     *  BML文書の取得後，BML.Ajaxのコールバック関数(onSuccess)内で構築を行う．
     *  @name  build
     *  @param {String} uri BML文書のURI
     */
    build : function(uri) {
      var ajax = new BML.Ajax(uri, {
        overrideMimeType : 'text/xml; charset=EUC-JP',
        asynchronous     : true,
        method           : 'GET',
        onSuccess        : function(response) {
          var buildSTime = (new Date).getTime();
          BML.Debug.info('[xhtml build start]');
          try {
            if (!response.responseXML) throw('[InvalidXMLResponse]:responseXML is null');
            
            buildNode(response.responseXML, document, document.nodeName.toLowerCase());

            if (BML.Util.isSafari) { // body要素を再appendする(描画がうまくされないため)
              var body = getFirstElementByTagName('body', document);
              body.parentNode.appendChild(body.parentNode.removeChild(body));
            }
            
            BML.Debug.info('[xhtml build done :' +
                           ((new Date).getTime() - buildSTime)+'[ms]]');

            // 外部ファイル(ECMAScriptファイル)取得よりもBML文書の構築が先に終わって
            // いた場合は，getExternalScript内の無名関数内でBML.Builder.finish()が実行される．
            if (scriptBuffer.count <= 0) {
              BML.Builder.finish();
            }
            BML.Builder.complete = true;
          } catch(e) {
            BML.Debug.error(e);
          }
        },
        onFailure        : function(response) {
          BML.Debug.error('[BML.Builder.build : load failed('+uri+'): '+
                          response.statusCode + ':'+response.statusText+']');
        }
      });
    },
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    /** BML文書の構築完了処理を行う．<br>
     *  @name  finish
     */
    finish : function() {
      var elm;
      if (scriptBuffer.length > 0) {
        // bmlに記述/参照されるscript要素を最後にまとめてappend
        elm = setScriptAttributes(document.createElement('script'));
        elm.appendChild(document.createTextNode(scriptBuffer.join('')));
        var head = getFirstElementByTagName('head', document);
        head.appendChild(elm);
      }
      
      // ナビゲーションの初期化
      BML.Navigation.initialize();
      
      // bodyの最後にScript要素をappendしてonloadを実行する
      elm = setScriptAttributes(document.createElement('script'));
      elm.appendChild(document.createTextNode("BML.Builder.onload();"));
      getFirstElementByTagName('body', document).appendChild(elm);
    },
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    /** BML文書に記述されたonloadイベントハンドラを実行する．<br>
     *  @name  onload
     */
    onload : function() {
      document.currentEvent = {
        type   : 'load',
        target : document.getElementsByTagName('body')[0]
      };
      
      // bodyのonload要素があれば実行する
      if (window[eventHandlers['onload']]) {
        try      { window[eventHandlers['onload']](); }
        catch(e) { BML.Debug.error(e); }
      }
      BML.Debug.info('[BML onload done: '+
                     ((new Date).getTime() - BML.Debug.getLoadStartTime())+'[ms]]');
    },
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    /** BML文書に記述されたonunloadイベントハンドラを実行する．<br>
     *  @name  onunload
     */
    onunload : function() {
      document.currentEvent = {
        type   : 'unload',
        target : document.getElementsByTagName('body')[0]
      };

      // bodyのonunload要素があれば実行する
      if (window[eventHandlers['onunload']]) {
        try      { window[eventHandlers['onunload']](); }
        catch(e) { BML.Debug.error(e); }
      }
    }
    /**#@-*/
  });
})();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 起動処理(IE未対応のためIEの場合は何も行わない)
/*@cc_on @if(1) (@_jscript)
  document.write('IEは未対応です');
@else @*/
/** XHTML文書ロード後のBML文書解析開始処理を行う無名関数．<br>
 *  windowのloadイベントリスナとして登録される．<br>
 *  HTML文書取得時のURIを解析してBML文書のURIを取得し，BML.Builder.buildをcallする．
 *  @name $anonymous @function
 */
window.addEventListener('load', function() {
  BML.Debug.initialize();

  var uri;
  uri = BML.Util.parseURI(location.href);
  BML.loaderUri = uri;
  BML.Debug.info('[html url]:'+uri.host + uri.path + uri.file);

  uri = BML.Util.parseURI(uri.query);
  BML.uri = uri;
  BML.Debug.info('[bml url]:'+uri.full);

  BML.Navigation.grabInput();
  BML.Builder.build(uri.full);
}, false);
/*@end @*/
