var PLAYER_VX=0.2;
var PLAYER_VY=-1.0;
var PLAYER_AY=0.1;
var HURDLE_COUNT=5;
var HURDLE_SPEED_MIN=0.1;
var HURDLE_SPEED_MAX=0.3;

var game;
var player;
var hurdle;

var playerWalkAnim;
var hurdleAnim;
var vanishAnim;

var playerHit;
var hurdleHit;

var STATE_ALIVE=0;
var STATE_DEAD=1;

function Player() {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(playerWalkAnim);
	obj.sprite.initHit(playerHit);
	obj.sprite.setXY(0, YMAX);
	obj.vy=0;
	obj.jump=false;
	obj.state=STATE_ALIVE;
	
	obj.sprite.onUpdate=function() {
		switch (obj.state) {
			case STATE_ALIVE: obj.alive(); break;
			case STATE_DEAD: obj.dead(); break;
		}
	}
	
	obj.alive=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vy=obj.vy;
		var mx=game.getMouseX()-0.5;
		
		if (Math.abs(mx-x)<=PLAYER_VX) {
			x=mx;
		} else {
			if (mx<x) x-=PLAYER_VX; else x+=PLAYER_VX;
		}
		
		if (x<0) x=0;
		if (x>XMAX) x=XMAX;
		
		if (!obj.jump) {
			if (game.isMouseButton(MOUSE_BUTTON_LEFT)) {
				vy=PLAYER_VY;
				obj.jump=true;
			}
			if (x!=obj.sprite.getX()) {
				obj.sprite.stepAnim();
			}
		} else {
			y+=vy;
			vy+=PLAYER_AY;
			if (y>=YMAX) {
				y=YMAX;
				obj.jump=false;
			}
		}

		obj.sprite.setXY(x, y);
		obj.vy=vy;

		if (game.testHitSprite(obj.sprite)) {
			obj.sprite.initAnim(vanishAnim);
			obj.state=STATE_DEAD;
		}
	}
	
	obj.dead=function() {
		obj.sprite.stepAnim();
		if (obj.sprite.isAnimOver()) {
			init();
		}
	}
}

function Hurdle() {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(hurdleAnim);
	obj.sprite.initHit(hurdleHit);
	obj.sprite.setXY(randFloat2(XMAX+1, XMAX*2), YMAX);
	obj.vx=-randFloat2(HURDLE_SPEED_MIN, HURDLE_SPEED_MAX);

	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vx=obj.vx;

		x+=obj.vx;
		if (x<=-1) {
			x=XMAX+1;
			vx=-randFloat2(HURDLE_SPEED_MIN, HURDLE_SPEED_MAX);
		}

		obj.sprite.setXY(x, y);
		obj.vx=vx;
		
		obj.sprite.stepAnim();
	}
}

function init() {
	var i;
	game.clear();
	player=new Player();
	hurdle=new Array();
	for (i=0; i<HURDLE_COUNT; i++) {
		hurdle[i]=new Hurdle();
	}
}

function main() {
	game=new Game();

	playerWalkAnim=new Array(
		"pcWalk0.png", "pcWalk2.png", "pcWalk0.png", 
		"pcWalk1.png", "pcWalk3.png", "pcWalk1.png"
	);
	hurdleAnim=new Array(
		"hurdle0.png", "hurdle1.png", "hurdle2.png",
		"hurdle3.png", "hurdle4.png", "hurdle5.png"
	);
	vanishAnim=new Array(
		"void.png", "vanish8.png", "vanish6.png", 
		"vanish4.png", "vanish2.png", "vanish0.png", 
		"vanish1.png", "vanish2.png", "vanish3.png", 
		"vanish4.png", "vanish5.png", "vanish6.png", 
		"vanish7.png", "vanish8.png", "void.png"
	);

	playerHit=new Array(0.25, 0.25, 0.75, 0.75);
	hurdleHit=new Array(0.25, 0.25, 0.75, 0.75);

	init();
}

