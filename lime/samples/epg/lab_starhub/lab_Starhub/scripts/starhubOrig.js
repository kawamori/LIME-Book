/************************************************************
 * Global variables
 */
var gChannelList = new Array('102 CH5','103 CH8',
	'821 CNA','858 Discovery HD');
	
var gChannelProgList = new Array();
gChannelProgList[0] = new Array('10:00AM   <<The Martha Stewart Show III','12:00PM   The Ellen DeGeneres Show VII','14:00PM   Whacked Out Sports','15:00PM   Wheel of Fortune',
	'16:00PM   En Bloc','19:00PM   The Price Is Right - USA',
	'20:00PM   Ninja Warrior','21:30PM   News 5 Tonight');
gChannelProgList[1] = new Array('10:00AM   TTT','12:00PM   ERR','14:00PM   555','15:00PM   ADS',
	'16:00PM   ASA','19:00PM   RFF',
	'20:00PM   SYA','21:30PM   BER');
gChannelProgList[2] = new Array('10:00AM   XXX','12:00PM   YYY','14:00PM   ZZZ','15:00PM   TTT',
	'16:00PM   EEE','19:00PM   FFF',
	'20:00PM   GGG','21:30PM   AAA');;
gChannelProgList[3] = new Array('10:00AM   III','12:00PM   VII','14:00PM   WOS','15:00PM   WOF',
	'16:00PM   ENB','19:00PM   USA',
	'20:00PM   NIW','21:30PM   N5T');


var gTVFocus = -1;
var gTVPage = 0;
var gTVSubfocus = -1;
var gTVSubPage = 0;
var gTVWin = new Array('tv_left','tv_center');

