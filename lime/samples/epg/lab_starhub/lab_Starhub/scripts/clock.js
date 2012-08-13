/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Dependencies:
 * - gDbg
 */

/************************************************************/
function MyClock( szDisplayId, szTimeoutFnCall) {
	this.cObj = null;
	this.fnToCall = szTimeoutFnCall;
	this.tmH = NaN;

	this.setDisplay = _setDisplay;
	this.strftime = _strftime;
	this.strftimeDate = _strftimeDate;
	this.strftimeTime = _strftimeTime;

	this.start = _clockStart;
	this.stop = _clockStop;
	this.tick = _clockTick;

	this.pszDayOfWeek = new Array(
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
	);

	this.pszMonthName = new Array(
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	);

	this.setDisplay( szDisplayId);

	gDbg.print( this.strftime( new Date()));
};

/************************************************************/
function _setDisplay( szDisplayId) {
	if( szDisplayId == null) {
		return;
	};

	this.cObj = document.getElementById( szDisplayId);

	if( this.cObj == null) {
		gDbg.print( "Error: no such id \"" + szDisplayId
					+ "\" for clock display.");
	};
};

/************************************************************/
function _strftimeDate( tm) {
	return( this.pszDayOfWeek[ tm.getDay()] + " " +
			this.pszMonthName[ tm.getMonth()] + " " +
			gString.pad( tm.getDate(), " ", 2) + " " +
			tm.getFullYear());
};

/************************************************************/
function _strftimeTime( tm) {
	return( gString.pad( tm.getHours(), "0", 2) + ":" +
			gString.pad( tm.getMinutes(), "0", 2) + ":" +
			gString.pad( tm.getSeconds(), "0", 2));
};

/************************************************************/
function _strftime( tm) {
	return( this.strftimeDate( tm) + " " + this.strftimeTime( tm));
};

/************************************************************/
function _clockStart( szTimeoutFnCall) {
	if( this.cObj == null) {
		return;
	};

	if( szTimeoutFnCall != null) {
		this.fnToCall = szTimeoutFnCall;
	};

	this.stop();
	this.tick();
};

/************************************************************/
function _clockStop() {
	if( isNaN( this.tmH)) {
		return;
	};

	browser.clearTimer( this.tmH);
	this.tmH = NaN;
};

/************************************************************/
function _clockTick() {
	if( this.cObj == null) {
		return;
	};

	this.tmH = NaN;

	browser.lockScreen();

//	gDbg.print( this.cObj.firstChild.data);
	var now = new Date();

	this.cObj.lastChild.data = this.strftimeTime( now);
	this.cObj.firstChild.data = this.strftimeDate( now);

//	gDbg.print( this.cObj.data);
//	this.cObj.data = this.strftime( new Date());

	browser.unlockScreen();

	this.tmH = browser.setInterval( this.fnToCall, 1000, 1);
};

