// 定数
var CELL_SIZE=80;
var CELL_XCOUNT=12;
var CELL_YCOUNT=7;
var XMAX=CELL_XCOUNT-1;
var YMAX=CELL_YCOUNT-1;
var FIELD_ZINDEX=0;
var SPRITE_ZINDEX=1;
var FIELD_WIDTH=CELL_SIZE*CELL_XCOUNT;
var FIELD_HEIGHT=CELL_SIZE*CELL_YCOUNT;
var FIELD_COLOR="white";
var BORDER_SIZE=5;
var BORDER_COLOR="black";
var SCORE_HEIGHT=40;
var SCORE_FONT_FAMILY="Impact, sans-serif";
var SCORE_FONT_SIZE="24pt";
var UPDATE_INTERVAL=50;
var MAX_SCORE=999999999;
var KEY_LEFT=37;
var KEY_RIGHT=39;
var KEY_UP=38;
var KEY_DOWN=40;
var KEY_SPACE=32;
var KEY_ENTER=13;
var KEY_ESC=27;
var KEY_COUNT=256;
var MOUSE_BUTTON_LEFT=0;
var MOUSE_BUTTON_CENTER=1;
var MOUSE_BUTTON_RIGHT=2;
var MOUSE_BUTTON_COUNT=3;
var READYSTATE_UNINI=0;
var READYSTATE_LOADING=1;
var READYSTATE_LOADED=2;
var READYSTATE_INTERACTIVE=3;
var READYSTATE_COMPLETE=4;
var STATUS_NOT_FOUND=404;
var STATUS_NOT_MODIFIED=304;
var STATUS_OK=200;

// 乱数
function randFloat2(from, to) {
	return Math.random()*(to-from)+from;
}
function randFloat(to) {
	return randFloat2(0, to);
}
function randInt2(from, to) {
	return Math.floor(randFloat2(from, to));
}
function randInt(to) {
	return randInt2(0, to);
}
function randSign() {
	return randInt(2)*2-1;
}

// デバッグ
function debug(message) {
	var style;
	var div=document.getElementById("divDebug");
	if (div==null) {
		div=document.createElement("div");
		document.body.appendChild(div);
		div.id="divDebug";
		style=div.style;
		style.position="absolute";
		style.left=0+"px";
		style.top=FIELD_HEIGHT+SCORE_HEIGHT+BORDER_SIZE*3+"px";
	}
	div.innerHTML=message;
}

// スプライト
function Sprite(div, zIndex) {
	var obj=this;
	var style;
	
	// 表示領域
	obj.img=document.createElement("img");
	div.appendChild(obj.img);
	obj.img.src="void.png";
	style=obj.img.style;
	style.position="absolute";
	style.zIndex=zIndex;

	// 更新
	obj.updated=false;
	obj.viewX=0;
	obj.viewY=0;
	obj.onUpdate=function() {}
	obj.update=function(viewX, viewY) {
		if (obj.updated && viewX==obj.viewX && viewY==obj.viewY) return;
		obj.updated=true;
		obj.viewX=viewX;
		obj.viewY=viewY;

		var style=obj.img.style;
		style.left=Math.floor((obj.x-viewX)*CELL_SIZE)+"px";
		style.top=Math.floor((obj.y-viewY)*CELL_SIZE)+"px";
		style.width=Math.floor(obj.xSize*CELL_SIZE)+"px";
		style.height=Math.floor(obj.ySize*CELL_SIZE)+"px";
		
		obj.img.src=obj.animImage[obj.animIndex];
	}

	// グリッド
	obj.setGrid=function(g) {
		obj.grid=g;
	}
	obj.getGrid=function() {
		return obj.grid;
	}
	obj.setGrid(0);

	// 位置
	obj.setXY=function(x, y) {
		obj.updated=false;
		if (obj.grid!=0) {
			obj.x=Math.floor(x*obj.grid+0.5)/obj.grid;
			obj.y=Math.floor(y*obj.grid+0.5)/obj.grid;
		} else {
			obj.x=x;
			obj.y=y;
		}
	}
	obj.getX=function() {
		return obj.x;
	}
	obj.getY=function() {
		return obj.y;
	}
	obj.setXY(0, 0);
	
	// サイズ
	obj.setSize=function(xSize, ySize) {
		obj.updated=false;
		obj.xSize=xSize;
		obj.ySize=ySize;
	}
	obj.getXSize=function() {
		return obj.xSize;
	}
	obj.getYSize=function() {
		return obj.ySize;
	}
	obj.setSize(1, 1);
	
	// アニメーション
	obj.initAnim=function(array) {
		obj.updated=false;
		obj.animImage=array;
		obj.animIndex=0;
		obj.animOver=false;
	}
	obj.stepAnim=function() {
		obj.updated=false;
		obj.animIndex++;
		if (obj.animIndex>=obj.animImage.length) {
			obj.animIndex=0;
			obj.animOver=true;
		}
	}
	obj.isAnimOver=function() {
		return obj.animOver;
	}
	obj.initAnim(new Array("void.png"));

	// 当たり判定処理
	obj.hit=new Array(0, 0, 1, 1);
	obj.initHit=function(array) {
		obj.hit=array;
	}
	obj.onHitSprite=function(spr) {};
	obj.testHitSprite=function(spr) {
		var a=obj.hit, b=spr.hit;
		var al=a[0]+obj.x, ar=a[2]+obj.x;
		var at=a[1]+obj.y, ab=a[3]+obj.y;
		var bl=b[0]+spr.x, br=b[2]+spr.x;
		var bt=b[1]+spr.y, bb=b[3]+spr.y;
		if (al<br && bl<ar && at<bb && bt<ab) {
			obj.onHitSprite(spr);
			return true;
		}
		return false;
	}
	
	// 状態
	obj.state=0;
	obj.getState=function() {
		return obj.state;
	}
	obj.setState=function(state) {
		obj.state=state;
	}
}

