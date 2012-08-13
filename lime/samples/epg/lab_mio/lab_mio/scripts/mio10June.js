var clkTimerID=NaN;
var TimeNow = new Date();
var clkText ="";
var gTimeDisplayArray = new Array();
var gTimeRecordArray = new Array();
var m=0;

var gMio = null;
var clockTimerID=NaN;
var gPicInd=1;
var gTimeArray = new Array();
gTimeArray[0] = new Array ("8.00AM",800);
gTimeArray[1] = new Array ("8.30AM",830);
gTimeArray[2] = new Array ("9.00AM",900);
gTimeArray[3] = new Array ("9.30AM",930);
gTimeArray[4] = new Array ("10.00AM",1000);
gTimeArray[5] = new Array ("10.30AM",1030);
gTimeArray[6] = new Array ("11.00AM",1100);
gTimeArray[7] = new Array ("11.30AM",1130);
gTimeArray[8] = new Array ("12.00PM",1200);
gTimeArray[9] = new Array ("12.30PM",1230);
gTimeArray[10] = new Array ("1.00PM",1300);
gTimeArray[11] = new Array ("1.30PM",1330);
gTimeArray[12] = new Array ("2.00PM",1400);
gTimeArray[13] = new Array ("2.30PM",1430);
gTimeArray[14] = new Array ("3.00PM",1500);
gTimeArray[15] = new Array ("3.30PM",1530);
gTimeArray[16] = new Array ("4.00PM",1600);
gTimeArray[17] = new Array ("4.30PM",1630);
gTimeArray[18] = new Array ("5.00PM",1700);
gTimeArray[19] = new Array ("5.30PM",1730);
gTimeArray[20] = new Array ("6.00PM",1800);
gTimeArray[21] = new Array ("6.30PM",1830);
gTimeArray[22] = new Array ("7.00PM",1900);
gTimeArray[23] = new Array ("7.30PM",1930);
gTimeArray[24] = new Array ("8.00PM",2000);
gTimeArray[25] = new Array ("8.30PM",2030);
gTimeArray[26] = new Array ("9.00PM",2100);
gTimeArray[27] = new Array ("9.30PM",2130);
gTimeArray[28] = new Array ("10.00PM",2200);
gTimeArray[29] = new Array ("10.30PM",2230);

var gContentsArray = new Array();
gContentsArray[0]= new Array("","","Wheel of Fortu","9 HD5",29);
gContentsArray[1]= new Array("","","B","9 HD5",100);
gContentsArray[2]= new Array("","","C","9 HD5",29);

gContentsArray[3]= new Array("","","D","20 SET",29);
gContentsArray[4]= new Array("","","E","20 SET",29);
gContentsArray[5]= new Array("","","F","20 SET",100);

gContentsArray[6]= new Array("","","G","24 CNA",29);
gContentsArray[7]= new Array("","","H","24 CNA",100);
gContentsArray[8]= new Array("","","I","24 CNA",29);

gContentsArray[9]= new Array("","","J","25 BBC",29);
gContentsArray[10]= new Array("","","K","25 BBC",29);
gContentsArray[11]= new Array("","","L","25 BBC",29);
gContentsArray[12]= new Array("","","M","25 BBC",29);

gContentsArray[13]= new Array("","","N","28 Discovery",100);
gContentsArray[14]= new Array("","","O","28 Discovery",29);
gContentsArray[15]= new Array("","","P","28 Discovery",29);

gContentsArray[16]= new Array("","","Q","72 CCTV",29);
gContentsArray[17]= new Array("","","R","72 CCTV",100);
gContentsArray[18]= new Array("","","S","72 CCTV",29);

var gChannelArray = new Array("5 Vasantham","6 CNA","8 okto","9 HD 5","20 SET","21 NDTV Good Times");
var gSub_hd = new Array('mio_sub_c','mio_sub_t','mio_content_');

var gUp=-1;
var gDown=-1;
var gLeft=-1;
var gRight=-1;
var gCurrentSelection="";
var gTempSelection="";
var gSelection=92;
var gMatchSelection =0;
var gCurrentStory="";
var gChnInd = 0; // browsing through the gChannelArray in setFocusMain

var xaxis=92;
var yaxis=128;

