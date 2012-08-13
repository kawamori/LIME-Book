/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Dependencies:
 * - gString
 * - gDbg
 * - gRC
 * - gTrans
 */

/************************************************************
 * Global variables
 */

/************************************************************
 * Wrapper class
 */
function Navigator( szMenuBox, ppszHrefLabel, pbgObj, szTagName,
					szButtonClass, szBgButtonRowPrefix, szUrlPrefixPath)
{
	gDbg.print( "Navigator()");

	_NavigatorInitAttribute( this);
	_NavigatorInitMethod( this);

	this.lwObj = new LineWrap();

	this.initButtons( szMenuBox, ppszHrefLabel, pbgObj, szTagName,
					  szButtonClass, szBgButtonRowPrefix, szUrlPrefixPath);

	this.initTransitions( pbgObj);

//	this.setVirtualFocus( this.ppButtonSeq[ this.nFocusIdx].obj());
	this.setVirtualFocusIdx( this.nFocusIdx);
};

/************************************************************/
function _NavigatorInitAttribute( nObj) {
	nObj.mObj = null;
	nObj.dObj = null;

	nObj.hObj = null;
	nObj.nHintOffsetLeft = -25;
	nObj.nHintOffsetTop = -105;

	nObj.tmH = NaN;
	nObj.fnHintOn = null;
	nObj.fnHintOff = null;
	nObj.nHintDelay = 500;
	nObj.nHintLife = 5000;

	nObj.ppButtonSeq = new Array();
	nObj.nFocusIdx = 0;

	nObj.nFocusColourIdx = NaN;
	nObj.nFocusBgColourIdx = NaN;
	nObj.nBlurColourIdx = NaN;
	nObj.nBlurBgColourIdx = NaN;

	nObj.szUrlDefaultPrefix = "/";
//	nObj.szUrlDefaultPrefix = "http://cdn.iptvf.jp/";
//	nObj.szUrlDefaultPrefix = "file://E:/IPTV/NTT/";
//	nObj.szUrlDefaultPrefix = "../../";

	nObj.szDefaultHint = "The quick brown fox jumps over the lazy dog.";
//	nObj.szDefaultHint = 'Coming soon...';
//	nObj.szDefaultHint = '';
};

/************************************************************
 * Internal functions
 ************************************************************/
function _NavigatorInitMethod( nObj) {
	nObj.initTitle = __Navigator_initTitle;

	nObj.compButtonYX = __Navigator_compButtonYX;
	nObj.compButtonXY = __Navigator_compButtonXY;
	nObj.compButtonDefault = __Navigator_compButtonDefault;

	nObj.regFocusBlurColourIndex = __Navigator_regFocusBlurColourIndex;
	nObj.setNextCoord = __Navigator_setNextCoord;
	nObj.regOneNaviButton = __Navigator_regOneNaviButton;

	nObj.initButtons = __Navigator_initButtons;

	nObj.initTransitions = __Navigator_initTransitions;
	nObj.initDescription = __Navigator_initDescription;
	nObj.initHint = __Navigator_initHint;
	nObj.initFocus = __Navigator_initFocus;

	nObj.showHint = __Navigator_showHint;
	nObj.hideHint = __Navigator_hideHint;
	nObj.setVirtualFocus = __Navigator_setVirtualFocus;
	nObj.setVirtualFocusIdx = __Navigator_setVirtualFocusIdx;
	nObj.onKey = __Navigator_onKey;
};

/************************************************************/
function __Navigator_initTitle( szTitleBox) {
	if( szTitleBox == null) {
		return;
	};

	var tObj = document.getElementById( szTitleBox);

	if( this.mObj == null) {
		gDbg.print( "No such element: \"" + szTitleBox + "\"");
		return;
	};

	var pChild = document.documentElement.firstChild;

	while( pChild != null) {
//		gDbg.print( pChild.tagName);

		if( pChild.tagName == "head") {
			if( (pChild.firstChild != null) &&
				(pChild.firstChild.tagName == "title") &&
				(pChild.firstChild.firstChild != null))
			{
//				gDbg.print( pChild.firstChild.firstChild.data);
				tObj.firstChild.data = pChild.firstChild.firstChild.data;
			};
			break;
		};

		pChild = pChild.nextSibling;
	};
};

