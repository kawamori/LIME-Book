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

var cnt = new Number();
cnt = 0;

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
	getData();
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
	else if( code == 19) {
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
	var val = "";
	var url = "../cgi/get_tsv_rt.pl?type=sine";
//	var url = "http://10.24.138.136/lab/cgi/get_tsv.pl";
//	var url = "http://10.24.138.136/lab/tsv/list1.tsv";
//	var url = "../tsv/list2.tsv";

	print( "calling retrieveTsv() to retrieve the corresponding tsv from "
			+ url, "tsv");

	var ret = retrieveTsv( url, val, "EUC-JP");
	var readTSV = 0;
	var index = 0;

//	print( ret[0], "tsv");

	if( ret[0] == 1) {
		var tmpTSVArray = new Array();
		var storeTSV = new Array();
		tmpTSVArray = ret[2];		// takes the encoding part."EUC-JP"

		if( tmpTSVArray == "") {
			clearRefreshTimer();
		};

		tmpTSVArray = tmpTSVArray.split( "\n");

		var tmpTSVArraySize = (tmpTSVArray.length) - 2;
//		print( tmpTSVArraySize, "tsv");

		if( tmpTSVArraySize < 0) {
			clearRefreshTimer();
		};

		for( var i = 0; i <= tmpTSVArraySize; i++) {
			storeTSV[i] = tmpTSVArray[i].split( "\t");
		};
//		print( storeTSV, "tsv");

		var intReadTsv = new Array();

		for( var i = tmpTSVArraySize; i >= 0; i--) {
			readTSV = storeTSV[i][8];
			readTSV = readTSV.split( ".");
			tmpreadTSV = readTSV.join( "");
			intReadTsv[i] = parseInt( tmpreadTSV);	// ($66.8000)-->($668000)
		};
		print( intReadTsv, "tsv");

		maxFunction( intReadTsv, max, tmpTSVArraySize);
		// write image file here.
	}
	else {
		print( "Retrieve error", "tsv");
	};
};

/************************************************************/
function maxFunction( intReadTsv, max, tmpTSVArraySize) {
	max = intReadTsv[0];

	for( var i = 1; i <= tmpTSVArraySize; i++) {
		if( intReadTsv[i] > max) {
			max = intReadTsv[i];
		};
	};
//	print( max, "tsv");

	minFunction( intReadTsv, max, min, tmpTSVArraySize);
};

/************************************************************/
function minFunction( intReadTsv, max, min, tmpTSVArraySize) {
	min = intReadTsv[0];

	for( var i = 1; i <= tmpTSVArraySize; i++) {
		if( intReadTsv[i] < min) {
			min = intReadTsv[i];
		};
	};

	calFunction( intReadTsv, max, min, tmpTSVArraySize);
};

/************************************************************/
function calFunction( intReadTsv, max, min, tmpTSVArraySize) {
	var diffMaxMin = max - min;
	diffMaxMin = diffMaxMin / 20;	// 38 (700/7px)

//	print( diffMaxMin, "tsv");
//	for( i = 0; i <= 4; i++) {
//		intReadTsv[i] = intReadTsv[i] + max;
//		intReadTsv[i] = intReadTsv[i] / max;
//	};

	var recordY = new Array();
	var m = 0;

	// interval set. Not use at the moment
	for( var i = 20; i >= 1; i--) {
		recordY[i] = max - (diffMaxMin * m);
		m++;
	};
	recordY[0] = min;
	callGraph( recordY, intReadTsv, tmpTSVArraySize);
//	print( max, "tsv");
};

/************************************************************/
function callGraph( recordY, intReadTsv, tmpTSVArraySize) {
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

	var pt = 0;
	var m = 0;

//	print( minDiff, "tsv");

	for( var n = 0; n <= tmpTSVArraySize; n++) {
		var minDiff = recordY[0] - intReadTsv[n];	// recordY[0]
		minDiff = abs( minDiff);

		for( i = 0; i <= 20; i++) {
			var checkDiff = recordY[i] - intReadTsv[n];
			checkDiff = abs( checkDiff);

			if( checkDiff <= minDiff) {
				minDiff = checkDiff;
				selectGraph[n] = i;
			};
		};
	};

	// The following for loop can be modified to display all the intervals.

	getElementById( "text0").normalStyle.left = xPos;
	getElementById( "text20").normalStyle.left = xPos;
	setText( "text0", recordY[ 0]);

	getElementById( "text0").normalStyle.top = yPos[ 0];
	getElementById( "text20").normalStyle.top = yPos[ 20];
	setText( "text20", recordY[ 20]);
/*
	for( i = 0; i < selectGraph.length; i++) {
		getElementById( "text" + i).normalStyle.left = xPos;
		getElementById( "text" + i).normalStyle.top = yPos[ selectGraph[ i]];
		setText( "text" + i, recordY[i]);
//		lockscreen();
	};
*/
	var X = new Array(
		 95,  99, 103, 107, 111,
		115, 119, 123, 127, 131,
		135, 139, 143, 147, 151,
		155, 159, 163, 167, 171,
		175
	);

	for( i = 0; i <= tmpTSVArraySize; i++) {
		getElementById( "graph" + i).data =
			"../images/graph/ybar" + selectGraph[i] + ".jpg";

		getElementById( "graph" + i).normalStyle.left = X[i];
		showElem( "graph" + i);
	};
};

/************************************************************/
function AutoRefresh() {
	Timer1 = browser.setInterval( "getData();", 1500, 0);
};

/************************************************************/
function clearRefreshTimer() {
	browser.clearTimer( Timer1);
//	getElementById( "text0").normalStyle.left = xPos;
////	getElementById( "text20").normalStyle.left = xPos;
//	setText( "text0", "");

//	getElementById( "text0").normalStyle.top = yPos[ 0];
//	getElementById( "text20").normalStyle.top = yPos[ 20];
//	setText( "text20", max);
	gState.launchDocument( "startup.bml");
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

