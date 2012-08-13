/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
//variables
flag = true;
player = 1;
pnlnum = new Array(4, 2, 2);
//pnlcol = new Array('green', 'black', 'white');
pnlcol = new Array(2, 0, 7);
var gIndex=0;

//set arra状態保持配列変数設定
// 0 => 無し, 1 => 黒, -1 => 白
// 2=> 白？
stat = new Array(7);
for( i = 0; i <= 7; i++) {
	stat[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
}
stat[3][3] = 1;
stat[3][4] = 2;
stat[4][3] = 2;
stat[4][4] = 1;

/************************************************************
 DOM event functions
 ************************************************************/
function onload() {
	gState.bmltype = 6;
	clockStart();
	hideElem( "loading2");
};

/************************************************************/
function onunload() {}

/************************************************************
 Internal functions
 ************************************************************/
function print( str, display){
	var obj = document.getElementById( display);
	obj.firstChild.data += str + "\r\n";
};

/************************************************************/
function backbutton() {
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if( code == 19) { // 戻る
		romSound(7);
		launchTop();
	};

	unlockScreen();
};

/************************************************************/
function Revert() {
	var target = document.currentEvent.target;
	var tid = target.id;
	var loc = tid.substring( 1, 3);
	var left = loc.substring( 0, 1);
	var right = loc.substring( 1, 2);

	rev( parseInt( left, 10), parseInt( right, 10));
};

// functions to be run on Click
function rev( X, Y) {
	if( !flag || (stat[X][Y] != 0)) {
		return;
	};

	flag = false;
	num = revnum( X, Y, true);

	if( num == 0) {
		flag = true;
		return;
	};

	stat[X][Y] = player;

	document.getElementById( "p" + X + Y)
			.normalStyle.colorIndex = pnlcol[ player];

	pnlnum[0]++;
	pnlnum[ player] += 1 + num;
	pnlnum[ (player == 1) ? 2 : 1] -= num;

	if( (pnlnum[0] >= 64) || (pnlnum[1] <= 0) || (pnlnum[2] <= 0)) {
		winner = (pnlnum[1] > pnlnum[2]) ? 'Black!' : 'White!';
		if( pnlnum[1] == pnlnum[2]) {
			winner = 'Draw';
		};
		print( 'Black has taken ' + pnlnum[1] + ' pieces\n' +
			   'White has taken ' + pnlnum[2] + ' pieces;\n' +
			   'And the winner is ' + winner, "alert");
		return;
	};

	player = (player == 1) ? 2 : 1;

	if( pass()) {
		player = (player == 1) ? 2 : 1;

		if( pass()) {
			print( 'Neither Black nor White have no more moves to make; ' +
				   'the end of Game', "alert");

			winner = (pnlnum[1] > pnlnum[2]) ? 'Black!' : 'White!';

			if( pnlnum[1] == pnlnum[2]) {
				winner = 'Draw';
			};
			print( 'Black has taken ' + pnlnum[1] + ' pieces\n' +
				   'White has taken ' + pnlnum[2] + ' pieces\n' +
				   'And the winner is ' + winner, "alert");
			return;
		};

		print( ((player == 1) ? 'White' : 'Black') +
			   ' has no valid move to make, and play passes', "alert");
	};

	document.getElementById( "navi")
			.innerHTML = (player == 1) ? 'Black' : 'White';
	document.getElementById( "navi")
			.normalStyle.colorIndex = pnlcol[ player];

	if( player == 2) {
		complay();
	};

	flag = true;
};

/************************************************************/
//反転数取得、及び反転処理
function revnum( cx, cy, revflag) {
	num = 0;

	num += pnlrev( cx, cy,  0, -1, revflag);
	num += pnlrev( cx, cy,  1, -1, revflag);
	num += pnlrev( cx, cy,  1,  0, revflag);
	num += pnlrev( cx, cy,  1,  1, revflag);
	num += pnlrev( cx, cy,  0,  1, revflag);
	num += pnlrev( cx, cy, -1,  1, revflag);
	num += pnlrev( cx, cy, -1,  0, revflag);
	num += pnlrev( cx, cy, -1, -1, revflag);

	return( num);
};

/************************************************************/
//パネル反転
function pnlrev( x, y, sx, sy, revflag) {
	n = 0;

	while( 1) {
		x += sx;
		y += sy;

		if( (x < 0) || (7 < x) || (y < 0) || (7 < y) || (stat[x][y] == 0)) {
			return( 0);
		};

		if( stat[x][y] == player) {
			if( n == 0) {
				return( 0);
			};
			if( revflag) {
				for( i = 1; i <= n; i++) {
					x -= sx;
					y -= sy;
					stat[x][y] = player;

					document.getElementById( "p" + x + y)
							.normalStyle.colorIndex = pnlcol[ player];
				};
			};
			return( n);
		};

		n++;
	};
};

/************************************************************/
//パス判定
function pass() {
	for( i = 0; i <= 7; i++) {
		for( j = 0; j <= 7; j++) {
			if( stat[i][j] == 0) {
				if( revnum( i, j, false) > 0) {
					return( false);
				};
			};
		};
	};

	return( true);
};

/************************************************************/
//コンピュータ時間稼ぎ
function complay() {

//	print( "I am complay", "display");
	// 0.5 〜 1.5 秒
//	setTimeout( "comgo()", 500 + Math.floor( Math.random() * 1000));
	setTimeout( "comgo()", 500 + browser.random( 1000));
};

/************************************************************/
function setTimeout( code, interval) {
	browser.setInterval( code, interval, 1);
};

/************************************************************/
//コンピュータプレイ
function comgo() {
	getnum = 0;
	getX = new Array();
	getY = new Array();
	XYnum = 0;

	if( (stat[0][0] == 0) && (revnum( 0, 0, false) > getnum)) {
		getnum = revnum( 0, 0, false);
		getX[0] = 0;
		getY[0] = 0;
		XYnum = 1;
	};
	if( (stat[7][0] == 0) && (revnum( 7, 0, false) > getnum)) {
		getnum = revnum( 7, 0, false);
		getX[0] = 7;
		getY[0] = 0;
		XYnum = 1;
	};
	if( (stat[0][7] == 0) && (revnum( 0, 7, false) > getnum)) {
		getnum = revnum(0, 7, false);
		getX[0] = 0;
		getY[0] = 7;
		XYnum = 1;
	};
	if( (stat[7][7] == 0) && (revnum( 7, 7, false) > getnum)) {
		getnum = revnum(7, 7, false);
		getX[0] = 7;
		getY[0] = 7;
		XYnum = 1;
	};

	if( getnum == 0) {
		for( i = 0; i <= 7; i++) {
			for( j = 0; j <= 7; j++) {
				if( stat[i][j] == 0) {
					if( revnum(i, j, false) > getnum) {
						getnum = revnum( i, j, false);
						getX = new Array();
						getX[0] = i;
						getY = new Array();
						getY[0] = j;
						XYnum = 1;
					}
					else if( revnum(i, j, false) == getnum) {
						getX[ XYnum] = i;
						getY [XYnum] = j;
						XYnum++;
					};
				};
			};
		};
	};

// print( "XYnum "+ XYnum, "display");

//	setnum = Math.floor( Math.random() * XYnum);
//	setnum = browser.random( XYnum);
	setnum = XYnum - 1;

//	print( "I am comgo 3 " + setnum, "display");
	flag = true;
//	print( X, "display");

//	print( "getX[ setnum]" + getX, "display");
	rev( getX[ setnum], getY[ setnum]);

//	print( "getX[ setnum]" + getX[ setnum], "display");
//	print( "I am comgo out", "display");
};

