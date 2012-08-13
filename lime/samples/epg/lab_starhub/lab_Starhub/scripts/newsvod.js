/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var gCalendars = new Array(
	new Array( -1, -1, -1, -1, -1, -1, -1),
	new Array( -1, -1, -1, -1, -1, -1, -1),
	new Array( -1, -1, -1, -1, -1, -1, -1),
	new Array( -1, -1, -1, -1, -1, -1, -1),
	new Array( -1, -1, -1, -1, -1, -1, -1),
	new Array( -1, -1, -1, -1, -1, -1, -1)
);

var gX=-1; // カレンダー上のフォーカス位置
var gY=-1; // カレンダー上のフォーカス位置
var gIdx=0; // リスト位置
var gList=null;

/************************************************************
 DOM event functions
 ************************************************************/
function onload() {
	lockScreen();
	gState.bmltype = 1;

	clockStart();
	showCalendar( gYers, gMonth);
	setCalFocus( gX, gY);
	setFcs( "cl");
	unlockScreen();
	hideElem( "loading2");
	gState.crid = "";
	gState.grid = "";
};

/************************************************************/
function onunload() {}

/************************************************************/
function onkey() {}

/************************************************************
 Internal functions
 ************************************************************/
function listkey(){
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	debug_log( id + ":" + code);

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

		// TODO: compare/merge with bulletin.js
		if(gList.length<code-5 || 8<code-5) return;
		if(code-5<=0) return;
		if(setListFocus(code-5-1,0)){
			if(gList!=null){
				if(gList[gIdx][2]){
					romSound(7);
					gState.grid=gList[gIdx][0];
					gState.launchDocument("bulletin.bml");
				}else{
					romSound(9);
				}
			}
		}
	}
	else if( code == 18) {
		// Was select/enter key press.
		if( gList != null) {

			// TODO: compare/merge with bulletin.js
			if(gList[gIdx][2]){
				romSound(7);
				gState.grid=gList[gIdx][0];
				gState.launchDocument("bulletin.bml");
			}
		}
	}
	else if( code == 19) {
		// Was data key press.
		romSound(7);

		// TODO: compare/merge with bulletin.js
		setCalFocus(gX,gY);
		setFcs("cl");
		setTxtCol("list0"+String(gIdx),"56","141 15");
		setImg("listj01","../thumb/thumbnail_s_00.jpg");
		setImg("listj02","../thumb/thumbnail_s_00.jpg");
		setImg("listj03","../thumb/thumbnail_s_00.jpg");
		setText("listmax", Number(1)+" of "+gList.length);
		if(gList.length<8) setText("listmax",  Number(1)+" of "+gList.length);
		else setText("listmax",  Number(1)+" of 8");
		hideElem("listf");
	}

	unlockScreen();
}

/************************************************************/
function setListFocus( idx, add) {
	var old = gIdx;
	gIdx = idx+add;
	if( (gList.length <= gIdx) || (8 <= gIdx)) {
		gIdx = 0;
	};
	if( gIdx < 0) {
		gIdx = (gList.length < 8) ? gList.length -1 : 7;
	};

	var Y = new Array( 154, 187, 220, 253, 286, 319, 352, 385);

	setPos( "listf", 386, Y[ gIdx], 274, 30);
	setTxtCol( "list0" + String( old), "56", "141 15");
	setTxtCol( "list0" + String( gIdx), "32", "18 196");
	showElem( "listf");
	
	if( gList.length < 8) {
		setText( "listmax", Number( gIdx + 1) + " of " + gList.length);
	}
	else {
		setText( "listmax", Number( gIdx + 1) + " of 8");
	};
	
	setImg( "listj01", gList[ gIdx][3]);
	setImg( "listj02", gList[ gIdx][4]);
	setImg( "listj03", gList[ gIdx][5]);
	return( true);
};

