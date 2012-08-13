/**********************************************************************
 * Copyright (C) 2010 Institute for Infocomm Research.
 * All rights reserved.
 **********************************************************************/

/************************************************************
 * Wrapper class
 */
function historyButtonShow()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('Daily').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 10+'px';

	elemStyle = document.getElementById('Monthly').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 110+'px';

	elemStyle = document.getElementById('Yearly').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 220+'px';

	elemStyle = document.getElementById('SelectBtn').normalStyle;
	elemStyle.visibility = 'visible';
	elemStyle.left = 10+'px';
	unlockScreen();
}
function historyButtonDisappear()
{
	lockScreen();
	elemStyle = document.getElementById('Daily').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('Monthly').normalStyle;
	elemStyle.visibility = 'hidden';
	elemStyle = document.getElementById('Yearly').normalStyle;
	elemStyle.visibility = 'hidden';	
	elemStyle = document.getElementById('SelectBtn').normalStyle;
	elemStyle.visibility = 'hidden';
	document.getElementById('TextTitleGV').firstChild.data = "";
	for( var i=0;i<13;i++)
	{
		document.getElementById('TextTitleAxis'+i).firstChild.data = "";	
	}
	unlockScreen();
}
function onGraphkey(){
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;
	lockScreen();

	if(code==18){
		romSound(7);
		if( id == "onGraph") {
			// realtime
			lockScreen();
			getElementById( "graphbox_native").normalStyle.top = "-540px";
			gboxDisappear();
			gbox1Show();
			unlockScreen();	

			lockScreen();
			elemStyle = document.getElementById('ghistory1').normalStyle;
			elemStyle.visibility = 'hidden';		
			unlockScreen();

			lockScreen();
			getElementById( "graphbox_native" + "1").normalStyle.top = "95px";
			historyButtonShow();
	//		showElem("selectBtn");
			setFcs("historyBtn");
			unlockScreen();	
		}

	}else if(code==23){
			romSound(7);
			homeShow();
			lockScreen();
			getElementById("graphbox_native").normalStyle.top="-540px";
			gboxDisappear();
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
		browser.pauseTimer(Timer1);
		backShow();
		
		lockScreen();
		getElementById("graphbox_native").normalStyle.top="-540px";
		gboxDisappear();
		unlockScreen();
		
		lockScreen();
		gIndex1=0;
		setlistFocus(0);
		meterListShow();
		backDisappear();
		unlockScreen();
		
		setFcs("list");


	}
};

