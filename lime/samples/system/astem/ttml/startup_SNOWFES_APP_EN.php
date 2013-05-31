<?xml version="1.0" encoding="EUC-JP" ?>
<?bml bml-version="100.0" ?>

<bml>
<head>
<title>Caption Test</title>
<?php
	$ip = getenv('REMOTE_ADDR');

	if( preg_match( "/[0-1a-fA-f]*:[0-1a-fA-f]*/", $ip ) )
	{
		$proto = "rtp_tts";
	}
	else
	{
		$proto = "http_tts";
	}
?>

<style><![CDATA[
	
	.button {width:140px;height:32px;}
	p:focus {background-color-index:2;}
	p.button {text-align:center;color-index:0;line-height:30px;}
	#display	{color-index:3;text-align:left;font-size:36px;
		top:30px;width:700px;}
]]></style>

<script src="./fkcommon.ecm"/> <!-- added by FK -->
<script src="./lib/common2.ecm"/> <!-- added by FK -->

<script><![CDATA[

	var vodTimerID = NaN;
	var nNL=0;
	var naChars = new Array(0, 0, 0);

///////////////////////////////////////////////////////////////
function onload(){
	
	// 先ず、２４時間計の基準値を設定
	dtBase = new Date();
	
	//browser.lockScreen();
	
	nItvMlSec = 100;
	
	//alert("NOP_1");

	// XMLファイルの読み込み
	//gCaptionXML_good = "../caption3/scripts/SNOWFES_EN.xml";
	gCaptionXML_good = "./SNOWFES_EN.xml";
	loadXML(gCaptionXML_good);

	//browser.unlockScreen();

	if( !isNaN(vodTimerID) )	{
		browser.clearTimer(vodTimerID);
		vodTimerID = NaN;
	}

	//alert("NOP_2");
	
	var video = getElementById("video");
	video.streamStatus = "play";
	video.streamStatus = "pause";

	vodTimerID = browser.setInterval("checkTime();", nItvMlSec, 0);
}

function onunload(){
	var video = getElementById("video");
	video.streamStatus="stop";
	if( !isNaN(vodTimerID) ){
		browser.clearTimer(vodTimerID);
		vodTimerID = NaN;
	}
}

///////////////////////////////////////////////////////////////
function checkTime(){
	//alert("checkTime_1");

	//alert("checkTime_11[" + dtBase.toString() + "]");
	var dtNow = new Date();
	var nNowTotalSec = browser.subDate(dtNow, dtBase, 1);
	//var nNowTotalSec = nMlSecFromDate(dtNow);
	//alert("checkTime_12[" + nNowTotalSec + "]");

	// 最初は、現在秒をセットする。
	if (tsBackSec == -1)
	{
		//alert("checkTime_A1");
		tsBackSec = nNowTotalSec;
		return;
	}
	//alert("checkTime_3");
	
	var disp = getElementById("display");
	//alert("checkTime_31[" + tsBackSec.toString() + ", " + nNowTotalSec.toString() + "]");
	var bSecBreak = (tsBackSec != nNowTotalSec);
	//alert("checkTime_4");
	if (bSecBreak)
	{
		nCurMlSec = nItvMlSec / 2;
		// ビデオが未稼働状態の時は、
		if (bVideoNotPlay)
		{
			// Status の pause --> play 状態化は、０秒で終わる。
			// そこで、再生開始時間を示す。
			alert("checkTime_A2");
			var video = getElementById("video");
			video.streamStatus = "play";
			//alert("checkTime_A3");
			bVideoNotPlay = false;
		}
	}
	else
	{
		nCurMlSec += nItvMlSec;
	}
	//alert("checkTime_5");
	
	// 前回処理秒をセット
	tsBackSec = nNowTotalSec;
	
	// ビデオが未稼働状態の時は、このまま return;
	if (bVideoNotPlay)
	{
		return;
	}
	//alert("checkTime_5_1");

	// 現在時刻を特定
	var nNowTotalMlSec = nNowTotalSec * 1000 + nCurMlSec;
	//alert("checkTime_5_2");

	// nOfsBaseMlSec を設定する。
	if (nOfsBaseMlSec == -1)
	{
		nOfsBaseMlSec = nNowTotalMlSec;
		//alert("checkTime_A4");
	}
	//alert("checkTime_6");
	
	// 現在修正（Offset）時刻を特定
	var nOfsNowTotalMlSec = nNowTotalMlSec - nOfsBaseMlSec;
	// nNowTotalMlSec = ?????, nOfsBaseMlSec = 10000 だった。
	//alert("checkTime_61[" + nNowTotalMlSec.toString()
	//			 + ", " + nOfsBaseMlSec.toString() + "]");

	// その時刻で字幕文字列をフェッチする。
	// vaRet[0] = 1:正常（文字表示）、-1:データ無し
	// vaRet[1] = 正常時、字幕消去時刻（トータルミリ秒）
	// vaRet[2] = 表示文字列
	//alert("checkTime_7");

	var vaRet = vaFetchTtml(nOfsNowTotalMlSec);
	//alert("checkTime_8");

	// データが無い時、
	if (vaRet[0] < 0)
	{
		//alert("checkTime_91");
		if (nClearTotalMlSec > 0
			&& nClearTotalMlSec < nOfsNowTotalMlSec)
		{
		//alert("checkTime_911");
			clearText();
		//alert("checkTime_912");
		}
		//alert("checkTime_913");
	} else if (vaRet[0] > 0)
	{
		//alert("checkTime_92");
		// データが有る時、
		changeText(vaRet[2]);
		nClearTotalMlSec = vaRet[1];
		//alert("checkTime_93 [" + vaRet[2].length.toString());
	}
	//alert("checkTime_A");
	
}

///////////////////////////////////////////////////////////////

function alert(str){
	
	DpText_Alt(str);
}

function DpText_Alt(str){

	var disp = getElementById("display_Alt");
	disp.normalStyle.width  = 600;
	disp.normalStyle.height  = 100;
	disp.normalStyle.left   = 100;
	disp.normalStyle.colorIndex = 3;
	disp.normalStyle.backgroundColorIndex = 20;
	//disp.normalStyle.backgroundColorIndex = 80;
	
	disp.firstChild.data = str + "\r\n" ;
}

function DpText(str){

	var disp = getElementById("display");
	/*
	disp.normalStyle.width  = 600;
	disp.normalStyle.height  = 100;
	disp.normalStyle.left   = 100;
	disp.normalStyle.backgroundColorIndex = 20;
	*/
	//disp.normalStyle.backgroundColorIndex = 80;
	
	disp.firstChild.data = str + "\r\n" ;
}

function alert2(str){

	var disp = getElementById("display");
	disp.firstChild.data = str + "\r\n" ;
}

function sGetDbgTxt(sTxt){
	var sDbg = "";
	nNL=0;
	naChars = new Array(0, 0, 0);

	var i = 0;
	var nLen = sTxt.length;
	var sChar = "";
	
	for(i = 0; i < nLen; i++)
	{
		sChar = sTxt.charAt(i);
		if (sChar == "\n")
		{
			nNL++;
			if (nNL > 2)
				break;
			continue;
		}
		naChars[nNL] += (sChar.charCodeAt(0) < 256) ? 1 : 2;
	}

	sDbg = nNL.toString() + ", " + naChars[0].toString()
	 + ", " + naChars[1].toString() + ", " + naChars[2].toString();
	return sDbg;
}

function changeText(sSubTitle){ 

	var disp = getElementById("display");
	fSize = parseInt(disp.normalStyle.fontSize) / 2;

	var sDbgWk = sGetDbgTxt(sSubTitle);
	
	var nMaxLen = naChars[0];
	if (nMaxLen < naChars[1])
		nMaxLen = naChars[1];
	if (nMaxLen < naChars[2])
		nMaxLen = naChars[2];
	
	var tLen = nMaxLen * fSize;
	
	tLen += 1 * fSize;

	if (nMaxLen < 1)
	{
		//disp.normalStyle.backgroundColorIndex = 8;
	}
	else if (sSubTitle.indexOf("$$CLEAR$$") >= 0)
	{
		clearText();
	}
	else
	{
		browser.lockScreen();
		disp.normalStyle.width  = tLen;
		disp.normalStyle.left   = (960 - tLen) / 2;
		var nHeight = nNL * fSize * 2;
		if (disp.normalStyle.height != nHeight)
			disp.normalStyle.height = nHeight;

		if (disp.normalStyle.backgroundColorIndex != 80)
			disp.normalStyle.backgroundColorIndex = 80;
		//DpText(sDbgWk + ", " + tLen.toString());
		DpText(sSubTitle);
		browser.unlockScreen();
	}
}

function clearText(){ 
	var disp = getElementById("display");
	browser.lockScreen();
	disp.normalStyle.backgroundColorIndex = 8;
	DpText("");
	browser.unlockScreen();
}


function handler(){
	var evt = document.currentEvent;
	var kcode =evt.keyCode;
	
	if (kcode == 19){goback();}
	else if (keycode == 21){reload();}
	else if (keycode == 22){}
	else if (keycode == 23){var disp = getElementById("display"); disp.normalStyle.fontSize=30;}
	else if (keycode == 24){var disp = getElementById("display"); disp.normalStyle.fontSize=36;}
}
function goback(){ browser.launchDocument(sRetPage, "cut");	}
function reload(){ browser.reloadActiveDocument();}

function chgSmall() {var disp = getElementById("display"); disp.normalStyle.fontSize=24;}
function chgMedium(){var disp = getElementById("display"); disp.normalStyle.fontSize=30;}
function chgLarge() {var disp = getElementById("display"); disp.normalStyle.fontSize=36;}

]]></script>