/************************************************************/
function listShow( day) {
	gList = getDayData( day);
	
	for(var i = 0; i < 8; i++) {
		if( (gList == null) || (gList.length <= i)) {
			setText( "list0" + i, "");
		}
		else {
			setText( "list0" + i, gList[i][1]);
		};
	};

	if( gList != null) {
		if( gList.length < 8) {
			setText( "listmax", Number( gIdx + 1) + " of " + gList.length);
		}
		else {
			setText( "listmax", Number( gIdx + 1) + " of 8");
		};
	}
	else {
		setText( "listmax", "");
	};
};

/************************************************************/
// カレンダーキー
function calendarkey() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if(0<code&&code<=4) {
		var ret = addCalendars( gX, gY, code);
		if( ret == -1) {
			// ⇒にあてるときはここに設定を入れる。
			if( addCalendars( gX, 6, code) == 0) {
			};
		}
		else if( ret == -2) {
			if( addCalendars( gX, -1, code) == 0) {
			};
		}
		else if( ret == -3) {
			if( addCalendars( 7, gY, code) == 0) {
			};
		}
		else if( ret == -4) {
			if( addCalendars( -1, gY, code) == 0) {
			};
		}
	}
	else if( code == 18) { // 決定
		if( getDayData( gCalendars[gY][gX]) != null) {
			romSound(7);
			// リストにフォーカス
			setImg( "clf", "../images/bt_cal_1_d.png");
			setTxtCol("cal" + String(gY) + String(gX), "164", "15 181");
			setFcs( "list");
			gIdx = 0;
			setListFocus( gIdx, 0);
		};
	}
	else if( code == 19) { // 戻る
		romSound(7);
		launchTop();
	}
	unlockScreen();
};

/************************************************************/
// カレンダー表示
function showCalendar( y, m) {
	var sdate = new Date( y, m - 1, 1);
	var maxDay = browser.subDate( new Date( y, m, 1), sdate, 4);
	var i, j;
	var tmpx = -1;
	var tmpy = -1;
	var k = 0;
	var month = new Array( "Jan", "Feb", "Mar", "Apr", "May", "Jun",
						   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

	setText( "years", month[ m - 1] + " " + y);
	
	for( j = 0; j < 6; j++) {
		for(i = 0; i < 7; i++) {
			if( (((j * 6) + i) >= sdate.getDay()) && (k < maxDay))
			{
				k++;
				gCalendars[j][i] = k;
				if( getDayData( k)) {
					if( gX == -1) { gX = i; };
					if( gY == -1) { gY = j; };
				};
				if( tmpx == -1) { tmpx = i; };
				if( tmpy == -1) { tmpy = j; };
				setText( "cal" + String(j) + String(i), k);
			};
		};
	};
	if( gX == -1) { gX = tmpx; };
	if( gY == -1) { gY = tmpy; };
};

/************************************************************/
// カレンダーフォーカス描画
function setCalFocus(x,y){
	var X = new Array(  59,  95, 131, 167, 203, 239, 275);
	var Y = new Array( 216, 255, 294, 333, 372, 411);
	var W = 37;
	var H = 40;
	
	setImg( "clf", "../images/bt_cal_1_f.png");
	setPos( "clf", X[x], Y[y], W, H);
	setTxtCol( "cal" + String(gY) + String(gX), "56", "41 97");
	setTxtCol( "cal" + String(y) + String(x), "32", "18 196");
	showElem( "calendarbox");
	listShow( gCalendars[y][x]);
	gX = x;
	gY = y;
};

/************************************************************/
// カレンダーフォーカス制御
function addCalendars(x, y, code) {
	if( code == 1) {
		y--;
	}
	else if( code == 2) {
		y++;
	}
	else if( code == 3) {
		x--;
	}
	else if( code == 4) {
		x++;
	};

	if( y < 0) { return( -1); };
	if( y >= 6) { return( -2); };
	if( x < 0) { return( -3); };
	if( x >= 7) { return( -4); };

	if( gCalendars[y][x] == -1) {
		return( addCalendars( x, y, code));
	};

	romSound(9);
	setCalFocus( x, y);
	return( 0);
};