// フィールド
function Field(div, zIndex) {
	var obj=this;
	var style;
	var x, y;

	// 表示領域
	obj.img=new Array();
	for (y=0; y<CELL_YCOUNT+1; y++) {
		obj.img[y]=new Array();
		for (x=0; x<CELL_XCOUNT+1; x++) {
			obj.img[y][x]=document.createElement("img");
			div.appendChild(obj.img[y][x]);
			obj.img[y][x].src="void.png";
			style=obj.img[y][x].style;
			style.position="absolute";
			style.zIndex=zIndex;
		}
	}
	
	// 更新
	obj.updated=false;
	obj.viewX=0;
	obj.viewY=0;
	obj.onUpdate=function() {}
	obj.update=function(viewX, viewY) {
		if (obj.updated && viewX==obj.viewX && viewY==obj.viewY) return;
		obj.updated=true;
		obj.viewX=viewX;
		obj.viewY=viewY;

		var style;
		var x, y;
		for (y=0; y<obj.img.length; y++) {
			for (x=0; x<obj.img[y].length; x++) {
				obj.img[y][x].src=
					obj.cellImage[obj.getCell(viewX+x, viewY+y)];
				style=obj.img[y][x].style;
				style.left=Math.floor(
					(Math.floor(viewX)-viewX+x)*CELL_SIZE)+"px";
				style.top=Math.floor(
					(Math.floor(viewY)-viewY+y)*CELL_SIZE)+"px";
			}
		}
	}

	// セル画像
	obj.initCellImage=function(array) {
		obj.updated=false;
		obj.cellImage=array;
	}
	obj.initCellImage(new Array("void.png"));

	// セル
	obj.initCell=function(array) {
		obj.updated=false;
		obj.cell=new Array();
		obj.yCount=array.length;
		obj.xCount=Number.MAX_VALUE;
		for (y=0; y<obj.yCount; y++) {
			obj.cell[y]=new Array();
			if (obj.xCount>array[y].length) {
				obj.xCount=array[y].length;
			}
			for (x=0; x<obj.xCount; x++) {
				obj.cell[y][x]=
					"0123456789abcdef".indexOf(array[y].charAt(x))
			}
		}
	}
	obj.getCell=function(x, y) {
		var yc=obj.yCount;
		var cy=(Math.floor(y)%yc+yc)%yc;
		var xc=obj.xCount;
		var cx=(Math.floor(x)%xc+xc)%xc;
		return obj.cell[cy][cx];
	}
	obj.setCell=function(x, y, value) {
		obj.updated=false;
		var yc=obj.yCount;
		var cy=(Math.floor(y)%yc+yc)%yc;
		var xc=obj.xCount;
		var cx=(Math.floor(x)%xc+xc)%xc;
		obj.cell[cy][cx]=value;
	}
	obj.getXCount=function() {
		return obj.xCount;
	}
	obj.getYCount=function() {
		return obj.yCount;
	}
	obj.initCell(new Array("0"));
}