function GraphBox( szBoxName, szOptBgImage, szBarPrefix, szGridPrefix,
				   nTickAxisDisplacement, bVertical, nGridInterval, nInitialH)
{
	if( (szBoxName == null) || (szBarPrefix == null)) {
		return;
	};

	var box = document.getElementById( szBoxName);

	if( box == null) {
		return;
	};

	this.initGridLines = _initGridLines;
	this.initBackground = _initBackground;

//	this.setLogicalDesc = _setLogicalDesc;
	this.getPadding = _getPadding;
	this.setPadding = _setPadding;
	this.setBar = _setBar;
	this.printAttr = _printAttr;
	this.updateBar = _updateBar;

	this.calcAvgBarWidthPadPair = _calcAvgBarWidthPadPair;
	this.setLTWH = _setLTWH;
	this.update = _updateGraph;

	this.bSepByBorderInfo = null;

	this.szBoxName = szBoxName;
	this.szOptBgImage = szOptBgImage;
	this.szBarPrefix = szBarPrefix;
	this.szGridPrefix = szGridPrefix;

	this.bVertical = (bVertical == null) ? true : bVertical;
	this.nGridInterval = (nGridInterval == null) ? 20 : nGridInterval;

	this.nTotalW = gString.stripUnit( box.normalStyle.width);
	this.nTotalH = gString.stripUnit( box.normalStyle.height);
/*
	debug_log( "gString.ripNumber( px) = " + gString.ripNumber( "px"));
	debug_log( "gString.ripNumber( 101px) = " + gString.ripNumber( "101px"));
	debug_log( "gString.ripNumber( 101) = " + gString.ripNumber( "101"));
	debug_log( "gString.ripNumber( 101p0) = " + gString.ripNumber( "101p0"));
*/
	this.initGridLines();
	this.initBackground();
//	this.setLogicalDesc();

	this.nTickAxisDisp =
		(nTickAxisDisplacement == null) ? 0 : nTickAxisDisplacement;

	if( this.nTickAxisDisp > this.nTotalH) {
		this.nTickAxisDisp = gMath.max( 0, this.nTotalH / 100);
	};

	this.pBarObj = new Array();

	this.calcAvgBarWidthPadPair();

	debug_log( "Plot dimensions = " + this.nTotalW + " x " + this.nTotalH);
//	debug_log( "Plot dimensions (logical) = "
//				+ this.nBarMaxW + " x " + this.nBarMaxH);
	debug_log( "Calculated width per bar = " + this.nAverageW);
	debug_log( "nInitialH = " + nInitialH);

	this.nInitBarH =
		(nInitBarH == null) ? 1 : gMath.min( nInitialH, this.nTotalH);
/*
	debug_log( "nPad = " + this.nPad);
	debug_log( "nInitBarH = " + this.nInitBarH);
	debug_log( "szBoxName = " + this.szBoxName);
	debug_log( "szBarPrefix = " + this.szBarPrefix);
	debug_log( "nTotalH - nInitBarH = " + (this.nTotalH - this.nInitBarH));
*/
	this.setLTWH();
};

/************************************************************/
function _initGridLines() {
	var i = 0;

	var pGridObj = new Array();

	var grid = document.getElementById( this.szGridPrefix + i);

	while( grid != null) {
		if( grid.parentNode.id == this.szBoxName) {
			pGridObj[ pGridObj.length] = grid;
		};

		i++;
		grid = document.getElementById( this.szGridPrefix + i);
	};

	var nStep = this.nTotalH / pGridObj.length;
	var nPos = 0;
	var nLen = this.nTotalW;

	for( i = 0; i < pGridObj.length; i++) {
		if( this.bVertical) {
			pGridObj[ i].normalStyle.top = nPos;
			pGridObj[ i].normalStyle.width = nLen;
			pGridObj[ i].normalStyle.height = nStep;
			pGridObj[ i].normalStyle.borderBottomColorIndex = 8;
		}
		else {
			pGridObj[ i].normalStyle.left = nPos;
			pGridObj[ i].normalStyle.width = nStep;
			pGridObj[ i].normalStyle.height = nLen;
			pGridObj[ i].normalStyle.borderLeftColorIndex = 8;
		};
		nPos += nStep;
	};
};

/************************************************************/
function _initBackground() {
	var box = document.getElementById( this.szBoxName);

	if( box == null) {
		return;
	};

	if( !( this.bVertical)) {
		// Swap width & height value of graph box.
		debug_log( "Swap width & height");
		box.normalStyle.width = this.nTotalH + "px";
		box.normalStyle.height = this.nTotalW + "px";
	};

	var bgImageObj = box.firstChild;

	if( bgImageObj != null) {
		debug_log( "First child = \"" + bgImageObj.id + "\"");
	};

	if( this.szOptBgImage != null) {
		bgImageObj = document.getElementById( this.szOptBgImage);
	};

	if( bgImageObj == null) {
		debug_log( "No associated background image for graph \""
					+ this.szBoxName + "\"");
		return;
	};

	debug_log( "Associated background image = \"" + bgImageObj.id + "\"");
	debug_log( "type = \"" + bgImageObj.type + "\"");
	debug_log( "data = \"" + bgImageObj.data + "\"");

	if( bgImageObj.type != "image/jpeg") {
		return;
	};

	var pszPath = bgImageObj.data.split( "/");

	debug_log( "# path segment = " + pszPath.length);

	pszPath[ pszPath.length - 1] =
		"grid" + this.nGridInterval + (this.bVertical ? "H" : "V") + ".jpg";

	bgImageObj.data = pszPath.join( "/");
	bgImageObj.normalStyle.width = box.normalStyle.width;
	bgImageObj.normalStyle.height = box.normalStyle.height;

	if( (box.firstChild == null) || (box.firstChild.id != bgImageObj.id)) {
		/* Not directly nested within graph box <div>, so need to set position
		 * explicitly.
		 */
		bgImageObj.normalStyle.left = box.normalStyle.left;
		bgImageObj.normalStyle.top = box.normalStyle.top;
		debug_log( "Setting position of background image to [l:"
					+ bgImageObj.normalStyle.left + ", t:"
					+ bgImageObj.normalStyle.top + "]");
	};
};

