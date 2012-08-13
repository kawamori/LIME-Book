/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */

/************************************************************
 Internal functions
 ************************************************************/
function show() {
	lockScreen();
	PlayVideo( gCridInfo[1]);
	WindowShow();
	gIndex = 0;
	setFocus( gIndex);
	gTicker.stop();
	setTicker( "ticker", gCridInfo[6], gCridInfo[7], gCridInfo[8], 71 + 4);
};

/************************************************************/
function WindowShow() {
	getElementById( "basebox").normalStyle.top = "0px";
	getElementById( "playbox").normalStyle.top = "0px";
	getElementById( "menu1box").normalStyle.visibility = "hidden";
	gPlayState = false;

	setText( "title", gCridInfo[0]);
	setImg( "jpg1", gCridInfo[2]);
	setImg( "jpg2", gCridInfo[4]);
	showElem( "playbox");

	var elm = getElementById( "Video");
	elm.normalStyle.left = "44px";
	elm.normalStyle.top = "111px";
	elm.normalStyle.width = "600px";
	elm.normalStyle.height = "337px";

	setFcs( "play");
};

/************************************************************/
function FullShow() {
	fullshowindex = 1;
//	getElementById( "menu1box").normalStyle.visibility = "visible";
	setFcs( "play");

	getElementById( "basebox").normalStyle.top = "-540px";
	getElementById( "playbox").normalStyle.top = "-540px";

	gPlayState = true;

	var elm = getElementById( "Video");
	elm.normalStyle.left = "0px";
	elm.normalStyle.top = "0px";
	elm.normalStyle.width = "960px";
	elm.normalStyle.height = "480px";
};

/************************************************************/
function playkey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if( (0 < code) && (code <= 4)) {
		// Was navigation key press.
		if( fullshowindex == 0) {
			if( gPlayState) {
				return;
			};
			focus( code);
		}
		else if( fullshowindex == 1) {
			focus1( code);
		};
	}
	else if( code == 18) {
		// Was select/enter key press.
		if( fullshowindex == 0) {
			if( gPlayState) {
				return;
			};

			var crid = "";
			if( gIndex == 0) {
				crid = gCridInfo[3];
			}
			else if( gIndex == 1) {
				crid = gCridInfo[5];
			}
			else if( gIndex == 2) {
				crid = gAlertCrid;
			};

			var info = getCrid( crid);
			if( info == null) {
				return;	// •®•È°º
			};
			romSound(7);
			gCridInfo = info;
			gRecomend = true;
			gTicker.stop();
			getElementById( "Video").streamStatus = "stop";
		}
		else if( fullshowindex == 1) {
			if( gIndex == 0) {
				scaledownshow();
			}
			else if( gIndex == 1) {
				PolyShow();
			}
			else if( gIndex == 3) {
				Deviceshow();
			};
		};
	}
	else if( code == 19) {
		// Was data key press.
//		if( gPlayState) {
//			return;
//		};
		romSound(7);
		VideoStop();
		returnLaunch();
	}
	else if( code == 21) {
		// Was blue button key press.
		romSound(7);
		if( gPlayState) {
			WindowShow();
		}
		else {
			FullShow();
		};
	}
	else if( code == 22) {
		if( gPlayState) {
			return;
		};
		alert();
	}
	else if( code == 23) {
		getElementById( "menu1box").normalStyle.visibility = "visible";
	}
	else if( code == 24) {
		getElementById( "menu1box").normalStyle.visibility = "hidden";
	};

	unlockScreen();
};

/************************************************************/
function returnLaunch() {
	if( gState.retrunBmltype == 2) {
		gState.launchDocument( "newsvod.bml");
	}
	else if( gState.retrunBmltype == 3) {
		gState.launchDocument( "hotnews.bml");
	}
	else if( gState.retrunBmltype == 4) {
		gState.launchDocument( "hotnews.bml");
	}
	else {
		gState.launchDocument( "startup.bml");
	};
};

