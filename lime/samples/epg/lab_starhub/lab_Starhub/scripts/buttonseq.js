/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */

/************************************************************
 * Wrapper class
 */
function ButtonSeq( nIdx, pButton, sObj, szShortDesc, szHint, szThumbURI) {
	this.nIndex = nIdx;
	this.pButton = pButton;

	this.sObj = new StyleInfo();
	this.sObj.copy( sObj);

	this.fObj = new FocusMap();

	this.idx = __ButtonSeq_idx;
	this.obj = __ButtonSeq_obj;
	this.toString = __ButtonSeq_toString;
//	this.valueOf = __ButtonSeq_valueOf;

	this.shortDesc = __ButtonSeq_shortDesc;
	this.hint = __ButtonSeq_hint;
	this.thumb = __ButtonSeq_thumb;

	this.shortDesc( szShortDesc);
	this.hint( szHint);
	this.thumb( szThumbURI);
};

/************************************************************/
function __ButtonSeq_idx() {
	return( this.nIndex);
};

/************************************************************/
function __ButtonSeq_obj() {
	return( this.pButton);
};

/************************************************************/
function __ButtonSeq_copy( bsObj) {
	this.nIndex = bsObj.nIndex;
	this.pButton = bsObj.pButton;
	this.sObj.copy( bsObj.sObj);
	this.fObj.copy( bsObj.fObj);
};

/************************************************************/
function __ButtonSeq_toString() {
	return( "" + this.idx() + ":" + this.pButton.firstChild.firstChild.data);
	return( "" + this.idx() + ":" + this.pButton.firstChild.firstChild.data
			+ ", " + this.sObj.toString() + ", " + this.fObj.toString());
};

/************************************************************/
/*
function __ButtonSeq_valueOf() {
	var bsCopy = new ButtonSeq( this.idx(), this.obj(), this.sObj);
	bsCopy.copy( this);
	return( bsCopy);
};
*/

/************************************************************/
function __ButtonSeq_shortDesc( szShortDesc) {
	if( szShortDesc != null) {
		this.szShortDesc = szShortDesc;
	};
	return( this.szShortDesc);
};

/************************************************************/
function __ButtonSeq_hint( szHint) {
	if( szHint != null) {
		this.szHint = szHint;
	};
	return( this.szHint);
};

/************************************************************/
function __ButtonSeq_thumb( szThumbURI) {
	if( szThumbURI != null) {
		this.szThumbURI = szThumbURI;
	};
	return( this.szThumbURI);
};