/************************************************************/
function __Navigator_compButtonYX( pbLhs, pbRhs) {
/*
	gDbg.print( "lhs = " + pbLhs.toString() + " v.s. " +
				"rhs = " + pbRhs.toString());
*/
	if( pbLhs.sObj.t() != pbRhs.sObj.t()) {
//		gDbg.print( "t");
		return( pbLhs.sObj.t() - pbRhs.sObj.t());
	}
	else if( pbLhs.sObj.l() != pbRhs.sObj.l()) {
//		gDbg.print( "l");
		return( pbLhs.sObj.l() - pbRhs.sObj.l());
	}
	else if( pbLhs.sObj.h() != pbRhs.sObj.h()) {
//		gDbg.print( "h");
		return( pbLhs.sObj.h() - pbRhs.sObj.h());
	}
	else if( pbLhs.sObj.w() != pbRhs.sObj.w()) {
//		gDbg.print( "w");
		return( pbLhs.sObj.w() - pbRhs.sObj.w());
	}
	else {
		return( pbLhs.idx() - pbRhs.idx());
//		return( this.compButtonDefault( pbLhs, pbRhs));
	};
};

/************************************************************/
function __Navigator_compButtonXY( pbLhs, pbRhs) {
/*
	gDbg.print( "lhs = " + pbLhs.sObj.toString() + " v.s. " +
				"rhs = " + pbRhs.sObj.toString());
*/
	if( pbLhs.sObj.l() != pbRhs.sObj.l()) {
		return( pbLhs.sObj.l() - pbRhs.sObj.l());
	}
	else if( pbLhs.sObj.t() != pbRhs.sObj.t()) {
		return( pbLhs.sObj.t() - pbRhs.sObj.t());
	}
	else if( pbLhs.sObj.w() != pbRhs.sObj.w()) {
		return( pbLhs.sObj.w() - pbRhs.sObj.w());
	}
	else if( pbLhs.sObj.h() != pbRhs.sObj.h()) {
		return( pbLhs.sObj.h() - pbRhs.sObj.h());
	}
	else {
// gDbg.print( "wtf");
		return( pbLhs.idx() - pbRhs.idx());
//		return( this.compButtonDefault( pbLhs, pbRhs));
	};
};

/************************************************************/
function __Navigator_compButtonDefault( pbLhs, pbRhs) {
	return( pbLhs.idx() - pbRhs.idx());
};

/************************************************************/
function __Navigator_regFocusBlurColourIndex( pButton) {
	if( isNaN( this.nFocusColourIdx)) {
		this.nFocusColourIdx = pButton.focusStyle.colorIndex;
//		gDbg.print( "focus colour index = " + this.nFocusColourIdx);
	};
	if( isNaN( this.nFocusBgColourIdx)) {
		this.nFocusBgColourIdx = pButton.focusStyle.backgroundColorIndex;
//		gDbg.print( "bg focus colour index = " + this.nFocusBgColourIdx);
	};
	if( isNaN( this.nBlurColourIdx)) {
		this.nBlurColourIdx = pButton.normalStyle.colorIndex;
//		gDbg.print( "normal colour index = " + this.nBlurColourIdx);
	};
	if( isNaN( this.nBlurBgColourIdx)) {
		this.nBlurBgColourIdx = pButton.normalStyle.backgroundColorIndex;
//		gDbg.print( "bg normal colour index = " + this.nBlurBgColourIdx);
	};
};

/************************************************************/
function __Navigator_setNextCoord( sObj, pbgObj, pButton, nNextColIdx) {
	var nColIdx = nNextColIdx;

	if( isNaN( sObj.w())) {
		sObj.w( gString.stripUnit( pButton.normalStyle.width));
		gDbg.print( "w = " + sObj.w());
	};

	if( sObj.w() == 0) {
		sObj.w( pbgObj.w());
	};

	if( isNaN( sObj.h())) {
		sObj.h( gString.stripUnit( pButton.normalStyle.height));
		gDbg.print( "h = " + sObj.h());
	};

	if( sObj.h() == 0) {
		sObj.h( pbgObj.h());
	};

	if( nColIdx == pbgObj.r()) {
		nColIdx = 0;
		sObj.l( pbgObj.l());
		sObj.t( sObj.t() + sObj.h() + pbgObj.dy());
	};

	nColIdx++;

	return( nColIdx);
};

