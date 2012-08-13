/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gString = new MyString();
var gString1 = new MyString1();
/************************************************************
 * Wrapper class
 */
function MyString() {
	this.stripUnit = _stripUnit;
	this.ripNumber = _ripNumber;
	this.extractTsvTable = _mapTsvToArray;
	this.getTsvColumn = _getTsvColumn;
	this.echo = _echo;
};
function MyString1() {
	this.stripUnit = _stripUnit;
	this.ripNumber = _ripNumber;
	this.extractTsvTable1 = _mapTsvToArray1;
	this.getTsvColumn1 = _getTsvColumn1;
	this.echo = _echo;
};
/************************************************************/
function _stripUnit( szAttrVal) {
	if( szAttrVal == null) {
		return( null);
	};

	var i = szAttrVal.length - 1;

	while( i >= 0) {
		if( !isNaN( Number( szAttrVal.substring( i, i + 1)))) {
/*
			debug_log( "break @ " + i + " \"" + szAttrVal.substring( i, i + 1)
						+ "\"");
*/
			break;
		};

		i--;
	};

	if( i >= 0) {
		return( Number( szAttrVal.substring( 0, i + 1)));
	};

	return( 0);
};

/************************************************************/
function _ripNumber( szAttrVal) {
	if( szAttrVal == null) {
		return( null);
	};

	var i = 0;

	while( i < szAttrVal.length) {
		if( isNaN( Number( szAttrVal.substring( i, i + 1)))) {
			break;
		};

		i++;
	};

	return( Number( szAttrVal.substring( 0, i)));
};

/************************************************************/
function _mapTsvToArray( pTable, szAllLines, nField, nColIdx, _transformFn) {
	if( szAllLines == null) {
		return;
	};

	var transFn = (_transformFn == null) ? this.echo : _transformFn;

	var pszLines = szAllLines.split( "\n");

	var nMinField = nField;

	for( var i = 0; i < pszLines.length; i++) {
		var pszRecord = pszLines[ i].split( "\t");

		if( isNaN( nMinField)) {
			nMinField = pszRecord.length;
		};

		if( pszRecord.length < nMinField) {
			continue;
		};
		
		pTable[ pTable.length] =
			(nColIdx == null) ? pszRecord : transFn( pszRecord[ nColIdx]);

	};
};

/************************************************************/
function _getTsvColumn( pList, szAllLines, nColIdx, _transFn) {

		this.extractTsvTable( pList, szAllLines, gMath.max( nColIdx + 1, 2), nColIdx, _transFn);
		
};
/************************************************************/
function _mapTsvToArray1( pTable, szAllLines, nField, nColIdx, _transformFn) {
	if( szAllLines == null) {
		return;
	};

	var transFn = (_transformFn == null) ? this.echo : _transformFn;

	var pszLines = szAllLines.split( "\n");

	var nMinField = nField;

	for( var i = 0; i < pszLines.length; i++) {
		var pszRecord = pszLines[ i].split( "\t");

		if( isNaN( nMinField)) {
			nMinField = pszRecord.length;
		};

		debug_log( "i = " + i + ", pszRecord[ " + pszRecord.length + "] v.s. " + nMinField);

		if( pszRecord.length < nMinField) {
			continue;
		};
		
		pTable[ pTable.length] =
			(nColIdx == null) ? pszRecord : transFn( pszRecord[ nColIdx]);

	};
};

/************************************************************/
/************************************************************/
function _getTsvColumn1( pList, szAllLines, nColIdx, _transFn) {
	this.extractTsvTable1( pList, szAllLines, gMath.max( nColIdx + 1, 2), nColIdx, _transFn);
};
/************************************************************/

function _echo( val) {
	return( val);
};


/************************************************************/

