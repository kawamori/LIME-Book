var GRID=5;
var SPEED=1.0/GRID;

var CELL_VOID=0;
var CELL_WALL=1;
var CELL_TRAMPOLINE=2;
var CELL_PIT=3;
var CELL_PLAYER=4;

var STATE_TRAMPOLINE_STAY=0;
var STATE_TRAMPOLINE_MOVE=1;

var game;
var player;
var trampoline;
var field;

var playerWalkAnim;
var trampolineStayAnim;
var trampolineMoveAnim;

function Player(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(playerWalkAnim);
	obj.sprite.setGrid(GRID);
	obj.sprite.setXY(x, y);
	obj.vy=0;
	obj.jump=false;
	
	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vx, vy=obj.vy;
		
		vx=0;
		if (game.isKey(KEY_LEFT)) vx=-1;
		if (game.isKey(KEY_RIGHT)) vx=1;

		if (!obj.jump) {
			if (x==Math.floor(x)) {
				if (field.getCell(x+vx, y)==CELL_WALL) {
					vx=0;
				}
				if (field.getCell(x, y)==CELL_PIT) {
					vx=0;
					vy=1;
					obj.jump=true;
				}
			}
			if (vx!=0) {
				obj.sprite.stepAnim();
			}
		} else {
			if (y==Math.floor(y)) {
				if (
					vy<0 &&
					field.getCell(x+vx, y)==CELL_VOID
				) {
					vy=0;
					obj.jump=false;
				} else {
					vx=0;
				}
				if (
					field.getCell(x, y)==CELL_TRAMPOLINE ||
					field.getCell(x, y+vy)==CELL_WALL
				) {
					vy=-vy;
				}
			} else {
				vx=0;
			}
			obj.sprite.onHitSprite=function(spr) {
				if (spr.getState()==STATE_TRAMPOLINE_STAY) {
					spr.initAnim(trampolineMoveAnim);
					spr.setState(STATE_TRAMPOLINE_MOVE);
				}
			}
			game.testHitSprite(obj.sprite);
		}

		obj.sprite.setXY(x+vx*SPEED, y+vy*SPEED);
		obj.vy=vy;
	}
}

function Trampoline(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(trampolineStayAnim);
	obj.sprite.setGrid(GRID);
	obj.sprite.setXY(x, y);
	obj.sprite.setState(STATE_TRAMPOLINE_STAY);
	obj.sprite.onUpdate=function() {
		if (obj.sprite.isAnimOver()) {
			obj.sprite.initAnim(trampolineStayAnim);
			obj.sprite.setState(STATE_TRAMPOLINE_STAY);
		}
		obj.sprite.stepAnim();
	}
}

function init() {
	var x, y, i;

	game.clear();

	field=game.createField();
	field.initCellImage(new Array(
		"void.png", "wall.png", "void.png", 
		"void.png", "void.png"
	));
	field.initCell(new Array(
		"111111111111",
		"134030030031",
		"131131131131",
		"130030030031",
		"131121121131",
		"130000000031",
		"121111111121"
	));
	
	trampoline=new Array();
	for (i=0, y=0; y<field.getYCount(); y++) {
		for (x=0; x<field.getXCount(); x++) {
			switch (field.getCell(x, y)) {
				case CELL_PLAYER:
					player=new Player(x, y);
					field.setCell(x, y, CELL_VOID);
					break;
				case CELL_TRAMPOLINE:
					trampoline[i++]=new Trampoline(x, y);
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
	trampolineStayAnim=new Array(
		"trampoline0.png"
	);
	trampolineMoveAnim=new Array(
		"trampoline0.png", "trampoline1.png", 
		"trampoline2.png", "trampoline3.png", 
		"trampoline4.png", "trampoline4.png", 
		"trampoline3.png", "trampoline2.png", 
		"trampoline1.png", "trampoline0.png"
	);
	init();
}

