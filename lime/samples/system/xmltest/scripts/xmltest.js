/**************************  ¶¦ÄÌ¥Ç¡¼¥¿  ********************************/


var gVodURL = "http://hls.okimediaserver.com/pcs/resolvecontent?contents_path=/moviebox/hotel/sanjya_matsuri_480i_out.mp4&protocol=http_tts";
/*var gVodLength = 730;	// Show VOD Time [100msec] ex.10=1sec, 300=30sec*/
var gVodLength = 12150;
/*var gCaptionXML_bad = "../scripts/htmlsample2.html";*/
var gCaptionXML_bad = "../scripts/caption_bad_tagalog.xml";
/*var gCaptionXML_good = "../scripts/htmlsample1.html";*/
/*var gCaptionXML_good = "http://nec.iptvf.jp/hello/bml/Shenzhen/aIPTV/scripts/chinese.xml";*/

var gCaption_bad = new Array();
var gCaption_good = new Array();


/*************************  ¶¦ÄÌ´ğÁÃ´Ø¿E *******************************/
/* ½èÍıÊä½E/
function getElementById(id){return document.getElementById(id);}
function showElem(id){getElementById(id).normalStyle.visibility="visible";}
function hideElem(id){getElementById(id).normalStyle.visibility="hidden";}
function romSound(id){browser.playRomSound("romsound://"+id);}
function lockScreen(){browser.lockScreen();}
function unlockScreen(){browser.unlockScreen();}

/****************************************************************  
* µ¡¡¡Ç½¡§ XML»úËEÕ¥¡¥¤¥EòÆÉ¤ß¹ş¤ßÇÛÎó¤Ë³ÊÇ¼¤¹¤E
* °ú¡¡¿ô¡§ XML¥Õ¥¡¥¤¥EÑ¥¹¡¢»úËEÛÎE
* Ìá¤EÍ¡§ ¤Ê¤·
****************************************************************/ 
function loadXML(xmlFile, captionArray){
/*modified by Kawamori*/

	/* ³°Éô»úËEÕ¥¡¥¤¥E/
	var array = browser.transmitTextDataOverIP(xmlFile, "" , "EUC-JP");
	
/*	if( array[0] == 1 ){
		return ;
	}else{
		return("Transmission failed");
	}
*/

	// ²ş¹Ô¥³¡¼¥É½EE
	var str = deleteLineFeed(array[2]);

	var captionCounter = 0;
	var startEndFlag = 0;
	var startTimeMsec = 0;
	var endTimeMsec = 0;
	var caption = "";

	// XML¤ò¥Ñ¡¼¥¹¤·¤Æ³«»Ï»ş´Ö¡¢½ªÎ»»ş´Ö¡¢É½¼¨Ê¸»úÎó¤òÇÛÎó¤Ë³ÊÇ¼
	if(array[0] == 1){
		var rootObj = Xparse(str);

		if(rootObj.contents[0].name == "tt"){
			if(rootObj.contents[0].contents[0].name == "body"){
			if(rootObj.contents[0].contents[0].contents[0].name == "div"){
										for(var i=0; i<rootObj.contents[0].contents[0].contents[0].contents.length; i++){
						if(rootObj.contents[0].contents[0].contents[0].contents[i].name == "p"){
							for (var pname in rootObj.contents[0].contents[0].contents[0].contents[i].attributes){
								if(startEndFlag == 0){
									startTimeMsec = clockTime2msec(rootObj.contents[0].contents[0].contents[0].contents[i].attributes[pname]);
									startEndFlag = 1;
								} else {
									endTimeMsec = clockTime2msec(rootObj.contents[0].contents[0].contents[0].contents[i].attributes[pname]);
									startEndFlag = 0;
								}
							} /*end of for */
							captionArray[captionCounter] = new Array(startTimeMsec, endTimeMsec, rootObj.contents[0].contents[0].contents[0].contents[i].contents[0].value);
							captionCounter++;
						} /*  end of if <p> */
					}/*  end of for <p> */
			}  	/*end of if <div> */
			}
		}
	}
}


/****************************************************************  
* µ¡¡¡Ç½¡§ ²ş¹Ô¥³¡¼¥É¤ÎºEE
* °ú¡¡¿ô¡§ Ê¸¸À
* Ìá¤EÍ¡§ ²ş¹Ô¥³¡¼¥É¤Ê¤·¤ÎÊ¸¸À
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
* µ¡¡¡Ç½¡§ »ş´Ö¥Õ¥©¡¼¥Ş¥Ã¥È¤òÊÑ´¹ 
* °ú¡¡¿ô¡§ ¥¯¥úÁÃ¥¯¥¿¥¤¥E
* Ìá¤EÍ¡§ msec
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
