/**************************  共通データ  ********************************/


var gVodURL = "http://hls.okimediaserver.com/pcs/resolvecontent?contents_path=/moviebox/hotel/sanjya_matsuri_480i_out.mp4&protocol=http_tts";
//var gVodLength = 730;	// Show VOD Time [100msec] ex.10=1sec, 300=30sec
var gVodLength = 12150;
var gCaptionXML_bad = "../scripts/caption_bad_tagalog2.xml";
//var gCaptionXML_bad = "http://nec.iptvf.jp/hello/bml/Shenzhen/aIPTV/scripts/tagalog.xml";
var gCaptionXML_good = "http://kawamori.github.com/LIME-Book/lime/samples/video/caption/scripts/caption_good.xml";
//var gCaptionXML_good = "http://nec.iptvf.jp/hello/bml/Shenzhen/aIPTV/scripts/chinese.xml";

var gCaption_bad = new Array();
var gCaption_good = new Array();


/*************************  共通基礎関数  *******************************/
// 処理補助
function getElementById(id){return document.getElementById(id);}
function showElem(id){getElementById(id).normalStyle.visibility="visible";}
function hideElem(id){getElementById(id).normalStyle.visibility="hidden";}
function romSound(id){browser.playRomSound("romsound://"+id);}
function lockScreen(){browser.lockScreen();}
function unlockScreen(){browser.unlockScreen();}

function splitMulti(msg){
var part=msg.split("--THIS_STRING_SEPARATES");
return part[2]; }

/****************************************************************  
* 機　能： XML字幕ファイルを読み込み配列に格納する
* 引　数： XMLファイルパス、字幕配列
* 戻り値： なし
****************************************************************/ 
function loadXML(url, captionArray){
//modified by Kawamori

	// 外部字幕ファイル
	var array = browser.transmitTextDataOverIP(url, "" , "EUC-JP");


alert("called from xmltest.js\n");

/* alert("xml? "+splitMulti(array[2]));*/
                      /*alert("xml? "+array[2]);*/
/*var partXML = splitMulti(array[2]);*/
	// 改行コード除去
	var str = deleteLineFeed(_strip(array[2]));
   /*var str = deleteLineFeed(partXML);*/
alert("str: "+str);

	var captionCounter = 0;
	var startEndFlag = 0;
	var startTimeMsec = 0;
	var endTimeMsec = 0;
	var caption = "";

	// XMLをパースして開始時間、終了時間、表示文字列を配列に格納
	if(array[0] == 1){
		var rootObj = Xparse(str);
alert ("root is "+rootObj+"\n");
					alert("foo? "+rootObj.contents[0].name);
					alert("bar? "+rootObj.contents[0].contents[1].name);
					alert("div? "+rootObj.contents[0].contents[1].contents[0].name);
					alert("next ? "+rootObj.contents[0].contents[1].contents[1].name);
					alert("next next? "+rootObj.contents[0].contents[1].contents[2].name);/* gives the tag name */
					alert("next next  "+rootObj.contents[0].contents[1].contents[2].contents[0]); /*gives the value of the tag */
					alert("DRPC=  " + rootObj.contents[0].contents[2].contents[0].name); 
					
					/*-----------------------------
					
					<DRPC_RESPONSE>
						<CODE>201</CODE>
						<MESSAGE>DRPCの取得に成功しました。</MESSAGE>
						<DRPC>
							<PERMISSION_CODE>
								<VERSION_UNIT>
									<VERSION>1.2</VERSION>
								</VERSION_UNIT>
								<PERMISSION_ACTOR_UNIT>
									<CONTENT_ID>VPJP010000000003</CONTENT_ID>
									<ISSUER_ID>HJPC010100000003</ISSUER_ID>
									<RECEIVER_ID>UJPI010000000002</RECEIVER_ID>
								</PERMISSION_ACTOR_UNIT>
								<PERMISSION_CLASSIFICATION_UNIT>
									<DISCLOSURE_CLASS disclosure_type="open permission"/>
									<USAGE_PURPOSE_CLASS usage_purpose_type="public permission"/>
									<CHARGE_MODEL_CLASS charge_model_type="free of charge" pay_per_use_flag="false" subscription_flag="false" coupon_flag="false"/>
									<BILLING_CLASS billing_type="ad hoc billing"/>
									<APPLICATION_CLASS application_type="ad hoc permission"/>
									<SPONSOR_CLASS sponsor_type="not exist"/>
								
								
								
											*/
		if(rootObj.contents[0].name == "tt"){
			if(rootObj.contents[0].contents[0].name == "body"){
				if(rootObj.contents[0].contents[0].contents[0].name == "div"){
					for(var i=0; i<rootObj.contents[0].contents[0].contents[0].contents.length; i++){
						if(rootObj.contents[0].contents[0].contents[0].contents[i].name == "p"){
							for (var pname in rootObj.contents[0].contents[0].contents[0].contents[i].attributes){
								if(startEndFlag == 0){
									startTimeMsec = clockTime2msec(rootObj.contents[0].contents[0].contents[0].contents[i].attributes[pname]);
									alert("start time is "+startTimeMsec);
									startEndFlag = 1;
								} else {
									endTimeMsec = clockTime2msec(rootObj.contents[0].contents[0].contents[0].contents[i].attributes[pname]);
									startEndFlag = 0;
								}
							}
							captionArray[captionCounter] = new Array(startTimeMsec, endTimeMsec, rootObj.contents[0].contents[0].contents[0].contents[i].contents[0].value);
							captionCounter++;
						}
					}
				}
			}
		}
	}
}


/****************************************************************  
* 機　能： 改行コードの削除 
* 引　数： 文言
* 戻り値： 改行コードなしの文言
****************************************************************/ 
function deleteLineFeed(myLen) {
	var newLen = "";  
	for(var i=0; i<myLen.length; i++){
		text = myLen.substring(i, i+1);

		if(text != "\n" && text != "\r"){
			newLen += myLen.substring(i, i+1);
		}
	}
	return(newLen);
}

/****************************************************************  
* 機　能： 時間フォーマットを変換 
* 引　数： クロックタイム
* 戻り値： msec
****************************************************************/ 
// Clock-time to msec
function clockTime2msec( strTime ) {

//printd(" clock: "+strTime);

	var fSec = 0;
	// Search separator between hour to minute
	var sep1 = strTime.indexOf( ':' );
	// Search separator between minute to second
	var sep2 = strTime.lastIndexOf( ':' );
	var sep3 = strTime.lastIndexOf( '.' );
	if( sep1 > 0 && sep2 > 0 ) {
		var hour = Number( strTime.substring( 0, sep1 ) );
		var min = Number( strTime.substring( sep1+1, sep2 ) );
		var sec = Number( strTime.substring( sep2+1, sep3) );
		var msec = Number( strTime.substring( sep3+1 ) )*10;
		fSec = hour*3600.0 + min*60.0 + sec;
		fSec *= 1000;
		fSec += msec;
	} //printd(" fSec: "+fSec);
	return fSec;

}

function splitMulti(msg){

var part=msg.split("--THIS_STRING_SEPARATES");

return part[2];

}