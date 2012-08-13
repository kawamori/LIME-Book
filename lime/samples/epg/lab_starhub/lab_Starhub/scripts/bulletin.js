/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gList = null;
var gIdx = 0;
var gPage = 0;

/************************************************************
 DOM event functions
 ************************************************************/
function onload() {
	gState.bmltype = 2;
	gList = getBulletin( gState.grid);
	if( gList == null) {
		return;
	};

	clockStart();
	lockScreen();
	listShow();
	setListFocus( gIdx, 0);
	setFcs( "list");
	hideElem( "loading2");
	unlockScreen();

	gState.crid = "";
};

/************************************************************/
function onunload() {}

/************************************************************/
function onkey() {}

/************************************************************
 Internal functions
 ************************************************************/
function listkey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if( code == 1) {
		// Was up key press.
		if( setListFocus( gIdx, -1)) {
			romSound(9);
		};
	}
	else if( code == 2) {
		// Was down key press.
		if( setListFocus( gIdx, 1)) {
			romSound(9);
		};
	}
	else if( (5 <= code) && (code <= 14)) {
		// Was digit key press.
		if( (gList.length < code - 5) || (9 < code - 5)) {
			// List is not long enough to contain element at index position.
			return;
		};
		if( code - 5 <= 0) {
			return;
		};
		if( setListFocus( code - 5 - 1, 0)) {
			if( gList != null) {
				if( gList[ gIdx + (gPage * 9)][1]) {
					romSound(7);
					gState.crid = gList[ gIdx + (gPage * 9)][0];
					gState.launchDocument( "../bml/play.bml");
				}
				else {
					romSound(9);
				};
			};
		};
	}
	else if( code == 18) {
		// Was select/enter key press.
		if( gList != null) {
			if( gList[ gIdx + (gPage * 9)][1]) {
				romSound(7);
				gState.crid = gList[ gIdx + (gPage * 9)][0];
				gState.launchDocument( "../bml/play.bml");
			};
		};
	}
	else if( code == 19) {
		// Was data key press.
		romSound(7);
		gState.launchDocument( "../bml/newsvod.bml");
	}

	unlockScreen();
};

/************************************************************/
function listShow() {
	for( var i = 0; i < 9; i++) {
		if( i + (gPage * 9) < gList.length) {
			setText( "list0" + i, gList[ i + (gPage * 9)][3]);
		}
		else {
			setText( "list0" + i, "");
		};
	};

	// ¥Ú¡¼¥¸
	var maxPage = gList.length / 9;

	if( gList.length % 9 != 0) {
		maxPage++;
	};

	if( maxPage > 1) {
		// Multiple pages.
		if( gPage == 0) {
			// At first page - no need to show up icon for prev page.
			hideElem( "up");
		}
		else {
			showElem("up");
		};

		if( gPage == maxPage - 1) {
			// At last page - no need to show down icon for next page.
			hideElem( "down");
		}
		else {
			showElem( "down");
		};
	}
	else {
		// 0 or 1 page - no need to show up/down icons for prev/next pages.
		hideElem( "down");
		hideElem( "up");
	};
};

/************************************************************/
function setListFocus( idx, add) {
	var old = gIdx;

	gIdx = idx + add;

	if( gList.length <= gIdx + (gPage * 9)) {
		gIdx = old;
		return( false);
	};

	if( gIdx < 0) {
		if( gPage == 0) {
			gIdx = old;
			return( false);
		};
		gPage--;
		gIdx = 8;
		listShow();
	};

	if( 9 <= gIdx) {
		gIdx = 0;
		gPage++;
		listShow();
	};

	var Y = new Array( 138, 171, 204, 237, 270, 303, 336, 369, 402);

	setPos( "listf", 101, Y[ gIdx], 361, 30);
	setTxtCol( "list0" + String( old), "56", "141 15");
	setTxtCol( "list0" + String( gIdx), "32", "18 196");
	showElem( "listf");

	setImg( "listj", gList[ gIdx + (gPage * 9)][4]);
	setText( "title", gList[ gIdx + (gPage * 9)][2]);
	setText( "listText", gList[ gIdx +(gPage * 9)][5]);
	setText( "listmax",
			 Number( gIdx + 1 + (gPage * 9)) + " of " + gList.length);

	return( true);
};

