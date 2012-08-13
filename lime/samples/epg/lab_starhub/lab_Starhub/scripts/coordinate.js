/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Dependencies:
 * - gDbg
 */

/************************************************************
 * Global variables
 */
var gCoord = new Coordinate();

/************************************************************
 * Wrapper class
 */
function Coordinate() {
	this.nScreenW = 1920;
	this.nScreenH = 1080;

	this.init = __Coordinate_init;
	this.screenWidth = __Coordinate_screenWidth;
	this.screenHeight = __Coordinate_screenHeight;
	this.toString = __Coordinate_toString;
};

/************************************************************/
function __Coordinate_init() {
	var pChild = document.documentElement.lastChild;
	var i = 0;

	while( pChild != null) {
		gDbg.print( i + ": <" + pChild.tagName + "> id=\"" + pChild.id + "\"");

		if( pChild.tagName == "body") {
			var szRes = String( pChild.normalStyle.resolution);
			gDbg.print( "resolution:" + szRes);

			var x = szRes.indexOf( "x", 0);
			this.nScreenW = Number( szRes.substring( 0, x));
			this.nScreenH = Number( szRes.substring( x + 1));

			break;
		};

		i++;
		pChild = pChild.previousSibling;
	};

	gDbg.print( "Resolution = " + this.nScreenW + "x" + this.nScreenH);
};

/************************************************************/
function __Coordinate_screenWidth() {
	return( this.nScreenW);
};

/************************************************************/
function __Coordinate_screenHeight() {
	return( this.nScreenH);
};

/************************************************************/
function __Coordinate_toString() {
	return( this.screenWidth() + "x" + this.screenHeight());
};