// ゲーム本体
function Game() {
	var obj=this;
	var style;
	var i;

	// ベース表示領域
	obj.divBase=document.createElement("div");
	document.body.appendChild(obj.divBase);
	style=obj.divBase.style;
	style.position="absolute";
	style.backgroundColor=BORDER_COLOR;
	style.left=0+"px";
	style.top=0+"px";
	style.width=FIELD_WIDTH+BORDER_SIZE*2+"px";
	style.height=FIELD_HEIGHT+SCORE_HEIGHT+BORDER_SIZE*3+"px";

	// フィールド表示領域
	obj.divField=document.createElement("div");
	obj.divBase.appendChild(obj.divField);
	style=obj.divField.style;
	style.overflow="hidden";
	style.position="absolute";
	style.backgroundColor=FIELD_COLOR;
	style.left=BORDER_SIZE+"px";
	style.top=BORDER_SIZE+"px";
	style.width=FIELD_WIDTH+"px";
	style.height=FIELD_HEIGHT+"px";

	// スコア表示領域
	obj.divScore=document.createElement("div");
	obj.divBase.appendChild(obj.divScore);
	style=obj.divScore.style;
	style.overflow="hidden";
	style.position="absolute";
	style.backgroundColor=FIELD_COLOR;
	style.left=BORDER_SIZE+"px";
	style.top=FIELD_HEIGHT+BORDER_SIZE*2+"px";
	style.width=FIELD_WIDTH/2+"px";
	style.height=SCORE_HEIGHT+"px";
	style.fontFamily=SCORE_FONT_FAMILY;
	style.fontSize=SCORE_FONT_SIZE;

	// ハイスコア表示領域
	obj.divHighScore=document.createElement("div");
	obj.divBase.appendChild(obj.divHighScore);
	style=obj.divHighScore.style;
	style.overflow="hidden";
	style.position="absolute";
	style.backgroundColor=FIELD_COLOR;
	style.left=BORDER_SIZE+FIELD_WIDTH/2+"px";
	style.top=FIELD_HEIGHT+BORDER_SIZE*2+"px";
	style.width=FIELD_WIDTH/2+"px";
	style.height=SCORE_HEIGHT+"px";
	style.fontFamily=SCORE_FONT_FAMILY;
	style.fontSize=SCORE_FONT_SIZE;

	// ハイスコア
	obj.getHighScore=function() {
		return obj.score;
	}
	obj.setHighScore=function(score) {
		obj.highScore=score;
		if (obj.highScore>MAX_SCORE) {
			obj.highScore=MAX_SCORE;
		}
		obj.divHighScore.innerHTML="High Score: "+obj.highScore;
	}
	obj.setHighScore(0);
	
	// スコア
	obj.getScore=function() {
		return obj.score;
	}
	obj.setScore=function(score) {
		obj.score=score;
		if (obj.score>MAX_SCORE) {
			obj.score=MAX_SCORE;
		}
		obj.divScore.innerHTML="Score: "+obj.score;
		if (obj.score>obj.highScore) {
			obj.setHighScore(obj.score);
		}
		if (obj.score%10==0) {
			obj.rankingScore=obj.score;
		}
	}
	obj.addScore=function(score) {
		obj.setScore(obj.score+score);
	}
	obj.setScore(0);
	
	// 画面のクリア
	obj.clear=function() {
		obj.divField.innerHTML="";
		obj.sprite=new Array();
		obj.field=new Array();
		obj.zIndex=0;
	}
	obj.clear();

	// フィールド
	obj.createField=function() {
		var f=new Field(obj.divField, obj.zIndex++);
		obj.field.push(f);
		return f;
	}
	
	// スプライト
	obj.createSprite=function() {
		var s=new Sprite(obj.divField, obj.zIndex++);
		obj.sprite.push(s);
		return s;
	}

	// ビュー
	obj.setViewXY=function(x, y) {
		obj.viewX=x;
		obj.viewY=y;
	}
	obj.getViewX=function() {
		return obj.viewX;
	}
	obj.getViewY=function() {
		return obj.viewY;
	}
	obj.setViewXY(0, 0);
	
	// キーボード
	obj.key=new Array();
	for (i=0; i<KEY_COUNT; i++) {
		obj.key[i]=false;
	}
	document.onkeydown=function(e) {
		if (e) {
			obj.key[e.which]=true;
		} else {
			obj.key[event.keyCode]=true;
		}
	}
	document.onkeyup=function(e) {
		if (e) {
			obj.key[e.which]=false;
		} else {
			obj.key[event.keyCode]=false;
		}
	}
	obj.isKey=function(code) {
		return obj.key[code];
	}
	
	// マウス
	obj.mouseX=0;
	obj.mouseY=0;
	obj.mouseButton=new Array();
	for (i=0; i<MOUSE_BUTTON_COUNT; i++) {
		obj.mouseButton[i]=false;
	}
	document.onmousemove=function(e) {
		if (e) {
			obj.mouseX=(e.pageX-BORDER_SIZE)/CELL_SIZE+obj.viewX;
			obj.mouseY=(e.pageY-BORDER_SIZE)/CELL_SIZE+obj.viewY;
		} else {
			obj.mouseX=(event.x-BORDER_SIZE)/CELL_SIZE+obj.viewX;
			obj.mouseY=(event.y-BORDER_SIZE)/CELL_SIZE+obj.viewY;
		}
	}
	document.onmousedown=function(e) {
		if (e) {
			obj.mouseButton[e.which-1]=true;
		} else {
			if (event.button&1) obj.mouseButton[MOUSE_BUTTON_LEFT]=true;
			if (event.button&4) obj.mouseButton[MOUSE_BUTTON_CENTER]=true;
			if (event.button&2) obj.mouseButton[MOUSE_BUTTON_RIGHT]=true;
		}
	}
	document.onmouseup=function(e) {
		if (e) {
			obj.mouseButton[e.which-1]=false;
		} else {
			if (event.button&1) obj.mouseButton[MOUSE_BUTTON_LEFT]=false;
			if (event.button&4) obj.mouseButton[MOUSE_BUTTON_CENTER]=false;
			if (event.button&2) obj.mouseButton[MOUSE_BUTTON_RIGHT]=false;
		}
	}
	obj.getMouseX=function() {
		return obj.mouseX;
	}
	obj.getMouseY=function() {
		return obj.mouseY;
	}
	obj.isMouseButton=function(index) {
		return obj.mouseButton[index];
	}
	
	// 当たり判定処理
	obj.testHitSprite=function(spr) {
		var hit=false;
		var i;
		for (i=0; i<obj.sprite.length; i++) {
			if (spr!=obj.sprite[i]) {
				if (spr.testHitSprite(obj.sprite[i])) {
					hit=true;
				}
			}
		}
		return hit;
	}
	
	// 更新
	obj.onUpdate=function() {}
	obj.update=function() {
		obj.onUpdate();
		var i;
		for (i=0; i<obj.field.length; i++) {
			obj.field[i].onUpdate();
		}
		for (i=0; i<obj.sprite.length; i++) {
			obj.sprite[i].onUpdate();
		}
		for (i=0; i<obj.field.length; i++) {
			obj.field[i].update(obj.viewX, obj.viewY);
		}
		for (i=0; i<obj.sprite.length; i++) {
			obj.sprite[i].update(obj.viewX, obj.viewY);
		}
	}
	setInterval(obj.update, UPDATE_INTERVAL);

	// ネームエントリー
	obj.rankingName="";
	obj.initNameEntry=function() {
		obj.clear();

		obj.divField.innerHTML=
			"<br><br><br><br><center>"+
			"Input Your Name<br><br>"+
			'<input id="nameInput"><br><br>'+
			"Press [Enter] Key To Submit<br>"+
			"</center>";
		obj.divField.style.fontFamily=SCORE_FONT_FAMILY;
		obj.divField.style.fontSize=SCORE_FONT_SIZE;
		
		obj.nameInput=document.getElementById("nameInput");
		obj.nameInput.type="text";
		obj.nameInput.maxlength=20;
		obj.nameInput.value="";
		obj.nameInput.style.fontFamily=SCORE_FONT_FAMILY;
		obj.nameInput.style.fontSize=SCORE_FONT_SIZE;
		obj.nameInput.style.textAlign="center";
		obj.nameInput.focus();
		
		obj.rankingName="";
	}
	obj.updateNameEntry=function() {
		obj.rankingName=obj.nameInput.value;
		return obj.rankingName.match(/^[A-Za-z0-9]+$/);
	}
	
	// ランキング
	obj.rankingScore=0;
	obj.rankingRequest=new Request();
	obj.initRanking=function(uri) {
		obj.clear();
		obj.divField.innerHTML=
			"<br><br><br><br><br><br><center>"+
			"Connecting To Server..."
			"</center>";
		obj.rankingRequest.doPost(
			uri, obj.rankingName+","+obj.rankingScore
		);
	}
	obj.updateRanking=function() {
		var res, s, i, a;
		if (obj.rankingRequest.isDone()) {
			res=obj.rankingRequest.getResponse().split("\n");
			if (res.shift()=="ok") {
				s=
					"<br><br><center>"+
					"Top Players<br><br>"+
					'<table id="rankingTable">'+
					"<tr><th>Rank</th><th>Name</th>"+
					"<th>Score</th></tr>";
				for (i=0; i<res.length-1; i++) {
					a=res[i].split(",");
					s+=
						"<tr><td>"+(i+1)+"</td>"+
						"<td>"+a[0]+"</td>"+
						"<td>"+a[1]+"</td></tr>";
					if (i==0) {
						obj.setHighScore(a[1]);
					}
				}
				s+=
					"</table><br>"+
					"Press [Enter] Key To Proceed<br>"+
					"</center>";
				obj.divField.innerHTML=s;
				obj.rankingTable=document.getElementById("rankingTable");
				obj.rankingTable.style.fontFamily=SCORE_FONT_FAMILY;
				obj.rankingTable.style.fontSize=SCORE_FONT_SIZE;
				obj.rankingTable.style.width=FIELD_WIDTH/2;
			} else {
				obj.initRanking();
			}
		}
		if (obj.rankingRequest.isError()) {
			obj.initRanking();
		}
	}
}

