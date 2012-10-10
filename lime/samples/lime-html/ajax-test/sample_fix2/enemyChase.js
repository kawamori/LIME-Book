var PLAYER_SPEED=0.2;
var ENEMY_SPEED=0.1;
var ENEMY_CHASE=0.04;
var ENEMY_WAIT=0.02;

var game;
var player;
var enemy;

var playerWalkAnim;
var enemyWalkAnim;
var vanishAnim;

var playerHit;
var enemyHit;

var STATE_ALIVE=0;
var STATE_DEAD=1;

function Player() {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(playerWalkAnim);
	obj.sprite.initHit(playerHit);
	obj.sprite.setXY(XMAX/2, YMAX/2);
	obj.state=STATE_ALIVE;
	
	obj.sprite.onUpdate=function() {
		switch (obj.state) {
			case STATE_ALIVE: obj.alive(); break;
			case STATE_DEAD: obj.dead(); break;
		}
	}
	
	obj.alive=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		
		if (game.isKey(KEY_LEFT)) x-=PLAYER_SPEED;
		if (game.isKey(KEY_RIGHT)) x+=PLAYER_SPEED;
		if (game.isKey(KEY_UP)) y-=PLAYER_SPEED;
		if (game.isKey(KEY_DOWN)) y+=PLAYER_SPEED;
		
		if (x<0) x=0; else if (x>XMAX) x=XMAX;
		if (y<0) y=0; else if (y>YMAX) y=YMAX;

		if (x!=obj.sprite.getX() || y!=obj.sprite.getY()) {
			obj.sprite.stepAnim();
		}
		
		obj.sprite.setXY(x, y);

		if (game.testHitSprite(obj.sprite)) {
			obj.sprite.initAnim(vanishAnim);
			obj.state=STATE_DEAD;
		}

		game.addScore(1);
	}
	
	obj.dead=function() {
		obj.sprite.stepAnim();
		if (obj.sprite.isAnimOver()) {
			init();
		}
	}
}

function Enemy(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(enemyWalkAnim);
	obj.sprite.initHit(enemyHit);
	obj.sprite.setXY(x, y);
	obj.chase=true;

	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var px=player.sprite.getX(), py=player.sprite.getY();

		if (obj.chase) {
			if (Math.abs(px-x)<ENEMY_SPEED) {
				x=px;
			} else {
				if (px<x) x-=ENEMY_SPEED; else x+=ENEMY_SPEED;
			}
			if (Math.abs(py-y)<ENEMY_SPEED) {
				y=py;
			} else {
				if (py<y) y-=ENEMY_SPEED; else y+=ENEMY_SPEED;
			}
			if (randFloat(1)<ENEMY_WAIT) obj.chase=false;
		} else {
			if (randFloat(1)<ENEMY_CHASE) obj.chase=true;
		}
		
		if (x!=obj.sprite.getX() || y!=obj.sprite.getY()) {
			obj.sprite.stepAnim();
		}
		obj.sprite.setXY(x, y);
	}
}

function init() {
	game.clear();
	game.setScore(0);
	player=new Player();
	enemy=new Array();
	enemy[0]=new Enemy(0, 0);
	enemy[1]=new Enemy(XMAX/2, 0);
	enemy[2]=new Enemy(XMAX, 0);
	enemy[3]=new Enemy(0, YMAX)
	enemy[4]=new Enemy(XMAX/2, YMAX)
	enemy[5]=new Enemy(XMAX, YMAX);
}

function main() {
	game=new Game();

	playerWalkAnim=new Array(
		"pcWalk0.png", "pcWalk2.png", "pcWalk0.png", 
		"pcWalk1.png", "pcWalk3.png", "pcWalk1.png"
	);
	enemyWalkAnim=new Array(
		"enemyWalk0.png", "enemyWalk2.png", "enemyWalk0.png", 
		"enemyWalk1.png", "enemyWalk3.png", "enemyWalk1.png"
	);
	vanishAnim=new Array(
		"void.png", "vanish8.png", "vanish6.png", 
		"vanish4.png", "vanish2.png", "vanish0.png", 
		"vanish1.png", "vanish2.png", "vanish3.png", 
		"vanish4.png", "vanish5.png", "vanish6.png", 
		"vanish7.png", "vanish8.png", "void.png"
	);

	playerHit=new Array(0.25, 0.25, 0.75, 0.75);
	enemyHit=new Array(0.25, 0.25, 0.75, 0.75);

	init();
}

