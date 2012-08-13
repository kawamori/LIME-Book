/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gArray = new MyArray();

/************************************************************
 * Wrapper class
 */
function MyArray() {
	this.copy = _copyArray;
	this.fill = _fillArray;
	this.pad = _padArray;
	this.getMinMaxPairIdx = _getMinMaxPairIndex;
	this.getMinMaxPair = _getMinMaxPair;
	this.map = _mapFnToElements;
};

/************************************************************
 Internal functions
 ************************************************************/
function _copyArray( pTarget, pSource, pDefault, pfTestFn) {
	var nLength = 0;

	if( pSource != null) {
		nLength = pSource.length;
	};

	if( (pDefault != null) && (nLength < pDefault.length)) {
		nLength = pDefault.length;
	};

//	debug_log( "nLength = " + nLength);

	for( var i = 0; i < nLength; i++) {
		if( (pSource != null) && (pSource.length > i) &&
			((pfTestFn == null) || !pfTestFn( pSource[ i])))
		{
//			debug_log( i + "a");
			pTarget[ i] = pSource[ i];
		}
		else if( (pDefault == null) || (pDefault.length <= i)) {
//			debug_log( i + "b");
			pTarget[ i] = null;
		}
		else {
//			debug_log( i + "c");
			pTarget[ i] = pDefault[ i];
		};
	};

//	return( pTarget);
};

/************************************************************/
function _fillArray( pTarget, value, nLength) {
	var nTargetLen = 0;

	if( (nLength == null) || isNaN( nLength) || (nLength > pTarget.length)) {
		nTargetLen = pTarget.length;
	};

	for( var i = 0; i < nTargetLen; i++) {
		pTarget[ i] = value;
	};

//	return( pTarget);
};

/************************************************************/
function _padArray( pTarget, value, nLength) {
	if( (pTarget == null) || (nLength == null) || isNaN( nLength) ||
		(nLength <= pTarget.length))
	{
		return;
	};

	for( var i = pTarget.length; i < nLength; i++) {
		pTarget[ i] = value;
	};

//	return( pTarget);
};

/************************************************************/
function _getMinMaxPairIndex( pSource, _cmpFn, _transformFn) {
	var cmpFn = (_cmpFn == null) ? gMath.cmp : _cmpFn;
	var transFn = (_transformFn == null) ? gString.echo : _transformFn;
	var nMin = NaN;
	var nMax = NaN;

	for( var i = 0; i < pSource.length; i++) {
		if( isNaN( nMin) ||
			(cmpFn( pSource[ nMin], transFn( pSource[ i])) < 0))
		{
			nMin = i;
		};
		if( isNaN( nMax) ||
			(cmpFn( transFn( pSource[ i]), pSource[ nMax]) < 0))
		{
			nMax = i;
		};
	};

	return( Array( nMin, nMax));
};

/************************************************************/
function _getMinMaxPair( pSource, _cmpFn, _transformFn) {
	var pnMinMaxIdx = this.getMinMaxPairIdx( pSource, _cmpFn);
	var transFn = (_transformFn == null) ? gString.echo : _transformFn;

	return( Array( isNaN( pnMinMaxIdx[0])
						? NaN : transFn( pSource[ pnMinMaxIdx[0]]),
				   isNaN( pnMinMaxIdx[1])
						? NaN : transFn( pSource[ pnMinMaxIdx[1]])));
};

/************************************************************/
function _mapFnToElements( pUpdate, mapFn) {
	if( mapFn == null) {
		return;
	};

	debug_log( "mapFn: " + mapFn);
	debug_log( "# elements: " + pUpdate.length);

	for( var i = 0; i < pUpdate.length; i++) {
		debug_log( i + ": \"" + pUpdate[ i] + "\"");
		pUpdate[ i] = mapFn( pUpdate[ i]);
	};
};

