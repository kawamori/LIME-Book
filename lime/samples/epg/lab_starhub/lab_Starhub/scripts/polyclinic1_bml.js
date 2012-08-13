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

// var gFocusa = new Array();
// gFocusa[0] = new Array(2,1);
// gFocusa[1] = new Array(0,2);
// gFocusa[2] = new Array(1,0);

var max =0;
var min =0;
var xyz = 0;

/************************************************************
 Internal functions
 ************************************************************/
function print(str, disp) {
	var obj = document.getElementById( disp);
	obj.firstChild.data = str;
};

/************************************************************
 DOM event functions
 ************************************************************/
function onload(){
	gState.bmltype = 9;
	clockStart();
	lockScreen();
	AutoPolyRefresh();

	hideElem( "loading2");
	getElementById( "QueuePicture1").normalStyle.visibility = "visible";
};

/************************************************************/
function onunload() {}

/************************************************************/
function onkey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	if( code == 18) {
//		getQueue();
	}
	else if( code == 19) {
		if( gIndex == "input") {
			return;
		};
		romSound(7);
		launchTop();
	};
};

/************************************************************/
function retrieveTsv( url, val, encoding) {
	return( browser.transmitTextDataOverIP( url, val, encoding));
};

/************************************************************/
function getQueue() {
	xyz++;

	var val = "";

//	var url = "http://10.24.138.136/lab/cgi/get_poly.pl?poly=GLP&data=TEXT";
	var url = "../cgi/get_poly.pl?poly=GLP&data=TEXT";

//	print( "Refreshing..............", "queue0");
	print( xyz, "queue0");

	var ret = retrieveTsv( url, val, "EUC-JP");

	var readTSV = 0;
	var index = 0;

	var PolyInfo = new Array(
		"No. of Patients in Registration Queue: ",
		"Estimated Waiting Time: ",
		"No. of Patients in Consultation Queue: ",
		"Estimated Waiting Time: ",
		"No. of Patients in Pharmacy Queue: ",
		"Estimated Waiting Time: "
	);

	if( ret[0] == 1) {
		var tmpTSVArray = new Array();
		var storeTSV = new Array();
		tmpTSVArray = ret[2];		// takes the encoding part."EUC-JP"

//		print( tmpTSVArray, "queue1");

		tmpTSVArray = tmpTSVArray.split( "\t");
		tmpTSVArraySize = (tmpTSVArray.length) - 1;

		for( var i = 1; i <= tmpTSVArraySize; i++) {
			print( PolyInfo[ i - 1] + tmpTSVArray[i], "queue" + i);
		};
		print( "Retrieve Image", "queue0");
	}
	else {
		print( "Retrieve error", "queue0");
	};

//	lockScreen();

//	getElementById( "QueuePictureBox").normalStyle.visibility = "visible";

	getElementById( "QueuePictureBox").data =
		"../cgi/get_poly.pl?poly=GLP&amp;data=IMAGE&amp;"
		+ "area=CONSULTATION&amp;time=" + xyz;

//	getElementById( "QueuePictureBox").data =
//		"http://10.24.138.136/lab/cgi/get_poly.pl?poly=GLP&data=IMAGE&"
//		+ "area=CONSULTATION&time=" + xyz;

//	unlockScreen();

//	getElementById( "QueuePictureBox").data = "../cgi/img-consultation.jpg";
};

/************************************************************/
function AutoPolyRefresh() {
	browser.setInterval( "getQueue();", 2000, 0);
};