/************************************************************/
function PlayVideo( URL) {
	if( !URL) {
		return;
	};

	URL = String( URL);
/*
	var ps = URL.indexOf( "&drmid=$drmid$");
	if( ps > 0) {
		URL = URL.substring( 0, ps) + URL.substring( ps + 14);
	};
	var drmId = getDRMID( "marlin_iptv_es");
	if( (drmId != null) && (String( drmId) != "NaN")) {
		URL += ( "&drmid=" +
				 String( (drmId.indexOf( "0x") == 0)
							? drmId.substring( 2) : drmId).toLowerCase() );
	};
*/
	var elm = getElementById( "Video");
	elm.data = URL;
	showElem( "Video");
	elm.streamStatus = "play";
	showElem( "ts");
	getElementById( "MediaStopped").subscribe = true;
};

/************************************************************/
function VideoStop() {
	if( gRecomend) {
		getElementById( "MediaStopped").subscribe = false;
		show();
		gRecomend = false;
		unlockScreen();
	}
	else {
		getElementById( "Video").streamStatus = "stop";
		getElementById( "MediaStopped").subscribe = false;
		hideElem( "Video");
		returnLaunch();
	};
};

/************************************************************/
function alert() {
	gAlert = (gAlert) ? false : true;

	if( gAlert) {
		if( gIndex == 2) {
			setImg( "playImg", "../images/bt_surveillance_f_b.png");
			hideElem( "alert");
		}
		else {
			showElem( "alert");
		};
		setImg( "alert", "../images/bt_surveillance_b.png");
		romSound(2);
		gAlertCheng = false;
		gAlertTimer = browser.setInterval( "alertInterval();", 800, 1);
	}
	else {
		if( gIndex == 2) {
			setImg( "playImg", "../images/bt_surveillance_f_a.png");
		};
		hideElem( "alert");
//		setImg( "alert", "../images/bt_surveillance_a.png");
	};
};

/************************************************************/
// alert≈¿Ã«ΩËÕ˝
var gAlertTimer = NaN;
var gAlertCheng = true;

/************************************************************/
function alertInterval() {
	if( !isNaN( gAlertTimer)) {
		browser.clearTimer( gAlertTimer);
		gAlertTimer = NaN;
	};
	if( !gAlert) {
		return;
	};

	if( gAlertCheng) {
		if( gIndex == 2) {
			setImg( "playImg", "../images/bt_surveillance_f_b.png");
			hideElem( "alert");
		}
		else {
			showElem( "alert");
		};
		setImg( "alert", "../images/bt_surveillance_b.png");
	}
	else {
		if( gIndex == 2) {
			setImg( "playImg", "../images/bt_surveillance_f_a.png");
		};
		hideElem( "alert");
//		setImg( "alert", "../images/bt_surveillance_a.png");
	};

	gAlertCheng = (gAlertCheng == true) ? false : true;
	gAlertTimer = browser.setInterval( "alertInterval();", 800, 1);
};

/************************************************************/
function focus( code) {
	var idx = gFocus[ gIndex][ code - 1];
	if( idx == -1) {
		return;
	};
	romSound(9);
	setFocus( idx);
	gIndex = idx;
};

/************************************************************/
function setFocus( id) {
	if( id == 2) {
		if( gAlert) {
			if( gAlertCheng) {
				setImg( "playImg", "../images/bt_surveillance_f_b.png");
			}
			else {
				setImg( "playImg", "../images/bt_surveillance_f_a.png");
			};
		}
		else {
			setImg( "playImg", "../images/bt_surveillance_f_a.png");
		}
		hideElem( "alert");
		setPos( "playImg", 668, 422, 253, 46);
	}
	else {
		var Y = new Array( 164, 288);
		setImg( "playImg", "../images/bt_play_f.png");
		setPos( "playImg", 668, Y[id], 253, 115);
	};
};

/************************************************************/
function focus1( code) {
	var idx = gFocus1[ gIndex][ code - 1];
	if( idx == -1) {
		return;
	};
	romSound(9);
	setFocus1( idx);
	gIndex = idx;
};

