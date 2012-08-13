/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gBtnType = 1; // 0:10 E1:5 E
var gIndex2 = 0;
var gAlert = false;
var gIndex = 0;

var cnt = new Number();
cnt = 0;

var temp = new Array();
temp = new Array( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9);

var gFocusa = new Array();
gFocusa[0] = new Array( -1, -1);

var max = 0;
var min = 0;
var StoreValue = "true";

/************************************************************
 Internal functions
 ************************************************************/
function print( str, disp) {
	var obj = document.getElementById( disp);
	obj.firstChild.data = str;
};

/************************************************************
 DOM event functions
 ************************************************************/
function onload() {
	gState.bmltype = 12;
	clockStart();
	lockScreen();

	getData();
	getData1();
	hideElem( "loading2");
};

/************************************************************/
function onunload() {}

/************************************************************/
function onkey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

//	if( (0 < code) && (code <= 4)) {
//		focus( code);
//	} else
	if( code == 18) {
		getData2();
	}
	else if( code == 19) {	// ╠сды
		if( gIndex == "input") {
			return;
		};
		romSound(7);
		launchTop();
	};
};

/************************************************************
 Internal functions
 ************************************************************/
function retrieveTsv( url, val, encoding) {
	return( browser.transmitTextDataOverIP( url, val, encoding));
};

/************************************************************/
function getData() {
	var val = "";	// text to sent

//	var url = "http://10.24.138.136/lab/cgi/smart_meter.pl?"
//				+ "type=control&device=M_ZONE_PLC&action=lightOn";
	var url = "../cgi/smart_meter.pl?"
				+ "type=control&device=M_ZONE_PLC&action=lightOff";
	/*
	 * where:
	 * DDDDD = L_ZONE, M_ZONE, X_ZONE_PLC_CENTER, etc.
	 * AAAAA = lightOn, lightOff, isLightOn, listDevices
	 */

//	print( "calling retrieveTsv() to retrieve the corresponding tsv from "
//			+ url, "tsv");

	var ret = retrieveTsv( url, val, "EUC-JP");
	var readTSV = 0;
	var index = 0;
};

/************************************************************/
function getData1() {
	var val = "";	// text to sent

//	var url = "http://10.24.138.136/lab/cgi/smart_meter.pl?"
//				+ "type=control&device=M_ZONE_PLC&action=isLightOn";
	var url = "../cgi/smart_meter.pl?"
				+ "type=control&device=M_ZONE_PLC&action=isLightOn";
	/*
	 * where:
	 * DDDDD = L_ZONE, M_ZONE, X_ZONE_PLC_CENTER, etc.
	 * AAAAA = lightOn, lightOff, isLightOn, listDevices
	 */

//	print( "calling retrieveTsv() to retrieve the corresponding tsv from "
//			+ url1, "tsv");

	var ret = browser.transmitTextDataOverIP( url, val, "EUC-JP");
	var readTSV = 0;
	var index = 0;

	if( ret[0] == 1) {
		var tmpTSVArray = new Array();
		var readTSV = new Array();
		var storeTSV = new Array();
		tmpTSVArray = ret[2];		//takes the encoding part."EUC-JP"
//		print( tmpTSVArray, "tsv");

		storeTSV = tmpTSVArray.split( ":");
		readTSV = storeTSV[2].split( "[EOL]");

		print( "Is the Light On:" + readTSV[0], "tsv");
		getElementById( "LightOn").normalStyle.visibility = "visible";
//		getElementById( "graphbox").normalStyle.visibility = "visible";
//		print( readTSV[0], "tsv");

		if( readTSV[0] == "false") {
			setText( "textButton", "true");
			StoreValue = "lightOn";
//			print( StoreValue, "tsv");
		}
		else if( readTSV[0] == "true") {
//			print( "Is the Light On:" + readTSV[0], "tsv");
			setText( "textButton", "false");
			StoreValue = "lightOff";
//			print( StoreValue, "tsv");
		};
	}
	else {
		print( "Retrieve error", "tsv");
	};
};

/************************************************************/
function getData2() {
	var val = "";	// text to sent
//	print( StoreValue, "tsv");

//	var url = "http://10.24.138.136/lab/cgi/smart_meter.pl?"
//				+ "type=control&device=M_ZONE_PLC&action=" + StoreValue;
//	print( url, "tsv");

	var url = "../cgi/smart_meter.pl?"
				+ "type=control&device=M_ZONE_PLC&action=" + StoreValue;
	/*
	 * where:
	 * DDDDD = L_ZONE, M_ZONE, X_ZONE_PLC_CENTER, etc.
	 * AAAAA = lightOn, lightOff, isLightOn, listDevices
	 */

//	print( "calling retrieveTsv() to retrieve the corresponding tsv from "
//			+ url, "tsv");

	var ret = retrieveTsv( url, val, "EUC-JP");

	var readTSV = 0;
	var index = 0;
	getData1();
};

