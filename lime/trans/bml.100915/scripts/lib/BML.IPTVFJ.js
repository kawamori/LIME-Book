if (typeof(BML) == 'undefined') throw('BML.js not loaded yet');
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** browser疑似オブジェクト @name browser @namespace */
var browser = (typeof(browser) != 'undefined') ? browser : {};
BML.Util.extend(browser, (function() {
  /**#@+ @methodOf browser */
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // IPTVFJ STD-0006(Browser疑似オブジェクト)
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>IP放送サービスに遷移する．** 本実装では例外を投げて動作を終了する．
   *  @name  epgTune
   *  @param {String} serviceRef IP放送サービスチャンネルを示す文字列
   */
  function epgTune(serviceRef) {
    if (typeof(epgTune.caller) != 'function') {
      // called in the global code : don't call onunload event
      BML.Builder.eventHandler['onunload'] = '';
    }
    throw('[!]epgTune called('+serviceRef+'): skip all javascript process');
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>永続記憶装置内のファイル内容を配列として取得する．** 本実装ではデフォルト値を返す．
   *  @name    readPersistentArray
   *  @param   {String} filename  ファイル名
   *  @param   {String} structure 配列の要素毎の型指定
   *  @returns {Array}            値を格納した配列．失敗した場合はnull．
   */
  function readPersistentArray(filename, structure) { return([20, false]); } //[年齢, 制限状態] 
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** TCP/IPプロトコルを用いてテキストデータを送受信する．
   *  @name    transmitTextDataOverIP
   *  @param   {String} uri       データ送信を行うサービス側のURI
   *  @param   {String} text      送信するテキストデータ
   *  @param   {String} charset   データの送受信を行う文字コード
   *  @returns {Array}            送受信結果
   */
  function transmitTextDataOverIP(url, text, charset) {
    charset = charset || 'EUC-JP';
    var ajax = new BML.Ajax(url,
                            ((text === null) || BML.Util.isUndefined(text)) ?
                            {
                              overrideMimeType : 'text/plane; charset=' + charset,
                              asynchronous     : false,
                              method           : 'GET'
                            } : 
                            {
                              overrideMimeType : 'text/plane; charset=' + charset,
                              asynchronous     : false,
                              method           : 'POST',
                              parameters       : { Denbun : text }
                            });
    var httpStatusCode = ajax.response.statusCode;
    if ((httpStatusCode < 200) || (httpStatusCode >= 300)) {
      if      (httpStatusCode ==  400) return([-1,  httpStatusCode, '']);
      else if (httpStatusCode ==  408) return([-3,  httpStatusCode, '']);
      else if (httpStatusCode !==   0) return([NaN, httpStatusCode, '']);
    }

    return([1, 200, ajax.response.responseText]);
  }
//function setCacheResourceOverIP() {}
//reloadActiveDocument() {}
//getBrowserVersion() {}
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 現在、提示しているBML 文書のURI を返す．
   *  @name    getActiveDocument
   *  @returns {String}            URI(失敗時:null)
   */
  function getActiveDocument() {
    var uri = BML.uri;
    return((uri.path || '/') + uri.file +
           ((uri.query    !== '') ? '?'+ uri.query    : '') +
           ((uri.fragment !== '') ? '#'+ uri.fragment : ''));
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>表示の更新を禁止する．** 本実装では何も行わない．
   *  @name    lockScreen */
  function lockScreen()   {}
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>表示の更新禁止を解除する．** 本実装では何も行わない．
   *  @name    unlockScreen */
  function unlockScreen() {}
//function getBrowserSupport() {}
  function launchDocument(url, style) {
    if (url === '') return(NaN);

    var loader = BML.loaderUri;
    url = loader.host+loader.path+loader.file+'?'+BML.Util.combinePath(url, BML.uri);

    location.href=url;
    return(1);
  }
//function quitDocument() {}
//function getResidentAppVersion() {}
//function startResidentApp() {}
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>受信機内蔵の効果音を再生する．** 本実装では何も行わない．
   *  @name    playRomSound
   *  @param   {String} soundID 名前空間による受信機内蔵音声の識別子
   */
  function playRomSound(soundID) {}
//function sleep() {}
  function setInterval(func, ms, repeat) {
    // @Todo：同期イベント待ちを実装する?
    ms = Math.max(100, Math.floor((ms + 99) / 100) * 100); // 設定値は100ms単位
    if (repeat === 0) repeat = -1;
    var timer = window.setInterval(function() {
      eval(func);
      if ((repeat > 0) && (--repeat === 0)) window.clearInterval(timer);
    }, ms);
    return(timer);
  }
  function clearTimer(id) { if (!isNaN(id)) window.clearInterval(id); }
//function pauseTimer() {}
//function resumeTimer() {}
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 乱数を発生する．
   *  @name    random
   *  @param   {Number} num 乱数の範囲指定
   *  @returns {Number}     1からnumまでの間の整数での乱数値
   */
  function random(num) { return(1 + Math.floor(Math.random() * num)); }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 指定したDateオブジェクトに指定した単位の時間を足した結果を求める．
   *  @name    addDate
   *  @param   {Date}   base 基準となるDateオブジェクト
   *  @param   {Number} time 加算する時間
   *  @param   {Number} unit timeの単位(0:ms/1:sec/2:min/3:hour/4:day/5:week)
   *  @returns {Date}        加算した結果のDateオブジェクト(失敗した場合はbase)
   */
  function addDate(base, time, unit) {
    var t = base.getTime();
    if      (unit === 0) t += time;
    else if (unit ==  1) t += time * 1000;
    else if (unit ==  2) t += time * 1000 * 60;
    else if (unit ==  3) t += time * 1000 * 60 * 60;
    else if (unit ==  4) t += time * 1000 * 60 * 60 * 24;
    else if (unit ==  5) t += time * 1000 * 60 * 60 * 24 * 7;
    var ret = new Date; ret.setTime(t);
    return(ret);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** 指定された二つのDateオブジェクトの時間差を指定の単位で求める．
   *  @name    subDate
   *  @param   {Date}   target 引かれる側のDate オブジェクト
   *  @param   {Date}   base   引く側のDate オブジェクト
   *  @param   {Number} unit   求めたい結果の単位(0:ms/1:sec/2:min/3:hour/4:day/5:week)
   *  @returns {Number}        指定した単位での時間差(失敗した場合はNaN)
   */
  function subDate(target, base, unit) {
    var diff = target.getTime() - base.getTime();
    if      (unit == 1) diff = Math.floor(diff /  1000);
    else if (unit == 2) diff = Math.floor(diff / (1000 * 60));
    else if (unit == 3) diff = Math.floor(diff / (1000 * 60 * 60));
    else if (unit == 4) diff = Math.floor(diff / (1000 * 60 * 60 * 24));
    else if (unit == 5) diff = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return(diff);
  }
  /** 指定した数値の3桁ごとに","を挿入した文字列を求める．
   *  @name    formatNumber
   *  @param   {Number} value 文字列化する数値
   *  @returns {String}       数値を文字列化した結果(失敗した場合はnull)
   */
  function formatNumber(value) {
    value = String(value);
    var len = value.length;
    if (len < 3) return(value);
    
    var odd = len % 3, buf = [];
    if (odd > 0) buf.push(value.substring(0, odd));
    for(var i = odd; i < len; i+=3) {
      buf.push(value.substring(i, i+3));
    }
    return(buf.join(','));
  }
//function getPrinterStatus() {}
//function printFile() {}
//function printTemplate() {}
//function printURI() {}
//function printStaticScreen() {}
//function saveImageToMemoryCard() {}
//function saveHttpServerImageToMemoryCard() {}
//function saveStaticScreenToMemoryCard() {}
//function launchDynamicDocument() {}
//function getMetadataElement() {}
//function getSynopsis() {}
//function searchMetadata() {}
//function searchMetadataOnServer() {}

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // IPTVFJ STD-0006(IPTV追加拡張関数)
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>ライセンスを取得する．** 本実装では何も行わず正常終了を返す．
   *  @name    getIPTVLicense
   *  @param   {String} drmSystem CAS/DRM方式を示す文字列
   *  @param   {String} id        サービス事業者ID(ip_service_provider_id)
   *  @param   {Array}  licenseId ライセンスIDの配列
   *  @returns {Number}           実行完了時ステータス
   */
  function getIPTVLicense(drmSystem, id, licenseId) { return(1); }
//function getIPTVLicenseInfo() {}
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>指定したDRM方式に対応するCAS/DRMクライアント識別子を取得する．** 本実装では擬似文字列を返す．
   *  @name    getDRMID
   *  @param   {String} drmSystem CAS/DRM方式を示す文字列
   *  @returns {String}           DRMID
   */
  function getDRMID(str)  { return('1234567890abcdef'); }
//function launchIPTVContent() {}
//function launchUnmanagedDocument() {}
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>文書のマネージメント状態を取得する．** 本実装ではmanaged状態(1)を返す．
   *  @name    getDocManagementStat
   *  @returns {Number}           文書のマネージメント状態(1:managed/0:unmanaged)
   */
  function getDocManagementStat()     { return(1); }
//function marqueeText() {}
//function setIPTVServiceRegistrationInfo() {}
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>IP放送・VODサービスの基本登録情報を確認する．** 本実装では擬似的な配列を返す．
   *  @name    checkIPTVServiceRegistrationInfo
   *  @param   {String} id        サービス事業者ID(ip_service_provider_id)
   *  @returns {Number}           データ内容を格納した配列(key,expire_date,license_uri)
   */
  function checkIPTVServiceRegistrationInfo(id) { return([12345678, 0, 'license']); } // key,expire_date,license_uri
//function setTBServiceRegistrationInfo() {}
//function checkTBServiceRegistrationInfo() {}
//function setContentPackageInfo() {}
//function setSelectedLicenseInfo() {}
//function updatePackageLicenseInfo() {}
//function checkParentalCtrlPassword() {}

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // IPTVFJ(IPRetransmission);
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  /** (擬似実装)<br>受信機を特定するための識別子を取得する．** 本実装では擬似文字列を返す．
   *  @name    getIRDID
   *  @param   {String} type      取得を要求する識別子の種別
   *  @returns {String}           受信機固有識別子
   */
  function getIRDID(type) { return('1234567890abcdef'); }
  /**#@-*/

  return({
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // IPTVFJ STD-0006(Browser疑似オブジェクト)
    epgTune                          : epgTune,
    readPersistentArray              : readPersistentArray,
    transmitTextDataOverIP           : transmitTextDataOverIP,
//  setCacheResourceOverIP           : setCacheResourceOverIP,
//  reloadActiveDocument             : reloadActiveDocument,
//  getBrowserVersion                : getBrowserVersion,
    getActiveDocument                : getActiveDocument,
    lockScreen                       : lockScreen,
    unlockScreen                     : unlockScreen,
//  getBrowserSupport                : getBrowserSupport,
    launchDocument                   : launchDocument,
//  quitDocument                     : quitDocument,
//  getResidentAppVersion            : getResidentAppVersion,
//  startResidentApp                 : startResidentApp,
    playRomSound                     : playRomSound,
//  sleep                            : sleep,
    setInterval                      : setInterval,
    clearTimer                       : clearTimer,
//  pauseTimer                       : pauseTimer,
//  resumeTimer                      : resumeTimer,
    random                           : random,
    addDate                          : addDate,
    subDate                          : subDate,
    formatNumber                     : formatNumber,
//  getPrinterStatus                 : getPrinterStatus,
//  printFile                        : printFile,
//  printTemplate                    : printTemplate,
//  printURI                         : printURI,
//  printStaticScreen                : printStaticScreen,
//  saveImageToMemoryCard            : saveImageToMemoryCard,
//  saveHttpServerImageToMemoryCard  : saveHttpServerImageToMemoryCard,
//  saveStaticScreenToMemoryCard     : saveStaticScreenToMemoryCard,
//  launchDynamicDocument            : launchDynamicDocument,
//  getMetadataElement               : getMetadataElement,
//  getSynopsis                      : getSynopsis,
//  searchMetadata                   : searchMetadata,
//  searchMetadataOnServer           : searchMetadataOnServer,
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // IPTVFJ STD-0006(IPTV追加拡張関数)
    getIPTVLicense                   : getIPTVLicense,
//  getIPTVLicenseInfo               : getIPTVLicenseInfo,
    getDRMID                         : getDRMID,
//  launchIPTVContent                : launchIPTVContent,
//  launchUnmanagedDocument          : launchUnmanagedDocument,
    getDocManagementStat             : getDocManagementStat,
//  marqueeText                      : marqueeText,
//  setIPTVServiceRegistrationInfo   : setIPTVServiceRegistrationInfo,
    checkIPTVServiceRegistrationInfo : checkIPTVServiceRegistrationInfo,
//  setTBServiceRegistrationInfo     : setTBServiceRegistrationInfo,
//  checkTBServiceRegistrationInfo   : checkTBServiceRegistrationInfo,
//  setContentPackageInfo            : setContentPackageInfo,
//  setSelectedLicenseInfo           : setSelectedLicenseInfo,
//  updatePackageLicenseInfo         : updatePackageLicenseInfo,
//  checkParentalCtrlPassword        : checkParentalCtrlPassword,
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // IPTVFJ STD-0005
    getIRDID                         : getIRDID
  });
})());