// 通信
function Request(){
	var obj=this;
	
	// XMLHttpRequestオブジェクトの生成
	var req=false;
	{
		// XMLHttpRequestを使用する場合
		if (window.XMLHttpRequest) {
			try {
				req=new XMLHttpRequest();
			} catch (e) {}
		} else
		
		// ActiveXObjectを使用する場合（IE/Windows）
		if (window.ActiveXObject) {
			try {
				req=new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					req=new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {}
			}
		}
	}
	obj.xmlHttpRequest=req;
	
	// リクエストの送信
	obj.send=function(method, uri, message) {
		var req=obj.xmlHttpRequest;
		if (
			req.readyState!=READYSTATE_COMPLETE && 
			req.readyState!=READYSTATE_UNINI
		) return;
		
		// 送信
		req.open(method, uri, true);
		req.setRequestHeader("Content-Type", "text/plain");
		req.send(message);
	}

	// GETリクエストの送信
	obj.doGet=function(uri) {
		obj.send("GET", uri, "");
	}

	// POSTリクエストの送信
	obj.doPost=function(uri, message) {
		obj.send("POST", uri, message);
	}

	// 状態の取得
	obj.isDone=function() {
		var req=obj.xmlHttpRequest;
		return (
			req.readyState==READYSTATE_COMPLETE && 
			req.status==STATUS_OK
		);
	}
	obj.isError=function() {
		var req=obj.xmlHttpRequest;
		return (
			req.readyState==READYSTATE_COMPLETE &&
			req.status!=STATUS_OK
		);
	}

	// レスポンスの取得
	obj.getResponse=function() {
		return obj.xmlHttpRequest.responseText;
	}
}