/************************************************************/
function setFocus1( id) {
	var img = new Array( "button1.jpg",
						 "button2.jpg",
						 "button3.jpg",
						 "button4.jpg");

	var X = new Array( 180, 352, 524, 686);
	var Y = new Array( 426, 426, 426, 426);
	var W = 200;
	var H = 154;
	setPos( "innermenu1", X[id], Y[id], W, H);
	setImg( "innermenu1", "../images/" + img[id]);
};

/************************************************************/
function scaledownshow() {
	getElementById( "basebox").normalStyle.top = "-540px";
	getElementById( "playbox").normalStyle.top = "-540px";
	getElementById( "menu1box").normalStyle.visibility = "hidden";
	getElementById( "meterlistbox").normalStyle.visibility = "visible";

	gPlayState = false;
	var elm = getElementById( "Video");

//	elm.normalStyle.left = "480px";
//	elm.normalStyle.top = "100px";
//	elm.normalStyle.width = "480px";
//	elm.normalStyle.height = "490px";	// might need
	elm.normalStyle.left = "0px";
	elm.normalStyle.top = "0px";
	elm.normalStyle.width = "960px";
	elm.normalStyle.height = "540px";	// might need

//	setFcs( "play");
	setFcs( "list");

	var X = 80;
	var Y = new Array(
		  0,  30,  60,  90,
		120, 150, 180, 210,
		240, 270, 300, 330,
		360, 390, 420, 450,
		480, 510
	);
	var W = 474;
	var H = 30;
	var Textinfo = new Array(
		"L_ZONE", "E_ZONE", "K_ZONE", "B_ZONE",
		"C_ZONE", "M_ZONE", "T_ZONE", "X1_ZONE",
		"X2_ZONE", "TOTAL", "MainValve", "DishWasher",
		"Kitchen-Fridge", "WashingMachine", "FishTank", "ToiletFlush",
		"BasinHandwash", "ShowerArea"
	);

	for( var i = 0; i < 18; i++) {
		setPos( "Textinfo" + i, X, Y[i], W, H);
		setText( "Textinfo" + i, Textinfo[i]);
	};
};

/************************************************************/
function listkey1() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if( (0 < code) && (code <= 4)) {
		// Was navigation key press.
		listFocus( code, idx);
	}
	else if( code == 18) {
		// Was select/enter key press.
		getElementById( "meterlistbox").normalStyle.visibility = "hidden";
//		AutoRefresh();
		metering();
	}
	else if( code == 19) {
		// Was data key press.
		romSound(7);
		returnLaunch();
	};

	unlockScreen();
};

/************************************************************/
function listFocus( code, idx) {
	idx = gFocus2[ gIndex][ code - 1];
	if( idx == -1) {
		return;
	};
	romSound(9);
	setlistFocus( idx);
	gIndex = idx;
};

/************************************************************/
function setlistFocus( id) {
	var X1 = 50;
	var X = 80;
	var Y = new Array(
		  0,  30,  60,  90,
		120, 150, 180, 210,
		240, 270, 300, 330,
		360, 390, 420, 450,
		480, 510, 540
	);
	var W = 474;
	var H = 30;

	setPos( "BtnFocus", X1, Y[id], W, H);

	var Textinfo = new Array(
		"L_ZONE", "E_ZONE", "K_ZONE", "B_ZONE",
		"C_ZONE", "M_ZONE", "T_ZONE", "X1_ZONE",
		"X2_ZONE", "TOTAL", "MainValve", "DishWasher",
		"Kitchen-Fridge", "WashingMachine", "FishTank", "ToiletFlush",
		"BasinHandwash", "ShowerArea"
	);

	setPos( "TextinfoA", X, Y[id], W, H);
	setText( "TextinfoA", Textinfo[id]);
};

