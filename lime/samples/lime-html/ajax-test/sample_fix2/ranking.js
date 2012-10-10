var GRID=40;
var PLAYER_SPEED=8/GRID;
var ENEMY_SPEED=5/GRID;
var PLAYER_BLINK_TIME=50;
var PLAYER_POWERUP_TIME=60;

var CELL_VOID=0;
var CELL_WALL=1;
var CELL_ITEM=2;
var CELL_POWERUP=3;
var CELL_HOUSE=4;

var STATE_PLAYER_ALIVE=0;
var STATE_PLAYER_DEAD=1;
var STATE_PLAYER_POWERUP=2;
var STATE_ENEMY_ALIVE=3;
var STATE_ENEMY_DEAD=4;
var STATE_SPLASH=5;

var SCORE_ITEM=10;
var SCORE_ENEMY=100;

var game;
var player;
var enemy;
var field;
var title;
var splash;

var playerWalkAnim;
var playerPowerupAnim;
var playerBlinkAnim;
var enemyWalkAnim;
var enemyEscapeAnim;
var enemyBlinkAnim;
var vanishAnim;
var titleAnim;

var playerHit;
var enemyHit;

var GS_TITLE=0;
var GS_TITLE2=1;
var GS_READY=2;
var GS_READY2=3;
var GS_GAME=4;
var GS_CLEAR=5;
var GS_CLEAR2=6;
var GS_CONTINUE=7;
var GS_CONTINUE2=8;
var GS_GAMEOVER=9;
var GS_GAMEOVER2=10;

var GS_NAME=11;
var GS_NAME2=12;
var GS_NAME3=13;
var GS_RANKING=14;
var GS_RANKING2=15;
var GS_RANKING3=16;

function isWall(x, y) {
	var cell=field.getCell(x, y);
	return cell==CELL_WALL || cell==CELL_HOUSE;
}