/************************************************************/
function __Navigator_regOneNaviButton( pButton, ppszHrefLabel, nIdx, sObj,
									   szUrlPrefix, bNewRow)
{
	var bReturn = true;

	if( pButton.type != null) {
		// Assume dom element is an image object if its type attribute is set.
		return( bReturn);
	};

	/* Not an image object implies should be a <p> element, containing an
	 * <a> element, containing a CDATA element.
	 */

	var szShortDesc = null;
	var szHint = null;

	if( (ppszHrefLabel != null) && (nIdx < ppszHrefLabel.length)) {
		/* Href, label, desc, hint, pic info available for current
		 * button index.
		 */
		gDbg.print( nIdx + ": setting anchor "
					+ pButton.firstChild.firstChild.data
					+ " -> " + ppszHrefLabel[ nIdx]);

		pButton.firstChild.href = szUrlPrefix + ppszHrefLabel[ nIdx][ 0];

		gDbg.print( "href = " + pButton.firstChild.href);

		pButton.firstChild.firstChild.data = ppszHrefLabel[ nIdx][ 1];

		// TODO: pre-process desc, hint & pic information.

		if( ppszHrefLabel[ nIdx].length > 2) {
			szShortDesc = ppszHrefLabel[ nIdx][ 2];
		};

		if( ppszHrefLabel[ nIdx].length > 3) {
			szHint = ppszHrefLabel[ nIdx][ 3];
		};
	}
	else {
		/* No href, label, desc, hint, pic info available for current
		 * button index.
		 */
		pButton.firstChild.firstChild.data =
			"= " + pButton.firstChild.firstChild.data + " =";

		bReturn = !( bNewRow);
	};

	if( bReturn) {
		this.ppButtonSeq[ this.ppButtonSeq.length] =
			new ButtonSeq( nIdx, pButton, sObj, szShortDesc, szHint);

		gDbg.print( this.ppButtonSeq[ this.ppButtonSeq.length - 1]);
	};

	return( bReturn);
};

/************************************************************/
function __Navigator_initButtons( szMenuBox, ppszHrefLabel, pbgObj,
								  szTagName, szButtonClass,
								  szBgButtonRowPrefix, szUrlPrefixPath)
{
	if( szMenuBox == null) {
		return;
	};

	this.mObj = document.getElementById( szMenuBox);

	if( this.mObj == null) {
		gDbg.print( "No such element: \"" + szMenuBox + "\"");
		return;
	};

	var szUrlPrefix =
		(szUrlPrefixPath == null) ? this.szUrlDefaultPrefix : szUrlPrefixPath;

	var pButton = this.mObj.firstChild;

	var sObj = new StyleInfo( pbgObj.l(), pbgObj.t(), NaN, NaN);

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

		this.regFocusBlurColourIndex( pButton);

		if( (ppszHrefLabel != null) && (x == pbgObj.r()) &&
			(szBgButtonRowPrefix != null))
		{
			// One row of buttons filled - reveal background button row.
			gDbg.print( "Unhide: " + szBgButtonRowPrefix + (i / pbgObj.r()));
			gTrans.show( szBgButtonRowPrefix + (i / pbgObj.r()));
		};

		x = this.setNextCoord( sObj, pbgObj, pButton, x);

//		gDbg.print( "[l,t,w,h] = [" + sObj.toString() + "] x = " + x);

		if( !( this.regOneNaviButton( pButton, ppszHrefLabel, i, sObj,
									  szUrlPrefix, (x == 1))))
		{
			break;
		};

//		gDbg.print( this.ppButtonSeq.length + " v.s. " + i);

		if( this.ppButtonSeq.length <= i) {
			break;
		};

		/* Set coordinate & dimensions for all button objects, whether they
		 * are image objects or <p> elements.
		 */
		sObj.setDomObj( pButton);

		sObj.l( sObj.l() + sObj.w() + pbgObj.dx());
		pButton = pButton.nextSibling;
		i++;
	};

	gDbg.print( "x = " + x);

	if( (ppszHrefLabel != null) && (i > 0) && (x == pbgObj.r()) &&
		(szBgButtonRowPrefix != null))
	{
		/* Last row of buttons at least partially filled - reveal
		 * background button row.
		 */
		gDbg.print( "Unhide: " + szBgButtonRowPrefix + (i / pbgObj.r()));
		gTrans.show( szBgButtonRowPrefix + (i / pbgObj.r()));
	};

	gDbg.print( i + " button(s)");

//	mObj.normalStyle.visibility = "visible";
}

