var PLAYER_SPEED=0.2;
var ENEMY_COUNT=10;
var ENEMY_SPEED=0.1;
var ENEMY_CHASE=0.04;
var ENEMY_WAIT=0.02;
var WEAPON_SPEED=0.4;
var WEAPON_COUNT=5;

var game;
var player;
var enemy;
var weapon;

var playerWalkAnim;
var enemyWalkAnim;
var vanishAnim;
var weaponAnim;

var playerHit;
var enemyHit;
var weaponHit;

var STATE_PLAYER_ALIVE=0;
var STATE_PLAYER_DEAD=1;
var STATE_ENEMY_ALIVE=2;
var STATE_ENEMY_DEAD=3;
var STATE_WEAPON_ALIVE=4;
var STATE_WEAPON_DEAD=5;

function Player() {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(playerWalkAnim);
	obj.sprite.initHit(playerHit);
	obj.sprite.setXY(XMAX/2, YMAX/2);
	obj.sprite.setState(STATE_PLAYER_ALIVE);
	obj.prevKey=true;
	
	obj.sprite.onUpdate=function() {
		switch (obj.sprite.getState()) {
			case STATE_PLAYER_ALIVE: obj.alive(); break;
			case STATE_PLAYER_DEAD: obj.dead(); break;
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

		if (!obj.prevKey && game.isKey(KEY_SPACE)) {
			for (i=0; i<weapon.length; i++) {
				if (weapon[i].sprite.getState()==STATE_WEAPON_DEAD) {
					weapon[i].init(x, y, 0, -1);
					break;
				}
			}
		}
		obj.prevKey=game.isKey(KEY_SPACE);
	}
	
	obj.dead=function() {
		obj.sprite.stepAnim();
		if (obj.sprite.isAnimOver()) {
			init();
		}
	}
}

function Enemy() {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initHit(enemyHit);

	obj.init=function() {
		obj.sprite.initAnim(enemyWalkAnim);
		switch (randInt(4)) {
			case 0: obj.sprite.setXY(randFloat2(0, XMAX), -1); break;
			case 1: obj.sprite.setXY(randFloat2(0, XMAX), YMAX+1); break;
			case 2: obj.sprite.setXY(-1, randFloat2(0, YMAX)); break;
			case 3: obj.sprite.setXY(XMAX+1, randFloat2(0, YMAX)); break;
		}
		obj.sprite.setState(STATE_ENEMY_ALIVE);
		obj.chase=true;
	}
	obj.init();

	obj.sprite.onUpdate=function() {
		switch (obj.sprite.getState()) {
			case STATE_ENEMY_ALIVE: obj.alive(); break;
			case STATE_ENEMY_DEAD: obj.dead(); break;
		}
	}
	
	obj.alive=function() {
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

		game.testHitSprite(obj.sprite);
	}
	
	obj.sprite.onHitSprite=function(spr) {
		switch (spr.getState()) {
			case STATE_PLAYER_ALIVE:
				spr.initAnim(vanishAnim);
				spr.setState(STATE_PLAYER_DEAD);
				break;
			case STATE_WEAPON_ALIVE:
				spr.setXY(-1, -1);
				spr.setState(STATE_WEAPON_DEAD);
				obj.sprite.initAnim(vanishAnim);
				obj.sprite.setState(STATE_ENEMY_DEAD);
				game.addScore(1);
				break;
		}
	}

	obj.dead=function() {
		obj.sprite.stepAnim();
		if (obj.sprite.isAnimOver()) {
			obj.init();
		}
	}
}

function Weapon() {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(weaponAnim);
	obj.sprite.initHit(weaponHit);
	obj.sprite.setXY(-1, -1);
	obj.vx=0;
	obj.vy=0;
	obj.sprite.setState(STATE_WEAPON_DEAD);

	obj.init=function(x, y, dx, dy) {
		obj.sprite.setXY(x, y);
		obj.vx=dx*WEAPON_SPEED;
		obj.vy=dy*WEAPON_SPEED;
		obj.sprite.setState(STATE_WEAPON_ALIVE);
	}

	obj.sprite.onUpdate=function() {
		if (obj.sprite.getState()!=STATE_WEAPON_ALIVE) return;
		
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		x+=obj.vx;
		y+=obj.vy;
		obj.sprite.setXY(x, y);
		obj.sprite.stepAnim();
		if (x<-1 || x>XMAX+1 || y<-1 || y>YMAX+1) {
			obj.sprite.setState(STATE_WEAPON_DEAD);
		}
	}
}

function init() {
	var i;
	game.clear();
	game.setScore(0);
	player=new Player();
	enemy=new Array();
	for (i=0; i<ENEMY_COUNT; i++) {
		enemy[i]=new Enemy();
	}
	weapon=new Array();
	for (i=0; i<WEAPON_COUNT; i++) {
		weapon[i]=new Weapon();
	}
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
	weaponAnim=new Array(
		"weapon0.png", "weapon1.png", "weapon2.png", 
		"weapon3.png", "weapon4.png", "weapon5.png"
	);

	playerHit=new Array(0.25, 0.25, 0.75, 0.75);
	enemyHit=new Array(0.25, 0.25, 0.75, 0.75);
	weaponHit=new Array(0.1, 0.1, 0.9, 0.9);

	init();
}

