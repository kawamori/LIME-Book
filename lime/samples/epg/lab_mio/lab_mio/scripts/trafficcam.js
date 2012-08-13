/************************************************************
 * Global variables
 */
var gCamLoc = new Array('Ayer Rajah Expressway(AYE)','Bukit Timah Expressway(BKE)',
	'Central Expressway(CTE)','East Coast Parkway(ECP)','Kranji Expressway(KJE)',
	'Pan-Island Expressway(PIE)','Seletar Expressway(SLE)',
	'Tampines Expressway(TPE)','Tuas Checkpoint',
	'Woodlands Checkpoint','Kallang-Paya Lebar Exway(KPE)',
	'Sentosa Gateway');
	
var gCamSubLoc = new Array();
gCamSubLoc[0] = new Array('After Tuas West Road','Pandan Gardens (Towards Tuas)',
	'Near Dover ITE(Towards ECP)','Near NUS(Towards Tuas)','Alexandra Road(Towards ECP)',
	'Lower Delta Road(Towards Tuas)','Keppel Viaduct');
gCamSubLoc[1] = new Array('Woodlands South Flyover','Woodlands Flyover',
	'Diary Farm Flyover','Chantek Flyover');
gCamSubLoc[2] = new Array('St George Road(Towards SLE)','Moulmein Flyover(Towards AYE)',
	'Ang Mo Kio Ave 5 Flyover(City)','Braddell Flyover(Towards SLE)');
gCamSubLoc[3] = new Array('Marina Bay(Towards AYE)','Benjamin Sheares Bridge',
	'Tanjong Rhu(Towards AYE)','Tanjong Katong Flyover(Changi)',
	'Marine Parade Flyover(AYE)','Laguna Flyover(Towards Changi)');
gCamSubLoc[4] = new Array('Choa Chu Kang(Towards PIE)');
gCamSubLoc[5] = new Array('Jurong West ST81(Jurong)','Bukit Timah Expressway(Changi)',
	'Adam Road(Towards Changi)','Mount Pleasant(Jurong)','Thomson Road','Kim Keat(Towards Changi)',
	'Woodsville Flyover(Towards Changi)','Kallang','Paya Lebar Flyover(Jurong)',
	'Eunos Flyover(Towards Jurong)','Bedok North(Towards Jurong)');
gCamSubLoc[6] = new Array('Lentor Flyover(Towards TPE)','Seletar Flyover(Towards BKE)');
gCamSubLoc[7] = new Array('Rivervale Drive(Towards SLE)','Upper Changi Flyover');
gCamSubLoc[8] = new Array('Second link at Tuas','Tuas Checkpoint',
	'After Tuas West Road');
gCamSubLoc[9] = new Array('Woodlands Causeway (Johor)','Woodlands Checkpoint(BKE)');
gCamSubLoc[10] = new Array('KPE/ECP','Kallang Way Flyover','KPE/PIE','Kallang Bahru','Defu Flyover',
	'KPE 8.5km');
gCamSubLoc[11] = new Array('To HarbourFront','To Sentosa');

var gCamSubId = new Array();
gCamSubId[0] = new Array(1,2,3,4,5,6,7);
gCamSubId[1] = new Array(8,9,10,11);
gCamSubId[2] = new Array(12,13,14,15);
gCamSubId[3] = new Array(16,17,18,19,20,21);
gCamSubId[4] = new Array(22,0);
gCamSubId[5] = new Array(23,24,25,26,27,28,29,30,31,32,33);
gCamSubId[6] = new Array(34,35);
gCamSubId[7] = new Array(36,37);
gCamSubId[8] = new Array(38,39,40);
gCamSubId[9] = new Array(41,42);
gCamSubId[10] = new Array(43,44,45,46,47,48);
gCamSubId[11] = new Array(49,50);