/************************************************************/
function Deviceshow() {
	getElementById( "basebox").normalStyle.top = "-540px";
	getElementById( "playbox").normalStyle.top = "-540px";
	getElementById( "menu1box").normalStyle.visibility = "hidden";
	getElementById( "devicelistbox").normalStyle.visibility = "visible";
	//---------->change

	gPlayState = false;

	var elm = getElementById( "Video");
	elm.normalStyle.left = "0px";
	elm.normalStyle.top = "0px";
	elm.normalStyle.width = "960px";
	elm.normalStyle.height = "540px";	// might need

	setFcs( "listdevices");
	var X = 80;
	var Y = new Array(
		 20,  50,  80, 110,
		140, 170, 200, 230,
		260, 290, 320, 350,
		380
	);
	var W = 474;
	var H = 30;
	var Textinfo = new Array(
		"M_ZONE_ELECTRONIC_GLASS", "M_ZONE_LED_CIR",
		"M_ZONE_LED_CIR_B", "M_ZONE_LED_CIR_G",
		"M_ZONE_LED_CIR_GB", "M_ZONE_LED_CIR_R",
		"M_ZONE_LED_CIR_RB", "M_ZONE_LED_CIR_RG",
		"M_ZONE_LED_CIR_RGB", "M_ZONE_LED_CURVE",
		"M_ZONE_PLC", "M_ZONE_POWER_METER",
		"M_ZONE_SHUTTER"
	);

	for( var i = 0; i <= 12; i++) {
		setPos( "TextinfoB" + i, X, Y[i], W, H);
		setText( "TextinfoB" + i, Textinfo[i]);
	};
};

/************************************************************/
function listkey2() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if( (0 < code) && (code <= 4)) {
		listFocus1( code, idx);
	}
	else if( code == 18) {	// ∑Ë√‡E
		getElementById( "devicelistbox").normalStyle.visibility = "hidden";
		getData();
		getData1();
	}
	else if( code == 19 ) {	// Ã·£‡E
		romSound(7);
		returnLaunch();
	};

	unlockScreen();
};

/************************************************************/
function listFocus1( code, idx) {
	idx = gFocus4[ gIndex][ code - 1];
	if( idx == -1) {
		return;
	};
	romSound(9);
	setlistFocus1( idx);
	gIndex = idx;
};

/************************************************************/
function setlistFocus1( id) {
	var X1 = 50;
	var X = 80;
	var Y = new Array(
		 20,  50,  80, 110,
		140, 170, 200, 230,
		260, 290, 320, 350,
		380
	);
	var W = 474;
	var H = 30;

	setPos( "BtnFocus1", X1, Y[id], W, H);
	var Textinfo = new Array(
		"M_ZONE_ELECTRONIC_GLASS", "M_ZONE_LED_CIR",
		"M_ZONE_LED_CIR_B", "M_ZONE_LED_CIR_G",
		"M_ZONE_LED_CIR_GB", "M_ZONE_LED_CIR_R",
		"M_ZONE_LED_CIR_RB", "M_ZONE_LED_CIR_RG",
		"M_ZONE_LED_CIR_RGB", "M_ZONE_LED_CURVE",
		"M_ZONE_PLC", "M_ZONE_POWER_METER",
		"M_ZONE_SHUTTER"
	);

	setPos( "TextinfoBA", X, Y[id], W, H);
	setText( "TextinfoBA", Textinfo[id]);
};

/************************************************************/
function PolyShow() {
	getElementById( "basebox").normalStyle.top = "-540px";
	getElementById( "playbox").normalStyle.top = "-540px";
	getElementById( "menu1box").normalStyle.visibility = "hidden";
	getElementById( "Polylistbox").normalStyle.visibility = "visible";
	//---------->change

	gPlayState = false;

	var elm = getElementById( "Video");
	elm.normalStyle.left = "0px";
	elm.normalStyle.top = "0px";
	elm.normalStyle.width = "960px";
	elm.normalStyle.height = "540px"; //might need

	setFcs( "listPoly");

	var X = 80;
	var Y = new Array(
		 80, 110, 140, 170,
		200, 230, 260, 290,
		320
	);
	var W = 474;
	var H = 30;
	var Textinfo = new Array(
		"Bedok_PolyClinic", "Bukit_Merah_PolyClinic",
		"Geylang_PolyClinic", "Marine_Parade_PolyClinic",
		"Outram_PolyClinic", "Queenstown_PolyClinic",
		"Pasir_Ris_PolyClinic", "SengKang_PolyClinic",
		"Tampines_PolyClinic"
	);

	for( var i = 0; i <= 8; i++) {
		setPos( "TextinfoP" + i, X, Y[i], W, H);
		setText( "TextinfoP" + i, Textinfo[i]);
	};
};

