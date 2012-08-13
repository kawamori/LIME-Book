function print(str,disp){
	var obj = document.getElementById(disp);
	obj.firstChild.data = str ;
}

function onPoly(){
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;
	lockScreen();


	if(code==23){
		romSound(7);
		homeShow();
		lockScreen();
		browser.pauseTimer(Timer2);
		QPictureDisappear();
		unlockScreen();
	
		lockScreen();
		homeDisappear();
		unlockScreen();

		lockScreen();
		WindowShow();
		setFcs("default");
		unlockScreen();
	}else if(code==24){ // –ß‚é
	
		romSound(7);
		lockScreen();
		browser.pauseTimer(Timer2);
		QPictureDisappear();
		backShow();
		unlockScreen();

		lockScreen();
		backDisappear();
		unlockScreen();
		
		lockScreen();
		gIndex4=0;
		setlistPolyFocus(0);
		PolyListShow();
		setFcs("listPoly");
		unlockScreen();
	}
}

function retrieveTsv(url,val,encoding){
	return browser.transmitTextDataOverIP(url,val,encoding);
	
}


function getQueue(){

	xyz++;

	var val="";

	var ppszPolyCodeGroupPair = new Array(
		new Array( "AMK", "NHG"),
		new Array( "BDP", null),
		new Array( "BBK", "NHG"),
		new Array( "BMP", null),
		new Array( "CCK", "NHG"),
		new Array( "GLP", null)
	);

	var pszPair = ppszPolyCodeGroupPair[ gIndex4];

	var url = "../cgi/get_poly.pl?poly=" + pszPair[0] + "&data=TEXT";
	var urlImage =
		"../cgi/get_poly.pl?poly=" + pszPair[0] + "&amp;data=IMAGE&amp;" +
		((pszPair[1] == null) ? "" : "group=" + pszPair[1]) +
		"&amp;area=CONSULTATION&amp;time=" + xyz;

	//var url="../cgi/get_poly.pl?poly=GLP&data=TEXT";
	textStyle = document.getElementById('queue0').normalStyle;
	textStyle.visibility = 'visible';
	textStyle.top = 115 +'px';
	document.getElementById('queue0').firstChild.data = "Refreshing.....";
	
	lockScreen();
	var ret = retrieveTsv(url, val,"EUC-JP");
	var readTSV=0;
	var index =0;
	var PolyInfo = new Array (
		"No. of Patients in Registration Queue: ",
		"Estimated Waiting Time: ",
		"No. of Patients in Consultation Queue: ",
		"Estimated Waiting Time: ",
		"No. of Patients in Pharmacy Queue: ",
		"Estimated Waiting Time: "
	);
	if(ret[0] ==1){

		var tmpTSVArray = new Array();
		var storeTSV = new Array();
		tmpTSVArray = ret[2];		//takes the encoding part."EUC-JP"
		var y = new Array(115,140,170,210,240,280,310);

	//	print(tmpTSVArray,"queue1");
		tmpTSVArray=tmpTSVArray.split("\t");
		tmpTSVArraySize=(tmpTSVArray.length)-1;
		for(var i=1;i<=tmpTSVArraySize;i++){
			textStyle = document.getElementById('queue'+i).normalStyle;
			textStyle.visibility = 'visible';
			textStyle.top = y[i] +'px';
			document.getElementById('queue'+i).firstChild.data = PolyInfo[i-1]+ tmpTSVArray[i] ;
		}

		textStyle = document.getElementById('queue0').normalStyle;
		textStyle.top = 115 +'px';
		document.getElementById('queue0').firstChild.data = "Retrieve Image"+url;
	}else{
		textStyle = document.getElementById('queue0').normalStyle;
		textStyle.top = 115 +'px';
		document.getElementById('queue0').firstChild.data = "Retrieve Error";
	}
	document.getElementById( 'QueuePictureBox').data = urlImage;
	unlockScreen();
}



function AutoPolyRefresh()
{
	Timer2 = browser.setInterval("getQueue(gIndex4);",2000,0);
	
}