/************************************************************/
/*
function _setLogicalDesc() {
	if( this.bVertical) {
		this.nBarMaxH = this.nTotalH;
		this.nBarMaxW = this.nTotalW;
	}
	else {
		this.nBarMaxH = this.nTotalW;
		this.nBarMaxW = this.nTotalH;
	};

	debug_log( "BarMaxH = " + this.nBarMaxH);
	debug_log( "BarMaxW = " + this.nBarMaxW);
};
*/
/************************************************************/
function _getPadding( obj) {
	/* Border width information will take precedence over padding size
	 * information for use as inter-bar separation distance.
	 */
	var nReturn = gString.stripUnit( obj.normalStyle.borderWidth);

	if( nReturn > 0) {
		this.bSepByBorderInfo = true;
		return( nReturn);
	};

	this.bSepByBorderInfo = false;

	if( this.bVertical) {
		return( gMath.max( gString.stripUnit( obj.normalStyle.paddingLeft),
						   gString.stripUnit( obj.normalStyle.paddingRight)));
	}
	else {
		return( gMath.max( gString.stripUnit( obj.normalStyle.paddingTop),
						   gString.stripUnit( obj.normalStyle.paddingBottom)));
	};
};

/************************************************************/
function _setPadding( sleeve) {
	// NOTE: this doesn't work - padding attributes are read-only.
	if( this.bVertical) {
		sleeve.normalStyle.paddingLeft = this.nPad + "px";
		sleeve.normalStyle.paddingRight = this.nPad + "px";
		sleeve.normalStyle.paddingTop = "0px";
		sleeve.normalStyle.paddingBottom = "0px";
	}
	else {
		sleeve.normalStyle.paddingLeft = "0px";
		sleeve.normalStyle.paddingRight = "0px";
		sleeve.normalStyle.paddingTop = this.nPad + "px";
		sleeve.normalStyle.paddingBottom = this.nPad + "px";
	};
};

/************************************************************/
function _printAttr( sleeve) {
	var szAttr =
//		"[left;top;width;height, padding-left;right;top;bottom]" +
		"[l;t;w;h, p-l;r;t;b]" +
		" = " +
		Array(
			sleeve.normalStyle.left,
			sleeve.normalStyle.top,
			sleeve.normalStyle.width,
			sleeve.normalStyle.height
		).join( ",")

		+ ", " +

		Array(
			sleeve.normalStyle.paddingLeft,
			sleeve.normalStyle.paddingRight,
			sleeve.normalStyle.paddingTop,
			sleeve.normalStyle.paddingBottom
		).join( ",");

	debug_log( "[" + szAttr + "]");
};

/************************************************************/
function _updateBar( bar, nValue) {
	if( this.bVertical) {
		bar.parentNode.normalStyle.top = (this.nTotalH - nValue) + "px";
		bar.parentNode.normalStyle.height = nValue + "px";
	}
	else {
		bar.parentNode.normalStyle.width = nValue + "px";
/*
		debug_log( "[top;height] = [" + bar.parentNode.normalStyle.top + ", "
					+ bar.parentNode.normalStyle.height + "]");
*/
	};

//	this.printAttr( bar.parentNode);
};

