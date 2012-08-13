/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gRC = new RemoteControl();

/************************************************************
 * Wrapper class
 */
function RemoteControl() {
	this.UP = 1;
	this.DOWN = 2;
	this.LEFT = 3;
	this.RIGHT = 4;
	this.NUM_0 = 5;
	this.NUM_1 = 6;
	this.NUM_2 = 7;
	this.NUM_3 = 8;
	this.NUM_4 = 9;
	this.NUM_5 = 10;
	this.NUM_6 = 11;
	this.NUM_7 = 12;
	this.NUM_8 = 13;
	this.NUM_9 = 14;
	this.NUM_10 = 15;
	this.NUM_11 = 16;
	this.NUM_12 = 17;
	this.ENTER = 18;
	this.DATA = 20;
	this.BLUE = 21;
	this.RED = 22;
	this.GREEN = 23;
	this.YELLOW = 24;

	this.isNaviKey = __RemoteControl_isNaviKey;
	this.isUpDownKey = __RemoteControl_isUpDownKey;
	this.isLeftRightKey = __RemoteControl_isLeftRightKey;
	this.isEnterKey = __RemoteControl_isEnterKey;
	this.keyName = __RemoteControl_keyName;
};

/************************************************************/
function __RemoteControl_isNaviKey( nCode) {
	return( this.isUpDownKey( nCode) || this.isLeftRightKey( nCode));
};

/************************************************************/
function __RemoteControl_isUpDownKey( nCode) {
	return( (nCode == this.UP) || (nCode == this.DOWN));
};

/************************************************************/
function __RemoteControl_isLeftRightKey( nCode) {
	return( (nCode == this.LEFT) || (nCode == this.RIGHT));
};

/************************************************************/
function __RemoteControl_isEnterKey( nCode) {
	return( nCode == this.ENTER);
};

/****************************************/
function __RemoteControl_keyName( nCode) {
	var szKey = "?";

	if( (1 <= nCode) && (nCode <= 4)) {
		// Was navigation key press.
		if( nCode == 1) {
			szKey = "up";
		}
		else if( nCode == 2) {
			szKey = "down";
		}
		else if( nCode == 3) {
			szKey = "left";
		}
		else {
			szKey = "right";
		};
	}
	else if( (5 <= nCode) && (nCode <= 14)) {
		// Was uni-digit key press.
		szKey = (nCode - 5) + "";
	}
	else if( (15 <= nCode) && (nCode <= 17)) {
		// Was dual-digit key press.
		szKey = (nCode - 5) + "";
	}
	else if( nCode == 18) {
		// Was select/enter key press.
		szKey = "select";
	}
	else if( nCode == 19) {
		// Was back key press.
		szKey = "back";
	}
	else if( nCode == 20) {
		// Was data key press.
		szKey = "data";
	}
	else if( (21 <= nCode) && (nCode <= 24)) {
		// Was colour key press.
		if( nCode == 21) {
			szKey = "blue";
		}
		else if( nCode == 22) {
			szKey = "red";
		}
		else if( nCode == 23) {
			szKey = "green";
		}
		else {
			szKey = "yellow";
		};
	};

	return( szKey);
};

