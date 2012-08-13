/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gMath = new MyMath();

/************************************************************
 * Wrapper class
 */
function MyMath() {
	this.abs = _absValue;
	this.isEven = _isEven;
	this.isOdd = _isOdd;
	this.pseudoHCF = _pseudoHighestCommonFactor;
	this.min = _minimumValue;
	this.max = _maximumValue;
	this.lt = _lt;
	this.le = _le;
	this.ge = _ge;
	this.gt = _gt;
	this.cmp = _cmp;
};

/************************************************************
 Internal functions
 ************************************************************/
function _absValue( n) {
	var a = n;
	if( a < 0) {
		a = a * -1;
	};
	return( a);
};

/************************************************************/
function _isEven( n) {
	return( (n & 1) ? false : true);
};

/************************************************************/
function _isOdd( n) {
	return( (n & 1) ? true : false);
};

/************************************************************/
function _pseudoHighestCommonFactor( v1, v2) {
	var n1 = v1;
	var n2 = v2;
	var nFactor = 1;

	while( this.isEven( n1) && this.isEven( n2)) {
		n1 /= 2;
		n2 /= 2;
		nFactor <<= 1;
	};

	return( nFactor);
};

/************************************************************/
function _minimumValue( n1, n2) {
	return( (n1 < n2) ? n1 : n2);
};

/************************************************************/
function _maximumValue( n1, n2) {
	return( (n1 > n2) ? n1 : n2);
};

/************************************************************/
function _lt( nLhs, nRhs) {
	return( nLhs < nRhs);
};

/************************************************************/
function _le( nLhs, nRhs) {
	return( nLhs <= nRhs);
};

/************************************************************/
function _ge( nLhs, nRhs) {
	return( nLhs >= nRhs);
};

/************************************************************/
function _gt( nLhs, nRhs) {
	return( nLhs > nRhs);
};

/************************************************************/
function _cmp( nLhs, nRhs) {
	return( (nLhs > nRhs) ? -1 : ((nLhs < nRhs) ? 1 : 0));
};