/************************************************************/
function _setBar( bar, nTickCoord, nBarSky) {
//	debug_log( "Text-align = \"" + bar.normalStyle.textAlign + "\"");

//	this.setPadding( bar.parentNode);

	if( this.bVertical) {
		bar.parentNode.normalStyle.left = nTickCoord + "px";
		bar.parentNode.normalStyle.top = nBarSky + "px";
		bar.parentNode.normalStyle.width =
			(this.nAverageW + 2 * this.nPad) + "px";
		bar.parentNode.normalStyle.height = this.nInitBarH + "px";

		bar.normalStyle.left = this.nPad + "px";
		if( this.bSepByBorderInfo) {
			// When using border info to determine inter-bar separation.
			bar.normalStyle.width = this.nAverageW + "px";
		}
		else {
			// When using padding info to determine inter-bar separation.
			bar.normalStyle.width = (this.nAverageW - 2 * this.nPad) + "px";
		};
		bar.normalStyle.height = this.nTotalH + "px";
	}
	else {
		bar.parentNode.normalStyle.left = "0px";
		bar.parentNode.normalStyle.top = nTickCoord + "px";
		bar.parentNode.normalStyle.width = this.nInitBarH + "px";
		bar.parentNode.normalStyle.height =
			(this.nAverageW + 2 * this.nPad) + "px";

		bar.normalStyle.top = this.nPad + "px";
		bar.normalStyle.width = this.nTotalH + "px";
		if( this.bSepByBorderInfo) {
			// When using border info to determine inter-bar separation.
			bar.normalStyle.height = this.nAverageW + "px";
		}
		else {
			// When using padding info to determine inter-bar separation.
			bar.normalStyle.height = (this.nAverageW - 2 * this.nPad) + "px";
		};

		// XXX: textAlign is read-only.
//		bar.normalStyle.textAlign = "right";
	};

//	this.printAttr( bar.parentNode);
//	this.printAttr( bar);

	return( nTickCoord + this.nAverageW + this.nPad * 2);
};

/************************************************************/
function _calcAvgBarWidthPadPair() {
	var i = 0;

	this.nPad = NaN;

	var bar = document.getElementById( this.szBarPrefix + i);

	while( bar != null) {
/*
		debug_log( "grandparent node of " + this.szBarPrefix + i + " = \"" +
					bar.parentNode.parentNode.id + "\"");

		debug_log( "parent node padding [left,right] = [" +
					bar.parentNode.normalStyle.paddingLeft + "," +
					bar.parentNode.normalStyle.paddingRight + "]");
*/
		if( bar.parentNode.parentNode.id == this.szBoxName) {
			this.pBarObj[ this.pBarObj.length] = bar;
/*
			var nLeftPad =
				gString.stripUnit( bar.parentNode.normalStyle.paddingLeft);
*/
//			var nPad = this.getPadding( bar.parentNode);
			var nPad = this.getPadding( bar);

			if( isNaN( this.nPad) ||
				((nPad > 0) && (this.nPad < nPad)))
			{
				this.nPad = nPad;
			};
		};

		i++;
		bar = document.getElementById( this.szBarPrefix + i);
	};

	debug_log( "Total of " + this.pBarObj.length + " " + this.szBarPrefix +
				"[0-9]+ bars under " + this.szBoxName);

	this.nAverageW = this.nTotalW / this.pBarObj.length;

	while( (this.nPad > 0) && (this.nAverageW <= this.nPad * 2)) {
		this.nPad--;
	};

	this.nAverageW -= this.nPad * 2;
};

