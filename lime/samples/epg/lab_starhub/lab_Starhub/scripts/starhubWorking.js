/************************************************************
 * Global variables
 */
var gChannelList = new Array('102 CH5','115 KBS World',
	'147 NHK World Premium','422 Discovery Channel','424 Animal Planet');
	
var gChannelProgList = new Array();
gChannelProgList[0] = new Array('10:00AM   <<The Martha Stewart Show III>>','12:00PM   The Ellen DeGeneres Show VII','14:00PM   Whacked Out Sports','15:00PM   Wheel of Fortune',
	'16:00PM   En Bloc','19:00PM   The Price Is Right - USA',
	'20:00PM   Ninja Warrior','21:30PM   News 5 Tonight',
	'22:00PM   Making of Shrek','23:00PM   CSI');
gChannelProgList[1] = new Array('10:00AM   Three Days','12:00PM   Gag Concert','14:00PM   News','15:00PM   TV Kindergarden',
	'16:00PM   641 Family','19:00PM   Cuisine Tour',
	'20:00PM   Showbiz Extra','21:30PM   News',
	'22:00PM   Pops In Seoul 1','23:00PM   Pops In Seoul 2');
gChannelProgList[2] = new Array('10:00AM   Artistic Hobbies','12:00PM   Venetia In Kyoto','14:00PM   News','15:00PM   Live From Your HomeTown',
	'16:00PM   Drama Serial','19:00PM   With Mother',
	'20:00PM   Peel-A-Boo','21:30PM   News',
	'22:00PM   Fun With English','23:00PM   Tokyo Market');
gChannelProgList[3] = new Array('10:00AM   I Shouldnt Be Alive','12:00PM   Ghost Lab','14:00PM   How Do They Do It','15:00PM   How Its Made',
	'16:00PM   Mythbusters','19:00PM   Live With Kombal Tribe',
	'20:00PM   Inside','21:30PM   Animal Guide',
	'22:00PM   Destroy In Seconds','23:00PM   Factory Made');
gChannelProgList[4] = new Array('10:00AM   Up Close & Dangerous','12:00PM   Up Close & Dangerous','14:00PM   Animal Cops','15:00PM   The Most Extreme',
	'16:00PM   Caught In the Moment','19:00PM   Untamed and Uncut',
	'20:00PM   Animal Stories','21:30PM   Animal Planet Showcase',
	'22:00PM   Venom','23:00PM   Up Close & Dangerous');
//main
var gTVFocus = -1;
var gTVPage = 0;
var gTVSubfocus = -1;
var gTVSubPage = 0;
var gTVWin = new Array('tv_left','tv_center');
var gGap=2;
var gSubGap=2; //7px down + 4px of separator.
var gUp=0;
var gDw=0;
var gSubUp=0;
var gSubDw=0;

//sub
var gIndex = 0;
var gIndex1 =0;
var gIndex2 =0;
var gIndex3 =0;
var gIndex4 =0;
var gwidgetShow =0;
var gRecomend = false;
var gPlayState = false;
var fullshowindex =0;
var SDDiagramShow =0;
//var gURL = "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g6ogyw73";
var gURL = "http://live-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fhcx0001";

//control widget menu
var gFocus1=new Array();
gFocus1[0]=new Array (-1,-1,6,1);
gFocus1[1]=new Array (-1,-1,0,2);
gFocus1[2]=new Array (-1,-1,1,3);
gFocus1[3]=new Array (-1,-1,2,4);
gFocus1[4]=new Array (-1,-1,3,5);
gFocus1[5]=new Array (-1,-1,4,6);
gFocus1[6]=new Array (-1,-1,5,0);

//control list of devices
var gFocus2=new Array();
gFocus2[0]=new Array (5,1,-1,-1);
gFocus2[1]=new Array (0,2,-1,-1);
gFocus2[2]=new Array (1,3,-1,-1);
gFocus2[3]=new Array (2,4,-1,-1);
gFocus2[4]=new Array (3,5,-1,-1);
gFocus2[5]=new Array (4,0,-1,-1);

var gFocus3=new Array();
gFocus3[0]=new Array (-1,-1,2,1);
gFocus3[1]=new Array (-1,-1,0,2);
gFocus3[2]=new Array (-1,-1,1,0);

var Timer1="";
var Timer2="";
var StoreValue = "true";
var gTrans = null;
var gGraph = null;
var gGraph1 = null;
var bVertical = true;
var StoreUrl ="";