function Player(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initHit(playerHit);
	obj.sprite.setGrid(GRID);
	obj.initX=x;
	obj.initY=y;

	obj.init=function() {
		obj.sprite.initAnim(playerWalkAnim);
		obj.sprite.setXY(obj.initX, obj.initY);
		game.setViewXY(obj.initX-XMAX/2, obj.initY-YMAX/2);
		obj.sprite.setState(STATE_PLAYER_ALIVE);
		obj.vx=0;
		obj.vy=0;
		obj.cx=obj.initX;
		obj.cy=obj.initY;
	}
	obj.init();
	
	obj.sprite.onUpdate=function() {
		if (game.state!=GS_GAME) return;
		switch (obj.sprite.getState()) {
			case STATE_PLAYER_ALIVE: 
			case STATE_PLAYER_POWERUP:
				obj.alive(); 
				break;
			case STATE_PLAYER_DEAD: 
				obj.dead(); 
				break;
		}
	}
	
	obj.alive=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vx=obj.vx, vy=obj.vy;
		var cx=obj.cx, cy=obj.cy;
		var spr;
		
		if (x==cx && y==cy) {
			if (field.getCell(cx, cy)==CELL_ITEM) {
				field.setCell(cx, cy, CELL_VOID);
				game.addScore(SCORE_ITEM);
				game.itemCount--;
				if (game.itemCount==0) {
					game.state=GS_CLEAR;
				}
			}
			if (field.getCell(cx, cy)==CELL_POWERUP) {
				if (obj.sprite.getState()!=STATE_PLAYER_POWERUP) {
					field.setCell(cx, cy, CELL_VOID);
					obj.powerupTime=0;
					obj.powerupScore=SCORE_ENEMY;
					obj.sprite.initAnim(playerPowerupAnim);
					obj.sprite.setState(STATE_PLAYER_POWERUP);
					for (i=0; i<enemy.length; i++) {
						spr=enemy[i].sprite;
						if (spr.getState()==STATE_ENEMY_ALIVE) {
							spr.initAnim(enemyEscapeAnim);
						}
					}
				}
			}

			vx=vy=0;
			if (game.isKey(KEY_LEFT)) vx=-1; else
			if (game.isKey(KEY_RIGHT)) vx=1; else
			if (game.isKey(KEY_UP)) vy=-1; else
			if (game.isKey(KEY_DOWN)) vy=1;
			if (isWall(cx+vx, cy+vy)) {
				vx=vy=0;
			}
			cx+=vx;
			cy+=vy;
		}
		
		x+=vx*PLAYER_SPEED;
		y+=vy*PLAYER_SPEED;
		obj.sprite.setXY(x, y);
		obj.vx=vx;
		obj.vy=vy;
		obj.cx=cx;
		obj.cy=cy;
		if (vx!=0 || vy!=0) {
			obj.sprite.stepAnim();
		}
		game.setViewXY(x-XMAX/2, y-YMAX/2);

		obj.sprite.onHitSprite=function(spr) {
			if (spr.getState()==STATE_ENEMY_ALIVE) {
				if (obj.sprite.getState()==STATE_PLAYER_POWERUP) {
					spr.initAnim(vanishAnim);
					spr.setState(STATE_ENEMY_DEAD);
					game.addScore(obj.powerupScore);
					obj.powerupScore*=2;
				} else {
					obj.sprite.initAnim(vanishAnim);
					obj.sprite.setState(STATE_PLAYER_DEAD);
				}
			}
		}
		game.testHitSprite(obj.sprite);

		if (obj.sprite.getState()==STATE_PLAYER_POWERUP) {
			obj.powerupTime++;
			if (obj.powerupTime==PLAYER_BLINK_TIME) {
				obj.sprite.initAnim(playerBlinkAnim);
				for (i=0; i<enemy.length; i++) {
					spr=enemy[i].sprite;
					if (spr.getState()==STATE_ENEMY_ALIVE) {
						spr.initAnim(enemyBlinkAnim);
					}
				}
			} else
			if (obj.powerupTime==PLAYER_POWERUP_TIME) {
				obj.sprite.initAnim(playerWalkAnim);
				obj.sprite.setState(STATE_PLAYER_ALIVE);
				for (i=0; i<enemy.length; i++) {
					spr=enemy[i].sprite;
					if (spr.getState()==STATE_ENEMY_ALIVE) {
						spr.initAnim(enemyWalkAnim);
					}
				}
			}
		}
	}
	
	obj.dead=function() {
		obj.sprite.stepAnim();
		if (obj.sprite.isAnimOver()) {
			game.state=GS_CONTINUE;
		}
	}
}

function Enemy(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initHit(enemyHit);
	obj.sprite.setGrid(GRID);
	obj.initX=x;
	obj.initY=y;

	obj.init=function() {
		obj.sprite.initAnim(enemyWalkAnim);
		obj.sprite.setXY(obj.initX, obj.initY);
		obj.sprite.setState(STATE_ENEMY_ALIVE);
		obj.vx=0;
		obj.vy=0;
		obj.playerState=STATE_PLAYER_ALIVE;
	}
	obj.init();
	
	obj.sprite.onUpdate=function() {
		if (game.state!=GS_GAME) return;
		switch (obj.sprite.getState()) {
			case STATE_ENEMY_ALIVE: obj.alive(); break;
			case STATE_ENEMY_DEAD: obj.dead(); break;
		}
	}
	
	obj.alive=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vx=obj.vx, vy=obj.vy;
		var ovx=obj.vx, ovy=obj.vy;
		var cx=Math.floor(x), cy=Math.floor(y);
		var px=player.cx, py=player.cy;
		var ps=player.sprite.getState();

		if (x==cx && y==cy) {
			vx=vy=0;
			if (px<cx) vx=-1; else if (px>cx) vx=1;
			if (py<cy) vy=-1; else if (py>cy) vy=1;

			if (ps==STATE_PLAYER_POWERUP) {
				vx=-vx;
				vy=-vy;
				if (obj.playerState==STATE_PLAYER_ALIVE) {
					ovx=ovy=0;
				}
			}
			obj.playerState=ps;

			if (isWall(cx+vx, cy) || vx==-ovx) vx=0;
			if (isWall(cx, cy+vy) || vy==-ovy) vy=0;
			if (vx!=0 && vy!=0) {
				if (randInt(2)==0) vx=0; else vy=0;
			} else
			if (vx==0 && vy==0) {
				if (!isWall(cx-1, cy) && ovx!=1) vx=-1; else
				if (!isWall(cx+1, cy) && ovx!=-1) vx=1; else
				if (!isWall(cx, cy-1) && ovy!=1) vy=-1; else
				if (!isWall(cx, cy+1) && ovy!=-1) vy=1;
			}
		}

		obj.sprite.setXY(x+vx*ENEMY_SPEED, y+vy*ENEMY_SPEED);
		obj.vx=vx;
		obj.vy=vy;
		obj.sprite.stepAnim();
	}
	
	obj.dead=function() {
		if (!obj.sprite.isAnimOver()) {
			obj.sprite.stepAnim();
		} else
		if (player.sprite.getState()!=STATE_PLAYER_POWERUP) {
			obj.init();
		}
	}
}

