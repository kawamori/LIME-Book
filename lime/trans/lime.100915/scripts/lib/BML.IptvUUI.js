//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/** 高速UIエージェントプログラム向けの拡張関数群用疑似オブジェクト ** @namespace */
var iptv_uui = (function() {
  var SEERVICE_LOGO_URL_PREFIX  = 'images/dummy_logo/chLogo_';
  var SEERVICE_LOGO_URL_SUFFIX  = '.png';

  var FIND_EVENT_ID_URL_PREFIX  = '../tsv/tsv_epg/epgfindEventId.';
  var FIND_EVENT_ID_URL_SUFFIX  = '.tsv';

  var GET_EVENT_INFO_URL_PREFIX = '../tsv/tsv_epg/getIntEventInfo.';
  var GET_EVENT_INFO_URL_SUFFIX = '.tsv';
  
  var UUI_MEDIA_ERR_OK                =  0; // 正常終了
  var UUI_MEDIA_ERR_NG                = -1; // その他のエラー
  var UUI_MEDIA_ERR_UNSUPPORTED       = -2; // 指定機能が未サポート
  var UUI_MEDIA_ERR_UNAVAILABLE       = -3; //
  var UUI_MEDIA_ERR_ENDOFDATA         = -4; //
  var UUI_MEDIA_ERR_INVALID_PARAMETER = -5; // 引数エラー
  var UUI_MEDIA_ERR_NOT_READY         = -6; // 処理中
  var UUI_MEDIA_ERR_INVALID_STATE     = -7; // Media Playerの動作ステートが適切でない
  var UUI_MEDIA_ERR_FORBIDDEN         = -8; //
  var UUI_MEDIA_ERR_EXPIRED           = -9; //
  
  //ダミーイベントハンドラ
/*  function onStateChangedEvt(){
    if(iptv_uui.onStateChanged) iptv_uui.onStateChanged(iptv_uui.Media2Status);
  }
  function onRateChangeToEvt(){
    if(iptv_uui.onRateChangeTo) iptv_uui.onRateChangeTo(iptv_uui.Media2GetRate(2),iptv_uui.Media2GetRate(1));
  }
  function onServiceChangedEvt(){
    if(iptv_uui.onServiceChanged) iptv_uui.onServiceChanged(iptv_uui.Media2iptvNetworkId,iptv_uui.Media2iptvServiceId);
  }
  function onCurrentEventIdEvt(){
    iptv_uui.EpgEpgGetCurEvtIdTimer=NaN;
    if(iptv_uui.onCurrentEventId) iptv_uui.onCurrentEventId(0,iptv_uui.EpgNetworkId,iptv_uui.EpgServiceId);
  }
  
  function Media2OpenPlayControl(url,position){
    var date = new Date();
    if(isNaN(position )) position=0;
    
    iptv_uui.Media2Status=3;
    iptv_uui.Media2Rate=0;
    iptv_uui.Media2Position=browser.addDate(date,(-1)*position,0);
    iptv_uui.Media2Duration=200000000;
    browser.setInterval("onStateChangedEvt();",100,1);
    return 0;
  }
  function Media2Start(){
    if(iptv_uui.Media2Status==3) {
      return;
    }
    else if(iptv_uui.Media2Status == 2) {
      if(iptv_uui.Media2Rate!=0) {
        iptv_uui.Media2Rate=0;
        browser.setInterval("onRateChangeToEvt();",100,1);
      }
      var date = new Date();
      var subdate = browser.subDate(date,iptv_uui.Media2PauseTime,0);
      iptv_uui.Media2Position = browser.addDate(iptv_uui.Media2Position,subdate,0);
    }
    iptv_uui.Media2Status=3;
    browser.setInterval("onStateChangedEvt();",100,1);
  }
  function Media2Pause(){
    if(iptv_uui.Media2Status==2) return;
    
    iptv_uui.Media2PauseTime = new Date();
    iptv_uui.Media2Status=2;
    browser.setInterval("onStateChangedEvt();",100,1);
  }
  function Media2Stop(){
    if(iptv_uui.Media2Status==5) return;
    iptv_uui.Media2Status=5;
    browser.setInterval("onStateChangedEvt();",100,1);
  }
  function Media2SetRate(isOffset,param){
    var oldparam = iptv_uui.Media2Rate;
    if(isNaN(isOffset) )return;
    if(isNaN(param) )return;
    if(isOffset == 0) {
      if(param == 100) iptv_uui.Media2Rate = 0;
      else reutrn;
    }
    else if(isOffset == 1) {
      if(param == 1) iptv_uui.Media2Rate++;
      if(param == -1) iptv_uui.Media2Rate--;
      if(iptv_uui.Media2Rate < -4) iptv_uui.Media2Rate = -4;
      if(iptv_uui.Media2Rate > 4) iptv_uui.Media2Rate = 4;
    }
    else return;
    if(iptv_uui.Media2Rate != oldparam) {
      browser.setInterval("onRateChangeToEvt();",100,1);
    }
    
  }
  function Media2GetRate(property){
    if(property == 1)
      return iptv_uui.Media2Rate;
    else if(property == 2){
      if(iptv_uui.Media2Rate >= 0)  return (iptv_uui.Media2Rate +1) *100;
      else return (iptv_uui.Media2Rate) *100;
    }
  }
  function Media2GetPosition(){
    if(! iptv_uui.Media2Position) return NaN;
    var time1 = new Date();
    
    if(iptv_uui.Media2Status==3)
      return browser.subDate(time1,iptv_uui.Media2Position,0);
    else if(iptv_uui.Media2Status==2){
      return browser.subDate(iptv_uui.Media2PauseTime,iptv_uui.Media2Position,0);
    }
  }
  function Media2GetDuration(){
    return iptv_uui.Media2Duration;
  }
  function Media2CheckService(type,network_id,service_id,skip_mode){
    return UUI_MEDIA_ERR_OK;
  }
  function Media2OpenService(type,network_id,service_id){
    
    iptv_uui.Media2iptvServiceId	= service_id;
    iptv_uui.Media2iptvNetworkId	= network_id;
    iptv_uui.Media2iptvType			= type;
    
    browser.setInterval("onServiceChangedEvt();",100,1);
  }

//    onServiceChanged
//      onAudioChanged
//        onCopyControlChanged
//          onCaptionChanged
//            onVideoChanged
//              onParentalChange

  function Media2GetServiceId(type,network_id,service_id,mode,property,skip_mode,service_order){
    if(isNaN(mode)) return;
    
    var targetNetworkId=NaN;
    var targetServiceId=NaN;
    
    //CH-
    if(mode == 0) {
      targetServiceId=service_id-1;
      targetNetworkId=network_id-1;
      if(targetServiceId<0) targetServiceId=0xffff;
      if(targetNetworkId<0) targetNetworkId=0xffff;
    }
    //CH+
    else if(mode == 1) {
      targetServiceId=service_id+1;
      targetNetworkId=network_id+1;
      if(targetServiceId>0xffff) targetServiceId=0;
      if(targetNetworkId>0xffff) targetNetworkId=0;
    }
    //先頭を取得 本ダミーでは未実装
    else if(mode == 2) {
    }
    //スキップチェック 本ダミーでは未実装
    else if(mode == 3) {
    }
    //デフォルト取得 本ダミーでは未実装
    else if(mode == 4) {
    }
    //現在値を取得
    else if(mode == 6) {
      if(iptv_uui.Media2iptvType != type) return UUI_MEDIA_ERR_UNAVAILABLE;
      targetServiceId=iptv_uui.Media2iptvServiceId;
      targetNetworkId=iptv_uui.Media2iptvNetworkId;
      
    }
    else return UUI_MEDIA_ERR_INVALID_PARAMETER;
    
    
    if(property == 0){
      if(!isNaN(targetNetworkId)) return targetNetworkId;
      else UUI_MEDIA_ERR_UNSUPPORTED;
    } else if(property == 1) {
      if(!isNaN(targetServiceId)) return targetServiceId;
      else UUI_MEDIA_ERR_UNSUPPORTED;
    } else {
      return UUI_MEDIA_ERR_INVALID_PARAMETER;
    }
    
    return UUI_MEDIA_ERR_NG;
  }

 */
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  var UIE_EPG_TYPE_IPTV = 0; // 多チャンネル
  var UIE_EPG_TYPE_TB   = 1; // 地上デジタルIP 再送信
  var UIE_EPG_TYPE_BS   = 2; // BS 放送IP 再送信

  var UIE_EPG_PROPERTY_SERVICE_TYPE        = 0;
  var UIE_EPG_PROPERTY_CHANNEL_NUMBER      = 1;
  var UIE_EPG_PROPERTY_REMOTE_KEY_ID       = 2;
  var UIE_EPG_PROPERTY_SERVICE_LOGO_WIDTH  = 3;
  var UIE_EPG_PROPERTY_SERVICE_LOGO_HEIGHT = 4;
  var UIE_EPG_PROPERTY_FREE_CA_MODE        = 5;

  var UIE_EPG_PROPERTY_SERVICE_NAME        = 11;
  var UIE_EPG_PROPERTY_SERVICE_LOGO_URL    = 12;

  var EIT_START_TIME                       = 0; // イベント開始時間
  var EIT_DURATION                         = 1; // イベント継続時間。秒数
  var EIT_PARENTAL_RATING                  = 2; // パレンタルレート記述子
  var EIT_DESCRIPTORS                      = 3; // 音声・映像情報、字幕情報、コピー制御記述子
  var EIT_CONTENT                          = 4; // コンテント記述子= 番組ジャンル; //
  var EIT_GROUP_TYPE                       = 5; // イベントグループ記述子のgropu_type= グループ種別; //
  var EIT_GROUP_NETWORK_ID                 = 6; // イベントグループ記述子のリンク先network_id= サービス識別; //
  var EIT_GROUP_SERVICE_ID                 = 7; // イベントグループ記述子のリンク先service_id= サービス識別; //
  var EIT_GROUP_EVENT_ID                   = 8; // イベントグループ記述子のevent_id= イベント識別; //
  var EIT_FREE_CA_MODE                     = 9; // EIT のfree_CA_mode= スクランブル; //に相当する

  var EIT_SHORT_EVENT_NAME                 = 10; // 短形式イベント記述子の番組名= event_name_char; //
  var EIT_SHORT_EVENT_TEXT                 = 11; // 短形式イベント記述子の番組記述（text_char）
  var EIT_EXTENDED_EVENT                   = 12; // 拡張形式イベント記述子 （番組詳細情報）
  
  var UIE_EPG_ERR_OK                       =  0; // 正常終了
  var UIE_EPG_ERR_NG                       = -1; //  当該記述子は存在しない。その他のエラー
  var UIE_EPG_ERR_INVALID_NETWORK_ID       = -2; // network_id の値が不正
  var UIE_EPG_ERR_INVALID_SERVICE_ID       = -3; // service_id の値が不正
  var UIE_EPG_ERR_INVALID_EVENT_ID         = -4; // event_id 不正
  var UIE_EPG_ERR_NOT_READY                = -5; // 取得中・または全局SI 取得中やサービスリスト構築中などの理由でEPG 情報が返却できない場合
  var UIE_EPG_ERR_INVALID_PARAMETER        = -6; // その他の引数不正


  // int uie_EPG_select(int type, int network_id, int service_id , int *subErrNo)
  function EpgSelect(type, network_id, service_id) {
    iptv_uui.EpgServiceId = service_id;
    iptv_uui.EpgNetworkId = network_id;
    iptv_uui.EpgType      = type;
    return(UIE_EPG_ERR_OK);
  }

  var findEventIdCache = {};
  // int uie_EPG_findEventId(int start_time, int duration , int *subErrNo)
  function EpgFindEventId(start_time, duration) {
    var date = new Date; date.setTime(start_time * 1000);
    iptv_uui.objectCreateTime = date;

    var name = [iptv_uui.EpgType, iptv_uui.EpgNetworkId, iptv_uui.EpgServiceId].join('.') +
               FIND_EVENT_ID_URL_SUFFIX;
    var ret = findEventIdCache[name];
    if (typeof(ret) != 'undefined') return(ret);
    
    ret = browser.transmitTextDataOverIP(FIND_EVENT_ID_URL_PREFIX + name, null, 'EUC-JP');
    if (isNaN(ret[0]) || (ret[0] < 0)) return(UIE_EPG_ERR_NG);
    ret = parseInt((ret[2].split("\r\n"))[0], 10);
    findEventIdCache[name] = ret;

    return(ret);
  }

  //int uie_EPG_getNextEventId(int event_id , int *subErrNo)
  function EpgGetNextEventId(event_id) { return(event_id + 1); }

  var getEventInfoCache = {};
  // int uie_EPG_getIntEventInfo(int eit_type, int event_id, int description_type,
  //                             int param , int *subErrNo)
  function EpgGetIntEventInfo(eit_type, event_id, description_type, param) {
    if(isNaN(event_id) || (event_id < 0)) return(UIE_EPG_ERR_INVALID_EVENT_ID);
    if(isNaN(description_type))           return(UIE_EPG_ERR_NG);

    var name = [iptv_uui.EpgType, iptv_uui.EpgNetworkId, iptv_uui.EpgServiceId].join('.') +
               '_' + event_id + GET_EVENT_INFO_URL_SUFFIX;

    var target = getEventInfoCache[name];
    if (!target) {
      target = browser.transmitTextDataOverIP(GET_EVENT_INFO_URL_PREFIX + name, null, 'EUC-JP');
      if (isNaN(target[0]) || (target[0] < 0)) return(UIE_EPG_ERR_NG);
      target = ((target[2].split("\r\n"))[0]).split("\t");
      getEventInfoCache[name] = target;
    }

    var date = this.objectCreateTime;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(),date.getHours(),0,0,0);

    if      (description_type == EIT_START_TIME)       { return(Math.floor(browser.addDate(date, parseInt(target[0],10), 1).getTime() / 1000));}
    else if (description_type == EIT_DURATION)         { return(parseInt(target[1],10)); }
    else if (description_type == EIT_PARENTAL_RATING)  { return(parseInt(target[2],10)); }
    else if (description_type == EIT_DESCRIPTORS)      { return(parseInt(target[3],10)); }
    else if (description_type == EIT_CONTENT)          { return(parseInt(target[4],10)); }
    else if (description_type == EIT_GROUP_TYPE)       { return(parseInt(target[5],10)); }
    else if (description_type == EIT_GROUP_NETWORK_ID) { return(parseInt(target[6],10)); }
    else if (description_type == EIT_GROUP_SERVICE_ID) { return(parseInt(target[7],10)); }
    else if (description_type == EIT_GROUP_EVENT_ID)   { return(parseInt(target[8],10)); }
    else if (description_type == EIT_FREE_CA_MODE)     { return(parseInt(target[9],10)); }
    else                                               { return(UIE_EPG_ERR_NG);         }
  }
  // int uie_EPG_getStringEventInfo(int eit_type, int event_id, int description_type,
  //                                int param, unsigned char resultStr[], int size , int *subErrNo)
  function EpgGetStringEventInfo(eit_type,event_id, description_type, param){
    var name = [iptv_uui.EpgType, iptv_uui.EpgNetworkId, iptv_uui.EpgServiceId].join('.') +
               '_' + event_id + GET_EVENT_INFO_URL_SUFFIX;
    var target = getEventInfoCache[name];
    if (!target) {
      target = browser.transmitTextDataOverIP(GET_EVENT_INFO_URL_PREFIX + name, null, 'EUC-JP');
      if (isNaN(target[0]) || (target[0] < 0)) return('');
      target = ((target[2].split("\r\n"))[0]).split("\t");
      getEventInfoCache[name] = target;
    }
    
    if      (description_type == EIT_SHORT_EVENT_NAME) { return(target[10]); }
    else if (description_type == EIT_SHORT_EVENT_TEXT) { return(target[11]); }
    else if (description_type == EIT_EXTENDED_EVENT)   { target = target[12 + param]; return(target ? target : ''); }
    else                                               { return('');         }
  }
  // int uie_EPG_getStringServiceInfo(int type, int network_id, int service_id,
  //                                  int property, unsigned char resultStr[],
  //                                  int size , int *subErrNo)
  function EpgGetStringServiceInfo(type, network_id, service_id, property) {
    if        (property == UIE_EPG_PROPERTY_SERVICE_NAME    ) {
      return('チャンネル' + service_id);
    } else if (property == UIE_EPG_PROPERTY_SERVICE_LOGO_URL) {
      return(SEERVICE_LOGO_URL_PREFIX + service_id + SEERVICE_LOGO_URL_SUFFIX);
    }
  }
  // int uie_EPG_getIntServiceInfo(int type, int network_id, int service_id,
  //                               int property , int *subErrNo)
  function EpgGetIntServiceInfo(type, network_id, service_id, property) {
    if        (property == UIE_EPG_PROPERTY_SERVICE_TYPE       ) {
      return(type);
    } else if (property == UIE_EPG_PROPERTY_CHANNEL_NUMBER     ) {
      return(((type == UIE_EPG_TYPE_IPTV) || (type == UIE_EPG_TYPE_BS)) ?
             service_id : seervice_id); // 地デジの場合は異なる(?)
    } else if (property == UIE_EPG_PROPERTY_REMOTE_KEY_ID      ) {
      return(-1);
    } else if (property == UIE_EPG_PROPERTY_SERVICE_LOGO_WIDTH ) {
      return(120);
    } else if (property == UIE_EPG_PROPERTY_SERVICE_LOGO_HEIGHT) {
      return(90);
    } else if (property == UIE_EPG_PROPERTY_FREE_CA_MODE       ) {
      return(0);// 1:スクランブル / 0:ノンスクランブル
    }
  }
//  function EpgGetCurrentEventId(){
//    if(! isNaN(iptv_uui.EpgEpgGetCurEvtIdTimer)) browser.clearTimer(iptv_uui.EpgEpgGetCurEvtIdTimer);
//    iptv_uui.EpgEpgGetCurEvtIdTimer = browser.setInterval("onCurrentEventIdEvt();",200,1);
//  }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // 視聴・録画予約データ
  var UIE_RESERVE_ERR_OK                =  0; // 正常終了
  var UIE_RESERVE_ERR_NG                = -1; // その他のエラー
  var UIE_RESERVE_ERR_ENDOFDATA         = -2; // データの終了を表す
  var UIE_RESERVE_ERR_UNAVAILABLE       = -3; // 操作無効
  var UIE_RESERVE_ERR_INVALID_PARAMETER = -4; // 引数が不正
  var UIE_RESERVE_ERR_NOTREADY          = -5; // 予約モジュール準備中
  var UIE_RESERVE_ERR_FULL              = -6; // 容量不足のため録画予約不可
  
//  function ReserveGetCurrent(index){
//    return index;
//  }
//  function ReserveGetFindResult(index,property){
//    return "";
//  }
//  function ReserveGetStringFindResult(index,property){
//    return "";
//  }

  // int uie_Reserve_getReserveIdByEvent(int type, int network_id, int service_id, int event_id,
  //                                     char reserve_id[], void* reserve , int *subErrNo)
  function ReserveGetReserveIdByEvent(type, network_id, service_id, event_id, reserve) {
    return('');
  }

  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  return({
    EpgServiceId        : NaN,
    EpgNetworkId        : NaN,
    EpgType             : NaN,
    
//    this.Media2OpenPlayControl	= Media2OpenPlayControl;
//    this.Media2Start			= Media2Start;
//    this.Media2Pause			= Media2Pause;
//    this.Media2Stop				= Media2Stop;
//    this.Media2SetRate			= Media2SetRate;
//    this.Media2GetRate			= Media2GetRate;
//    this.Media2GetPosition		= Media2GetPosition;
//    this.Media2GetDuration		= Media2GetDuration;
    
//    this.Media2CheckService		= Media2CheckService;
//    this.Media2OpenService		= Media2OpenService;
//    this.Media2GetServiceId		= Media2GetServiceId;
    
//    this.Media2Status			= 5;
//    this.Media2Rate				= NaN;
//    this.Media2Position			= NaN;
//    this.Media2Duration			= NaN;
//    this.Media2PauseTime		= NaN;
    
//    this.Media2iptvServiceId	= NaN;
//    this.Media2iptvNetworkId	= NaN;
//    this.Media2iptvType			= NaN;

//    EpgInit                 : EpgInit,
//    EpgExit                 : EpgExit,
    EpgSelect               : EpgSelect,
    EpgFindEventId          : EpgFindEventId,
    EpgGetNextEventId       : EpgGetNextEventId,
//    EpgGetPfEventId         : EpgGetPfEventId,
//    EpgGetCurrentEventId    : EpgGetCurrentEventId,
    EpgGetIntEventInfo      : EpgGetIntEventInfo,
    EpgGetStringEventInfo   : EpgGetStringEventInfo,
    EpgGetIntServiceInfo    : EpgGetIntServiceInfo,
    EpgGetStringServiceInfo : EpgGetStringServiceInfo,
//    EpgGetTime              : EpgGetTime,
//    this.EpgGetCurrentEventId	= EpgGetCurrentEventId;
    
    
//    this.EpgEpgGetCurEvtIdTimer = NaN;
    
//    this.ReserveGetCurrent		= ReserveGetCurrent;
//    this.ReserveGetFindResult	= ReserveGetFindResult;
//    this.ReserveGetStringFindResult	= ReserveGetStringFindResult;
    ReserveGetReserveIdByEvent : ReserveGetReserveIdByEvent,
    
    //ダミーイベントハンドラ。設定してある場合、当該イベントを発生させうる処理実行時にタイマが設定される。
//    this.onStateChanged			= null;
//    this.onRateChangeTo			= null;
//    this.onServiceChanged		= null;
    
      objectCreateTime : new Date()
  });
})();