var url ="";
var xyz =0;
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
	for(i=0;i<gChannelList.length;i++)
	{
		document.getElementById(tagId+'_row'+i).normalStyle.visibility = 'hidden';
		document.getElementById(tagId+'_t'+i).normalStyle.visibility = 'hidden';
	}
}
function renderMenu(tagId,x,y,arrContent,focus)
{

	var noRows = arrContent.length;
	var page = focus/9;
	var noPage = noRows/9 + 1;

	//render buttons and text
	var offset = page*9;
	for(i=0;i<noRows;i++,offset++)
	{
		var textStyle = document.getElementById(tagId+'_t'+i).normalStyle;
		textStyle.visibility = 'visible';
		textStyle.left  = (x) + 'px';
		textStyle.top = (y +i*23)+'px';
		document.getElementById(tagId+'_t'+i).firstChild.data =" " + arrContent[offset];
		if (tagId =='tv_center'){
			y+=7;
		}else{
			y+=2;
		}

	}
	

}


function setFocusMain(focus)
{
	if (gTVFocus >= 0)
	{
		var textStyle = document.getElementById('epg_channel_focus_bg').normalStyle;
		textStyle.visibility = 'hidden';
		var textStyle = document.getElementById(gTVWin[0]+'_t'+gTVFocus).normalStyle;
		textStyle.visibility = 'visible';
	}
	gTVFocus = focus;
	focus %= 9;
	
	var textStyle = document.getElementById(gTVWin[0]+'_t'+focus).normalStyle;
	textStyle.visibility = 'hidden';

	if ((gDw ==1)&& (gGap<10)){

		gGap +=2;
		gDw =0;
	}else if(( gUp ==1) && ( gGap>2)){
	
		gGap -=2;
		if( gTVFocus ==0){
			gGap =2;
		}
		gUp =0;
	}

	var textStyle = document.getElementById('epg_channel_focus_bg').normalStyle;
	textStyle.top = (gGap+(focus*23))+'px';
	textStyle.left = 0+'px';
	document.getElementById('epg_channel_focus_bg').firstChild.data = " " + gChannelList[focus];
	textStyle.visibility ='visible';



	//buttons//
	elemStyle = document.getElementById('tv_left_bu').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 280 +'px';
	elemStyle.top = 202+(gTVFocus*23)+ (gGap-4)+'px';

	elemStyle = document.getElementById('tv_left_bd').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 280 +'px';
	elemStyle.top = 232+(gTVFocus*23)+(gGap-4)+'px';

	elemStyle = document.getElementById('tv_left_br').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 313 +'px';
	elemStyle.top = 218+(gTVFocus*23)+(gGap-4)+'px';

	//change submenu according to the scrolling of main menu.
	renderMenu(gTVWin[1],25,7,gChannelProgList[gTVFocus],0);
	

}

function setFocusSub(focus)
{
	
	document.getElementById('sub_bl').normalStyle.visibility='visible';
	document.getElementById('sub_br').normalStyle.visibility='visible';
	document.getElementById('sub_bu').normalStyle.visibility='visible';
	document.getElementById('sub_bd').normalStyle.visibility='visible';
	gTVSubfocus = focus;

	if (gTVSubfocus >=0){
		if ((gSubDw ==1) && (gSubGap<65)){
			gSubGap +=7;
			gSubDw =0;


		}else if(( gSubUp ==1) &&(gSubGap>2)) {
			
			gSubGap =gSubGap-7;
		
			if( gTVSubfocus ==0){
				gSubGap =2;
			}
			gSubUp =0;
		}

		var elemStyle = document.getElementById('sub_f').normalStyle;
		elemStyle.visibility = 'visible';
		elemStyle.left = 25+'px';
		elemStyle.top = (gSubGap+(gTVSubfocus*29)-(gTVSubfocus*6))+'px';

	}
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
	gUp=1;

	if (gTVFocus > 0)
		setFocusMain(gTVFocus-1);
}
function mainKeyDown()
{
	gDw=1;

	if (gTVFocus >= gChannelList.length - 1){
		gDw=0;
	}
	if (gTVFocus < gChannelList.length - 1)
		setFocusMain(gTVFocus+1);
}
function accessSubmenu(){
	gSubGap =2;
	gTVSubfocus = 0;
	setFocusSub(0);
}
function accessMainmenu(){
	setFocusMain(gTVFocus);
	document.getElementById('sub_f').normalStyle.visibility='hidden'; 
	document.getElementById('sub_bl').normalStyle.visibility='hidden';
	document.getElementById('sub_br').normalStyle.visibility='hidden';
	document.getElementById('sub_bu').normalStyle.visibility='hidden';
	document.getElementById('sub_bd').normalStyle.visibility='hidden';
	gTVSubfocus = -1;
}
function subKeyUp()
{
	gSubUp=1;
	if (gTVSubfocus > 0)
		setFocusSub(gTVSubfocus-1);
}
function subKeyDown()
{
	gSubDw=1;
	if (gTVSubfocus >= gChannelProgList[gTVFocus].length - 1){
		gSubDw=0;
	}
	if (gTVSubfocus < gChannelProgList[gTVFocus].length - 1){
	
		setFocusSub(gTVSubfocus+1);
		
	}
}


