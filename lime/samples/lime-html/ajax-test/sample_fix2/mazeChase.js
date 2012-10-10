var GRID=40;
var PLAYER_SPEED=8/GRID;
var ENEMY_SPEED=5/GRID;
var CELL_WALL=1;
var STATE_PLAYER_ALIVE=0;
var STATE_PLAYER_DEAD=1;

var game;
var player;
var enemy;
var field;

var playerWalkAnim;
var enemyWalkAnim;
var vanishAnim;

var playerHit;
var enemyHit;

function isWall(x, y) {
	return field.getCell(x, y)==CELL_WALL;
}

function Player(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(playerWalkAnim);
	obj.sprite.initHit(playerHit);
	obj.sprite.setGrid(GRID);
	obj.sprite.setXY(x, y);
	game.setViewXY(x-XMAX/2, y-YMAX/2);
	obj.sprite.setState(STATE_PLAYER_ALIVE);
	obj.vx=0;
	obj.vy=0;
	obj.cx=x;
	obj.cy=y;
	
	obj.sprite.onUpdate=function() {
		switch (obj.sprite.getState()) {
			case STATE_PLAYER_ALIVE: obj.alive(); break;
			case STATE_PLAYER_DEAD: obj.dead(); break;
		}
	}
	
	obj.alive=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vx=obj.vx, vy=obj.vy;
		var cx=obj.cx, cy=obj.cy;
		
		if (x==cx && y==cy) {
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

		if (game.testHitSprite(obj.sprite)) {
			obj.sprite.initAnim(vanishAnim);
			obj.sprite.setState(STATE_PLAYER_DEAD);
		} else {
			game.addScore(1);
		}
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
	obj.sprite.setGrid(GRID);
	obj.sprite.setXY(x, y);
	obj.vx=0;
	obj.vy=0;

	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vx=obj.vx, vy=obj.vy;
		var ovx=obj.vx, ovy=obj.vy;
		var cx=Math.floor(x), cy=Math.floor(y);
		var px=player.cx, py=player.cy;

		if (x==cx && y==cy) {
			vx=vy=0;
			if (px<cx) vx=-1; else if (px>cx) vx=1;
			if (py<cy) vy=-1; else if (py>cy) vy=1;
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
}

function init() {
	game.clear();
	game.setScore(0);

	field=game.createField();
	field.initCellImage(new Array(
		"void.png", "wall.png"
	));
	field.initCell(new Array(
		"0000000000000000000000000",
		"0000000000000000000000000",
		"0000011111111111111100000",
		"0000010000001000000100000",
		"0000010111100011110100000",
		"0000010000101010000100000",
		"0000010110101010110100000",
		"0000010100000000010100000",
		"0000010001011101000100000",
		"0000010100000000010100000",
		"0000010110101010110100000",
		"0000010000101010000100000",
		"0000010111100011110100000",
		"0000010000001000000100000",
		"0000011111111111111100000",
		"0000000000000000000000000",
		"0000000000000000000000000"
	));
	
	player=new Player(11, 7);
	enemy=new Array();
	enemy[0]=new Enemy(6, 3);
	enemy[1]=new Enemy(18, 3);
	enemy[2]=new Enemy(6, 13);
	enemy[3]=new Enemy(18, 13);
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

