var GRID=5;
var SPEED=1.0/GRID;

var CELL_VOID=0;
var CELL_WALL=1;
var CELL_LOAD=2;
var CELL_PLAYER=3;

var STATE_LOAD_STAY=1;
var STATE_LOAD_MOVE=2;

var game;
var player;
var load;
var field;

var playerWalkAnim;
var loadAnim;

function Player(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(playerWalkAnim);
	obj.sprite.setGrid(GRID);
	obj.sprite.setXY(x, y);
	obj.vx=0;
	obj.vy=0;
	
	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vx=obj.vx, vy=obj.vy;
		var i;
		
		if (x==Math.floor(x) && y==Math.floor(y)) {
			vx=vy=0;
			if (game.isKey(KEY_LEFT)) vx=-1; else
			if (game.isKey(KEY_RIGHT)) vx=1; else
			if (game.isKey(KEY_UP)) vy=-1; else
			if (game.isKey(KEY_DOWN)) vy=1;
			
			if (field.getCell(x+vx, y+vy)==CELL_VOID) {
				field.setCell(x, y, CELL_VOID);
				field.setCell(x+vx, y+vy, CELL_PLAYER);
			} else
			if (
				vy==0 &&
				field.getCell(x+vx, y)==CELL_LOAD &&
				field.getCell(x+vx+vx, y)==CELL_VOID &&
				field.getCell(x+vx, y+1)!=CELL_VOID
			) {
				for (i=0; i<load.length; i++) {
					if (
						load[i].sprite.getState()==STATE_LOAD_STAY &&
						load[i].sprite.getX()==x+vx && 
						load[i].sprite.getY()==y+vy
					) {
						field.setCell(x, y, CELL_VOID);
						field.setCell(x+vx, y, CELL_PLAYER);
						field.setCell(x+vx+vx, y, CELL_LOAD);
						load[i].vx=vx;
						load[i].vy=vy;
						load[i].sprite.setState(STATE_LOAD_MOVE);
						break;
					}
				}
				if (i==load.length) {
					vx=vy=0;
				}
			} else {
				vx=vy=0;
			}
		}

		obj.sprite.setXY(x+vx*SPEED, y+vy*SPEED);
		obj.vx=vx;
		obj.vy=vy;
		if (vx!=0 || vy!=0) {
			obj.sprite.stepAnim();
		}
	}
}

function Load(x, y) {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(loadAnim);
	obj.sprite.setGrid(GRID);
	obj.sprite.setState(STATE_LOAD_STAY);
	obj.sprite.setXY(x, y);
	obj.vx=0;
	obj.vy=0;
	
	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX(), y=obj.sprite.getY();
		var vx=obj.vx, vy=obj.vy;
		
		if (obj.sprite.getState()==STATE_LOAD_STAY) {
			if (field.getCell(x, y+1)==CELL_VOID) {
				vy=1;
				field.setCell(x, y, CELL_VOID);
				field.setCell(x, y+vy, CELL_LOAD);
				obj.sprite.setState(STATE_LOAD_MOVE);
			}
		}
		if (obj.sprite.getState()==STATE_LOAD_MOVE) {
			obj.sprite.setXY(x+vx*SPEED, y+vy*SPEED);
			x=obj.sprite.getX();
			y=obj.sprite.getY();
			if (x==Math.floor(x) && y==Math.floor(y)) {
				vx=vy=0;
				obj.sprite.setState(STATE_LOAD_STAY);
			}
		}

		obj.vx=vx;
		obj.vy=vy;
	}
}

function init() {
	var x, y, i;

	game.clear();

	field=game.createField();
	field.initCellImage(new Array(
		"void.png", "wall.png", 
		"void.png", "void.png"
	));
	field.initCell(new Array(
		"111111111111",
		"100300002001",
		"101110011101",
		"100020000001",
		"100011110201",
		"102000000201",
		"111111111111"
	));
	
	load=new Array();
	for (i=0, y=0; y<field.getYCount(); y++) {
		for (x=0; x<field.getXCount(); x++) {
			switch (field.getCell(x, y)) {
				case CELL_PLAYER:
					player=new Player(x, y);
					break;
				case CELL_LOAD:
					load[i++]=new Load(x, y);
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
	loadAnim=new Array("load.png");
	init();
}

