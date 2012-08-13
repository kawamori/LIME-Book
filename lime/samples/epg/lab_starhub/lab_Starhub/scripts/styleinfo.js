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
function StyleInfo( l, t, w, h) {
	this.l = __StyleInfo_l;
	this.t = __StyleInfo_t;
	this.w = __StyleInfo_w;
	this.h = __StyleInfo_h;

	this.toString = __StyleInfo_toString;
	this.setDomObj = __StyleInfo_setDomObj;
	this.copy = __StyleInfo_copy;

	this.l( (l == null) ? NaN : l);
	this.t( (t == null) ? NaN : t);
	this.w( (w == null) ? NaN : w);
	this.h( (h == null) ? NaN : h);
};

/************************************************************/
function __StyleInfo_l( l) {
	if( l != null) {
		this.nLeft = l;
	};
	return( this.nLeft);
};

/************************************************************/
function __StyleInfo_t( t) {
	if( t != null) {
		this.nTop = t;
	};
	return( this.nTop);
};

/************************************************************/
function __StyleInfo_w( w) {
	if( w != null) {
		this.nWidth = w;
	};
	return( this.nWidth);
};

/************************************************************/
function __StyleInfo_h( h) {
	if( h != null) {
		this.nHeight = h;
	};
	return( this.nHeight);
};

/************************************************************/
function __StyleInfo_toString() {
	return( Array( this.l(), this.t(), this.w(), this.h()));
};

/************************************************************/
function __StyleInfo_setDomObj( pObj) {
	pObj.normalStyle.left = this.l() + "px";
	pObj.normalStyle.top = this.t() + "px";
	pObj.normalStyle.width = this.w() + "px";
	pObj.normalStyle.height = this.h() + "px";
};

/************************************************************/
function __StyleInfo_copy( sObj) {
/*
	this.nLeft = sObj.nLeft;
	this.nTop = sObj.nTop;
	this.nWidth = sObj.nWidth;
	this.nHeight = sObj.nHeight;
*/
	this.l( sObj.l());
	this.t( sObj.t());
	this.w( sObj.w());
	this.h( sObj.h());
};

