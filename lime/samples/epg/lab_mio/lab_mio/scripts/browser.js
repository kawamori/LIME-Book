/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gBrowser = new MyBrowser();

/************************************************************
 * Wrapper class
 */
function MyBrowser() {
	this.getTsv = _retrieveTsv;
};

/************************************************************
 Internal functions
 ************************************************************/
function _retrieveTsv( szUrl, _szMesg, _szEncoding) {
	var szMesg = (_szMesg == null) ? "" : _szMesg;
	var szEncoding = (_szEncoding == null) ? "EUC-JP" : _szEncoding;

	var pszReturn = browser.transmitTextDataOverIP( szUrl, szMesg, szEncoding);

	if( pszReturn[0] != 1) {
		// Error.
		debug_log( "Retrieve error \"" + pszReturn[2] + "\"");
		return( null);
	};

	return( pszReturn[2]);
};

