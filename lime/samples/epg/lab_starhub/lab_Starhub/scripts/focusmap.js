/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Dependencies:
 * - gDbg
 * - gRC
 */

/************************************************************
 * Global variables
 */

/************************************************************
 * Wrapper class
 */
function FocusMap( l, r, u, d) {
	this.left = __FocusMap_left;
	this.right = __FocusMap_right;
	this.up = __FocusMap_up;
	this.down = __FocusMap_down;

	this.go = __FocusMap_dirByCode;
	this.copy = __FocusMap_copy;
	this.toString = __FocusMap_toString;

	this.left( (l == null) ? NaN : l);
	this.right( (r == null) ? NaN : r);
	this.up( (u == null) ? NaN : u);
	this.down( (d == null) ? NaN : d);
};

/************************************************************/
function __FocusMap_left( l) {
	if( l != null) {
		this.neighbourLeft = l;
	};
	return( this.neighbourLeft);
};

/************************************************************/
function __FocusMap_right( r) {
	if( r != null) {
		this.neighbourRight = r;
	};
	return( this.neighbourRight);
};

/************************************************************/
function __FocusMap_up( u) {
	if( u != null) {
		this.neighbourUp = u;
	};
	return( this.neighbourUp);
};

/************************************************************/
function __FocusMap_down( d) {
	if( d != null) {
		this.neighbourDown = d;
	};
	return( this.neighbourDown);
};

/************************************************************/
function __FocusMap_dirByCode( nCode) {
	gDbg.print( "nCode (" + nCode + ") in ["
				+ Array( gRC.LEFT, gRC.RIGHT, gRC.UP, gRC.DOWN) + "]?");

	if( nCode == gRC.LEFT) {
		return( this.left());
	}
	else if( nCode == gRC.RIGHT) {
		return( this.right());
	}
	else if( nCode == gRC.UP) {
		return( this.up());
	}
	else if( nCode == gRC.DOWN) {
		return( this.down());
	}
	else {
		return( NaN);
	};
};

/************************************************************/
function __FocusMap_copy( fmObj) {
	this.l( fmObj.l());
	this.t( fmObj.t());
	this.w( fmObj.w());
	this.h( fmObj.h());
};

/************************************************************/
function __FocusMap_toString() {
	return( Array( this.left(), this.right(), this.up(), this.down()));
};

