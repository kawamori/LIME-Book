/**************************  共通データ  ********************************/


var gVodURL = 
"http://hls.okimediaserver.com/pcs/resolvecontent?contents_path=/moviebox/ntt-ev/h264-sd-tts/Docu-white-E_out.mp4&protocol=http_tts";
//var gVodLength = 730;	// Show VOD Time [100msec] ex.10=1sec, 300=30sec
var gVodLength = 12150;
var gCaptionXML_bad = "../scripts/caption_bad_tagalog.xml";
//var gCaptionXML_bad = "http://nec.iptvf.jp/hello/bml/Shenzhen/aIPTV/scripts/tagalog.xml";
var gCaptionXML_good = "../scripts/caption_good.xml";
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

/****************************************************************  
* 機　能： XML字幕ファイルを読み込み配列に格納する
* 引　数： XMLファイルパス、字幕配列
* 戻り値： なし
****************************************************************/ 
function loadXML(xmlFile){
//modified by Kawamori


	// 改行コード除去
	var str = deleteLineFeed(xmlFile);

	var captionCounter = 0;
	var startEndFlag = 0;
	var startTimeMsec = 0;
	var endTimeMsec = 0;
	var caption = "";

	// XMLをパースして開始時間、終了時間、表示文字列を配列に格納

		var rootObj = Xparse(str);

		if(rootObj.contents[0].name == "eri"){
			if(rootObj.contents[0].contents[0].name == "startup"){
				if(rootObj.contents[0].contents[0].contents[0].name == "content_title"){  return "true";
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
