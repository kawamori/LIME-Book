function TrafficShow(){
	widgetDisappear();
	lockScreen();

	hideElem( "loading2");
	footerShow();
	giTimer = browser.setInterval('checkRefresh();',30000,0);

	renderTrafficMenu(gTcWin[0],10,100,gCamLoc,0);
	setFocusTrafficMain(0);
	document.getElementById('tcview_mainmap').normalStyle.visibility = 'visible';

	unlockScreen();
	setFcs("trafficcam_key");

}
function footerShow()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('footer1').normalStyle;
	elemStyle.visibility = 'visible';
}
function footerDisappear()
{
	lockScreen();
	//highlight the first one//
	elemStyle = document.getElementById('footer1').normalStyle;
	elemStyle.visibility = 'hidden';
}


