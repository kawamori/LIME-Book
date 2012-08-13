/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
// gBtnType == 0 => 10 buttons on startup screen.
// gBtnType != 0 => 5 buttons on startup screen.
var gBtnType = 0; // 0:10 E1:5 E
var gIndex = 0;

// Focus transition map for startup screen on navigation key press.
var gFocus = new Array();

if( gBtnType == 0) {
	setImg( "bg", "../images/base_top.jpg");
	/* Array( U, D, L, R)
	 * =>
	 * goto gFocus[U] on Up key press
     * goto gFocus[D] on Down key press
     * goto gFocus[L] on Left key press
     * goto gFocus[R] on Right key press
	 */
	gFocus[0] = new Array(5,5,4,1);
	gFocus[1] = new Array(6,6,0,2);
	gFocus[2] = new Array(7,7,1,3);
	gFocus[3] = new Array(8,8,2,4);
	gFocus[4] = new Array(9,9,3,0);
	gFocus[5] = new Array(0,0,9,6);
	gFocus[6] = new Array(1,1,5,7);
	gFocus[7] = new Array(2,2,6,8);
	gFocus[8] = new Array(3,3,7,9);
	gFocus[9] = new Array(4,4,8,5);
}
else {
	setImg( "bg", "../images/base_top2.jpg");
	gFocus[0] = new Array(-1,-1,4,1);
	gFocus[1] = new Array(-1,-1,0,2);
	gFocus[2] = new Array(-1,-1,1,3);
	gFocus[3] = new Array(-1,-1,2,4);
	gFocus[4] = new Array(-1,-1,3,0);
};

/************************************************************
 DOM event functions
 ************************************************************/
function onload() {
	clockStart();
	lockScreen();
	gState.bmltype = 0;
	gState.crid = "";
	setFocus(0);
	hideElem( "loading2");
	unlockScreen();
};

/************************************************************/
function onunload() {}

/************************************************************/
function onkey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if( (0 < code) && (code <= 4)) {
		focus( code);
	}
	else if( code == 18) {
		var info = gTopButtonInfo[ gIndex];

		if( (String( info) == "undefine") || (String( info) == "null")) {
			return;
		};
		if( !info[0]) {
			return;
		};

		romSound(7);

		if( info[1] == "reversi-w1.bml") {
			 gState.launchDocument( "reversi-w1.bml");
		}
		else if( info[1] == "HttpPostTest.bml") {
			 gState.launchDocument( "HttpPostTest.bml");
		}
		else if( info[1] == "mazegame.bml") {
			 gState.launchDocument( "mazegame.bml");
		}
		else if( info[1] == "doomlike.bml") {
			 gState.launchDocument( "doomlike.bml");
		}
		else if( info[1] == "meters.bml") {
			 gState.launchDocument( "meters.bml");
		}
		else if( info[1] == "smart_meter2.bml") {
			 gState.launchDocument( "smart_meter2.bml");
		}
		else if( info[1] == "DeviceControl.bml") {
			 gState.launchDocument( "DeviceControl.bml");
		}
		else if( info[1] == "Polyclinic1.bml") {
			 gState.launchDocument( "Polyclinic1.bml");
		}
		else if( info[1] != ""){
			 gState.launchDocument(info[1]);
		};
	}
	else if( code == 19) {
		romSound(7);
		launchTop();
	};

	unlockScreen();
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
	var img = new Array(
		"bt_top_1_f.png",
		"bt_top_2_f.png",
		"bt_top_3_f.png",
		"bt_top_4_f.png",
		"bt_top_5_f.png",

		"bt_top_6_f.png",
		"bt_top_6_f.png",
		"bt_top_6_f.png",
		"bt_top_6_f.png",
		"bt_top_6_f.png"
	);
	var X = new Array(  57, 229, 401, 573, 745,
						57, 229, 401, 573, 745);
	var Y = new Array( 145, 145, 145, 145, 145,
					   256, 256, 256, 256, 256);
	var W = 159;
	var H = 94;

	setPos( "menu", X[id], Y[id], W, H);
	setImg( "menu", "../images/" + img[id]);
	setText( "info", gTopButtonInfo[id][2]);
	showElem( "menubox");
};

