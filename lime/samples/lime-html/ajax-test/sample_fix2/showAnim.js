var img;
var anim;
var animIndex;

function main() {
	img=document.createElement("img");
	document.body.appendChild(img);
	img.src="pcStay.png";

	anim=new Array(
		"pcWalk0.png", "pcWalk2.png", "pcWalk0.png", 
		"pcWalk1.png", "pcWalk3.png", "pcWalk1.png"
	);
	animIndex=0;
	setInterval(update, 50);
}

function update() {
	img.src=anim[animIndex];
	animIndex++;
	if (animIndex>=anim.length) {
		animIndex=0;
	}
}

