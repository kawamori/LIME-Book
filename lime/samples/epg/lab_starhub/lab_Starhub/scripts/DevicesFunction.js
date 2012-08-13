function Deviceshow()
{
	
	widgetDisappear();
	deviceListShow();
	setFcs("listdevices");
	lockScreen();
	var X = 50;
	var Y = new Array(105,140,175,210,245,280);
	var W =480;
	var H = 30;
	var Textinfo= new Array ("AC0","AC1","M_ZONE_LED_CIR_B","M_ZONE_LED_CIR_G","M_ZONE_LED_CIR_GB","M_ZONE_PLC");
	var TextTitle= "List Of Devices";

	textStyle = document.getElementById('TextTitleB').normalStyle;
	textStyle.visibility = 'visible';
	textStyle.left = 20+'px';
	textStyle.top = 55+'px';
	textStyle.width = W +'px';
	textStyle.height = H +'px';
	document.getElementById('TextTitleB').firstChild.data = TextTitle;

	for( var i=0;i<6;i++)
	{
		textStyle = document.getElementById('TextinfoB'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
		textStyle.left  = X + 'px';
		textStyle.top = Y[i]+'px';
		textStyle.width = W +'px';
		textStyle.height = H +'px';
		document.getElementById('TextinfoB'+i).firstChild.data = Textinfo[i];

	}
	unlockScreen();
}
function deviceListShow()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('devicebackground').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('devicefooter').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('BtnFocus1').normalStyle;
	elemStyle.visibility = 'visible';
	textStyle = document.getElementById('device').normalStyle;
	textStyle.visibility = 'visible';
	textStyle = document.getElementById('TextTitleB').normalStyle;
	textStyle.visibility = 'visible';
	for( var i=0;i<6;i++)
	{
		textStyle = document.getElementById('TextinfoB'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
	}
	unlockScreen();
}
function deviceListDisappear()
{
	lockScreen();
	elemStyle = document.getElementById('devicebackground').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('devicefooter').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('BtnFocus1').normalStyle;
	elemStyle.visibility = 'hidden';
	textStyle = document.getElementById('device').normalStyle;
	textStyle.visibility = 'hidden';
	textStyle = document.getElementById('TextTitleB').normalStyle;
	textStyle.visibility = 'hidden';
	for( var i=0;i<6;i++)
	{
		textStyle = document.getElementById('TextinfoB'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'hidden';
	}
	unlockScreen();
}

function listkey2(){
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;
	
	lockScreen();
	
	if(0<code&&code<=4){
		listFocus1(code,idx);
	}else if(code==18){ // ·èÃàE
		romSound(7);
		deviceListDisappear();
		var Textinfo= new Array ("AC0","AC1","M_ZONE_LED_CIR_B","M_ZONE_LED_CIR_G","M_ZONE_LED_CIR_GB","M_ZONE_PLC");
		var TextinfoSelection = Textinfo[gIndex3];
		getStatus(TextinfoSelection);

	}else if(code==23){ // Ìá£àE
		romSound(7);
		lockScreen();
		deviceListDisappear();
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
		deviceListDisappear();
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

function listFocus1(code,idx){
		idx = gFocus2[gIndex3][code-1];
		if(idx==-1) return;
		romSound(9);
		setlistFocus1(idx);
		gIndex3=idx;
}

function setlistFocus1(id){
	var X =10;
	var Y = new Array(95,135,170,205,240,275);
	var W =480;
	var H = 30;

	elemStyle = document.getElementById('BtnFocus1').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.top = Y[id]+'px';
	elemStyle.left = X +'px';
	elemStyle.width = W +'px';
	elemStyle.height = H +'px';
}