var gRecomend = false;
var gPlayState = false;
var fullshowindex =0;
var gURL = "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090ksjj";
//////////////////////////////////////////////////////////////////////////////////////////////
//Menu Rendering Functions
//////////////////////////////////////////////////////////////////////////////////////////////
function hideMenu(tagId)
{
	document.getElementById(tagId+'_top').normalStyle.visibility = 'hidden';
	document.getElementById(tagId+'_mainMenu').normalStyle.visibility = 'hidden';
	document.getElementById(tagId+'_bu').normalStyle.visibility = 'hidden';
	document.getElementById(tagId+'_bd').normalStyle.visibility = 'hidden';
	document.getElementById(tagId+'_br').normalStyle.visibility = 'hidden';
	for(i=0;i<4;i++)
	{
		document.getElementById(tagId+'_row'+i).normalStyle.visibility = 'hidden';
		document.getElementById(tagId+'_t'+i).normalStyle.visibility = 'hidden';
	}
}
function renderMenu(tagId,x,y,arrContent,focus)
{

//	hideMenu(tagId);
	var noRows = arrContent.length;
	var page = focus/9;
	var noPage = noRows/9 + 1;

	noRows = noRows - page*9;
	noRows = noRows>9?9:noRows;
	
	//render top

	elemStyle = document.getElementById(tagId+'_top').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = x+'px';
	elemStyle.top = y+'px';
	y = y+2;
	
	//render rows_/subrows_bg

	elemStyle = document.getElementById(tagId+'_bg').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = x +'px';
	elemStyle.top = (y +28)+'px';
	

	//render rows
	var i;
	for(i=0;i<noRows;i++)
	{
		elemStyle = document.getElementById(tagId+'_row'+i).normalStyle;
		elemStyle.visibility = 'visible';
		elemStyle.left = (x+20) +'px';
		elemStyle.top = (y +30+i*35)+'px';
	}

	//render buttons and text
	var offset = page*9;
	for(i=0;i<noRows;i++,offset++)
	{
		textStyle = document.getElementById(tagId+'_t'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
		textStyle.left  = (x+40) + 'px';
		textStyle.top = (y +30+i*35+10)+'px';
		document.getElementById(tagId+'_t'+i).firstChild.data = arrContent[offset];

	}
	

}


function setFocusMain(focus)
{
	if (gTVFocus >= 0)
	{

		var rowId = gTVFocus%9;
		elemStyle = document.getElementById(gTVWin[0]+'_row'+rowId).normalStyle;
		elemStyle.visibility = 'visible';
		elemStyle.left = 60 +'px';
		elemStyle.top = 327+(rowId*35)+'px';
		document.getElementById(gTVWin[0]+'_row'+rowId).data = 
			'../images/starhub/row.jpg';
		textStyle = document.getElementById(gTVWin[0]+'_t'+rowId).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
		textStyle.left  = 80+ 'px';
		textStyle.top = 327+(rowId*35+10)+'px';
		textStyle.grayscaleColorIndex=String("141 15");
		textStyle.colorIndex=String("56");
		document.getElementById(gTVWin[0]+'_t'+rowId).firstChild.data = gChannelList[rowId];
	}
	gTVFocus = focus;
	focus %= 9;
	
	//setHighlight.img//
	elemStyle = document.getElementById(gTVWin[0]+'_row'+focus).normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 40+'px';
	elemStyle.top = 327+(gTVFocus*35)+'px';
	if (focus ==3){
		document.getElementById(gTVWin[0]+'_row'+focus).data = 
			'../images/starhub/row_fl.jpg';
	}else{
		document.getElementById(gTVWin[0]+'_row'+focus).data = 
			'../images/starhub/row_f.jpg';
	}
	//setText-highlight//
	textStyle = document.getElementById(gTVWin[0]+'_t'+focus).normalStyle;
	textStyle.visibility = elemStyle.visibility = 'visible';
	textStyle.left  = 80+ 'px';
	textStyle.top = 327+(gTVFocus*35+10)+'px';
	textStyle.grayscaleColorIndex=String("45 201");
	textStyle.colorIndex=String("110");
	document.getElementById(gTVWin[0]+'_t'+focus).firstChild.data = gChannelList[focus];

	//buttons//
	elemStyle = document.getElementById('tv_left_bu').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 432 +'px';
	elemStyle.top = 315+(gTVFocus*35)+'px';

	elemStyle = document.getElementById('tv_left_bd').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 432 +'px';
	elemStyle.top = 352+(gTVFocus*35)+'px';

	elemStyle = document.getElementById('tv_left_br').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 460 +'px';
	elemStyle.top = 334+(gTVFocus*35)+'px';

	//change submenu according to the scrolling of main menu.
	renderMenu(gTVWin[1],485,55,gChannelProgList[gTVFocus],0);
	 
}

function setFocusSub(focus)
{
	if (gTVSubfocus >= 0)
	{
		var rowId = gTVSubfocus%9;
		document.getElementById(gTVWin[1]+'_row'+rowId).data = 
			'../images/starhub/subrow.jpg';
	}
	gTVSubfocus = focus;
	focus %= 9;

	elemStyle = document.getElementById(gTVWin[1]+'_row'+focus).normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 487+'px';
	elemStyle.top = 87+(gTVSubfocus*35)+'px';
	document.getElementById(gTVWin[1]+'_row'+focus).data = 
		'../images/starhub/subrow_f.jpg';

	elemStyle = document.getElementById('tv_center_bl').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 490 +'px';
	elemStyle.top = 60+'px';

	elemStyle = document.getElementById('tv_center_br').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 895 +'px';
	elemStyle.top = 60+'px';

}

function keyArrow(code)
{
	if (code == 1)
	{
		//up
		if (gTVSubfocus < 0)
		{
			//main
			mainKeyUp();
		}
		else
		{
			//sub
			subKeyUp();
		}
	}
	else if (code == 2)
	{
		//down
		if (gTVSubfocus < 0)
		{
			//main
			mainKeyDown();
	}
		else
		{
			subKeyDown();
		}
	}
	else if (code == 3)
	{
		//left
		//close submenu
		accessMainmenu();
	}
	else if (code==4)
	{
		//right
		//open submenu
		if (gTVSubfocus < 0)
		{
			accessSubmenu();
		}
	}
}

function keyEnter()
{
	if (gTVSubfocus < 0)
		accessSubmenu();
	else
		FullShow();
}

function mainKeyUp()
{
	var page = gTVFocus/9;
	if (page>0 && gTVFocus%9==0)
	{
		renderMenu(gTVWin[0],40,295,gChannelList,gTVFocus-1);
		setFocusMain(gTVFocus);
	}
	if (gTVFocus > 0)
		setFocusMain(gTVFocus-1);
}
function mainKeyDown()
{
	var page = gTVFocus/9;
	var noPage = gChannelList.length/9;

	if (page<noPage && gTVFocus%9==8)
	{
		renderMenu(gTVWin[0],40,295,gChannelList,gTVFocus+1);								//might need to change
		setFocusMain(gTVFocus);
	}
	if (gTVFocus < gChannelList.length - 1)
		setFocusMain(gTVFocus+1);
}
function accessSubmenu(){
	gTVSubfocus = -1;
	setFocusSub(0);
}
function accessMainmenu(){
	setFocusMain(gTVFocus);
	document.getElementById(gTVWin[1]+'_row'+gTVSubfocus).data = 
		'../images/starhub/subrow.jpg';
	gTVSubfocus = -1;
}
function subKeyUp()
{
	var page = gTVSubfocus/9;
	if (page>0 && gTVSubfocus%9==0)
	{
		renderMenu(gTVWin[1],488,55,gChannelProgList[gTVFocus],gTVSubfocus-1);
		setFocusSub(gTVSubfocus);
	}
	if (gTVSubfocus > 0)
		setFocusSub(gTVSubfocus-1);
}
function subKeyDown()
{
	var page = gTVSubfocus/9;
	var noPage = gChannelProgList[gTVFocus].length/9;

	if (page<noPage && gTVSubfocus%9==8)
	{
		renderMenu(gTVWin[1],488,55,gChannelProgList[gTVFocus],gTVSubfocus+1);
		setFocusSub(gTVSubfocus);
	}
	if (gTVSubfocus < gChannelProgList[gTVFocus].length - 1)
		setFocusSub(gTVSubfocus+1);
}


/////////////////////////////////////////////////////////////////
//Play + Stop Video functions
////////////////////////////////////////////////////////////////
function PlayVideo(URL){
	if(!URL)return;
	URL=String(URL);

	var elm=getElementById("video");
	elm.data=URL;
	//elm.data = "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090ksjj";
	showElem("video");
	elm.streamStatus="play";
	getElementById("MediaStopped").subscribe=true;	//true
}
function VideoStop(){
	if(gRecomend){
		getElementById("MediaStopped").subscribe=false;
		gRecomend=false;
		unlockScreen();
	}else{
		getElementById("video").streamStatus="stop";
		getElementById("MediaStopped").subscribe=false;
		showElem("video"); //hideElem
	}
}
/////////////////////////////////////////////////////////////////
//Video show in EPG window
////////////////////////////////////////////////////////////////
function WindowShow(){
	fullshowindex = 0;
	getElementById("basebox").normalStyle.top = "0px";
	var elm=getElementById("video");
	elm.normalStyle.left="40px";
	elm.normalStyle.top="55px";
	elm.normalStyle.width="440px";
	elm.normalStyle.height="240px";
//	setFcs("play");															/////NEed to edit
}
/////////////////////////////////////////////////////////////////
//Video show in FULL window
////////////////////////////////////////////////////////////////
function FullShow(){
	fullshowindex = 1;
//	setFcs("play");															//////Need to edit
	gPlayState=true;
	var elm=getElementById("video");
	elm.normalStyle.left="0px";
	elm.normalStyle.top="0px";
	elm.normalStyle.width="960px";
	elm.normalStyle.height="540px";
}
function showButton(tag){
	var buttonlist = new Array('red','green','yellow','blue');
	var i;
	for(i=0;i<buttonlist.length;i++)
	{
	elemStyle=document.getElementById(tag+'_'+buttonlist[i]).normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 40 + (i*90) +'px';
	elemStyle.top = 500+'px';
	}
}

/************************************************************
 DOM event functions
 ************************************************************/
function onload()
{
	gState.bmltype = 0;
	clockStart();
	lockScreen();

	hideElem( "loading2");

	PlayVideo(gURL);
	WindowShow();
	unlockScreen();
	lockScreen();
	renderMenu(gTVWin[0],40,295,gChannelList,0);
	renderMenu(gTVWin[1],485,55,gChannelProgList[0],0);
	setFocusMain(0);
	showButton('tv_button');
	unlockScreen();
}

/************************************************************/
function onunload() 
{
	
}
/************************************************************/
function onkey()
{
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if (code >=1 && code <=4)
		keyArrow(code);
	else if (code == 18)
		keyEnter();


	
	unlockScreen();
}
