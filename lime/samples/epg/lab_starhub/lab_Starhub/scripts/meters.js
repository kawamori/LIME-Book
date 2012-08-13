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
function print( str, disp) {
	var obj = document.getElementById( disp);
	obj.firstChild.data = str;
};

/************************************************************/
function retrieveTsv( url, val, encoding) {
	return( browser.transmitTextDataOverIP( url, val, encoding));
};

/************************************************************/
function metering() {
	getElementById( "historyButton").normalStyle.visibility = "visible";
	setFcs( "historyBtn");
	AutoRefresh();
};

/************************************************************/
function getData4()
// function getData( meters)
{
	var powerMeters = new Array(
		"L_ZONE", "E_ZONE", "K_ZONE", "B_ZONE",
		"C_ZONE", "M_ZONE", "T_ZONE", "X1_ZONE",
		"X2_ZONE", "TOTAL"
	);
	var waterMeters = new Array(
		"MainValve", "DishWasher", "Kitchen-Fridge", "WashingMachine",
		"FishTank", "ToiletFlush", "BasinHandwash", "ShowerArea"
	);
	var val = "";
/*
	if( gIndex < 10) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=" +
				  powerMeters[ gIndex];
		print( powerMeters[ gIndex], "tsv");
	}
	else {
		var url = "../cgi/get_tsv_rt.pl?type=water&device=" +
				  waterMeters[ gIndex];
		print( waterMeters[ gIndex], "tsv");
	};
*/
/*
	if( gIndex == 0) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=L_ZONE";
		print( "L_ZONE", "tsv");
	}
	else if( gIndex == 1) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=E_ZONE";
		print( "E_ZONE", "tsv");
	}
	else if( gIndex == 2) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=K_ZONE";
		print( "K_ZONE", "tsv");
	}
	else if( gIndex == 3) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=B_ZONE";
		print( "B_ZONE", "tsv");
	}
	else if( gIndex == 4) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=C_ZONE";
		print( "C_ZONE", "tsv");
	}
	else if( gIndex == 5) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=M_ZONE";
		print( "M_ZONE", "tsv");
	}
	else if( gIndex == 6) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=T_ZONE";
		print( "T_ZONE", "tsv");
	}
	else if( gIndex == 7) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=X1_ZONE";
		print( "X1_ZONE", "tsv");
	}
	else if( gIndex == 8) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=X2_ZONE";
		print( "X2_ZONE", "tsv");
	}
	else if( gIndex == 9) {
		var url = "../cgi/get_tsv_rt.pl?type=power&device=TOTAL";
		print( "TOTAL", "tsv");
	}
	else if( gIndex == 10) {
		var url = "../cgi/get_tsv_rt.pl?type=water&device=MainValve";
		print( "MainValve", "tsv");
	}
	else if( gIndex == 11) {
		var url = "../cgi/get_tsv_rt.pl?type=water&device=DishWasher";
		print( "DishWasher", "tsv");
	}
	else if( gIndex == 12) {
		var url = "../cgi/get_tsv_rt.pl?type=water&device=Kitchen-Fridge";
		print( "Kitchen-Fridge", "tsv");
	}
	else if( gIndex == 13) {
		var url = "../cgi/get_tsv_rt.pl?type=water&device=WashingMachine";
		print( "WashingMachine", "tsv");
	}
	else if( gIndex == 14) {
		var url = "../cgi/get_tsv_rt.pl?type=water&device=FishTank";
		print( "FishTank", "tsv");
	}
	else if( gIndex == 15) {
		var url = "../cgi/get_tsv_rt.pl?type=water&device=ToiletFlush";
		print( "ToiletFlush", "tsv");
	}
	else if( gIndex == 16) {
		var url = "../cgi/get_tsv_rt.pl?type=water&device=BasinHandwash";
		print( "BasinHandwash", "tsv");
	}
	else if( gIndex == 17) {
		var url = "../cgi/get_tsv_rt.pl?type=water&device=ShowerArea";
		print( "ShowerArea", "tsv");
	};
*/
	var url = "../cgi/get_tsv_rt.pl?type=sine";
//	var url = "http://10.24.138.136/lab/cgi/get_tsv.pl";
//	var url = "../cgi/get_tsv.pl" + meters;

//	print( "calling retrieveTsv() " + gIndex, "tsv");
//	print( "calling retrieveTsv() to retrieve the corresponding tsv from "
//			+ url, "tsv");

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
//		print( tmpTSVArray[1], "tsv");

		var tmpTSVArraySize = (tmpTSVArray.length) - 2;

		if( tmpTSVArraySize < 0) {
			clearRefreshTimer();
		};

		for( var i = 0; i <= tmpTSVArraySize; i++) {
			storeTSV[i] = tmpTSVArray[i].split( "\t");
		};
//		print( storeTSV.length, "tsv");

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
		 95, 110, 125, 140, 155,
		170, 185, 200, 215, 230,
		245, 260, 275, 290, 305,
		320, 335, 350, 365, 380,
		395
	);

	for( i = 0; i <= tmpTSVArraySize; i++) {
//		getElementById( "graph" + i).data = "../images/graph/ybar20.jpg";
		getElementById( "graph" + i).data =
			"../images/widget_menu/ybar" + selectGraph[i] + ".jpg";

		getElementById( "graph" + i).normalStyle.left = X[i];
		showElem( "graph" + i);
	};
};

/************************************************************/
function AutoRefresh() {
//	setFcs( "historyBtn");
//	getElementById( "historyButton").normalStyle.visibility = "visible";
//	setFcs( "historyBtn");
	Timer1 = browser.setInterval( "getData4();", 1500, 0);
};

/************************************************************/
function clearRefreshTimer() {
	browser.clearTimer( Timer1);
	gState.launchDocument( "startup.bml");
};

/************************************************************/
function HistoryKey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	if( (0 < code) && (code <= 4)) {
		HistoryFocus( code, idx);
	}
	else if( code == 18) {
		browser.pauseTimer( Timer1);
		getData5();
	}
	else if( code == 19) { // –ß‚é
		romSound(7);
		launchTop();
	};
};

/************************************************************/
function HistoryFocus( code, idx) {
	idx = gFocus3[ gIndex][ code - 1];
	if( idx == -1) {
		return;
	};
	romSound(9);
	setHistoryFocus( idx);
	gIndex = idx;
};

/************************************************************/
function setHistoryFocus( id) {
	var Y = 500;
	var X = new Array( 50, 140, 230);
	var W = 180;
	var H = 94;
	setPos( "SelectBtn", X[ id], Y, W, H);
	var Btninfo = new Array( "Daily", "Monthly", "Yearly");
	setPos( "BtninfoA", X[ id], Y, W, H);
	setText( "BtninfoA", Btninfo[ id]);
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

