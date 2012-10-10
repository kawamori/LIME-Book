var CELL_VOID=0;
var CELL_WALL=1;
var CELL_PLAYER=2;

var PLAYER_VX=0.2;
var PLAYER_VY=0.6;
var PLAYER_AY=0.05;
var WALL_VY=0.2;
var WALL_AY=0.05;

var game;
var player;
var wall;
var field;

var playerWalkAnim;
var wallAnim;

var playerBodyHit;
var playerHeadHit;
var playerFootHit;

var STATE_WALL_STAY=1;
var STATE_WALL_LIFT=2;
var STATE_WALL_MOVE=3;

function Player(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(playerWalkAnim);
	obj.sprite.setXY(x, y);
	obj.vx=0;
	obj.vy=0;
	obj.jump=false;
	
	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var gx, gy;

		obj.vx=0;
		if (game.isKey(KEY_LEFT)) obj.vx=-PLAYER_VX;
		if (game.isKey(KEY_RIGHT)) obj.vx=PLAYER_VX;

		if (!obj.jump) {
			obj.vy=0;
			if (game.isKey(KEY_SPACE)) {
				obj.vy=-PLAYER_VY;
				obj.jump=true;
			}
		} else {
			obj.vy+=PLAYER_AY;
			if (obj.vy>PLAYER_VY) {
				obj.vy=PLAYER_VY;
			}
		}
		
		obj.sprite.setXY(x+obj.vx, y+obj.vy);
		obj.sprite.initHit(playerBodyHit);
		obj.sprite.onHitSprite=function() {}
		if (game.testHitSprite(obj.sprite)) {
			obj.vx=0;
		}

		if (obj.vy<0) {
			obj.sprite.setXY(x+obj.vx, y+obj.vy);
			obj.sprite.initHit(playerHeadHit);
			obj.sprite.onHitSprite=function(spr) {
				if (spr.getState()==STATE_WALL_STAY) {
					spr.setState(STATE_WALL_LIFT);
				}
				obj.vy=0;
			}
			game.testHitSprite(obj.sprite);
		} else {
			obj.sprite.setXY(x+obj.vx, y+obj.vy);
			obj.jump=true;
			obj.sprite.initHit(playerFootHit);
			obj.sprite.onHitSprite=function(spr) {
				if (obj.jump) {
					obj.vy=(spr.getY()-1)-(obj.sprite.getY()-obj.vy);
					obj.jump=false;
				}
			}
			game.testHitSprite(obj.sprite);
		}
		
		x+=obj.vx;
		y+=obj.vy;
		obj.sprite.setXY(x, y);
		if (!obj.jump && obj.vx!=0) {
			obj.sprite.stepAnim();
		}
		
		gx=game.getViewX();
		gy=game.getViewY();
		if (x<gx+1) gx=x-1; else if (x>gx+XMAX-1) gx=x-XMAX+1;
		if (y<gy+1) gy=y-1; else if (y>gy+YMAX-1) gy=y-YMAX+1;
		game.setViewXY(gx, gy);
	}
}

function Wall(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(wallAnim);
	obj.sprite.setXY(x, y);
	obj.sprite.setState(STATE_WALL_STAY);
	obj.initX=x;
	obj.initY=y;
	obj.vy=0;
	
	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vy=obj.vy;

		if (obj.sprite.getState()==STATE_WALL_LIFT) {
			vy=-WALL_VY;
			obj.sprite.setState(STATE_WALL_MOVE);
		}
		
		if (obj.sprite.getState()==STATE_WALL_MOVE) {
			y+=vy;
			vy+=WALL_AY;
			if (y>=obj.initY) {
				y=obj.initY;
				obj.sprite.setState(STATE_WALL_STAY);
			}
		}

		obj.sprite.setXY(x, y);
		obj.vy=vy;
	}
}

function init() {
	var x, y, i;

	game.clear();

	field=game.createField();
	field.initCellImage(new Array(
		"void.png", "void.png", "void.png"
	));
	field.initCell(new Array(
		"111111111111",
		"100000000001",
		"100000000001",
		"100001100001",
		"100000000001",
		"111000000111",
		"100000000001",
		"100001100001",
		"100000000001",
		"111000000111",
		"100000000001",
		"100001100001",
		"100000000001",
		"100002000001",
		"111111111111"
	));
	
	wall=new Array();
	for (i=0, y=0; y<field.getYCount(); y++) {
		for (x=0; x<field.getXCount(); x++) {
			switch (field.getCell(x, y)) {
				case CELL_PLAYER:
					player=new Player(x, y);
					break;
				case CELL_WALL:
					wall[i++]=new Wall(x, y);
					break;
			}
		}
	}
}

function main() {
	game=new Game();
	playerWalkAnim=new Array(
		"pcWalk0.png", "pcWalk2.png", "pcWalk0.png", 
		"pcWalk1.png", "pcWalk3.png", "pcWalk1.png"
	);
	wallAnim=new Array("wall.png");
	playerBodyHit=new Array(0.1, 0.1, 0.9, 0.9);
	playerHeadHit=new Array(0.1, 0.3, 0.9, 0.4);
	playerFootHit=new Array(0.1, 1, 0.9, 1.1);
	init();
}