/************************************************************/
function _setLTWH() {
	var nBarSky = this.nTotalH - this.nInitBarH;

	debug_log( "_setLTWH( " + this.szBoxName + ", " + this.szBarPrefix + ", "
				+ nBarSky + ", " + this.nAverageW + ", " + this.nInitBarH
				+ ")");
	debug_log( "Bar sky = " + nBarSky);
//	var i = 0;
//	var nLeft = isNaN( this.nPad) ? 0 : nPad;
//	var nLeft = 0;
	var nTickCoord = 0;

//	var bar = document.getElementById( this.szBarPrefix + i);

	browser.lockScreen();

//	while( bar != null) {
	for( var i = 0; i < this.pBarObj.length; i++) {
/*
		debug_log( "grandparent node of " + this.szBarPrefix + i + " = \"" +
					bar.parentNode.parentNode.id + "\"");
		debug_log( "parent node padding [left,right] = [" +
					bar.parentNode.normalStyle.paddingLeft + "," +
					bar.parentNode.normalStyle.paddingRight + "]");
*/
		var bar = this.pBarObj[ i];

//		this.setPadding( bar.parentNode);
		nTickCoord = this.setBar( bar, nTickCoord, nBarSky);
/*

//		if( bar.parentNode.parentNode.id == this.szBoxName) {
			bar.parentNode.normalStyle.left = nLeft + "px";
			bar.parentNode.normalStyle.top = t + "px";
			bar.parentNode.normalStyle.width = this.nAverageW + "px";
			bar.parentNode.normalStyle.height = this.nInitBarH + "px";
			bar.normalStyle.height = this.nTotalH + "px";
			nLeft += this.nAverageW + this.nPad * 2;
//		};
*/

//		i++;
//		bar = document.getElementById( this.szBarPrefix + i);
	};

	browser.unlockScreen();
};

/************************************************************/
function _updateGraph( pList) {
//	gArray.map( pList, gString.ripNumber);

	var pnMinMaxVal = gArray.getMinMaxPair( pList);

	var nMin = gMath.max( 0, (pnMinMaxVal[0] - 10) / 10 * 10);
	var nMax = (pnMinMaxVal[1] + 10) / 10 * 10;
	var nRange = nMax - nMin;

	debug_log( "Value range = [" + nMin + ", " + nMax + "] = " + nRange);

	var nFactor = 1;

	if( nRange < this.nTotalH) {
		nFactor = this.nTotalH / nRange;
		nRange = this.nTotalH;
	};

	var nDeltaPerPixel = nRange / (this.nTotalH - this.nTickAxisDisp) + 1;
	var nHalfPoint = nDeltaPerPixel / 2;

	debug_log( "Delta per pixel = " + nDeltaPerPixel);
	debug_log( "Half point = " + nHalfPoint);
	debug_log( "Artificial scale factor = " + nFactor);
	debug_log( "pBarObj[ " + this.pBarObj.length + "] v.s. pList[ "
				+ pList.length + "]");

	var szBlurb = this.bVertical ? "top;height" : "left:width";
	var i;

	browser.lockScreen();

	for( i = 0; (i < this.pBarObj.length) && (i < pList.length); i++) {
		var h = ((pList[ i] - nMin) * nFactor + nHalfPoint) / nDeltaPerPixel
				+ this.nTickAxisDisp;
/*
		debug_log( "Bar #" + i + ": " + pList[ i] + " => [" + szBlurb + "] = ["
					+ (this.bVertical ? this.nTotalH - h : 0) + "," + h + "]");
*/
//	browser.lockScreen();
		this.updateBar( this.pBarObj[ i], h);
//	browser.unlockScreen();
/*
		var bar = this.pBarObj[ i];

		bar.parentNode.normalStyle.top = (this.nTotalH - h) + "px";
		bar.parentNode.normalStyle.height = h + "px";
*/
	};

//	var t = this.nTotalH - this.nInitBarH;

	for( i = pList.length; i < this.pBarObj.length; i++) {
		this.updateBar( this.pBarObj[ i], this.nInitBarH);
/*
		var bar = this.pBarObj[ i];

		bar.parentNode.normalStyle.top = t + "px";
		bar.parentNode.normalStyle.height = h + "px";
*/
	};

	browser.unlockScreen();
};