var gIndex = 0;
var gIndex1 =0;
var gIndex2 =0;
var gIndex3 =0;
var gIndex4 =0;
var gwidgetShow =0;
var gRecomend = false;
var gPlayState = false;
var fullshowindex =0;
//var gURL = "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g6ogyw73";
var gURL = "http://live-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fhcx0000";
//var gURL = "http://live-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fhcx0001";

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

function renderMenu(tagId,x,y,arrContent,focus)
{

//	hideMenu(tagId);

	var noRows = arrContent.length;
//	setText("debug7",noRows);
	var page = focus/9;
	var noPage = noRows/9 + 1;



	//render channel rows
	var i;
	var z=y;
	var t=0;
	var offset = page*9;
	if(tagId =="mio_sub_c"){
		for(i=0;i<noRows;i++,offset++)
		{
			
			var textStyle = document.getElementById(tagId+'text'+i).normalStyle;
			textStyle.visibility = 'visible';
			textStyle.left  = (x+1) + 'px';
			textStyle.top = (z +i*34+5)+'px'; // to centralize the text
			document.getElementById(tagId+'text'+i).firstChild.data = arrContent[offset];	

	//		setText("debug"+i,tagId+'text'+i);
			z = z+3;
		}

	}else if(tagId =="mio_sub_t") {
		z=x;
	//	setText("debug04",tagId+'text0');

		for(i=0;i<noRows;i++,offset++)
		{
			var textStyle = document.getElementById(tagId+'text'+i).normalStyle;
			textStyle.visibility = 'visible';
			document.getElementById(tagId+'text'+i).firstChild.data = arrContent[offset];	
//			setText("debug0"+i,tagId+'text'+i+arrContent[offset]);

		}
	}else {
		z=x;

		var m=0;

		var textStyle = document.getElementById(tagId+'text0').normalStyle;
		textStyle.backgroundColorIndex= "88";
		
		for(i=0;i<noRows;i++,offset++)
		{
			
			
			var textStyle = document.getElementById(tagId+'text'+i).normalStyle;
			var elemStyle = document.getElementById(tagId+'heading'+i).normalStyle;
			elemStyle.visibility='hidden';
			
			elemStyle.left = z+'px';
			textStyle.left= z+'px';
			elemStyle.top = y+'px';
			textStyle.top = y+'px';
	
			if( arrContent[offset][4]==100){
	
				textStyle.width = (349)+'px';
				document.getElementById(tagId+'text'+i).firstChild.data = arrContent[offset][2];	
				z = (z+360);
			}else{
				textStyle.width = (169)+'px';
				document.getElementById(tagId+'text'+i).firstChild.data = arrContent[offset][2];	
				z = (z+180);
			}
			if (z>=676){
				y=36+(m*36);
				z=0;
				m+=1;
				if (i<arrContent.length-1){
					t =i+1;
					var textStyle = document.getElementById(tagId+'text'+t).normalStyle;
					textStyle.backgroundColorIndex= "88";
				}
			}
			textStyle.visibility = 'visible';

		}

	
	}
	
}


