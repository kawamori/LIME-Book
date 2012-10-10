var PLAYER_COUNT=10;
var PLAYER_SPEED=0.05;

var game;
var player;
var playerWalkAnim;

function Player() {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(playerWalkAnim);
	obj.sprite.setXY(randFloat(XMAX), randFloat(YMAX));
	obj.vx=randSign()*PLAYER_SPEED;
	obj.vy=randSign()*PLAYER_SPEED;
	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX()+obj.vx;
		var y=obj.sprite.getY()+obj.vy;
		if (x<0 || x>XMAX) obj.vx=-obj.vx;
		if (y<0 || y>YMAX) obj.vy=-obj.vy;
		obj.sprite.setXY(x, y);
		obj.sprite.stepAnim();
	}
}

function main() {
	var i;
	game=new Game();
	player=new Array();
	playerWalkAnim=new Array(
		"pcWalk0.png", "pcWalk2.png", "pcWalk0.png", 
		"pcWalk1.png", "pcWalk3.png", "pcWalk1.png"
	);
	for (i=0; i<PLAYER_COUNT; i++) {
		player[i]=new Player();
	}
}