/************************************************************/
function __Navigator_initTransitions() {
	var i;

	this.ppButtonSeq.sort( this.compButtonYX);
//	gDbg.print( "Sort by YX: " + this.ppButtonSeq);

	for( i = 0; i < this.ppButtonSeq.length; i++) {
		var nPrev = (i == 0) ? this.ppButtonSeq.length - 1 : i - 1;
		var nNext = (i == this.ppButtonSeq.length - 1) ? 0 : i + 1;

		this.ppButtonSeq[ i].fObj.left( this.ppButtonSeq[ nPrev].idx());
		this.ppButtonSeq[ i].fObj.right( this.ppButtonSeq[ nNext].idx());
/*
		gDbg.print( this.ppButtonSeq[ nPrev].idx()
					+ " <-- " + this.ppButtonSeq[ i].idx() + " --> "
					+ this.ppButtonSeq[ nNext].idx());
*/
	};

	this.ppButtonSeq.sort( this.compButtonXY);
//	this.ppButtonSeq.reverse();
//	gDbg.print( "Sort by XY: " + this.ppButtonSeq);

	for( i = 0; i < this.ppButtonSeq.length; i++) {
		var nPrev = (i == 0) ? this.ppButtonSeq.length - 1 : i - 1;
		var nNext = (i == this.ppButtonSeq.length - 1) ? 0 : i + 1;

		this.ppButtonSeq[ i].fObj.up( this.ppButtonSeq[ nPrev].idx());
		this.ppButtonSeq[ i].fObj.down( this.ppButtonSeq[ nNext].idx());
/*
		gDbg.print( this.ppButtonSeq[ nPrev].idx()
					+ " ^ " + this.ppButtonSeq[ i].idx() + " v "
					+ this.ppButtonSeq[ nNext].idx());
*/
	};

	this.ppButtonSeq.sort( this.compButtonDefault);
//	gDbg.print( "Sort: " + this.ppButtonSeq);
};

/************************************************************/
function __Navigator_initDescription( szDescBox) {
	if( szDescBox == null) {
		return;
	};

	this.dObj = document.getElementById( szDescBox);

	if( this.dObj == null) {
		gDbg.print( "No such element: \"" + szDescBox + "\"");
		return;
	};
};

/************************************************************/
function __Navigator_initHint( szHintBox, fnHide, fnShow, nDelay, nDuration,
							   rx, ry)
{
	if( szHintBox == null) {
		return;
	};

	this.hObj = document.getElementById( szHintBox);

	if( this.hObj == null) {
		gDbg.print( "No such element: \"" + szHintBox + "\"");
		return;
	};

	if( fnHide != null) {
		this.fnHintOff = fnHide;
	};

	if( fnShow != null) {
		this.fnHintOn = fnShow;
	};

	if( nDelay != null) {
		this.nHintDelay = nDelay;
	};

	if( nDuration != null) {
		this.nHintLife = nDuration;
	};

	if( rx != null) {
		this.nHintOffsetLeft = rx;
	};

	if( ry != null) {
		this.nHintOffsetTop = ry;
	};

	this.lwObj.init(
		gString.stripUnit( this.hObj.lastChild.normalStyle.width),
		gString.stripUnit( this.hObj.lastChild.normalStyle.fontSize));
};

/************************************************************/
function __Navigator_initFocus() {
//	this.setVirtualFocus( this.ppButtonSeq[ this.nFocusIdx].obj());
	this.setVirtualFocusIdx( this.nFocusIdx);
};

/************************************************************/
function __Navigator_showHint() {
	if( this.hObj == null) {
		return;
	};

		if( !isNaN( this.tmH)) {
			browser.clearTimer( this.tmH);
			this.tmH = NaN;
		};

	this.hObj.normalStyle.visibility = "visible";

		if( this.fnHintOff != null) {
			this.tmH = browser.setInterval( this.fnHintOff, this.nHintLife, 1);
		};
};

/************************************************************/
function __Navigator_hideHint() {
	if( this.hObj == null) {
		return;
	};

		if( !isNaN( this.tmH)) {
			browser.clearTimer( this.tmH);
			this.tmH = NaN;
		};

	this.hObj.normalStyle.visibility = "hidden";
};

/************************************************************/
function __Navigator_setVirtualFocus( pbToFocus, pbToBlur) {
	if( pbToBlur != null) {
		pbToBlur.normalStyle.colorIndex = this.nBlurColourIdx;
		pbToBlur.normalStyle.backgroundColorIndex = this.nBlurBgColourIdx;
	};

	pbToFocus.normalStyle.colorIndex = this.nFocusColourIdx;
	pbToFocus.normalStyle.backgroundColorIndex = this.nFocusBgColourIdx;
};

