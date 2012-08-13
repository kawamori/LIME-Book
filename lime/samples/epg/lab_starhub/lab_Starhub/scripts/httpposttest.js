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

var gFocusa = new Array();
gFocusa[0] = new Array( 2, 1);
gFocusa[1] = new Array( 0, 2);
gFocusa[2] = new Array( 1, 0);

/************************************************************
 DOM event functions
 ************************************************************/
function onload() {
	gState.bmltype = 7;
	clockStart();
	hideElem( "loading2");
};

/************************************************************/
function onunload() {}

/************************************************************/
function onkey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	if( (0 < code) && (code <= 2)) {
		// Was up or down key press.
		focus1( code);
	}
	else if( code == 18) { // ·èÃàE
		// Was select/enter key press.
		printText();
	}
	else if( code == 19) {
		// Was data key press.
		romSound(7);
		launchTop();
	};
};

/************************************************************
  Some utility functions used in this sample.
 ************************************************************/
function print( str, disp) {
	var obj = document.getElementById( disp);
	obj.firstChild.data = str ;
};

/************************************************************/
function printlnd( str){
	var obj = document.getElementById( "display");
	obj.firstChild.data += str + "\r\n";
};

/************************************************************/
function printText() {
	printlnd( "Demonstrating Asynchronous Data Transport");
};

/************************************************************/
function replace( str, reg, replaced) {
	return( str.substring( 0, str.indexOf( reg)) + replaced +
			str.substring( str.indexOf( reg) + reg.length,
						   str.lastIndexOf( "")));
};

/************************************************************/
function $( id) {
	return( document.getElementById( id));
};

/************************************************************
 * This is the HTTP Post function
 */
function httpPost( url, val, encoding) {
	return( browser.transmitTextDataOverIP( url, val, encoding));
};

/************************************************************/
function focus1( code) {
	var idx = gFocusa[ gIndex2][ code - 1];

	if( idx == 1) {
		send();
	}
	else if( idx == 2) {
		getNews();
	};

	gIndex2 = idx;
};

/************************************************************/
function focus() {
	var tid = document.currentEvent.target.id;
	var p = $(tid);

	p.normalStyle.left =
		parseInt( replace( p.normalStyle.left, "px", "")) + 25 + "px";
};

/************************************************************/
function blur(){
	var tid = document.currentEvent.target.id;
	var p = $(tid);

	p.normalStyle.left =
		parseInt( replace(p.normalStyle.left, "px", "")) - 25 + "px";
};

/************************************************************/
function send() {
	focus();

	if( cnt < 4) {
		cnt++;
	}
	else {
		cnt = 1;
	};

	var val = "";
	var url = "../text/test" + cnt + ".txt";
	printlnd( "calling send() retrieving data from " + url);

	var ret = browser.transmitTextDataOverIP( url, val, "EUC-JP");

	if( ret[0] == 1) {
		printlnd( "Returned value: " + ret[2]);
	}
	else {
		printlnd( "Transmission failed");
	};
};

/************************************************************/
function getNews() {
//	print("test","news");
	focus();

	var val = "";
	var url = "../text/news" + cnt + ".txt";
	print( "calling getNews() retrieving data from " + url, "news");

	var ret = httpPost( url, val, "EUC-JP");

	if( ret[0] == 1) {
		print( ret[2], "news");
	}
	else {
		print( "Transmission failed", "news");
	};
};