</head>

<body onload="onload();" onunload="onunload();" style="background-color-index:7;">

<!-- 新スタイル -->
<div style="top:0px;left:0px;width:960px;height:540px;visibility:visible;">
<object id="video"
type="application/X-arib-contentPlayControl"
data="http://lime.jgn-x.jp/pcs/resolvecontent?contents_path=/moviebox/snow2013/hd-tts/itu2013.mp4&protocol=<?php echo $proto ?>"
streamstatus="stop" style="top:0px;left:0px;width:960px;height:540px;"
/>
</div>

<!--
data="http://lime.jgn-x.jp/pcs/resolvecontent?contents_path=/moviebox/snow2013/hd-tts/itu2013.mp4&protocol=http_tts"
data="http://hls.okimediaserver.com/pcs/resolvecontent?contents_path=/moviebox/ntt-ev/h264-sd-tts/Docu-white-J_out.mp4&protocol=http_tts"
-->
<!--
		<p id="p01" class="button" style="top:10px;left:790px;color-index:0;background-color-index:1;font-size:24px;width:160px;nav-index:0;nav-up:1;nav-down:1;" accessKey="R" onclick="startCounter();">Start Caption</p>

		<p id="p02" class="button"  style="top:50;left:0;nav-index:1;nav-up:0;nav-down:0" onclick="changeText();">Button2</p>

-->

<p id="display_Alt" style="top:40px;left:130px;padding-left:12px;"><![CDATA[]]></p>
<p id="display" style="top:400px;left:130px;padding-left:12px;"><![CDATA[]]></p>

<p class="button" style="top:1px;left:1px;height:1px;width:1px;color-index:3;font-size:24pt;" accesskey="B" onclick="reload();"></p>

<p class="button" style="top:10px;left:10px;height:36px;width:64px;color-index:1;font-size:24pt;" accesskey="R" onclick="chgSmall();">S</p>

<p class="button" style="top:10px;left:74px;height:36px;width:64px;color-index:2;font-size:24pt;" accesskey="G"  onclick="chgMedium();">M</p>

<p class="button" style="top:10px;left:138px;height:36px;width:64px;color-index:3;font-size:24pt;" accesskey="Y" onclick="chgLarge();">L</p>

<p style="top:0px;left:0px;height:1px;width:1px;background-color-index:8;font-size:24pt;" accesskey="X" onclick="goback();"></p>

</body>
</bml>
