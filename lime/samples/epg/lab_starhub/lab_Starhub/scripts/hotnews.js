/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gIndex = 0;
var gFocus = new Array();

gFocus[0]=new Array("input",5,4,1);
gFocus[1]=new Array("input",6,0,2);
gFocus[2]=new Array("input",7,1,3);
gFocus[3]=new Array("input",8,2,4);
gFocus[4]=new Array("input",9,3,0);
gFocus[5]=new Array(0,"input",9,6);
gFocus[6]=new Array(1,"input",5,7);
gFocus[7]=new Array(2,"input",6,8);
gFocus[8]=new Array(3,"input",7,9);
gFocus[9]=new Array(4,"input",8,5);
gFocus[11]=new Array(9,4,"input","input");
gFocus["input"]=new Array(9,4,11,11);

/************************************************************
 DOM event functions
 ************************************************************/
function onload() {
	gState.bmltype = 3;
	gState.crid = "";
	gState.grid = "";
	clockStart();
	lockScreen();
	listShow();
	hideElem("loading2");
	unlockScreen();
	setFocus(0,0);
};

/************************************************************/
function onunload() {}

/************************************************************/
function onkey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	if( (0 < code) && (code <= 4)) {
		// Was navigation key press.
		focus( code);
	}
	else if( code == 18) {
		// Was select/enter key press.
		if( gIndex == "input") {
			return;
		};
		var info = gHotNewsButtonInfo[ gIndex];
		if( (String( info) == "undefine") || (String( info) == "null")) {
			return;
		};
		if( !info[1]) {
			return;
		};
		romSound(7);

		if( info[2] != "") {
			if( info[2] == "play.bml") {
				gState.crid = info[3];
			}
			else if( info[2] == "result.bml") {
				gState.grid = info[3];
			};
			gState.launchDocument( info[2]);
		};
	}
	else if( code==19) {
		// Was data key press.
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
function listShow() {
	for( var i = 0; (i < gHotNewsButtonInfo.length) && (i < 10); i++){
		setText( "menut" + i, gHotNewsButtonInfo[i][0]);
	};
};

/************************************************************/
function focus( code) {
	var idx = gFocus[ gIndex][ code - 1];
	romSound(9);
	setFocus( gIndex, idx);
	gIndex = idx;
};

/************************************************************/
function setFocus( old, id) {
	var X = new Array(  56, 228, 400, 572, 744,
						56, 228, 400, 572, 744);
	var Y = new Array( 113, 113, 113, 113, 113,
					   255, 255, 255, 255, 255);
	var W = 161;
	var H = 75;
	
	lockScreen();

	if( old < 10) {
		setTxtCol( "menut" + String( old), "41", "83 106");
	};

	if( id == "input") { // 入力エリア
		setImg( "menu", "../images/bt_input_f.png");
		setPos( "menu", 410, 354, 288, 45);
		setFcs( "input");
		if( (0 <= old) && (old < 5)) {
			gFocus[id][1] = old;
			gFocus[id][0] = old + 5;
		}
		else if( (5 <= old) && (old < 10)) {
			gFocus[id][1] = old - 5;
			gFocus[id][0] = old;
		};
	}
	else if( id == 11) { // searchボタン
		setImg( "menu", "../images/bt_search_f.png");
		setPos( "menu", 700, 359, 103, 35);
		setFcs( "default");
	}
	else {
		setTxtCol( "menut" + String( id), "32", "18 196");
		setPos( "menu", X[id], Y[id], W, H);
		setImg( "menu", "../images/bt_keyword_f.png");
		setFcs( "default");
	};

	if( id != "input") {
		setText( "info", gHotNewsButtonInfo[id][4]);
	};

	showElem("menubox");
	unlockScreen();
};

