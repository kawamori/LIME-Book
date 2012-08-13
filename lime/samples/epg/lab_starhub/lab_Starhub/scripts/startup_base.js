/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gClock = new MyClock();
var gTrans = new Transition();

var nTotalRunTimeSec = 0;
var ppButtonSeq = new Array();
var nFocusIdx = 0;
var nOffset = 3;

var nFocusColourIdx = 7;
var nFocusBgColourIdx = 8;
var nBlurColourIdx = 41;
var nBlurBgColourIdx = 17;

var szUrlDefaultPrefix = "/";
// var szUrlDefaultPrefix = "http://cdn.iptvf.jp/";
// var szUrlDefaultPrefix = "file://E:/IPTV/NTT/";
// var szUrlDefaultPrefix = "../../";

var ppnButtonCoordInfo = new Array(
	55,		// first box left position
	139,	// first box top position
	5,		// number of boxes per row
	11,		// inter-box horizontal spacing
	68,		// inter-box vertical spacing
	161,	// optional box width
	75		// optional box height
);

var ppszHrefLabelPairs = new Array(
/*
	new Array( "lab_demo/bml/startup.bml", "Demo"),
	new Array( "lab_beta/bml/startup.bml", "Beta")
*/
	new Array( "lab_demo100122/bml/startup.bml", "Demo"),
	new Array( "lab_beta100122/bml/startup.bml", "Beta")
);

/************************************************************/
function compButtonYX( pbLhs, pbRhs) {
	var nOffset = 2;

	if( pbLhs[ nOffset][ gTrans.TOP] != pbRhs[ nOffset][ gTrans.TOP]) {
		return( pbLhs[ nOffset][ gTrans.TOP] -
				pbRhs[ nOffset][ gTrans.TOP]);
	}
	else if( pbLhs[ nOffset][ gTrans.LEFT] != pbRhs[ nOffset][ gTrans.LEFT]) {
		return( pbLhs[ nOffset][ gTrans.LEFT] -
				pbRhs[ nOffset][ gTrans.LEFT]);
	}
	else if( pbLhs[ nOffset][ gTrans.HEIGHT] != pbRhs[ nOffset][ gTrans.HEIGHT])
	{
		return( pbLhs[ nOffset][ gTrans.HEIGHT] -
				pbRhs[ nOffset][ gTrans.HEIGHT]);
	}
	else if( pbLhs[ nOffset][ gTrans.WIDTH] != pbRhs[ nOffset][ gTrans.WIDTH]) {
		return( pbLhs[ nOffset][ gTrans.WIDTH] -
				pbRhs[ nOffset][ gTrans.WIDTH]);
	}
	else {
		return( compButtonDefault( pbLhs, pbRhs));
	};
};

/************************************************************/
function compButtonXY( pbLhs, pbRhs) {
	var nOffset = 2;

	if( pbLhs[ nOffset][ gTrans.LEFT] != pbRhs[ nOffset][ gTrans.LEFT]) {
		return( pbLhs[ nOffset][ gTrans.LEFT] -
				pbRhs[ nOffset][ gTrans.LEFT]);
	}
	else if( pbLhs[ nOffset][ gTrans.TOP] != pbRhs[ nOffset][ gTrans.TOP]) {
		return( pbLhs[ nOffset][ gTrans.TOP] -
				pbRhs[ nOffset][ gTrans.TOP]);
	}
	else if( pbLhs[ nOffset][ gTrans.WIDTH] != pbRhs[ nOffset][ gTrans.WIDTH]) {
		return( pbLhs[ nOffset][ gTrans.WIDTH] -
				pbRhs[ nOffset][ gTrans.WIDTH]);
	}
	else if( pbLhs[ nOffset][ gTrans.HEIGHT] != pbRhs[ nOffset][ gTrans.HEIGHT])
	{
		return( pbLhs[ nOffset][ gTrans.HEIGHT] -
				pbRhs[ nOffset][ gTrans.HEIGHT]);
	}
	else {
		return( compButtonDefault( pbLhs, pbRhs));
	};
};

/************************************************************/
function compButtonDefault( pbLhs, pbRhs) {
	return( pbLhs[ 0] - pbRhs[ 0]);
};

