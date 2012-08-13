/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gTicker = new TickerData(); // ティッカー処理
var gRecomend = false;
var gCridInfo = null;
var gAlert = false;
var gPlayState = false;
var gIndex = 0;
var gIndex2 = 0;
var gFocus = new Array();
var fullshowindex = 0;
var gBtnType = 1; // 0:10 E1:5 E

var cnt = new Number();
cnt = 0;

var max = 0;
var min = 0;
var idx = 0;
var url = "";

gFocus[0] = new Array( 2, 1, -1, -1);
gFocus[1] = new Array( 0, 2, -1, -1);
gFocus[2] = new Array( 1, 0, -1, -1);

/************************************************************/
// edited.............................
// Focus transition map for overlay buttons on navigation key press.
var gFocus1 = new Array();

gFocus1[0] = new Array( -1, -1, 3, 1);
gFocus1[1] = new Array( -1, -1, 0, 2);
gFocus1[2] = new Array( -1, -1, 1, 3);
gFocus1[3] = new Array( -1, -1, 2, 0);

var gFocus2 = new Array();
gFocus2[ 0] = new Array( 17, 1, -1, -1);
gFocus2[ 1] = new Array(  0, 2, -1, -1);
gFocus2[ 2] = new Array(  1, 3, -1, -1);
gFocus2[ 3] = new Array(  2, 4, -1, -1);
gFocus2[ 4] = new Array(  3, 5, -1, -1);
gFocus2[ 5] = new Array(  4, 6, -1, -1);
gFocus2[ 6] = new Array(  5, 7, -1, -1);
gFocus2[ 7] = new Array(  6, 8, -1, -1);
gFocus2[ 8] = new Array(  7, 9, -1, -1);
gFocus2[ 9] = new Array(  8,10, -1, -1);
gFocus2[10] = new Array(  9,11, -1, -1);
gFocus2[11] = new Array( 10,12, -1, -1);
gFocus2[12] = new Array( 11,13, -1, -1);
gFocus2[13] = new Array( 12,14, -1, -1);
gFocus2[14] = new Array( 13,15, -1, -1);
gFocus2[15] = new Array( 14,16, -1, -1);
gFocus2[16] = new Array( 15,17, -1, -1);
gFocus2[17] = new Array( 16, 0, -1, -1);

var gFocus3 = new Array();
gFocus3[0] = new Array( -1, -1, 2, 1);
gFocus3[1] = new Array( -1, -1, 0, 2);
gFocus3[2] = new Array( -1, -1, 1, 0);

/************************************************************
 DOM event functions
 ************************************************************/
function onload() {
	gState.bmltype = 5;
	gCridInfo = getCrid( gState.crid);
	if( gCridInfo == null) {
		return;	// エラー
	};
	clockStart();
	show();
	hideElem( "loading2");
	unlockScreen();
	gState.crid = "";
};

/************************************************************/
function onunload() {
	if( !isNaN( gAlertTimer)) {
		browser.clearTimer( gAlertTimer);
		gAlertTimer = NaN;
	};
	if( !isNaN( gTicker.timerId)) {
		browser.clearTimer( gTicker.timerId);
		gTicker.timerId = NaN;
	};
};

