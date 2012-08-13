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
// gFocusa[0] = new Array( 2, 1);
// gFocusa[1] = new Array( 0, 2);
// gFocusa[2] = new Array( 1, 0);

var max = 0;
var min = 0;

/************************************************************/
function print( str, disp) {
	var obj = document.getElementById( disp);
	obj.firstChild.data = str;
};

/************************************************************
 DOM event functions
 ************************************************************/
function onload() {
	gState.bmltype = 9;
	clockStart();
	lockScreen();
	AutoRefresh();
	hideElem( "loading2");
};

/************************************************************/
function onunload() {}

/************************************************************/
function onkey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	if( code == 18) {
		getData();
	}
	else if( code == 19) { // ╠сды
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
function getData(){
	var val = "";
//	var url = "tsv/list1.tsv";
//	var url = "tsv/list4.tsv";
//	var url = "http://10.24.138.136/lab/bml/tsv/list1.tsv";
	var url = "http://10.24.138.136/lab/bml/cgi/qwatch_data.txt";
//	var url = "http://10.24.138.136/lab_beta/cgi/smart_meter.pl?"
//				+ "type=power&scale=daily&file=elect_daily.xml";

	print( "calling retrieveTsv() to retrieve the corresponding tsv from "
			+ url, "tsv");

	var ret = retrieveTsv( url, val, "EUC-JP");

	var readTSV = 0;
	var index = 0;

	if( ret[0] == 1) {
		var tmpTSVArray = new Array();
		var storeTSV = new Array();
		tmpTSVArray = ret[2];		// takes the encoding part."EUC-JP"

		tmpTSVArray = tmpTSVArray.split( "\r\n");

		for( var i = 0; i <= 5; i++) {
			storeTSV[i] = tmpTSVArray[i].split( "\t");
		};

		var intReadTsv = new Array();

		for( var i = 5; i >= 0; i--) {
			readTSV = storeTSV[i][1];
			readTSV = readTSV.split( ".");
			tmpreadTSV = readTSV.join( "");
			intReadTsv[i] = Number( tmpreadTSV);	// ($66.8000)-->($668000)
		};
		maxFunction( intReadTsv, max);
//		print( intReadTsv, "tsv");
		// write image file here.
	}
	else {
		print( "Retrieve error", "tsv");
	};
};

/************************************************************/
function maxFunction( intReadTsv, max) {
	max = intReadTsv[0];

	for( var i = 1; i <= 5; i++) {
		if( intReadTsv[i] > max) {
			max = intReadTsv[i];
		};
	};
//	print( max, "tsv");
	minFunction( intReadTsv, max, min);
};

/************************************************************/
function minFunction( intReadTsv, max, min) {
	min = intReadTsv[0];

	for( var i = 1; i <= 5; i++) {
		if( intReadTsv[i] < min) {
			min = intReadTsv[i];
		};
	};

	calFunction( intReadTsv, max, min);
};

/************************************************************/
function calFunction( intReadTsv, max, min) {
	var diffMaxMin = max - min;
	diffMaxMin = diffMaxMin / 20;	// 38 (700/7px)
//	print( diffMaxMin, "tsv");

	var recordY = new Array();
	var m = 0;

	// interval set. Not use at the moment
	for( var i = 20; i >= 1; i--) {
		recordY[i] = max - (diffMaxMin * m);
		m++;
	};
	recordY[0] = min;
	callGraph( recordY, intReadTsv);
//	print( recordY, "tsv");
};

/************************************************************/
function callGraph( recordY, intReadTsv) {
	var xPos = 15;
	var yPos = new Array();
	var m = 0;

	for( i = 20; i >= 0; i--) {
		yPos[m] = 285 + (3 * i) + (90 - (m * 10));
		m++;
	};

	getElementById( "graphbox").normalStyle.visibility = "visible";

//	print( yPos, "tsv");

	var selectGraph = new Array();
	selectGraph[0] = 0;
//
	var pt = 0;
	var m = 0;

//	print( minDiff, "tsv");

	for( var n = 0; n <= 5; n++) {
		var minDiff = recordY[0] - intReadTsv[n];	// recordY[0]
		minDiff = abs( minDiff);

		for( i = 0; i <= 20; i++) {
			var checkDiff = recordY[i] - intReadTsv[n];
			checkDiff = abs( checkDiff);

			if( checkDiff <= minDiff) {
				minDiff = checkDiff + 1;
				selectGraph[n] = i;
			};
		};
	};
	print( yPos, "tsv");

	// The following for loop can be modified to display all the intervals.

	getElementById( "text0").normalStyle.left = xPos;
	getElementById( "text20").normalStyle.left = xPos;
	setText( "text0", recordY[ 0]);

	getElementById( "text0").normalStyle.top = yPos[ 0];
	getElementById( "text20").normalStyle.top = yPos[ 20];
	setText( "text20", recordY[ 20]);
/*
	for( i = 0; i < yPos.length; i++) {
		getElementById( "text" + i).normalStyle.left = xPos;
//		getElementById( "text" + i).normalStyle.top = yPos[ selectGraph[ i]];
		getElementById( "text" + i).normalStyle.top = yPos[ i];
		setText( "text" + i, recordY[i]);
//		lockscreen();
	};
*/
	var X = new Array(
		 90,  94,  98, 102, 106,
		110, 114, 118, 122, 126,
		130, 134, 138, 142, 146,
		150, 154, 158, 162, 166,
		170
	);

	for( i = 0; i <= 5; i++) {
		getElementById( "graph" + i).data =
			"../images/graph" + selectGraph[i] + ".jpg";

		getElementById( "graph" + i).normalStyle.left = X[i];
		showElem( "graph" + i);
	};
//	print( selectGraph, "tsv");
//	AutoRefresh();
};

/************************************************************/
function AutoRefresh() {
	browser.setInterval( "getData();", 500, 3);
};

/************************************************************/
function abs( a) {
	if( a < 0) {
		v = a * -1;
	}
	else {
		v = a;
	};

	return( v);
};