/************************************************************/
function initButtons( szMenuBox, ppszHrefLabel, ppnButtonCoord, szTagName,
					  szButtonClass, szUrlPrefixPath)
{
	if( szMenuBox == null) {
		return;
	};

	var mObj = document.getElementById( szMenuBox);

	if( mObj == null) {
		debug_log( "No such element: \"" + szMenuBox + "\"");
		return;
	};

	var szUrlPrefix =
		(szUrlPrefixPath == null) ? szUrlDefaultPrefix : szUrlPrefixPath;

	var nOffset = 2;
	var pButton = mObj.firstChild;

	var l = ppnButtonCoord[ 0];
	var t = ppnButtonCoord[ 1];
	var w = NaN;
	var h = NaN;
	var x = 0;

	var i = 0;

	while( pButton != null) {
		if( ((szTagName != null) && (pButton.tagName != szTagName)) ||
			((szButtonClass != null) && ((pButton.className == null) ||
										 (pButton.className != szButtonClass))))
		{
			pButton = pButton.nextSibling;
			continue;
		};

		if( isNaN( w)) {
			w = gString.stripUnit( pButton.normalStyle.width);
			debug_log( "w = " + w);
		};
		if( w == 0) {
			w = ppnButtonCoord[ 5];
		};

		if( isNaN( h)) {
			h = gString.stripUnit( pButton.normalStyle.height);
			debug_log( "h = " + h);
		};
		if( h == 0) {
			h = ppnButtonCoord[ 6];
		};
		if( x == ppnButtonCoord[ 2]) {
			x = 0;
			l = ppnButtonCoord[ 0];
			t += h + ppnButtonCoord[ 4];
		}
		else {
			x++;
		};

		debug_log( "[l,t,w,h] = [" + Array( l, t, w, h) + "]");

		if( pButton.type == null) {
			if( (ppszHrefLabel != null) && (i < ppszHrefLabel.length)) {
				debug_log( i + ": setting anchor "
							+ pButton.firstChild.firstChild.data
							+ " -> " + ppszHrefLabel[ i]);

				pButton.firstChild.href = szUrlPrefix + ppszHrefLabel[ i][ 0];

				debug_log( pButton.firstChild.href);

				pButton.firstChild.firstChild.data = ppszHrefLabel[ i][ 1];
			}
			else {
				pButton.firstChild.firstChild.data =
					"= " + pButton.firstChild.firstChild.data + " =";
			};

			var j = ppButtonSeq.length;

			ppButtonSeq[ j] = new Array( i, pButton, new Array( 0, 0, 0, 0),
													 new Array( 0, 0, 0, 0, 0));

			ppButtonSeq[ j][ nOffset][ gTrans.LEFT] = l;
			ppButtonSeq[ j][ nOffset][ gTrans.TOP] = t;
			ppButtonSeq[ j][ nOffset][ gTrans.WIDTH] = w;
			ppButtonSeq[ j][ nOffset][ gTrans.HEIGHT] = h;
		};

		pButton.normalStyle.left = l + "px";
		pButton.normalStyle.top = t + "px";
		pButton.normalStyle.width = w + "px";
		pButton.normalStyle.height = h + "px";

		l += w + ppnButtonCoord[ 3];
		i++;
		pButton = pButton.nextSibling;
	};

	debug_log( i + " button(s)");
}

/************************************************************/
function initTransitions() {
	var nOffset = 3;
	var i;
/*
//	var xxxx =
		new Array( new Array( "b", "d"), new Array( "a"), new Array( "c"));

	var xxxx = new Array();
	debug_log( xxxx.length);

	xxxx[ 0] = new Array( "b", "d");
	debug_log( xxxx.length);

	xxxx[ xxxx.length] = new Array( "a", "e");
	debug_log( xxxx.length);

	xxxx[ xxxx.length] = new Array( "c", "f");
	debug_log( xxxx.length);

	xxxx.sort();
	debug_log( xxxx);
*/

//	debug_log( "Sort by YX: " + ppButtonSeq[0]);

//	ppButtonSeq.sort();
//	ppButtonSeq.sort( new Function( a, b, "return( compButtonYX( a, b));"));
	ppButtonSeq.sort( compButtonYX);
//	debug_log( "Sort by YX: " + ppButtonSeq);

	for( i = 0; i < ppButtonSeq.length; i++) {
		var nPrev = (i == 0) ? ppButtonSeq.length - 1 : i - 1;
		var nNext = (i == ppButtonSeq.length - 1) ? 0 : i + 1;

		ppButtonSeq[ i][ nOffset][ gRC.LEFT] = ppButtonSeq[ nPrev][ 0];
		ppButtonSeq[ i][ nOffset][ gRC.RIGHT] = ppButtonSeq[ nNext][ 0];
/*
		debug_log( ppButtonSeq[ nPrev][ 0]
					+ " <-- " + ppButtonSeq[ i][ 0] + " --> "
					+ ppButtonSeq[ nNext][ 0]);
*/
	};

	ppButtonSeq.sort( compButtonXY);
//	debug_log( "Sort by XY: " + ppButtonSeq);

	for( i = 0; i < ppButtonSeq.length; i++) {
		var nPrev = (i == 0) ? ppButtonSeq.length - 1 : i - 1;
		var nNext = (i == ppButtonSeq.length - 1) ? 0 : i + 1;

		ppButtonSeq[ i][ nOffset][ gRC.UP] = ppButtonSeq[ nPrev][ 0];
		ppButtonSeq[ i][ nOffset][ gRC.DOWN] = ppButtonSeq[ nNext][ 0];
/*
		debug_log( ppButtonSeq[ nPrev][ 0]
					+ " ^ " + ppButtonSeq[ i][ 0] + " v "
					+ ppButtonSeq[ nNext][ 0]);
*/
	};

	ppButtonSeq.sort( compButtonDefault);
//	debug_log( "Sort: " + ppButtonSeq);
};