/////////////////////////////////////////////////////////////////
//Play + Stop Video functions
////////////////////////////////////////////////////////////////
function PlayVideo(URL){
	if(!URL)return;
	URL=String(URL);

	var elm=getElementById("video");
	elm.data=URL;
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
		lockScreen();
		AllWidgetsDisappear();
		WindowShow();
		setFcs("default");
		PlayVideo(gURL);   //video always looping.
		unlockScreen();
	}
}
/////////////////////////////////////////////////////////////////
//All Widgets Disappear
////////////////////////////////////////////////////////////////
function AllWidgetsDisappear()
{
	lockScreen();
	gboxDisappear();
	gbox1Disappear();
	widgetDisappear();
	homeDisappear();
	backDisappear();
	meterListDisappear();
	historyButtonDisappear();
	getElementById( "graphbox_native").normalStyle.top = "-540px";
	getElementById( "graphbox_native" + "1").normalStyle.top = "-540px";
	lightControlOff();
	deviceListDisappear();
	PolyListDisappear();
	QPictureDisappear();
	browser.clearTimer(Timer2);
	footerDisappear();
	gIndex =0;
	gIndex1 =0;
	gIndex2 =0;
	gIndex3 =0;
	gIndex4 =0;
	closeCameraView();
	hideTrafficMenu(gTcWin[0]);
	hideTrafficMenu(gTcWin[1]);
	document.getElementById('tcview_mainmap').normalStyle.visibility = 'hidden';
	document.getElementById('tcview_submap').normalStyle.visibility = 'hidden';
	unlockScreen();
}
/////////////////////////////////////////////////////////////////
//Video show in EPG window
////////////////////////////////////////////////////////////////
function WindowShow(){
	fullshowindex = 0;
	var elm=getElementById("video");
	elm.normalStyle.left="77px";
	elm.normalStyle.top="104px";
	elm.normalStyle.width="350px";
	elm.normalStyle.height="180px";
}
/////////////////////////////////////////////////////////////////
//Video show in FULL window
////////////////////////////////////////////////////////////////
function FullShow(){
	fullshowindex = 1;
	var elm=getElementById("video");
	elm.normalStyle.left="0px";
	elm.normalStyle.top="0px";
	elm.normalStyle.width="960px";
	elm.normalStyle.height="540px";
}

/************************************************************
 show widgets
 ************************************************************/
function widgetShow()
{
	//set mainMenu//
	getElementById("widgetmenubox").normalStyle.visibility="visible";
	//highlight the first one//
	elemStyle = document.getElementById('innermenu1').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 20+'px';
	document.getElementById('innermenu1').data = 
			'../images/widget_menu/wi01_h.jpg';
	gIndex =0;
	gIndex1 =0;
	gIndex2 =0;
	gIndex3 =0;
	gIndex4 =0;
	
}
function widgetDisappear()
{
	//set mainMenu//
	getElementById("widgetmenubox").normalStyle.visibility="hidden";
	
	//highlight the first one//
	elemStyle = document.getElementById('innermenu1').normalStyle;
	elemStyle.visibility = 'hidden';
	gIndex =0;
	gIndex1 =0;
	gIndex2 =0;
	gIndex3 =0;
	gIndex4 =0;

	
}
function backShow()
{
	//set mainMenu//
	widgetDisappear();
	
	//appear footer//
	elemStyle = document.getElementById('bfooter').normalStyle;
	elemStyle.visibility = 'visible';

	//spelling error for the second one//
	elemStyle = document.getElementById('back_menu').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 870+'px';
	elemStyle.top = 492+'px';	
	elemStyle.width = 132+'px';
	elemStyle.height = 60+'px';

	
}
function homeShow()
{
	//hide widgetMenuBox//
	widgetDisappear();
	
	//highlight the first one//
	elemStyle = document.getElementById('hfooter').normalStyle;
	elemStyle.visibility = 'visible';

	//spelling error for the second one//
	elemStyle = document.getElementById('home_menu').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 783+'px';
	elemStyle.top = 500+'px';	
	elemStyle.width = 152+'px';
	elemStyle.height = 60+'px';

	
}
function homeDisappear()
{
	//hide widgetMenuBox//
	widgetDisappear();
	
	//highlight the first one//
	elemStyle = document.getElementById('hfooter').normalStyle;
	elemStyle.visibility = 'hidden';

	//spelling error for the second one//
	elemStyle = document.getElementById('home_menu').normalStyle;
	elemStyle.visibility = 'hidden';
	
}
function backDisappear()
{
	//hide widgetMenuBox//
	widgetDisappear();
	
	//highlight the first one//
	elemStyle = document.getElementById('bfooter').normalStyle;
	elemStyle.visibility = 'hidden';

	//spelling error for the second one//
	elemStyle = document.getElementById('back_menu').normalStyle;
	elemStyle.visibility = 'hidden';
	
}
/************************************************************
 DOM event functions
 ************************************************************/