function setFocusMain(focus)
{


	if (gNextIndex>=0){

		var rowId = gNextIndex;
		var elemStyle = document.getElementById(gSub_hd[2]+'heading'+rowId).normalStyle;
		elemStyle.visibility = 'hidden';
		if(gContentsArray[rowId][4]==100){
			document.getElementById(gSub_hd[2]+'heading'+rowId).data = "";

		}else if( gContentsArray[rowId][4]==29){
			document.getElementById(gSub_hd[2]+'heading'+rowId).data = "";
		}

		var textStyle = document.getElementById(gSub_hd[2]+'text'+rowId).normalStyle;
		textStyle.visibility = 'visible';
	
		textStyle.backgroundColorIndex= "89";
		document.getElementById(gSub_hd[2]+'text'+rowId).firstChild.data = gContentsArray[rowId][2];
//		document.getElementById('ThumbPic').data = 
//			'../images/'+szDefaultSnapshot;

		for (var i=0; i<gContentsArray.length;i++){
			if (gChannelArray[gChnInd]==gContentsArray[i][3]){
				setText("debug1",gChnInd);
				setText("debug2",gContentsArray[i][2]);
				var textStyle = document.getElementById(gSub_hd[2]+'text'+i).normalStyle;
				textStyle.backgroundColorIndex= "88";
			//	document.getElementById('ThumbPic').data = 
			//		'../images/'+gSnapshotArray[gChnInd];
				i = 20;
				break;
			}
		}

	}

	gNextIndex = focus;

	var textStyle = document.getElementById(gSub_hd[2]+'text0').normalStyle;

	textStyle.backgroundColorIndex= "88";
	if (focus ==0){
//		document.getElementById('ThumbPic').data = 
//			'../images/'+gSnapshotArray[0];
	}else {
		//	setText("debug5",gSelection);
		//	setText("debug6",gContentsArray[focus-1][3]);
		if (gSelection !=gContentsArray[focus-1][3]){
			setText("debug5",gPicInd);
			setText("debug6",gContentsArray[focus-1][3]);
			
		//	document.getElementById('ThumbPic').data = 
		//	'../images/'+gSnapshotArray[];
		//gPicInd=i+1;
		}
	}
	//setHighlight.img//




	var textStyle = document.getElementById(gSub_hd[2]+'text'+focus).normalStyle;
	textStyle.visibility = 'visible';
    textStyle.backgroundColorIndex= "8";
	document.getElementById(gSub_hd[2]+'text'+focus).firstChild.data = gContentsArray[focus][2];
	setText("debug0","aa");

	var elemStyle = document.getElementById(gSub_hd[2]+'heading'+focus).normalStyle;
	elemStyle.visibility = 'visible';
	if(gContentsArray[focus][4]==100){
		elemStyle.width = 360+'px';
		document.getElementById(gSub_hd[2]+'heading'+focus).data = 
			"../images/mio_prog_focus_60_358x34.png";
	}else if( gContentsArray[focus][4]==29){
		elemStyle.width = 178+'px';
//		setText("debug05",elemStyle.width);
		document.getElementById(gSub_hd[2]+'heading'+focus).data = 
			"../images/mio_prog_focus_30_178x34.png";

	}



	gSelection = gContentsArray[focus][3];

	gCurrentStory = gContentsArray[focus][2];
	if(gMatchSelection==0){
		gCurrentSelection = gContentsArray[focus][0];
	}else{
		gCurrentSelection = gTempSelection;
	}

	//Allowing controls//
	gRight=0;

	if( gNextIndex >0){
		gLeft=0;
	}else{
		gLeft=-1;
	}

	if (gSelection !=gChannelArray[0]){
		gUp=0;	


	}else{
		gUp=-1;
	}

	if (gSelection !=gChannelArray[5]){
		gDown=0;


	}else{
		gDown=-1;
	}
}


function keyArrow(code)
{
	if (code == 1)
	{
		//up

			mainKeyUp();

	}
	else if (code == 2)
	{
		//down

			mainKeyDown();

	}
	else if (code == 3)
	{
		//left

		mainKeyLeft();
	}
	else if (code==4)
	{
		//right
		mainKeyRight();
	}
}

function keyEnter()
{

	
		FullShow();

}

function mainKeyUp()
{
	if(gUp==0){
		setText("debug4",gChnInd);

		for( var i=gChannelArray.length-1; i>=0;i--){
			if(gChannelArray[i]==gSelection){
				gSelection = gChannelArray[i-1];
				i-=1;
			}
		}

		for( var i=0; i<gContentsArray.length;i++){
			if (gContentsArray[i][3]==gSelection){

				if(gContentsArray[i][0] ==gCurrentSelection){
					gCurrentIndex =i;
					gMatchSelection=0;
					setFocusMain(gCurrentIndex);
					gChnInd -=1;
					gPicInd -=1;
					return;
				}
			}
			if(((i+1)>=gContentsArray.length)&&(gContentsArray[i][3]!=gSelection)){
				findContentMatch();
				gChnInd -=2;
			}
		}
	}
}
function mainKeyDown()
{

	if(gDown==0){
		setText("debug0",gChnInd);

		for( var i=0; i<gChannelArray.length;i++){
			if(gChannelArray[i]==gSelection){
				gSelection = gChannelArray[i+1];
				i+=1;
			}
		}

//		setText("debug06",gCurrentSelection);
//		setText("debug00",gSelection);
		for( var i=0; i<gContentsArray.length;i++){
			if (gContentsArray[i][3]==gSelection){
				if(gContentsArray[i][0] ==gCurrentSelection){
					gCurrentIndex =i;
					gMatchSelection=0;
					setFocusMain(gCurrentIndex);
					gChnInd +=1;
					if( gPicInd<5){
						gPicInd +=1;
					}
					return;
				}
			}

			if((i+1)>=gContentsArray.length){
				
				findContentMatch();
				gChnInd +=1;
				gPicInd +=1;
			}
		}
		
	}
}

