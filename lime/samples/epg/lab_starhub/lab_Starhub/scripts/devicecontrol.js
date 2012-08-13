
function print(str,disp){
	var obj = document.getElementById(disp);
	obj.firstChild.data = str ;
}

function onDevicekey(){
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	if(code==18){
		romSound(7);		
		if( StoreValue == "lightOn"){
			elemStyle = document.getElementById('LOn').normalStyle;
			elemStyle.visibility = 'visible';
			elemStyle.top = 200+'px';
			elemStyle.left = 50 +'px';
			elemStyle.width = 200 +'px';
			elemStyle.height = 100 +'px';
			document.getElementById('LOn').data = 
					'../images/widget_menu/btn_on_h.jpg';

		}else {
			elemStyle = document.getElementById('LOn').normalStyle;
			elemStyle.visibility = 'visible';
			elemStyle.top = 200+'px';
			elemStyle.left = 50 +'px';
			elemStyle.width = 200 +'px';
			elemStyle.height = 100 +'px';
			document.getElementById('LOn').data = 
					'../images/widget_menu/btn_off_h.jpg';
		}
//		browser.sleep(2000);
		ControlDevice(StoreUrl);

	}else if(code==23){ // –ß‚é
		romSound(7);
		homeShow();
		lockScreen();
		
		lightControlOff();
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
		//launchTop();
		backShow();

		lightControlOff();

		lockScreen();
		gIndex3=0;
		setlistFocus1(0);
		deviceListShow();
		backDisappear();
		unlockScreen();
		
		setFcs("listdevices");
	}
}

function lightControl()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('Lbackground').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('Lfooter').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle = document.getElementById('LOn').normalStyle;
	elemStyle.top = 200+'px';
	elemStyle.left = 50 +'px';
	elemStyle.width = 200 +'px';
	elemStyle.height = 100 +'px';
	elemStyle.visibility = 'visible';
	textStyle = document.getElementById('TextTitleL').normalStyle;
	textStyle.visibility = 'visible';
	textStyle = document.getElementById('tsv1').normalStyle;
	textStyle.visibility = 'visible';
	unlockScreen();
}
function lightControlOff()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('Lbackground').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('Lfooter').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('LOn').normalStyle;
	elemStyle.visibility = 'hidden';
	textStyle = document.getElementById('TextTitleL').normalStyle;
	textStyle.visibility = 'hidden';
	textStyle = document.getElementById('tsv1').normalStyle;
	textStyle.visibility = 'hidden';
	unlockScreen();
}
function retrieveTsv(url,val,encoding){
	return browser.transmitTextDataOverIP(url,val,encoding);
	
}



function getStatus(TextinfoSelection){

	var val="";	//text to sent

//	var url="http://10.24.138.136/lab/cgi/smart_meter.pl?type=control&device=M_ZONE_PLC&action=isLightOn";
//	var url="../cgi/smart_meter.pl?type=control&device=M_ZONE_PLC&action=isLightOn";
	var url="../cgi/smart_meter.pl?type=control&device="+TextinfoSelection+"&action=isLightOn";

	

/*
where:
DDDDD = L_ZONE, M_ZONE, X_ZONE_PLC_CENTER, etc.
AAAAA = lightOn, lightOff, isLightOn, listDevices
*/

//	print("calling retrieveTsv() to retrieve the corresponding tsv from "+url1,"tsv");

	var ret = browser.transmitTextDataOverIP(url,val,"EUC-JP");
	var readTSV=0;
	var index =0;

	if(ret[0] ==1){
		lockScreen();
		var tmpTSVArray = new Array();
		var readTSV = new Array();
		var storeTSV = new Array();
		tmpTSVArray = ret[2];		//takes the encoding part."EUC-JP"
	//	print(tmpTSVArray,"tsv");
	//	storeTSV=tmpTSVArray.split(":");
		readTSV=tmpTSVArray.split("\n");
		lightControl();
		textStyle = document.getElementById('tsv1').normalStyle;
		textStyle.visibility = 'visible';
		document.getElementById('tsv1').firstChild.data = "Is the Light On:" +readTSV[0];
	//	getElementById("graphbox").normalStyle.visibility="visible";
	//	print(readTSV[0],"tsv");
		if(readTSV[0] == "false"){
			//setText("textButton","true");
			StoreValue = "lightOn";
			elemStyle = document.getElementById('LOn').normalStyle;
			elemStyle.visibility = 'visible';
			elemStyle.top = 200+'px';
			elemStyle.left = 50 +'px';
			elemStyle.width = 200 +'px';
			elemStyle.height = 100 +'px';
			document.getElementById('LOn').data = 
					'../images/widget_menu/btn_on.jpg';
		//	print(StoreValue,"tsv");
		}else if(readTSV[0] == "true"){
		//	print("Is the Light On:"+ readTSV[0],"tsv");
		//	setText("textButton","false");
			StoreValue = "lightOff";
			elemStyle = document.getElementById('LOn').normalStyle;
			elemStyle.visibility = 'visible';
			elemStyle.top = 200+'px';
			elemStyle.left = 50 +'px';
			elemStyle.width = 200 +'px';
			elemStyle.height = 100 +'px';
			document.getElementById('LOn').data = 
					'../images/widget_menu/btn_off.jpg';
		//	print(StoreValue,"tsv");
			unlockScreen();
		}
	StoreUrl = TextinfoSelection;	
	}else{
		print("Retrieve error","tsv1");
	}
	setFcs("onDevices");

}

function ControlDevice(StoreUrl){

	var val="";	//text to sent	
	//print(StoreValue,"tsv");

//	var url="http://10.24.138.136/lab/cgi/smart_meter.pl?type=control&device=M_ZONE_PLC&action="+StoreValue;
//	print(url,"tsv");

//	var url="../cgi/smart_meter.pl?type=control&device=M_ZONE_PLC&action="+StoreValue;
	var url="../cgi/smart_meter.pl?type=control&device="+StoreUrl+"&action="+StoreValue;

	

	
/*
where:
DDDDD = L_ZONE, M_ZONE, X_ZONE_PLC_CENTER, etc.
AAAAA = lightOn, lightOff, isLightOn, listDevices
*/

//	print("calling retrieveTsv() to retrieve the corresponding tsv from "+url1,"tsv");
	var ret = retrieveTsv(url, val,"EUC-JP");

	var readTSV=0;
	var index =0;
	getStatus(StoreUrl);

}