function onload()
{
	clockStart();
	lockScreen();

	hideElem( "loading2");

	PlayVideo(gURL);
	WindowShow();
	unlockScreen();
	lockScreen();
	renderMenu(gTVWin[0],0,2,gChannelList,0);
	renderMenu(gTVWin[1],25,7,gChannelProgList[0],0);

	setFocusMain(0);
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

	if (code >=1 && code <=4){
		keyArrow(code);
	}else if (code == 18){
		keyEnter();
	}else if (code ==19){
		if (fullshowindex == 1){
			WindowShow();
		}
	}else if(code==21){ //blue --- bring up the widget menu.
		if (fullshowindex == 1){
			romSound(7);
			widgetShow();
			gwidgetShow =1;
			setFcs("widget");
		}
	}else if(code==22){ //red --- controlling full and partial screen.

		if(fullshowindex ==1){
			WindowShow();
			widgetDisappear();
		}else {
			FullShow;
		}
	}else if(code==23){ //Green --- Show Service Discovery Architecture

		if(SDDiagramShow ==1){
			var elemStyle = document.getElementById('SD_Architecture').normalStyle;
			elemStyle.visibility = 'hidden';
			SDDiagramShow =0;
		}else {
			var elemStyle = document.getElementById('SD_Architecture').normalStyle;
			elemStyle.visibility = 'visible';
			SDDiagramShow =1;
		}
	}
	
	unlockScreen();
}

function widgetKey()
{
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if (code >=1 && code <=4){
		widgetFocus(code);
	}else if (code == 18){
				romSound(7);
			if (gIndex ==0){
				scaledownshow();
			}else if (gIndex ==1){
				Deviceshow();
			}else if (gIndex ==2){
				PolyShow();
			}else if (gIndex ==3){
				TrafficShow();
			}
	}else if(code==21){ //blue --- bring up the widget menu.
			romSound(7);
			if (gwidgetShow == 0){
				widgetShow();
				gwidgetShow =1;
		
			}else if(gwidgetShow == 1){
				widgetDisappear();					
				gwidgetShow=0;
			}		

	}else if(code==22){ //red --- controlling full and partial screen.
		if(fullshowindex ==1){
			WindowShow();
			widgetDisappear();
			setFcs("default");
		}else {
			FullShow;
		}

	}else if(code==23){ //green --- activate the back shown on widget menu.
			romSound(7);
			lockScreen();
			homeShow();						
			unlockScreen();
	
			lockScreen();
			homeDisappear();
			unlockScreen();

			lockScreen();
			WindowShow();
			setFcs("default");
			unlockScreen();

	}else if(code==24){ //yellow --- activate the home shown on widget menu.

			romSound(7);
			lockScreen();
			backShow();
			unlockScreen();

			lockScreen();
			backDisappear();
			unlockScreen();

			lockScreen();
			WindowShow();
			setFcs("default");
			unlockScreen();

	}
	
	unlockScreen();
}
function widgetFocus(code){
		var idx = gFocus1[gIndex][code-1];
		if(idx==-1) return;
		setWidgetFocus(idx);
		gIndex=idx;
}

function setWidgetFocus(id){
	romSound(9);
	var img=new Array("wi01_h.jpg","wi02_h.jpg","wi03_h.jpg","wi04_h.jpg","wi05_h.jpg","wi06_h.jpg","wi07_h.jpg");
	var X = new Array(20,160,295,425,560,695,830);
	var Y = 355;
	var W = 240;
	var H = 266;

	elemStyle = document.getElementById('innermenu1').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = X[id]+'px';
	elemStyle.top = Y+'px';	
	elemStyle.width = W+'px';
	elemStyle.height = H+'px';
	document.getElementById('innermenu1').data = 
			'../images/widget_menu/'+img[id];
}