function test() {
	var szCgi =
//		"smart_meter.pl"
		"get_tsv_rt.pl"
	;

	var szType =
		"power"
//		"water"
//		"sine"
	;
	var szDevice = gszDevice;

	var szInterval = null;

	if( szDevice == "X1_ZONE") {
		szType = "sine";
		szInterval = "1";
	} else if(gszDevice == "MAIN_VALVE" || gszDevice == "TOILET_FLUSH"){
		szType = "water";
	};
/*
	var szDevice =

		"B_ZONE"
		"C_ZONE"
		"E_ZONE"
		"K_ZONE"
		"L_ZONE"
		"M_ZONE"
		"T_ZONE"
		"X1_ZONE"
		"X2_ZONE"
		"TOTAL"

		"BasinHandwash"
		"DishWasher"
		"FishTank"
		"Kitchen-Fridge"
		"ShowerArea"
		"ToiletFlush"
		"WashingMachine"
		"MainValve"

		null
	;
*/
	var szScale =
//		"daily"
//		"monthly"
//		"yearly"
		null
	;
	var szFile =
//		"elect_daily.xml"
//		"elect_monthly.xml"
//		"elect_yearly.xml"
		null
	;

	var szUrl =
//"../cgi/get_tsv_rt.pl?type=sine";
//"tsv/list2.tsv";
//		"http://10.24.138.136/lab/"
		"../"
//			+ "tsv/list2.tsv"
		
			+ "cgi/" + szCgi + "?type=" + szType
			+ ((szDevice == null) ? "" : "&device=" + szDevice)
			+ ((szScale == null) ? "" : "&scale=" + szScale)
			+ ((szFile == null) ? "" : "&file=" + szFile)
			+ ((szInterval == null) ? "" : "&sec=" + szInterval)
/*
*/
	;

	debug_log( "szUrl = \"" + szUrl + "\"");

	 var szTsvText = gBrowser.getTsv( szUrl);

	if( szTsvText == null) {
		return;
	};

//	debug_log( szTsvText);

	var pnValues = new Array();

	gString.getTsvColumn( pnValues, szTsvText, 8, gString.ripNumber);

	gGraph.update( pnValues);
};

var gszDevice = null;

function AutoGraphRefresh(szIndex){

	gGraph = new GraphBox( "graphbox_native","graphbox_background","b","g",5,true);
	gGraph1 = new GraphBox( "graphbox_native1","graphbox_background","bA","gA",5,false);
	gszDevice = szIndex;
	Timer1=browser.setInterval( "test();", 500, 0);

};
function HistoryKey(){
	var code = document.currentEvent.keyCode;
	var id = document.currentEvent.target.id;

	if(0<code&&code<=4){
		HistoryFocus(code,idx);
	}else if(code==18){
		romSound(7);
		browser.clearTimer(Timer1);
		bVertical=false;

		var Textinfo= new Array ("Daily","Monthly","Yearly");
		textStyle = document.getElementById('TextTitleGV').normalStyle;
		textStyle.visibility = 'visible';
		textStyle.top = 58 +'px';
		textStyle.left = 50 +'px';
		textStyle.width = 480 +'px';
		textStyle.height = 30 +'px';	
		document.getElementById('TextTitleGV').firstChild.data = Textinfo[gIndex2];

		var TextinfoSelection = Textinfo[gIndex2];
		test2(TextinfoSelection);
	}else if(code==23){
			romSound(7);
			homeShow();
			lockScreen();
			getElementById("graphbox_native1").normalStyle.top="-540px";
			historyButtonDisappear();
			gbox1Disappear();
		//	hideElem("SelectBtn");	
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
		backShow();

		lockScreen();
		getElementById("graphbox_native1").normalStyle.top="-540px";
		historyButtonDisappear();
		gbox1Disappear();
		
		//hideElem("SelectBtn");	
		unlockScreen();

		lockScreen();
		gIndex1=0;
		setlistFocus(0);
		meterListShow();
		backDisappear();
		unlockScreen();

		setFcs("list");
	}
};

