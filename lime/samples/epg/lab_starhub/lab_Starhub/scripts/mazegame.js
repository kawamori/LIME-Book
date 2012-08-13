/**********************************************************************
 * Copyright (C) 2009 Nippon Telegraph and Telephone Corporation.
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Global variables
 */
var SIZE = 21;	// 迷路のサイズ(縦と横)
var Time = 0;	// ゲーム開始時から経過秒
var DoRefresh;	// スクロール再描画の要否
var Maze;	// 迷路データ２次元配列
var Hero;	// 主人公オブジェクト
var Enemies;	// 敵オブジェクト配列

var ShowMapTimer = NaN;	// マップ表示用タイマ
var CounterTimer = NaN;	// ゲーム進行用タイマ

/************************************************************
 DOM event functions
 ************************************************************/
function onunload() {}

/************************************************************/
// ゲームを初期化します
function start() {
	gState.bmltype = 8;
	clockStart();
	hideElem( "loading2");

	document.getElementById( "end").normalStyle.visibility = "hidden";
	document.getElementById( "maze").focus();

	Time = 0;
	DoRefresh = true;

	Maze	= createMaze( SIZE);
	Hero	= new CharacterObject( 0, 0, "hero");		// 左上
	Enemies	= new Array(
		new CharacterObject( SIZE, 0, "enemy0"),	// 右上
		new CharacterObject( 0, SIZE, "enemy1"),	// 左下
		new CharacterObject( SIZE, SIZE, "enemy2")	// 右下
	 );

	drawScope();
	CounterTimer = browser.setInterval( "gameTick();", 1000, 0);
};

/************************************************************/
// キー押下時のイベントハンドラ
function keydown() {
	var x = Hero.X;		// 移動先のX座標
	var y = Hero.Y;		// 移動先のY座標

	var code = document.currentEvent.keyCode;

	if( code == 1) {	// 上
		// Was up key press.
		y--;
		Hero.Object.data = "../images/mazegame/hero1.png";
	}
	else if( code == 2) {	// 下
		// Was down key press.
		y++;
		Hero.Object.data = "../images/mazegame/hero2.png";
	}
	else if( code == 3) {	// 左
		// Was left key press.
		x--;
		Hero.Object.data = "../images/mazegame/hero3.png";
	}
	else if( code == 4) {	// 右
		// Was right key press.
		x++;
		Hero.Object.data = "../images/mazegame/hero4.png";
	}
	else if( code == 18) {	// 決定
		// Was select/enter key press.
		showMap();
	}
	else if( code == 19) {
		// Was data key press.
		browser.unlockScreen();
		romSound(7);
		gState.launchDocument( "startup.bml");
		hideElem( "loading2");
	};

	if( (0 <= x) && (x < SIZE) && (0 <= y) && (y < SIZE)) {
		if( Maze[x][y] == 0) {	// 移動先が通路
			// スクロールの要否のチェック
			DoRefresh = (Hero.X / 7 != x / 7) || (Hero.Y / 7 != y / 7);

			Hero.X = x;
			Hero.Y = y;

			drawScope();

			if( (Hero.X == SIZE - 1) && (Hero.Y == SIZE - 1)) {
				gameOver( "クリア！！　タイム：" + getTimeString( Time));
			};
		};
	};
};

/************************************************************
 Internal functions
 ************************************************************/
// キャラ用（主人公や敵）オブジェクトのコンストラクタ
function CharacterObject( x, y, id) {
	this.X = x;
	this.Y = y;
	this.Object	= document.getElementById( id);
	this.Style	= document.getElementById( id).normalStyle;
};

/************************************************************/
// 迷路を作成します
// 　size：縦横の大きさ
function createMaze( size ) {
	// 迷路[x,y]を初期化
	var maze = new Array( size);

	for( var x = 0; x < size; x++) {
		maze[x] = new Array( size);

		for( var y = 0; y < size; y++) {
			maze[x][y] = 0;
		};
	};

	// 棒倒し法で迷路作成
	for( var x = 1; x < size - 1; x += 2) {
		for( var y = 1; y < size - 1; y += 2) {
			maze[x][y] = 1;		// 柱

			// 最左列は上下左右、それ以外は上下右のみ
			var dir = browser.random( (x == 1) ? 4 : 3);
			var px = x;
			var py = y;

			if( dir == 0 ) { py--; }
			else if( dir == 1 ) { py++; }
			else if( dir == 2 ) { px++; }
			else if( dir == 3 ) { px--; }

			maze[px][py] = 1;	// 倒れた柱
		};
	};

	return( maze);
};

