function PolyListShow()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('Polybackground').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('polyfooter').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('PolyFocus1').normalStyle;
	elemStyle.visibility = 'visible';
	textStyle = document.getElementById('Poly').normalStyle;
	textStyle.visibility = 'visible';
	textStyle = document.getElementById('TextTitleC').normalStyle;
	textStyle.visibility = 'visible';
	for( var i=0;i<6;i++)
	{
		textStyle = document.getElementById('TextinfoP'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
	}
	unlockScreen();	
}
function PolyListDisappear()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('Polybackground').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('polyfooter').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('PolyFocus1').normalStyle;
	elemStyle.visibility = 'hidden';
	textStyle = document.getElementById('Poly').normalStyle;
	textStyle.visibility = 'hidden';
	textStyle = document.getElementById('TextTitleC').normalStyle;
	textStyle.visibility = 'hidden';
	for( var i=0;i<6;i++)
	{
		textStyle = document.getElementById('TextinfoP'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'hidden';
	}
	unlockScreen();	
}
function QPictureShow()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('QueuePictureBox').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('Pbackground').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('Pfooter').normalStyle;
	elemStyle.visibility = 'visible';
	textStyle = document.getElementById('TextTitleP').normalStyle;
	textStyle.visibility = 'visible';
	for( var i=0;i<=6;i++)
	{
		textStyle = document.getElementById('queue'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
	}
	unlockScreen();	
}
function QPictureDisappear()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('QueuePictureBox').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('Pbackground').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('Pfooter').normalStyle;
	elemStyle.visibility = 'hidden';
	textStyle = document.getElementById('TextTitleP').normalStyle;
	textStyle.visibility = 'hidden';
	document.getElementById('TextTitleP').firstChild.data = "";
	for( var i=0;i<=6;i++)
	{
		textStyle = document.getElementById('queue'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'hidden';
		document.getElementById('queue'+i).firstChild.data = "";
	}
	unlockScreen();	
}
function PolyShow(){
	widgetDisappear();
	PolyListShow();
	setFcs("listPoly");
	
	lockScreen();
	var X = 50;
	var Y = new Array(105,140,175,210,245,280);
	var W =480;
	var H = 30;
	var Textinfo= new Array(
		"Ang Mo Kio Poly",
		"Bedok PolyClinic",
		"Bukit Batok Poly",
		"Bukit Merah PolyClinic",
		"Chua Chu Kang Poly",
		"Geylang PolyClinic",
		"Hougang Poly",
		"Jurong Poly",
		"Marine Parade PolyClinic",
		"Outram PolyClinic",
		"Queenstown PolyClinic",
		"Toa Payoh Poly"
	);

	var TextTitle= "List Of Clinics";
	textStyle = document.getElementById('TextTitleC').normalStyle;
	textStyle.visibility = elemStyle.visibility = 'visible';
	textStyle.left = 20+'px';
	textStyle.top = 55+'px';
	textStyle.width = W +'px';
	textStyle.height = H +'px';
	document.getElementById('TextTitleC').firstChild.data = TextTitle;

	for( var i=0;i<6;i++)
	{
		textStyle = document.getElementById('TextinfoP'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
		textStyle.left  = X + 'px';
		textStyle.top = Y[i]+'px';
		textStyle.width = W +'px';
		textStyle.height = H +'px';
		document.getElementById('TextinfoP'+i).firstChild.data = Textinfo[i];

	}
	unlockScreen();
	
}


function Polykey(){
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;
	
	lockScreen();
	
	if(0<code&&code<=4){
		listPolyFocus(code,idx);
	}else if(code==18){ // ·èÃàE
		romSound(7);
		lockScreen();
		PolyListDisappear();
		unlockScreen();
		lockScreen();
		QPictureShow();
		var Textinfo= new Array(
			"Ang Mo Kio Poly",
			"Bedok PolyClinic",
			"Bukit Batok Poly",
			"Bukit Merah PolyClinic",
			"Chua Chu Kang Poly",
			"Geylang PolyClinic",
			"Hougang Poly",
			"Jurong Poly",
			"Marine Parade PolyClinic",
			"Outram PolyClinic",
			"Queenstown PolyClinic",
			"Toa Payoh Poly"
		);
	
		textStyle = document.getElementById('TextTitleP').normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
		textStyle.left = 50+'px';
		textStyle.top = 60+'px';
		textStyle.width = 480 +'px';
		textStyle.height = 30 +'px';
		document.getElementById('TextTitleP').firstChild.data = Textinfo[gIndex4];
		setFcs("PolyKey1");
		unlockScreen();
		AutoPolyRefresh();
	}else if(code==23){ // Ìá£àE
		romSound(7);

		lockScreen();
		PolyListDisappear();
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
		PolyListDisappear();
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

function listPolyFocus(code,idx){
		idx = gFocus2[gIndex4][code-1];
		if(idx==-1) return;
		romSound(9);
		setlistPolyFocus(idx);
		gIndex4=idx;
}

function setlistPolyFocus(id){
	var Y = new Array(95,135,170,205,240,275);
	var W =480;
	var H = 30;
	elemStyle = document.getElementById('PolyFocus1').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.top = Y[id]+'px';
	elemStyle.left = 10 +'px';
	elemStyle.width = W +'px';
	elemStyle.height = H +'px';
}

	
