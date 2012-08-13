/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Wrapper class
 */
function ColourTab( szBoxName, nStartColourIdx) {
	if( szBoxName == null) {
		return;
	};

	var box = document.getElementById( szBoxName);

	if( box == null) {
		return;
	};

	this.szBoxName = szBoxName;

	this.initBackground = _initBackground;
	this.printAttr = _printAttr;
	this.cycleBgColour = _cycleBackgroundColour;

	this.initBackground( nStartColourIdx);
};

/************************************************************/
function _initBackground( nStartColourIdx) {
	var box = document.getElementById( this.szBoxName);

	if( box == null) {
		return;
	};

	var xMax = gString.stripUnit( box.normalStyle.width);
	var yMax = gString.stripUnit( box.normalStyle.height);

	debug_log( "xMax = " + xMax + ", yMax = " + yMax);

	var x = 0;
	var y = 0;

	var i = (nStartColourIdx == null) ? 0 : nStartColourIdx;

	var cObj = box.firstChild;

	var nBorder = gString.stripUnit( cObj.firstChild.normalStyle.borderWidth);

	var xStep = gString.stripUnit( cObj.normalStyle.width);
	var yStep = gString.stripUnit( cObj.normalStyle.height);

	var gcL = nBorder + "px";
	var gcT = nBorder + "px";
	var gcW = (xStep - 2 * nBorder) + "px";
	var gcH = (yStep - 2 * nBorder) + "px";

	var cW = xStep + "px";
	var cH = yStep + "px";

	while( cObj != null) {
		if( cObj.type == "image/jpeg") {
			cObj.normalStyle.width = xMax;
			cObj.normalStyle.height = yMax;
			debug_log( "Skip image \"" + cObj.data + "\"");
//			cObj.data = "";

			cObj = cObj.nextSibling;
			continue;
		};

		browser.lockScreen();

		cObj.normalStyle.left = x + "px";
		cObj.normalStyle.top = y + "px";
		cObj.normalStyle.width = cW;
		cObj.normalStyle.height = cH;

		cObj.firstChild.normalStyle.left = gcL;
		cObj.firstChild.normalStyle.top = gcT;
		cObj.firstChild.normalStyle.width = gcW;
		cObj.firstChild.normalStyle.height = gcH;
//		cObj.firstChild.data = "<![CDATA[" + i + "]]>";
		cObj.firstChild.firstChild.data = i;
		cObj.firstChild.normalStyle.backgroundColorIndex = i;

		browser.unlockScreen();

		if( x + xStep >= xMax) {
			x = 0;
			y += yStep;
		}
		else {
			x += xStep;
		};

		if( y + yStep > yMax) {
			break;
		};

/*
		debug_log( "Child #" + i + " = \"" + cObj.id + "\"");
		debug_log( "type = \"" + cObj.type + "\"");
		debug_log( "data = \"" + cObj.data + "\"");
		debug_log( "data = \"" + cObj.firstChild.firstChild.data + "\"");
*/
/*
		cObj.normalStyle.paddingLeft = "1px";
		cObj.normalStyle.paddingRight = "1px";
		cObj.normalStyle.paddingTop = "1px";
		cObj.normalStyle.paddingBottom = "1px";
*/
//		cObj.data = "<![CDATA[ ]]>";

//		this.printAttr( cObj);
//		this.printAttr( cObj.firstChild);

		i++;

		cObj = cObj.nextSibling;
	};
};

/************************************************************/
function _printAttr( sleeve) {
	var szAttr =
		"[l;t;w;h, p-l;r;t;b]" +
		" = " +
		Array(
			sleeve.normalStyle.left,
			sleeve.normalStyle.top,
			sleeve.normalStyle.width,
			sleeve.normalStyle.height
		).join( ",")

		+ ", " +

		Array(
			sleeve.normalStyle.paddingLeft,
			sleeve.normalStyle.paddingRight,
			sleeve.normalStyle.paddingTop,
			sleeve.normalStyle.paddingBottom
		).join( ",");

	debug_log( "[" + szAttr + "]");
};

/************************************************************/
function _cycleBackgroundColour( szOverlayId, nInterval) {
	if( szOverlayId == null) {
		return;
	};

	var oObj = document.getElementById( szOverlayId);

	if( oObj == null) {
		return;
	};

	var nSleepMilliSec = (nInterval == null) ? 1000 : nInterval;

	var nBgIdx = gString.stripUnit( oObj.normalStyle.backgroundColorIndex);

	debug_log( "Counting down background colour from :" + nBgIdx);

	while( nBgIdx >= 0) {
		browser.lockScreen();
		oObj.firstChild.data = nBgIdx;
		oObj.normalStyle.backgroundColorIndex = nBgIdx;
		browser.unlockScreen();

		var nRet = browser.playRomSound( "romsound://" + nBgIdx);

		if( nRet == NaN) {
			debug_log( "No ROM sound #" + nBgIdx);
		};

//		debug_log( "Sleep start");
		browser.sleep( nSleepMilliSec);
//		debug_log( "Sleep end");
		nBgIdx--;
	};
};

