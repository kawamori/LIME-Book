/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Dependencies:
 * - gDbg
 * - gArray
 * - gMath
 */

/************************************************************
 * Global variables
 */

/************************************************************
 * Wrapper class
 */
function LineWrap( nBoxWidth, nFontSize) {
	this.init = __LineWrap_init;
	this.wrap = __LineWrap_wrap;

	this.init( nBoxWidth, nFontSize);
};

/************************************************************
 Internal functions
 ************************************************************/
function __LineWrap_init( nBoxWidth, nFontSize) {
	this.nMaxCharPerLine =
		((nBoxWidth == null) ? 100 : nBoxWidth) /
		((nFontSize == null) ? 10 : nFontSize) * 2;

	if( (this.nMaxCharPerLine == 0) || isNaN( this.nMaxCharPerLine)) {
		this.nMaxCharPerLine = 1;
	};

	this.szPad = '';

	for( var i = 0; i < this.nMaxCharPerLine; i++) {
		this.szPad += ' ';
	};

	gDbg.print( "Max char per line = " + this.nMaxCharPerLine);
};

/************************************************************/
function __LineWrap_wrap( szLine) {
	var pszWords = szLine.split( ' ');
	var pszReturn = new Array();

	var szLine = '';
	var nChar = 0;
	var i = 0;

	while( i < pszWords.length) {
		if( nChar + pszWords[ i].length > this.nMaxCharPerLine - 1) {
			if( nChar == 0) {
				pszReturn[ pszReturn.length] =
					pszWords[ i].substring( 0, this.nMaxCharPerLine);

				pszWords[ i] = pszWords[ i].substring( this.nMaxCharPerLine);
			}
			else if( pszWords[ i].length > this.nMaxCharPerLine) {
				pszReturn[ pszReturn.length] =
					szLine + ' ' +
					pszWords[ i].substring( 0,
											this.nMaxCharPerLine - 1 - nChar);

				pszWords[ i] =
					pszWords[ i].substring( this.nMaxCharPerLine - 1 - nChar);

				szLine = '';
				nChar = 0;
			}
			else {
				pszReturn[ pszReturn.length] =
					szLine +
					this.szPad.substring( 0, this.nMaxCharPerLine - nChar);

				szLine = '';
				nChar = 0;
			};
			continue;
		}
		else {
			if( (nChar > 0) && (pszWords[ i].length > 0)) {
				szLine += ' ';
				nChar++;
			};

			szLine += pszWords[ i];
			nChar += pszWords[ i].length;
		};

		i++;
	};

	if( nChar > 0) {
		pszReturn[ pszReturn.length] = szLine;
		szLine = '';
		nChar = 0;
	};

	return( pszReturn.join( ''));
};

