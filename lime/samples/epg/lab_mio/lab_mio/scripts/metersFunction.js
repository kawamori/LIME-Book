function scaledownshow()
{

	widgetDisappear();
	meterListShow();

	setFcs("list");
	lockScreen();
	var X = 80;
	var Y = new Array(105,140,175,210,245,280);
	var W =480;
	var H = 30;
	var TextTitle= "List Of Meters";
	var Textinfo= new Array ("TOTAL","X1_ZONE","X2_ZONE","AC0","MAIN_VALVE","TOILET_FLUSH");

	textStyle = document.getElementById('TextTitleA').normalStyle;
	textStyle.visibility = 'visible';
	textStyle.left = 20+'px';
	textStyle.top = 55+'px';
	textStyle.width = W +'px';
	textStyle.height = H +'px';
	document.getElementById('TextTitleA').firstChild.data = TextTitle;

	for( var i=0;i<6;i++)
	{
		textStyle = document.getElementById('Textinfo'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
		textStyle.left  = X + 'px';
		textStyle.top = Y[i]+'px';
		textStyle.width = W +'px';
		textStyle.height = H +'px';
		document.getElementById('Textinfo'+i).firstChild.data = Textinfo[i];

	}
	unlockScreen();
}

function meterListShow()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('meterbackground').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('meterfooter').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('BtnFocus').normalStyle;
	elemStyle.visibility = 'visible';
	textStyle = document.getElementById('TextTitleA').normalStyle;
	textStyle.visibility = 'visible';
	for( var i=0;i<6;i++)
	{
		textStyle = document.getElementById('Textinfo'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
	}	
	unlockScreen();
}
function meterListDisappear()
{
	elemStyle = document.getElementById('meterbackground').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('meterfooter').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('BtnFocus').normalStyle;
	elemStyle.visibility = 'hidden';
	
	textStyle = document.getElementById('TextTitleA').normalStyle;
	textStyle.visibility = 'hidden';
	for( var i=0;i<6;i++)
	{
		textStyle = document.getElementById('Textinfo'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'hidden';
	}	
}
function gboxShow()
{
	//highlight the first one//
	elemStyle = document.getElementById('gbackground').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('gfooter').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('ghistory').normalStyle;
	elemStyle.visibility = 'visible';
	
	var Textinfo= new Array ("TOTAL","X1_ZONE","X2_ZONE","AC0","MAIN_VALVE","TOILET_FLUSH");
	textStyle = document.getElementById('TextTitleG').normalStyle;
	textStyle.visibility = elemStyle.visibility = 'visible';
//  textStyle.fontSize = 22+'px';
	textStyle.top = 58 +'px';
	textStyle.left = 50 +'px';
	textStyle.width = 480 +'px';
	textStyle.height = 30 +'px';	
	document.getElementById('TextTitleG').firstChild.data = Textinfo[gIndex1];
}
function gboxDisappear()
{
	elemStyle = document.getElementById('gbackground').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('gfooter').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('ghistory').normalStyle;
	elemStyle.visibility = 'hidden';	
	document.getElementById('TextTitleG').firstChild.data = "";
}
function gbox1Show()
{
	//highlight the first one//
	elemStyle = document.getElementById('gbackground1').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('gfooter1').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('ghistory1').normalStyle;
	elemStyle.visibility = 'visible';
}
function gbox1Disappear()
{
	elemStyle = document.getElementById('gbackground1').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('gfooter1').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('ghistory1').normalStyle;
	elemStyle.visibility = 'hidden';
	document.getElementById('TextTitleGV').firstChild.data = "";	
}
function listkey1()
{
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;
	
	lockScreen();
	
	if(0<code&&code<=4){
		listFocus(code,idx);
	}else if(code==18){ // ·èÃàE
		romSound(7);
		meterListDisappear();
		setFcs("onGraph");
		gboxShow();
		getElementById( "graphbox_native").normalStyle.top = "100px";
		var Textinfo= new Array ("TOTAL","X1_ZONE","X2_ZONE","AC0","MAIN_VALVE","TOILET_FLUSH");
 		AutoGraphRefresh(Textinfo[gIndex1]);
	}else if(code==23){ // Ìá£àE
		romSound(7);
		lockScreen();
		meterListDisappear();
		homeShow();
		unlockScreen();

		lockScreen();
		homeDisappear();
		unlockScreen();

		lockScreen();
		WindowShow();
		setFcs("default");
		unlockScreen();

	}else if(code==24){ // Ìá£àE
		romSound(7);
		lockScreen();
		meterListDisappear();
		backShow();
		unlockScreen();

		lockScreen();
		backDisappear();
		unlockScreen();

		lockScreen();
		widgetShow();
		setFcs("widget");
		unlockScreen();
		
	}
	
	unlockScreen();
}
function listFocus(code,idx){
		idx = gFocus2[gIndex1][code-1];
		if(idx==-1) return;
		romSound(9);
		setlistFocus(idx);
		gIndex1=idx;
}

function setlistFocus(id){
	var X =10;
	var Y = new Array(95,135,170,205,240,275);
	var W =480;
	var H = 30;

	elemStyle = document.getElementById('BtnFocus').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.top = Y[id]+'px';
	elemStyle.left = X +'px';
	elemStyle.width = W +'px';
	elemStyle.height = H +'px';

}