function findContentMatch()
{

	for( var i=0; i<gContentsArray.length;i++){
		if (gContentsArray[i][3]==gSelection){
			if((gContentsArray[i][0]< gCurrentSelection)&&(gCurrentSelection-gContentsArray[i][0]<100)){
				
				gCurrentIndex =i;
				gMatchSelection =1;
				gTempSelection = gCurrentSelection;
				setFocusMain(gCurrentIndex);
			
				return;
			}
		}
	}
}

function mainKeyRight(){

	for( var i=0; i<gContentsArray.length;i++){
		if ((gContentsArray[i][3]==gSelection)&&(gCurrentSelection<gContentsArray[i][0])&&(gCurrentStory != gContentsArray[i][2])){
			gCurrentIndex = i;
//			setText("debug05",gCurrentIndex);
			gMatchSelection =0;
			setFocusMain(gCurrentIndex);
			return;

		}

	}
}
function mainKeyLeft(){

	if(gLeft ==0){
		for( var i=gContentsArray.length-1; i>=0;i--){
			if ((gContentsArray[i][3]==gSelection)&&(gCurrentSelection>gContentsArray[i][0])&&(gCurrentStory != gContentsArray[i][2])){
				gCurrentIndex = i;
				gMatchSelection =0;
				setFocusMain(gCurrentIndex);
				return;
			}


		}	
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
		lockScreen();

		PlayVideo(gURL);
		unlockScreen();
		lockScreen();
		AllWidgetsDisappear();
		WindowShow();
		setFcs("default");
   //video always looping.
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
	LayerShow();
//	getElementById("basebox").normalStyle.top = "0px";
	var elm=getElementById("video");
	elm.normalStyle.left="0px";
	elm.normalStyle.top="0px";
	elm.normalStyle.width="960px";
	elm.normalStyle.height="540px";
//	setFcs("play");															/////NEed to edit
}
/////////////////////////////////////////////////////////////////
//Video show in FULL window
////////////////////////////////////////////////////////////////
function FullShow(){
	fullshowindex = 1;
//	setFcs("play");															//////Need to edit
	LayerGone();
	var elm=getElementById("video");
	elm.normalStyle.left="0px";
	elm.normalStyle.top="0px";
	elm.normalStyle.width="960px";
	elm.normalStyle.height="540px";
}
/************************************************************
full screen mode: top layer all gone
************************************************************/
function LayerGone()
{
	hideElem("layer0");
	hideElem("clock");
	hideElem("epg_date");
	hideElem("epg_channel_name_window");
	for (var i=0; i<gChannelArray.length;i++)
	{
		hideElem("mio_sub_ctext"+i);
	}
	hideElem("epg_time_window");
	for (var i=0; i<4;i++)
	{
		hideElem("mio_sub_ttext"+i);
	}
	hideElem("epg_prog_focus");
	for (var i=0; i<gContentsArray.length;i++)
	{
		hideElem("mio_content_heading"+i);
	}
	hideElem("epg_prog_cell_window");
	for (var i=0; i<gContentsArray.length;i++)
	{
		hideElem("mio_content_text"+i);
	}

}
/************************************************************
window screen mode: top layer all back
************************************************************/
function LayerShow()
{
	showElem("layer0");
	showElem("clock");
	showElem("epg_date");
	showElem("epg_channel_name_window");
	for (var i=0; i<gChannelArray.length;i++)
	{
		showElem("mio_sub_ctext"+i);
	}
	showElem("epg_time_window");
	for (var i=0; i<4;i++)
	{
		showElem("mio_sub_ttext"+i);
	}
	showElem("epg_prog_focus");
	for (var i=0; i<gContentsArray.length;i++)
	{
		showElem("mio_content_heading"+i);
	}
	showElem("epg_prog_cell_window");
	for (var i=0; i<gContentsArray.length;i++)
	{
		showElem("mio_content_text"+i);
	}

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
function clockStarts()
{

	lockScreen();

	if( TimeNow != null) {
		clkText = padding( "00", TimeNow.getHours()) + ":"
				+ padding( "00", TimeNow.getMinutes());
	
		setText("clock", clkText);
	
	}
	else {
		getElementById( "clock").normalStyle.top = "-540px";
	};

	unlockScreen();

	clockTimerID = browser.setInterval( "clockStarts();", 1000, 1);


}
function DateStarts()
{
	
	var day = new Array( "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
	var month = new Array(
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	);

	lockScreen();
	clkText = day[ TimeNow.getDay()] + " " + month[ TimeNow.getMonth()] + " "
			+ padding( " ", TimeNow.getDate());
	setText("epg_date", clkText);
	unlockScreen();

}
function clkStart()
{
	clkTimerID = NaN;

	lockScreen();
	clkText = padding("00",TimeNow.getHours())+padding("00",TimeNow.getMinutes());
	clkText = Number(clkText);
//	clkText = 1455;
//	clkText = clkText +1;
//	setText("debug4",clkText);
	unlockScreen();
}

function updateEPGTime()
{
//	setText("debug1","a");
	for (var i=0; i<=3;i++){
		gTimeRecordArray[i]=gTimeArray[m][1];
		gTimeDisplayArray[i]=gTimeArray[m][0];  //E.g.4.30pm
		m+=1;
//		setText("debug"+i,gTimeDisplayArray[i]);
	}

}

function compareEPGTime()
{
	if( abs(clkText - gTimeArray[m][1]) < 30){
		updateEPGTime();
		return;
	}
}

function abs(a)
{
 if (a<0){
v= a * -1;}else { v = a;}
return v;
}

function updateChannelList()
{
	var p=0;
	gContentsArray[0][0]=gTimeRecordArray[p];

	gContentsArray[0][1]=gTimeRecordArray[p]+gContentsArray[0][4];
	p+=1;
	for( var i=1;i<gContentsArray.length;i++){
		if(gContentsArray[i-1][4] ==29){
			gContentsArray[i][0]=gTimeRecordArray[p];
		}else if(gContentsArray[i-1][4] ==100){
			gContentsArray[i][0]=gContentsArray[i-1][0]+100;
			if(p==0){
				gContentsArray[i][0]=gTimeRecordArray[p];
			}

		}
		gContentsArray[i][1]=gContentsArray[i][0]+gContentsArray[i][4];

		if(gContentsArray[i][1] >gTimeRecordArray[3]){
			p=0;
		}else{
			if(gContentsArray[i][1]>gTimeRecordArray[p+1]){
				p+=2;
			}else{
				p+=1;
			}
			
		}

	}

/*
	for(var i=0;i<=18;i++){
		setText("debug0"+i,gContentsArray[i]);

	}
*/
}
function debug( name , str )
{
/*document.getElementById( name ).firstChild.data = String(str);*/
}


/************************************************************
 DOM event functions
 ************************************************************/

function onLoad()
{
	clockStarts();

	DateStarts();
	clkStart();
	lockScreen();

	hideElem( "loading2");

//	showElem("layer0");

	for (var i=0; i<gTimeArray.length && gTimeDisplayArray.length ==0; i++){
		if(gTimeArray[i][1] ==clkText){
			m=i;
			updateEPGTime();
		}else{
			m=i;
			compareEPGTime();
		}
	}
	updateChannelList();
	unlockScreen();
	lockScreen();

//	renderMenu(gSub_hd[0],15,0,gChannelArray,0);
//	renderMenu(gSub_hd[1],180,84,gTimeDisplayArray,0);
//	setText("debug1",gContentsArray[0]);
//	renderMenu(gSub_hd[2],0,0,gContentsArray,0);
//	setText("debug1","aa");
//	setFocusMain(0);

	unlockScreen();

	lockScreen();
//	PlayVideo(gURL);
//	WindowShow();
	unlockScreen();


}

/************************************************************/
function onunload() 
{
	
}
/************************************************************/

function onKey()
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
		//	if (gwidgetShow == 0){
				widgetShow();

				gwidgetShow =1;
				setFcs("widget");
				
		//	}else if(gwidgetShow == 1){
		//		widgetDisappear();					
		//		gwidgetShow=0;
		//	}		
		}
	}else if(code==22){ //red --- controlling full and partial screen.

		if(fullshowindex ==1){
			WindowShow();
			widgetDisappear();
		}else {
			FullShow;
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
	//		VideoStop();
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
	//		VideoStop();
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
