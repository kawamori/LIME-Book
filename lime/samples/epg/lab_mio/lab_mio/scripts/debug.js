/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/
var gbDebug = 0;
// var gbDebug = 1;
var gDEBUG_LOGs = 0;

/************************************************************/
function debug_log( str) {
	if( !( gbDebug)) {
		return;
	};

	var max = 12;
	browser.lockScreen();

	if( gDEBUG_LOGs < max) {
		debug( "debug" + gDEBUG_LOGs, str);
		gDEBUG_LOGs++;
	}
	else {
		var i;
		if( max > 1) {
			for( i = 0; i < (max - 1); i++) {
				debug( "debug" + i ,
					   document.getElementById( "debug" + (i + 1))
							   .firstChild.data);
			};
		};
		debug( "debug" + (max - 1), str);
		gDEBUG_LOGs++;
		if( gDEBUG_LOGs > 10000000) {
			gDEBUG_LOGs = 0;
		};
	};
};

/************************************************************/
function debug( name, str) {
	if( !( gbDebug)) {
		return;
	};

	document.getElementById( name).firstChild.data = String( str);
};

