var img;
var anim;
var animIndex;
var x, y;
var vx, vy;

function main() {
	img=document.createElement("img");
	document.body.appendChild(img);
	img.src="pcStay.png";

	anim=new Array(
		"pcWalk0.png", "pcWalk2.png", "pcWalk0.png", 
		"pcWalk1.png", "pcWalk3.png", "pcWalk1.png"
	);
	animIndex=0;

	img.style.position="absolute";
	x=0;
	y=0;
	vx=10;
	vy=10;
	setInterval(update, 50);
}

function update() {
	img.src=anim[animIndex];
	animIndex++;
	if (animIndex>=anim.length) {
		animIndex=0;
	}
	
	x+=vx;
	y+=vy;
	if (x<=0 || x>=720) vx=-vx;
	if (y<=0 || y>=520) vy=-vy;
	img.style.left=x+"px";
	img.style.top=y+"px";
}