/************************************************************/
// 画面を描画します。
function drawScope() {
	browser.lockScreen();

	// 画面スクロールは７ｘ７([x,y]、[x+6,y+6])単位です。
	// 描画は外枠を含めるため９ｘ９([x-1,y-1]、[x+7,y+7])になります。

	var scopeX = Hero.X / 7;
	var scopeY = Hero.Y / 7;

	// 迷路を描画します。
	if( DoRefresh) {
		DoRefresh = false;

		for( var y = 0; y < 9; y++) {
			for( var x = 0; x < 9; x++) {
				var obj = document.getElementById( "c" + y + x);
				var dx = scopeX * 7 + x - 1;
				var dy = scopeY * 7 + y - 1;

				// 通路を描画（＝周囲・壁は非表示）
				var flag = true;
				if( (0 <= dx) && (dx < SIZE) && (0 <= dy) && (dy < SIZE)) {
					flag = Maze[ dx][ dy];
				};

				obj.normalStyle.visibility = flag ? "hidden" : "visible";
			};
		};
	};

	// 主人公を描画します。
	Hero.Style.top  = (Hero.Y % 7 + 1) * 50 + "px";
	Hero.Style.left = (Hero.X % 7 + 1) * 50 + "px";

	// 敵キャラを描画します。
	for( var i = 0; i < Enemies.length; i++) {
		var enemy = Enemies[i];

		// 主人公と同じスコープ時のみ描画
		if( (enemy.X / 7 == scopeX) && (enemy.Y / 7 == scopeY)) {
			enemy.Style.visibility	= "visible";
			enemy.Style.top  = (enemy.Y % 7 + 1) * 50 + "px";
			enemy.Style.left = (enemy.X % 7 + 1) * 50 + "px";
		}
		else {
			enemy.Style.visibility	= "hidden";
		};

		if( (enemy.X == Hero.X) && (enemy.Y == Hero.Y)) {
			gameOver( "無念、、捕まった、、");
			return;
		};
	};

	browser.unlockScreen();
};

/************************************************************/
// 秒数から"mm:ss"の文字列を取得します。
function getTimeString( time) {
	var m0 = (time / 60) / 10;
	var m1 = (time / 60) % 10;
	var s0 = (time % 60) / 10;
	var s1 = (time % 60) % 10;
	return( " " + m0 + m1 + ":" + s0 + s1);
};

/************************************************************/
// 定期的に呼ばれるタイマーです。敵を移動し時刻を更新します。
function gameTick() {
	// 経過時刻を更新します。
	Time++;
	document.getElementById( "time").firstChild.data = getTimeString( Time);

	// 主人公を追いかけます。
	for( var i = 0; i < Enemies.length; i++) {
		var enemy = Enemies[i];
		var xdiff = Hero.X - enemy.X;
		var ydiff = Hero.Y - enemy.Y;
		var dir = browser.random(3);

		if( dir == 1) {
			// X軸方向に接近
			if( xdiff < 0) {
				enemy.X--;
				enemy.Object.data = "../images/mazegame/enemy3.png";
			}
			else if( xdiff > 0) {
				enemy.X++;
				enemy.Object.data = "../images/mazegame/enemy4.png";
			};
		}
		else if( dir == 2) {
			// Y軸方向に接近
			if( ydiff < 0) {
				enemy.Y--;
				enemy.Object.data = "../images/mazegame/enemy1.png";
			}
			else if( ydiff > 0) {
				enemy.Y++;
				enemy.Object.data = "../images/mazegame/enemy2.png";
			};
		};
	};

	drawScope();
};

/************************************************************/
// マップを一定時間表示します。
function showMap() {
	if( !isNaN( ShowMapTimer)) {
		return;
	};

	var str = "";

	for( var y = 0; y < SIZE; y++) {
		for( var x = 0; x < SIZE; x++) {
			if( (x == Hero.X) && (y == Hero.Y)) {
				str += "★";		// 自分
			}
			else if( Maze[x][y] == 1) {
				str += "■";		// 壁
			}
			else {
				str += "　";		// 通路
			};
		};
		str += "\r\n";
	};

	var map = document.getElementById( "map");
	map.firstChild.data = str;
	map.normalStyle.visibility = "visible";

	ShowMapTimer = browser.setInterval( "hideMap();", 3000, 1);
};

/************************************************************/
// マップを非表示にします。
function hideMap() {
	document.getElementById( "map").normalStyle.visibility = "hidden";
	ShowMapTimer = NaN;
};

/************************************************************/
// ゲーム終了表示をします。
function gameOver( msg) {
	browser.clearTimer( CounterTimer);
	var obj = document.getElementById( "end");
	obj.normalStyle.visibility = "visible";
	obj.lastChild.firstChild.data = msg;
	obj.focus();
};

