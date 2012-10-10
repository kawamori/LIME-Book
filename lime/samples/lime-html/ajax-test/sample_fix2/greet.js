var PLAYER_COUNT=10;
var PLAYER_SPEED=0.05;

var game;
var player;
var playerWalkAnim;
var playerGreetAnim;

function Player() {
	var obj=this;
	obj.sprite=game.createSprite();
	obj.sprite.initAnim(playerWalkAnim);
	obj.sprite.setXY(randFloat(XMAX), randFloat(YMAX));
	obj.vx=randSign()*PLAYER_SPEED;
	obj.vy=randSign()*PLAYER_SPEED;
	
	obj.greet=false;
	obj.sprite.onUpdate=function() {
		var x=obj.sprite.getX()+obj.vx;
		var y=obj.sprite.getY()+obj.vy;
		if (x<0 || x>XMAX) obj.vx*=-1;
		if (y<0 || y>YMAX) obj.vy*=-1;
		obj.sprite.setXY(x, y);
		obj.sprite.stepAnim();
		
		if (game.testHitSprite(obj.sprite)) {
			if (!obj.greet) {
				obj.sprite.initAnim(playerGreetAnim);
				obj.greet=true;
			}
		} else {
			if (obj.greet) {
				obj.sprite.initAnim(playerWalkAnim);
				obj.greet=false;
			}
		}
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
	playerGreetAnim=new Array(
		"pcGreet0.png", "pcGreet1.png", 
		"pcGreet2.png", "pcGreet1.png"
	);
	for (i=0; i<PLAYER_COUNT; i++) {
		player[i]=new Player();
	}
}