/************************************************************/
function __Navigator_setVirtualFocusIdx( nToFocusIdx, nToBlurIdx) {
	if( nToFocusIdx == null) {
		return;
	};

	var nFocusIdx = parseInt( nToFocusIdx);

	if( (nFocusIdx < 0) || (this.ppButtonSeq.length <= nFocusIdx)) {
		return;
	};

	var pbToFocus = this.ppButtonSeq[ nFocusIdx].obj();
	var pbToBlur = null;

	if( nToBlurIdx != null) {
		var nBlurIdx = parseInt( nToBlurIdx);

		if( (0 <= nBlurIdx) && (nBlurIdx < this.ppButtonSeq.length)) {
			pbToBlur = this.ppButtonSeq[ nBlurIdx].obj();
		};
	};

	this.setVirtualFocus( pbToFocus, pbToBlur);

	if( this.dObj != null) {
		this.dObj.firstChild.data =
			(this.ppButtonSeq[ nFocusIdx].shortDesc() == null)
				? this.ppButtonSeq[ nFocusIdx].obj().firstChild.href
				: this.ppButtonSeq[ nFocusIdx].shortDesc();
	};

	if( this.hObj != null) {
		gDbg.print( "Positioning hint box...");

		this.hideHint();

		this.hObj.normalStyle.left =
			(this.ppButtonSeq[ nFocusIdx].sObj.l() + this.nHintOffsetLeft)
			+ "px";
		this.hObj.normalStyle.top =
			(this.ppButtonSeq[ nFocusIdx].sObj.t() + this.nHintOffsetTop)
			+ "px";

		var szHint = (this.ppButtonSeq[ nFocusIdx].hint() == null)
						? this.szDefaultHint
						: this.ppButtonSeq[ nFocusIdx].hint();

		if( (szHint != null) && (szHint.length > 0)) {
			this.hObj.lastChild.firstChild.data = this.lwObj.wrap( szHint);
			this.tmH = browser.setInterval( this.fnHintOn, this.nHintDelay, 1);
		};
	};
};

/************************************************************
 DOM event functions
 ************************************************************/
function __Navigator_onKey() {
	gDbg.print( "onKey()");

	var e = document.currentEvent;

	var nCode = e.keyCode;
	var szId = e.target.id;

	gDbg.print( "Key code = " + nCode + " (" + gRC.keyName( nCode) + ") -> \""
				+ szId + "\"");

	if( gRC.isNaviKey( nCode)) {
		gDbg.print( this.ppButtonSeq[ this.nFocusIdx].fObj.toString());

		var nNewFocusIdx = this.ppButtonSeq[ this.nFocusIdx].fObj.go( nCode);

		gDbg.print( "Key code = " + nCode + ", focus: " + this.nFocusIdx
					+ " -> " + nNewFocusIdx);
/*
		gDbg.print( "Huh? " + " " + this.nFocusIdx + " "
					+ this.ppButtonSeq[ this.nFocusIdx]);
		gDbg.print( "--> " + nNewFocusIdx + " "
					+ this.ppButtonSeq[ nNewFocusIdx]);
*/
		gDbg.print( "Change focus: " +
					this.ppButtonSeq[ this.nFocusIdx]
							.obj().firstChild.firstChild.data +
					" -> " +
					this.ppButtonSeq[ nNewFocusIdx]
							.obj().firstChild.firstChild.data);
/*
		this.setVirtualFocus( this.ppButtonSeq[ nNewFocusIdx].obj(),
							  this.ppButtonSeq[ this.nFocusIdx].obj());
*/
		this.setVirtualFocusIdx( nNewFocusIdx, this.nFocusIdx);
		this.nFocusIdx = nNewFocusIdx;
	}
	else if( gRC.isEnterKey( nCode)) {
		gDbg.print( "\"" + this.ppButtonSeq[ this.nFocusIdx]
								.obj().firstChild.href + "\"");

		if( (this.ppButtonSeq[ this.nFocusIdx].obj().firstChild.href == null) ||
			(this.ppButtonSeq[ this.nFocusIdx].obj().firstChild.href == ""))
		{
			gDbg.print( "No link for "
						+ this.ppButtonSeq[ this.nFocusIdx]
									.obj().firstChild.firstChild.data);
		}
		else {
			gTrans.show( "loadingbox");

			gDbg.print( "Launching "
						+ this.ppButtonSeq[ this.nFocusIdx]
								.obj().firstChild.firstChild.data + " ...");
			gDbg.print( "\"" + this.ppButtonSeq[ this.nFocusIdx]
									.obj().firstChild.href + "\"");

			var ret = browser.launchDocument(
						this.ppButtonSeq[ this.nFocusIdx]
								.obj().firstChild.href, "cut");
		};
	}
	else {
		// Do nothing.
	};
};

