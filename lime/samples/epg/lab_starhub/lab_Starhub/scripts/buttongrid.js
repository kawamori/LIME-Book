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
function ButtonGrid( l, t, r, dx, dy, w, h) {
	this.l = __ButtonGrid_l;
	this.t = __ButtonGrid_t;
	this.r = __ButtonGrid_r;
	this.dx = __ButtonGrid_dx;
	this.dy = __ButtonGrid_dy;
	this.w = __ButtonGrid_w;
	this.h = __ButtonGrid_h;

	// First box left position
	this.l( (l == null) ? NaN : l);

	// First box top position
	this.t( (t == null) ? NaN : t);

	// Number of boxes per row
	this.r( (r == null) ? NaN : r);

	// Inter-box horizontal spacing
	this.dx( (dx == null) ? NaN : dx);

	// Inter-box vertical spacing
	this.dy( (dy == null) ? NaN : dy);

	// Optional box width
	this.w( (w == null) ? NaN : w);

	// Optional box height
	this.h( (h == null) ? NaN : h);
};

/************************************************************/
function __ButtonGrid_l( l) {
	if( l != null) {
		this.nFirstLeft = l;
	};
	return( this.nFirstLeft);
};

/************************************************************/
function __ButtonGrid_t( t) {
	if( t != null) {
		this.nFirstTop = t;
	};
	return( this.nFirstTop);
};

/************************************************************/
function __ButtonGrid_r( r) {
	if( r != null) {
		this.nBoxPerRow = r;
	};
	return( this.nBoxPerRow);
};

/************************************************************/
function __ButtonGrid_dx( dx) {
	if( dx != null) {
		this.nInterBoxSpaceH = dx;
	};
	return( this.nInterBoxSpaceH);
};

/************************************************************/
function __ButtonGrid_dy( dy) {
	if( dy != null) {
		this.nInterBoxSpaceV = dy;
	};
	return( this.nInterBoxSpaceV);
};

/************************************************************/
function __ButtonGrid_w( w) {
	if( w != null) {
		this.nOptionalBoxW = w;
	};
	return( this.nOptionalBoxW);
};

/************************************************************/
function __ButtonGrid_h( h) {
	if( h != null) {
		this.nOptionalBoxH = h;
	};
	return( this.nOptionalBoxH);
};