function HistoryFocus(code,idx){
		idx = gFocus3[gIndex2][code-1];
		if(idx==-1) return;
		romSound(9);
		setHistoryFocus(idx);
		gIndex2=idx;
};

function setHistoryFocus(id){
	var img=new Array("btn_daily_h.jpg","btn_monthly_h.jpg","btn_yearly_h.jpg");	
	var X1 = new Array (10,110,220);
	var Y1 = 320;
	var W1 = 90;
	var H1 = 194;

	lockScreen();
	elemStyle = document.getElementById('SelectBtn').normalStyle;
	elemStyle.visibility = 'hidden';
	unlockScreen();
	
	lockScreen();
	elemStyle = document.getElementById('SelectBtn').normalStyle;
	elemStyle.left = X1[id]+'px';
	elemStyle.top = Y1+'px';	
	elemStyle.width = W1+'px';
	elemStyle.height = H1+'px';
	document.getElementById('SelectBtn').data = 
			'../images/widget_menu/'+img[id];
	elemStyle.visibility = 'visible';
	unlockScreen();
};

function test2(TextinfoSelection) {

	var RetrieveSelection = new Array ("elect_daily.xml","elect_monthly.xml","elect_yearly.xml");
	var Textinfo= new Array ("Daily","Monthly","Yearly");
	var choosenXML = "";
	for (var i=0;i<=2;i++){
		if (TextinfoSelection == Textinfo[i]){
			choosenXML = RetrieveSelection[i];
		}
	}

	var szUrl ="../cgi/smart_meter.pl?type=power&scale=" + TextinfoSelection + "&zone="+gszDevice;
	
	if(gszDevice == "MAIN_VALVE" || gszDevice == "TOILET_FLUSH"){
		var szUrl ="../cgi/smart_meter.pl?type=water&scale=" + TextinfoSelection + "&zone="+gszDevice;
	};
//	var szUrl ="../cgi/smart_meter.pl?type=power&scale=" + TextinfoSelection + "&file="+choosenXML

	var szTsvText = gBrowser.getTsv( szUrl);

	if( szTsvText == null) {
		return;
	};

//	debug_log( szTsvText);

	var pnValues = new Array();

// Edited by me...
	var pnAxis = new Array();
	gString1.getTsvColumn1( pnAxis, szTsvText,0);
	gString.getTsvColumn( pnValues, szTsvText, 1, gString.ripNumber);
	gGraph1.update( pnValues);
//	setText("TextTitleAxis",pnAxis);

	debug_log( "pnAxis[" + pnAxis.length + "]");
	debug_log( pnAxis);
	debug_log( "pnValues[" + pnAxis.length + "]");
	debug_log( pnValues);

//var Yaxis = new Array (108,130,150,170,190,210,230,250,270,290,310,330,360);
	var y = 95;
	var yGap = 18;
	lockScreen();
	for( var i=0;i<pnAxis.length;i++)
	{
		textStyle = document.getElementById('TextTitleAxis'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'visible';
		textStyle.left  = 30 + 'px';
		textStyle.top = y+'px';
		textStyle.width = 50 +'px';
		textStyle.height = 20 +'px';
		document.getElementById('TextTitleAxis'+i).firstChild.data = pnAxis[i];
		y +=yGap;

	}
	for (var i=pnAxis.length; i<12;i++){
		textStyle = document.getElementById('TextTitleAxis'+i).normalStyle;
		textStyle.visibility = elemStyle.visibility = 'hidden';
	}
	unlockScreen();
};