var gTcFocus = -1;
var gTcPage = 0;
var gTcSubfocus = -1;
var gTcSubPage = 0;
var gTcWin = new Array('tclist_left','tclist_sub');
var gCamView = false;
var giTimer;
//////////////////////////////////////////////////////////////////////////////////////////////
//Menu Rendering Functions
//////////////////////////////////////////////////////////////////////////////////////////////
function hideTrafficMenu(tagId)
{
	document.getElementById(tagId+'_top').normalStyle.visibility = 'hidden';
	document.getElementById(tagId+'_bottom').normalStyle.visibility = 'hidden';
	document.getElementById(tagId+'_bu').normalStyle.visibility = 'hidden';
	document.getElementById(tagId+'_bd').normalStyle.visibility = 'hidden';
	for(i=0;i<9;i++)
	{
		document.getElementById(tagId+'_row'+i).normalStyle.visibility = 'hidden';
		document.getElementById(tagId+'_b'+i).normalStyle.visibility = 'hidden';
		document.getElementById(tagId+'_t'+i).normalStyle.visibility = 'hidden';
	}
}
function renderTrafficMenu(tagId,x,y,arrContent,focus)
{
	hideTrafficMenu(tagId);
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

	//render rows
	var i;
	for(i=0;i<noRows;i++)
	{
		elemStyle = document.getElementById(tagId+'_row'+i).normalStyle;
		elemStyle.visibility = 'visible';
		elemStyle.left = x +'px';
		elemStyle.top = (y +45+i*35)+'px';
	}

	//render bottom
	elemStyle = document.getElementById(tagId+'_bottom').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = x+'px';
	elemStyle.top = (y +45+noRows*35)+'px';

	//render buttons and text
	var offset = page*9;
	for(i=0;i<noRows;i++,offset++)
	{
		elemStyle = document.getElementById(tagId+'_b'+i).normalStyle;
		textStyle = document.getElementById(tagId+'_t'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
		elemStyle.left = (x+5) +'px';
		textStyle.left  = (x+35) + 'px';
		elemStyle.top = (y +45+i*35+5)+'px';
		textStyle.top = (y +45+i*35+10)+'px';
		document.getElementById(tagId+'_t'+i).firstChild.data = arrContent[offset];
	}

	if (page > 0)
		renderMoreUpButton(tagId,x,y);
	if (page+1 < noPage)
		renderMoreDownButton(tagId,x,y,noRows);

}

function renderMoreUpButton(tagId,x,y)
{
	elemStyle = document.getElementById(tagId+'_bu').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = (x+120-12) +'px';
	elemStyle.top = (y +45-12)+'px';
}

function renderMoreDownButton(tagId,x,y,noRows)
{
	elemStyle = document.getElementById(tagId+'_bd').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = (x+120-12) +'px';
	elemStyle.top = (y +45+noRows*35-12)+'px';
}

function setFocusTrafficMain(focus)
{
	if (gTcFocus >= 0)
	{
		var rowId = gTcFocus%9;
		document.getElementById(gTcWin[0]+'_row'+rowId).data = 
			'../images/trafficcam/row.jpg';
	}
	gTcFocus = focus;
	focus %= 9;
	document.getElementById(gTcWin[0]+'_row'+focus).data = 
		'../images/trafficcam/row_f.jpg';
}

function setFocusTrafficSub(focus)
{
	if (gTcSubfocus >= 0)
	{
		var rowId = gTcSubfocus%9;
		document.getElementById(gTcWin[1]+'_row'+rowId).data = 
			'../images/trafficcam/row.jpg';
	}
	gTcSubfocus = focus;
	focus %= 9;
	document.getElementById(gTcWin[1]+'_row'+focus).data = 
		'../images/trafficcam/row_f.jpg';
}

function keyTrafficArrow(code)
{
	if (code == 1)
	{
		//up
		if (gTcSubfocus < 0)
		{
			//main
			mainTrafficKeyUp();
		}
		else
		{
			//sub
			subTrafficKeyUp();
		}
	}
	else if (code == 2)
	{
		//down
		if (gTcSubfocus < 0)
		{
			//main
			mainTrafficKeyDown();
	}
		else
		{
			subTrafficKeyDown();
		}
	}
	else if (code == 3)
	{
		//left
		//close submenu
		closeSubmenu();
	}
	else if (code==4)
	{
		//right
		//open submenu
		if (gTcSubfocus < 0)
		{
			openSubmenu();
		}
	}
}

function keyTrafficEnter()
{
	romSound(7);
	if (gTcSubfocus < 0)
		openSubmenu();
	else
		openCameraView();
}

function keyTrafficBack()
{
	if (gCamView)
	{
		closeCameraView();
	}
	else if (gTcSubfocus >= 0)
	{
		closeSubmenu();
	}
}

function keyNumber(code)
{
	code -= 5;
	if (gTcSubfocus <0)
	{
		var keyNow = gTcFocus%9 + 1;
		setFocusTrafficMain(gTcFocus+code-keyNow);
		openSubmenu();
	}
	else
	{
		var keyNow = gTcSubfocus%9 + 1;
		setFocusTrafficSub(gTcSubfocus+code-keyNow);
		openCameraView();
	}
}

function keyYellow_Back()
{
		romSound(7);

		lockScreen();
		backShow();
		unlockScreen();

		lockScreen();
		closeCameraView();
		closeSubmenu();
		hideTrafficMenu(gTcWin[0]);
		hideTrafficMenu(gTcWin[1]);
		document.getElementById('tcview_mainmap').normalStyle.visibility = 'hidden';
		document.getElementById('tcview_submap').normalStyle.visibility = 'hidden';
		unlockScreen();

		lockScreen();
		backDisappear();
		footerDisappear();
		unlockScreen();

		lockScreen();
		widgetShow();
		setFcs("widget");
}
function keyGreen_Home()
{	
		romSound(7);
		
		lockScreen();
		homeShow();
		unlockScreen();

		lockScreen();
		closeCameraView();
		closeSubmenu();
		hideTrafficMenu(gTcWin[0]);
		hideTrafficMenu(gTcWin[1]);
		document.getElementById('tcview_mainmap').normalStyle.visibility = 'hidden';
		document.getElementById('tcview_submap').normalStyle.visibility = 'hidden';
		unlockScreen();

		lockScreen();
		homeDisappear();
		footerDisappear();
		unlockScreen();

		lockScreen();
		WindowShow();
		setFcs("default");
		unlockScreen();
}




//gTcFocus
//gTcSubfocus
function mainTrafficKeyUp()
{
	romSound(9);
	var page = gTcFocus/9;
	if (page>0 && gTcFocus%9==0)
	{
		renderTrafficMenu(gTcWin[0],10,100,gCamLoc,gTcFocus-1);
		setFocusTrafficMain(gTcFocus);
	}
	if (gTcFocus > 0)
		setFocusTrafficMain(gTcFocus-1);
}
function mainTrafficKeyDown()
{
	romSound(9);
	var page = gTcFocus/9;
	var noPage = gCamLoc.length/9;

	if (page<noPage && gTcFocus%9==8)
	{
		renderTrafficMenu(gTcWin[0],10,100,gCamLoc,gTcFocus+1);
		setFocusTrafficMain(gTcFocus);
	}
	if (gTcFocus < gCamLoc.length - 1)
		setFocusTrafficMain(gTcFocus+1);
}

function openSubmenu()
{
	romSound(9);
	renderTrafficMenu(gTcWin[1],260,100,gCamSubLoc[gTcFocus],0);
	gTcSubfocus = -1;
	setFocusTrafficSub(0);
	document.getElementById('tcview_submap').data = '../images/trafficcam/sub' + gTcFocus +'.jpg';
	document.getElementById('tcview_submap').normalStyle.visibility = 'visible';
}
function closeSubmenu()
{
	romSound(9);
	hideTrafficMenu(gTcWin[1]);
	setFocusTrafficSub(0);
	gTcSubfocus = -1;
	document.getElementById('tcview_submap').normalStyle.visibility = 'hidden';
}
function subTrafficKeyUp()
{
	romSound(9);
	var page = gTcSubfocus/9;
	if (page>0 && gTcSubfocus%9==0)
	{
		renderTrafficMenu(gTcWin[1],260,100,gCamSubLoc[gTcFocus],gTcSubfocus-1);
		setFocusTrafficSub(gTcSubfocus);
	}
	if (gTcSubfocus > 0)
		setFocusTrafficSub(gTcSubfocus-1);
}
function subTrafficKeyDown()
{
	romSound(9);
	var page = gTcSubfocus/9;
	var noPage = gCamSubLoc[gTcFocus].length/9;

	if (page<noPage && gTcSubfocus%9==8)
	{
		renderTrafficMenu(gTcWin[1],260,100,gCamSubLoc[gTcFocus],gTcSubfocus+1);
		setFocusTrafficSub(gTcSubfocus);
	}
	if (gTcSubfocus < gCamSubLoc[gTcFocus].length - 1)
		setFocusTrafficSub(gTcSubfocus+1);
}

function openCameraView()
{
	hideTrafficMenu(gTcWin[0]);
	hideTrafficMenu(gTcWin[1]);

	var data = getTCInfo(gCamSubId[gTcFocus][gTcSubfocus]);

	document.getElementById('tcview_tvf').normalStyle.visibility = 'visible';
	document.getElementById('tcview_tvf').firstChild.data = data[0];

	document.getElementById('tcview_mainmap').normalStyle.visibility = 'hidden';
	
	document.getElementById('tcview_submap').normalStyle.visibility = 'hidden';
//	document.getElementById('tcview_submap').data = '../images/trafficcam/sub' + gTcFocus +'.jpg';

	document.getElementById('tcview_cam').normalStyle.visibility = 'visible';
	// XXX
	data[2] = '../cgi/camimg.pl?img=' + data[2];
	document.getElementById('tcview_cam').data = data[2];

	document.getElementById('tcview_tt').normalStyle.visibility = 'visible';
	document.getElementById('tcview_tt').firstChild.data = data[1];

	gCamView = true;
}
function closeCameraView()
{
	document.getElementById('tcview_tvf').normalStyle.visibility = 'hidden';
	document.getElementById('tcview_mainmap').normalStyle.visibility = 'visible';
	document.getElementById('tcview_submap').normalStyle.visibility = 'visible';
	document.getElementById('tcview_cam').normalStyle.visibility = 'hidden';
	document.getElementById('tcview_tt').normalStyle.visibility = 'hidden';

	renderTrafficMenu(gTcWin[0],10,100,gCamLoc,gTcFocus);
	renderTrafficMenu(gTcWin[1],260,100,gCamSubLoc[gTcFocus],gTcSubfocus);
	gCamView = false;
}
/************************************************************
 Data Retrival functions
 ************************************************************/
function getTCInfo(cam)
{
	//replace with server address
//	var url = 'http://yeodenure.homeftp.net/lime/trafficlime.php?opt='+cam;
//	var url = 'http://10.24.138.136/lab_CSP/php/trafficlime.php?opt='+cam;
	var url = '../php/trafficlime.php?opt='+cam;
	var data = browser.transmitTextDataOverIP(url,'','EUC-JP');
	if (data[0])
		return data[2].split('|');
	else
		return false;
	return data;
}
///////////////////////////////////////////////////////////////////
//Timer functions
//////////////////////////////////////////////////////////////////
function checkRefresh()
{
	if (gCamView)
	{
		openCameraView();
	}
}

/************************************************************
 DOM event functions
 ************************************************************/
/*
function onload()
{
	gState.bmltype = 9;
	clockStart();
	lockScreen();

	hideElem( "loading2");

	giTimer = browser.setInterval('checkRefresh();',30000,0);
//
	renderMenu(gTcWin[0],10,100,gCamLoc,0);
	setFocusMain(0);
	document.getElementById('tcview_mainmap').normalStyle.visibility = 'visible';

	unlockScreen();
}
*/
/************************************************************/
/*
function onunload() 
{
	browser.clearTimer(giTimer);
}
*/
/************************************************************/
function trafficKey()
{
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	lockScreen();

	if (code >=1 && code <=4)
		keyTrafficArrow(code);
	else if (code == 18)
		keyTrafficEnter();
	else if (code == 19)
		keyTrafficBack();
	else if (code >=6 && code <= 14)
		keyNumber(code);
	else if (code==23)
		keyGreen_Home();
	else if (code==24) // Ìá£àE
		keyYellow_Back();

	unlockScreen();
}
