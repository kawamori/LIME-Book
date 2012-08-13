/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************/
function Transition( szElement, pnStartLTWH, pnEndLTWH, nMilliSec,
					 szTimeoutFnCall)
{
	_TransitionInit( this, szTimeoutFnCall);

	this.element = document.getElementById( szElement);

	if( this.element == null) {
		return;
	};

	debug_log( "[left;top;width;height] = [" +
			   this.element.normalStyle.left + "," +
			   this.element.normalStyle.top + "," +
			   this.element.normalStyle.width + "," +
			   this.element.normalStyle.height + "]");

	var pnOrgLTWH = new Array(
		String( this.element.normalStyle.left),
		String( this.element.normalStyle.top),
		String( this.element.normalStyle.width),
		String( this.element.normalStyle.height)
	);

	this.pnLTWH = new Array();
	this.pnEndLTWH = new Array();

	var i;

	for( i = 0; i < this.EOA; i++) {
		pnOrgLTWH[ i] =
			Number( pnOrgLTWH[ i].substring( 0, pnOrgLTWH[ i].length - 2));

		debug_log( "pnOrgLTWH[ " + i + "] = " + pnOrgLTWH[ i]);
	};

	gArray.copy( this.pnLTWH, pnStartLTWH, pnOrgLTWH, isNaN);
	gArray.copy( this.pnEndLTWH, pnEndLTWH, pnOrgLTWH, isNaN);
//	this.pnLTWH = gArray.copy( this.pnLTWH, pnStartLTWH, pnOrgLTWH, isNaN);
//	this.pnEndLTWH = gArray.copy( this.pnEndLTWH, pnEndLTWH, pnOrgLTWH, isNaN);

//	debug_log( this.pnLTWH.length + ', ' + this.pnEndLTWH.length);

	this.pnStep = new Array(4);
	gArray.fill( this.pnStep, 0);

	var pnDelta = new Array(4);

	var nMax = NaN;
	var nMaxDelta = NaN;

	for( i = 0; i < this.EOA; i++) {
		pnDelta[ i] = this.pnEndLTWH[ i] - this.pnLTWH[ i];

		debug_log( "this.pnEndLTWH[ " + i + "] - this.pnLTWH[ " + i + "] = " +
					this.pnEndLTWH[ i] + " - " + this.pnLTWH[ i] + " = " +
					pnDelta[ i]);

		if( isNaN( nMaxDelta) || (nMaxDelta < gMath.abs( pnDelta[ i]))) {
//			debug_log( "pnDelta[ " + i + "] = " + pnDelta[ i]);
			nMaxDelta = gMath.abs( pnDelta[ i]);
			nMax = i;
		};
	};

	if( nMaxDelta == 0) {
		return;
	};

	debug_log( nMilliSec + ' / ' + nMaxDelta);

	this.nSleep = nMilliSec / nMaxDelta;

	debug_log( "nSleep = " + this.nSleep);

	if( this.nSleep < this.MAX_SLEEP_RES_MILLI_SEC) {
		this.nSleep = this.MAX_SLEEP_RES_MILLI_SEC;
		debug_log( "nSleep = " + this.nSleep);
	};

	this.nCycle = nMilliSec / this.nSleep;

	debug_log( "nCycle = " + this.nCycle);

	for( i = 0; i < this.EOA; i++) {
		this.pnStep[ i] = pnDelta[ i] / this.nCycle;
		debug_log( "pnStep[ " + i + "] = " + pnStep[ i]);
	};

	debug_log( "pHCF( 20, 16) = " + gMath.pseudoHCF( 20, 16));
/*
	debug_log( (gMath.isEven( 1) ? "even" : "odd"));
	debug_log( (gMath.isEven( 0) ? "even" : "odd"));
	debug_log( (gMath.isEven( 2) ? "even" : "odd"));
	debug_log( (gMath.isEven( 3) ? "even" : "odd"));
*/
};

/************************************************************/
function _TransitionInit( tObj, szTimeoutFnCall) {
	tObj.stop = _clockStop;
	tObj.start = _clockStart;
	tObj.loop = _clockLoop;
	tObj.fnToCall = szTimeoutFnCall;

	// Frame rate of 20 fps is fast enough for screen transition effects?
	tObj.MAX_SLEEP_RES_MILLI_SEC = 50;

	// Index positions for pStartLTWH, pEndLTWH & pOrgLTWH access.
	tObj.LEFT = 0;
	tObj.TOP = 1;
	tObj.WIDTH = 2;
	tObj.HEIGHT = 3;
	tObj.EOA = 4;

	tObj.tmH = NaN;
	tObj.nIter = 0;
	tObj.nCycle = 0;
	tObj.nSleep = this.MAX_SLEEP_RES_MILLI_SEC;
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
function _clockStart( szFnCall) {
	this.stop();
	this.loop();
};

/************************************************************/
function _clockLoop() {
	this.nIter++;

	if( this.nIter > this.nCycle) {
		this.element.normalStyle.left = this.pnEndLTWH[ this.LEFT] + "px";
		this.element.normalStyle.top  = this.pnEndLTWH[ this.TOP]  + "px";
		this.element.normalStyle.width  = this.pnEndLTWH[ this.WIDTH]  + "px";
		this.element.normalStyle.height = this.pnEndLTWH[ this.HEIGHT] + "px";
		return;
	};

	for( var i = 0; i < this.EOA; i++) {
		this.pnLTWH[ i] += this.pnStep[ i];
//		debug_log( "pnLTWH[ " + i + "] = " + pnLTWH[ i]);
	};

//	_hideElement( "loading2");

	browser.lockScreen();

	this.element.normalStyle.left = this.pnLTWH[ this.LEFT] + "px";
	this.element.normalStyle.top  = this.pnLTWH[ this.TOP]  + "px";
	this.element.normalStyle.width  = this.pnLTWH[ this.WIDTH]  + "px";
	this.element.normalStyle.height = this.pnLTWH[ this.HEIGHT] + "px";

	browser.unlockScreen();

//	_showElement( "loading2");

//	debug_log( "setInterval( " + this.fnToCall + ", " + this.nSleep + ")");

	this.tmH = browser.setInterval( this.fnToCall, this.nSleep, 1);
};

/************************************************************/
function _setVisibility( szElement, szPropValue) {
	var el = document.getElementById( szElement);

	if( el == null) {
		return;
	};

	el.normalStyle.visibility = szPropValue;
};
/************************************************************/
function _hideElement( szElement) {
	_setVisibility( szElement, "hidden");
};

/************************************************************/
function _showElement( szElement) {
	_setVisibility( szElement, "visible");
};