/************************************************************/
function Polykey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if( 0 < code && code <= 4) {
		listPolyFocus( code, idx);
	}
	else if( code == 18) { // ∑Ë√‡E
		getElementById( "Polylistbox").normalStyle.visibility = "hidden";
		getElementById( "QueuePicture1").normalStyle.visibility = "visible";
		setFcs( "PolyKey");
		AutoPolyRefresh();
	}
	else if( code == 19) { // Ã·£‡E
		romSound(7);
		returnLaunch();
	};

	unlockScreen();
};

/************************************************************/
function listPolyFocus( code, idx) {
	idx = gFocus5[ gIndex][ code - 1];
	if( idx == -1) {
		return;
	};
	romSound(9);
	setlistPolyFocus( idx);
	gIndex = idx;
};

/************************************************************/
function setlistPolyFocus( id) {
	var X1 = 50;
	var X = 80;
	var Y = new Array(
		 80, 110, 140, 170,
		200, 230, 260, 290,
		320
	);
	var W = 474;
	var H = 30;

	setPos( "PolyFocus1", X1, Y[id], W, H);

	var Textinfo = new Array(
		"Bedok_PolyClinic", "Bukit_Merah_PolyClinic",
		"Geylang_PolyClinic", "Marine_Parade_PolyClinic",
		"Outram_PolyClinic", "Queenstown_PolyClinic",
		"Pasir_Ris_PolyClinic", "SengKang_PolyClinic",
		"Tampines_PolyClinic"
	);

	setPos( "TextinfoPA", X, Y[id], W, H);
	setText( "TextinfoPA", Textinfo[id]);
};

/************************************************************/
// d•‹•ø•ÅE
function dataButtonPressed() {
//	if( gPlayState) {
//		return;
//	};
	if( gFOff) {
		return;
	};
	romSound(7);
	gState.retrunBmltype = 0;
	VideoStop();
	returnLaunch();
//	launchTop();
};

/************************************************************/
// •∆•£•√•´°ºΩËÕ˝
// Ticker data
function TickerData() {
	this.timerId = NaN;

	this.targetid = "";
	this.text = new Array();	// •¢•À•·°º•∑•Á•Û§µ§ª£‡E∏ª˙ŒÛ«€Œ°¶
	this.textIdx = 0;

	this.time = 100;
	this.move = 10;

	this.buffer = "";
	this.byteCnt = 0;
	this.gap = 0;
	this.riv = 0;

	this.font_size = NaN;
	this.width = NaN;
	this.left = NaN;

	this.start = Ticker_start;
	this.stop = Ticker_stop;
	this.getTextCountEx = Ticker_getTextCountEx;
};

/************************************************************/
function setTicker( targetid, itime, move, text, byteCnt) {
	gTicker.targetid = targetid;
	gTicker.time = itime;
	gTicker.move = move;
	gTicker.text = text;
	gTicker.byteCnt = byteCnt;
	gTicker.start();

	for( var i = 0; i < byteCnt; i++) {
		gTicker.buffer += " ";
	};
};

/************************************************************/
function Ticker_start() {
	if( !isNaN( this.timerId)) {
		browser.clearTimer( this.timerId);
		this.timerId = NaN;
	};
	if( this.text.length <= 0) {
		return( false);
	};
	this.textIdx = 0;
	this.timerId = browser.setInterval( "TickerInit();", this.time, 1);
	return( true);
};

/************************************************************/
function Ticker_stop() {
	if( !isNaN( this.timerId)) {
		browser.clearTimer( this.timerId);
		this.timerId = NaN;
	};
	if( !isVis( this.targetid)) {
		return;
	};
	setText( this.targetid, "");
	if( !isNaN( Number( this.left))) {
		getElementById( this.targetid).normalStyle
									  .left = Number( this.left) + "px";
	};
	if( !isNaN( Number( this.width))) {
		getElementById( this.targetid).normalStyle
									  .width = Number( this.width) + "px";
	};
	this.timerId = NaN;
	this.targetid = "";
	this.text = new Array();	// •¢•À•·°º•∑•Á•Û§µ§ª£‡E∏ª˙ŒÛ«€Œ°¶
	this.textIdx = 0;
	this.time = 100;
	this.move = 10;
	this.buffer = "";
	this.byteCnt = 0;
	this.gap = 0;
	this.riv = 0;
	this.font_size = NaN;
	this.width = NaN;
	this.left = NaN;
};