function initStage() {
	var x, y;

	game.clear();

	field=game.createField();
	field.initCellImage(new Array(
		"void.png", "wall.png", "item.png", 
		"powerup.png", "house.png"
	));
	field.initCell(new Array(
		"0000000000000000000000000",
		"0000011100000000011100000",
		"0000014111111111114100000",
		"0000012222221222222100000",
		"0000012111123211112100000",
		"0000012222121212222100000",
		"0000012112121212112100000",
		"0000012122220222212100000",
		"0000013221211121223100000",
		"0000012122222222212100000",
		"0000012112121212112100000",
		"0000012222121212222100000",
		"0000012111123211112100000",
		"0000012222221222222100000",
		"0000014111111111114100000",
		"0000011100000000011100000",
		"0000000000000000000000000"
	));
	game.itemCount=0;
	for (y=0; y<field.getYCount(); y++) {
		for (x=0; x<field.getXCount(); x++) {
			if (field.getCell(x, y)==CELL_ITEM) {
				game.itemCount++;
			}
		}
	}
	
	player=new Player(12, 7);
	enemy=new Array();
	enemy[0]=new Enemy(6, 2);
	enemy[1]=new Enemy(18, 2);
	enemy[2]=new Enemy(6, 14);
	enemy[3]=new Enemy(18, 14);

	splash=game.createSprite();
	splash.setSize(CELL_XCOUNT, CELL_YCOUNT);
	splash.setState(STATE_SPLASH);
}

function initGame() {
	game.setScore(0);
	initStage();
}

function initTitle() {
	game.clear();
	game.setViewXY(0, 0);
	title=game.createSprite();
	title.initAnim(titleAnim);
	title.setSize(CELL_XCOUNT, CELL_YCOUNT);
}

function initSplash(image) {
	splash.setXY(game.getViewX(), game.getViewY());
	splash.initAnim(new Array(image));
}

