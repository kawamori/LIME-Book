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
temp = new Array (0,1,2,3,4,5,6,7,8,9);

// var gFocusa = new Array();
// gFocusa[0] = new Array(2,1);
// gFocusa[1] = new Array(0,2);
// gFocusa[2] = new Array(1,0);

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
	gState.bmltype = 11;
	clockStart();
	lockScreen();
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
	var gIndex = 1;

	if( gIndex == 0) {
//		var url = "http://10.24.138.136/lab_beta/cgi/smart_meter.pl?"
//					+ "type=power&scale=daily&file=elect_daily.xml";
		var url = "../cgi/smart_meter.pl?"
					+ "type=power&scale=daily&file=elect_daily.xml";
	}
	else if( gIndex == 1) {
//		var url = "http://10.24.138.136/lab/cgi/smart_meter.pl?"
//					+ "type=power&scale=monthly&file=elect_monthly.xml";
		var url = "../cgi/smart_meter.pl?"
					+ "type=power&scale=monthly&file=elect_monthly.xml";
	}
	else if( gIndex == 2) {
//		var url = "http://10.24.138.136/lab_beta/cgi/smart_meter.pl?"
//					+ "type=power&scale=yearly&file=elect_yearly.xml";
		var url = "../cgi/smart_meter.pl?"
					+ "type=power&scale=yearly&file=elect_yearly.xml";
	};

	print( "calling retrieveTsv() to retrieve the corresponding tsv from "
			+ url, "tsv");

	var ret = retrieveTsv( url, val, "EUC-JP");

	var readTSV = 0;
	var index = 0;

	if( ret[0] == 1) {
		var tmpTSVArray = new Array();
		var storeTSV = new Array();
		tmpTSVArray = ret[2];		// takes the encoding part."EUC-JP"

		tmpTSVArray = tmpTSVArray.split( "\n");
//		print( tmpTSVArray, "tsv");
		tmpTSVArraySize = (tmpTSVArray.length) - 2;

		for( var i = 0; i <= tmpTSVArraySize; i++) {
			storeTSV[i] = tmpTSVArray[i].split( "\t");
		};
//		print( storeTSV.length, "tsv");

		var intReadTsv = new Array();

		for( var i = tmpTSVArraySize; i >= 0; i--) {
			readTSV = storeTSV[i][1];
			readTSV = readTSV.split( "[EOL]");
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

	for( var i = 1; i <= tmpTSVArraySize; i++) {
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

	for( var i = 1; i <= tmpTSVArraySize; i++) {
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

	var recordX = new Array();
	var m = 0;

	// interval set. Not use at the moment
	for( var i = 20; i >= 1; i--) {
		recordX[i] = max - (diffMaxMin * m);
		m++;
	};

	recordX[0] = min;
	callGraph( recordX, intReadTsv);
};

/************************************************************/
function callGraph( recordX, intReadTsv) {
	var yPos = 450;		// 470;
	var xPos = new Array();
	var m = 0;

	for( i = 20; i >= 0; i--) {
		xPos[m] = 175 + (3 * i) + (90 - (m * 10));
		m++;
	};

	getElementById( "graphbox").normalStyle.visibility = "visible";

	var selectGraph = new Array();
	selectGraph[0] = 0;

	var pt = 0;
	var m = 0;

	for( var n = 0; n <= tmpTSVArraySize; n++) {
		var minDiff = recordX[0] - intReadTsv[n];	// recordX[0]
		minDiff = abs( minDiff);

		for( i = 0; i <= 20; i++) {
			var checkDiff = recordX[i] - intReadTsv[n];
			checkDiff = abs( checkDiff);

			if( checkDiff <= minDiff) {
				minDiff = checkDiff + 1;

				if( intReadTsv[n] == 0) {
					selectGraph[n] = "Zero";
				}
				else {
					selectGraph[n] = i;
				};
			};
		};
	};
//	print( yPos, "tsv");

	// The following for loop can be modified to display all the intervals.

	var Y = new Array(
		450, 435, 420, 405, 390, 375,
		360, 345, 330, 315, 300, 285,
		270, 255, 240, 225, 210, 195,
		180, 165
	);

	for( i = 0; i <= tmpTSVArraySize; i++) {
		getElementById( "graph" + i).data =
			"../images/Hbar" + selectGraph[i] + ".jpg";

//		getElementById( "graph" + i).data = "../images/Hbar20.jpg";
		getElementById( "graph" + i).normalStyle.top = Y[i];
		showElem( "graph" + i);
	};

	getElementById( "text0").normalStyle.left = xPos[ 20];	// xPos[20];
	getElementById( "text20").normalStyle.left = xPos[ 0];
	setText( "text0",intReadTsv[ 0]);

	getElementById( "text0").normalStyle.top = yPos;
	getElementById( "text20").normalStyle.top = yPos;
	setText( "text20", recordX[ 20]);

	print( recordX[0], "tsv");
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