/************************************************************/
function TickerInit() {
	var obj = gTicker;

	if( !obj) {
		return;
	};
	if( !isNaN( obj.timerId)) {
		browser.clearTimer( obj.timerId);
		obj.timerId = NaN;
	};

	if( isNaN( obj.width)) {
		obj.width =
			String( getElementById( obj.targetid).normalStyle.width)
				.substring( 0, String( getElementById( obj.targetid)
										.normalStyle.width).length - 2);
	};
	if( isNaN( obj.left)) {
		obj.left =
			String( getElementById( obj.targetid).normalStyle.left)
				.substring( 0, String( getElementById( obj.targetid)
										.normalStyle.left).length - 2);
	};
	if( isNaN( obj.font_size)) {
		obj.font_size =
			String( getElementById( obj.targetid).normalStyle.fontSize)
				.substring( 0, String( getElementById( obj.targetid)
										.normalStyle.fontSize).length - 2);
	};

	lockScreen();

	if( isNaN( obj.width) || isNaN( obj.font_size)) {
		return;
	}
	else {
		getElementById( obj.targetid).normalStyle.width =
			(Number( obj.width) + Number( obj.font_size * 2)) + "px";
	};

	for( var i = 0; obj.buffer.length < gTicker.byteCnt; i++) {
		obj.buffer += obj.text[ obj.textIdx];
		obj.textIdx++;
		if( obj.textIdx >= obj.text.length) {
			obj.textIdx = 0;
		};
	};

	setText( obj.targetid, obj.buffer);
	Ticker();
};

/************************************************************/
function Ticker() {
	var obj = gTicker;
	if( !obj) {
		return;
	};

	if( !isNaN( obj.timerId)) {
		browser.clearTimer( obj.timerId);
		obj.timerId = NaN;
	};

	if( isVis( obj.targetid)) {
		var char_length = 0;
		var charSize = obj.font_size;
		lockScreen();
		obj.gap += obj.move;

		if( obj.gap >= charSize / 2) {
			var flg = false;
			for( var i = 0; i < obj.buffer.length; i++) {
				var gap = 0;
				if( obj.buffer.charCodeAt(0) < 0xFF) {
					gap = charSize / 2;
				}
				else {
					gap = charSize;
				};
				if( obj.gap <= gap) {
					break;
				};
				obj.gap -= gap;
				obj.buffer = obj.buffer.substring(1);
				flg = true;
			};
			if( flg) {
				setText( obj.targetid, obj.buffer);
			};
		};

		var tc = obj.getTextCountEx( obj.buffer, obj.byteCnt);

		getElementById( obj.targetid).normalStyle.left =
			(obj.left - obj.gap - obj.riv) + "px";

		if( (tc - 4) * obj.font_size / 2 <= obj.width) {
			obj.timerId = browser.setInterval( "TickerInit();", obj.time, 1);
		}
		else {
			obj.timerId = browser.setInterval( "Ticker();", obj.time, 1);
		};
	};
};

/************************************************************/
function Ticker_getTextCountEx( txt, byteCont) {
	var c = 0, bt = 0;
	this.riv = this.font_size / 4;

	for( var i = 0; i < txt.length; i++) {
		c = txt.charCodeAt( i);
		bt += (c < 256 ? 1 : 2);
		if( (byteCont + 4) == bt) {
			this.riv = 0;
		};
	};
	return( bt);
};

/************************************************************/
function getTextCount( txt) {
	var c = 0, bt = 0;

	for( var i = 0; i < txt.length; i++) {
		c = txt.charCodeAt( i);
		bt += (c < 256 ? 1 : 2);
	};
	return( bt);
};