/************************************************************/
function tick() {
	nTotalRunTimeSec++;
	gClock.tick();
};

/************************************************************/
function setVirtualFocus( pbToFocus, pbToBlur) {
	if( pbToBlur != null) {
		pbToBlur.normalStyle.colorIndex = nBlurColourIdx;
//			pbToFocus.normalStyle.colorIndex;
		pbToBlur.normalStyle.backgroundColorIndex = nBlurBgColourIdx;
//			pbToFocus.normalStyle.backgroundColorIndex;
	};

	pbToFocus.normalStyle.colorIndex = nFocusColourIdx;
//		pbToFocus.focusStyle.colorIndex;
	pbToFocus.normalStyle.backgroundColorIndex = nFocusBgColourIdx;
//		pbToFocus.focusStyle.backgroundColorIndex;
};

/************************************************************
 DOM event functions
 ************************************************************/
function onLoad() {
	gClock.setDisplay( "clock");
	gClock.start( "tick();");
	gTrans.hide( "loadingbox");

//	var ret = browser.launchDocument( "startup_demo.bml", "cut");
//	var ret = browser.launchDocument( "startup.bml", "cut");

	initButtons( "layer1", ppszHrefLabelPairs, ppnButtonCoordInfo,
				 null, "buttonbox");

	initButtons( "layer1", null, ppnButtonCoordInfo, "object");

	initTransitions();
	setVirtualFocus( ppButtonSeq[ nFocusIdx][ 1]);
/*
*/
	blah();
};

/************************************************************/
function onUnload() {
	gClock.stop();
};

/************************************************************/
function onKey() {
	debug_log( "onKey()");

	var e = document.currentEvent;

	var nCode = e.keyCode;
	var szId = e.target.id;

	debug_log( "Key code = " + nCode + " (" + gRC.keyName( nCode) + ") -> \""
				+ szId + "\"");

	var nOffset = 3;

	if( gRC.isNaviKey( nCode)) {
		var nNewFocusIdx = ppButtonSeq[ nFocusIdx][ nOffset][ nCode];

		debug_log( "Key code = " + nCode + ", focus: " + nFocusIdx + " -> "
					+ nNewFocusIdx);
/*
		debug_log( "Huh? " + nOffset + " " + nFocusIdx + " "
					+ ppButtonSeq[ nFocusIdx]);
		debug_log( "--> " + nNewFocusIdx + " " + ppButtonSeq[ nNewFocusIdx]);
*/
		debug_log( "Change focus: " +
					ppButtonSeq[ nFocusIdx][ 1].firstChild.firstChild.data +
					" -> " +
					ppButtonSeq[ nNewFocusIdx][ 1].firstChild.firstChild.data);

		setVirtualFocus( ppButtonSeq[ nNewFocusIdx][ 1],
						 ppButtonSeq[ nFocusIdx][ 1]);
		nFocusIdx = nNewFocusIdx;
/*
		ppButtonSeq[ nFocusIdx][ 1].focus();
		document.getElementById( "default").focus();
*/
	}
	else if( gRC.isEnterKey( nCode)) {
		debug_log( "\"" + ppButtonSeq[ nFocusIdx][ 1].firstChild.href + "\"");

		if( (ppButtonSeq[ nFocusIdx][ 1].firstChild.href == null) ||
			(ppButtonSeq[ nFocusIdx][ 1].firstChild.href == ""))
		{
			debug_log( "No link for " +
				ppButtonSeq[ nFocusIdx][ 1].firstChild.firstChild.data);
		}
		else {
			gTrans.show( "loadingbox");
			debug_log( "Launching " +
				ppButtonSeq[ nFocusIdx][ 1].firstChild.firstChild.data
				+ " ...");
			debug_log( "\"" + ppButtonSeq[ nFocusIdx][ 1].firstChild.href
						+ "\"");

			var ret = browser.launchDocument(
						ppButtonSeq[ nFocusIdx][ 1].firstChild.href, "cut");

		};
	};
};