function main() {
	var i;
	
	game=new Game();

	playerWalkAnim=new Array(
		"pcWalk0.png", "pcWalk2.png", "pcWalk0.png", 
		"pcWalk1.png", "pcWalk3.png", "pcWalk1.png"
	);
	playerPowerupAnim=new Array(
		"pc2Walk0.png", "pc2Walk2.png", "pc2Walk0.png", 
		"pc2Walk1.png", "pc2Walk3.png", "pc2Walk1.png"
	);
	playerBlinkAnim=new Array(
		"pcWalk0.png", "pc2Walk2.png", "pcWalk0.png", 
		"pc2Walk1.png", "pcWalk3.png", "pc2Walk1.png"
	);
	enemyWalkAnim=new Array(
		"enemyWalk0.png", "enemyWalk2.png", "enemyWalk0.png", 
		"enemyWalk1.png", "enemyWalk3.png", "enemyWalk1.png"
	);
	enemyEscapeAnim=new Array(
		"enemy2Walk0.png", "enemy2Walk2.png", "enemy2Walk0.png", 
		"enemy2Walk1.png", "enemy2Walk3.png", "enemy2Walk1.png"
	);
	enemyBlinkAnim=new Array(
		"enemyWalk0.png", "enemy2Walk2.png", "enemyWalk0.png", 
		"enemy2Walk1.png", "enemyWalk3.png", "enemy2Walk1.png"
	);
	vanishAnim=new Array(
		"void.png", "vanish8.png", "vanish6.png", 
		"vanish4.png", "vanish2.png", "vanish0.png", 
		"vanish1.png", "vanish2.png", "vanish3.png", 
		"vanish4.png", "vanish5.png", "vanish6.png", 
		"vanish7.png", "vanish8.png", "void.png"
	);
	titleAnim=new Array(
		"title0.png", "title0.png", "title0.png", "title0.png", 
		"title1.png", "title1.png",
		"title2.png", "title2.png", "title2.png", "title2.png",
		"title1.png", "title1.png"
	);

	playerHit=new Array(0.25, 0.25, 0.75, 0.75);
	enemyHit=new Array(0.25, 0.25, 0.75, 0.75);

	game.onUpdate=function() {
		switch (game.state) {
			case GS_NAME:
				game.initNameEntry();
				game.state=GS_NAME2;
			case GS_NAME2:
				if (
					game.updateNameEntry() &&
					game.isKey(KEY_ENTER)
				) {
					game.state=GS_NAME3;
				}
				break;
			case GS_NAME3:
				if (!game.isKey(KEY_ENTER)) {
					game.state=GS_RANKING;
				}
				break;
			case GS_TITLE:
				initTitle();
				game.state=GS_TITLE2;
			case GS_TITLE2:
				title.stepAnim();
				if (game.isKey(KEY_ENTER)) {
					initGame();
					game.state=GS_READY;
				}
				break;
			case GS_READY:
				initSplash("ready.png");
				game.time=0;
				game.state=GS_READY2;
			case GS_READY2:
				game.time++;
				if (game.time==20) {
					initSplash("void.png");
					game.state=GS_GAME;
				}
				break;
			case GS_CLEAR:
				initSplash("clear.png");
				game.time=0;
				game.state=GS_CLEAR2;
			case GS_CLEAR2:
				game.time++;
				if (game.time==20) {
					initSplash("void.png");
					game.addScore(1000);
					initStage();
					game.state=GS_READY;
				}
				break;
			case GS_CONTINUE:
				initSplash("continue.png");
				game.state=GS_CONTINUE2;
			case GS_CONTINUE2:
				if (game.isKey(KEY_ENTER)) {
					initSplash("void.png");
					player.init();
					for (i=0; i<enemy.length; i++) {
						enemy[i].init();
					}
					if (game.getScore()%10<9) {
						game.addScore(1);
					}
					game.state=GS_READY;
				}
				if (game.isKey(KEY_ESC)) {
					initSplash("void.png");
					game.state=GS_GAMEOVER;
				}
				break;
			case GS_GAMEOVER:
				initSplash("gameover.png");
				game.time=0;
				game.state=GS_GAMEOVER2;
			case GS_GAMEOVER2:
				game.time++;
				if (game.time==20) {
					initSplash("void.png");
					game.state=GS_RANKING;
				}
				break;
			case GS_RANKING:
				game.initRanking("cgi-bin/ranking.cgi");
				game.state=GS_RANKING2;
			case GS_RANKING2:
				game.updateRanking();
				if (game.isKey(KEY_ENTER)) {
					game.state=GS_RANKING3;
				}
				break;
			case GS_RANKING3:
				if (!game.isKey(KEY_ENTER)) {
					game.state=GS_TITLE;
				}
				break;
		}
	}
	game.state=GS_NAME;
	game.time=0;
}

