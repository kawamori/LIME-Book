/*************************  TOP  *************************/
var gTopButtonInfo = new Array(
	new Array( true, "newsvod.bml", "News VoD"),
	new Array( true, "hotnews.bml", "Hot News Search"),
	new Array( true, "HttpPostTest.bml", "HttpPostTest"),
	new Array( true, "mazegame.bml", "mazegame"),
	new Array( true, "reversi-w1.bml","Reversi Game"), //Edited//
	new Array( true, "doomlike.bml", "doomlike.bml"),
	new Array( true, "meters.bml", "smart meters"),
	new Array( true, "smart_meter2.bml", "DailyMeters"),
	new Array( true, "DeviceControl.bml", "DeviceControl"),
	new Array( true, "Polyclinic1.bml", "Polyclinic")
);

/*************************  News VoD Top  *************************/
var gYers = 2009;
var gMonth = 9;
var gDay = new Array();

gDay[6] = new Array();
gDay[6][0] = new Array( "Day06_CNA 10:00 - English", "CNA 10:00 - English", true, "../thumb/cna_1000_20090906_00_2S.jpg", "../thumb/cna_1000_20090906_00_3S.jpg", "../thumb/cna_1000_20090906_00_4S.jpg");
gDay[6][1] = new Array( "Day06_CH8 18:30 - Chinese", "CH8 18:30 - Chinese", true, "../thumb/ch8_1830_20090906_00_2S.jpg", "../thumb/ch8_1830_20090906_00_3S.jpg", "../thumb/ch8_1830_20090906_00_4S.jpg");
gDay[6][2] = new Array( "Day06_CH5 21:30 - English", "CH5 21:30 - English", true, "../thumb/ch5_2130_20090906_00_2S.jpg", "../thumb/ch5_2130_20090906_00_3S.jpg", "../thumb/ch5_2130_20090906_00_4S.jpg");
gDay[6][3] = new Array( "Day06_CHU 23:00 - Chinese", "CHU 23:00 - Chinese", true, "../thumb/chu_2300_20090906_00_2S.jpg", "../thumb/chu_2300_20090906_00_3S.jpg", "../thumb/chu_2300_20090906_00_4S.jpg");

gDay[7] = new Array();
gDay[7][0] = new Array( "Day07_CH8 13:00 - Chinese", "CH8 13:00 - Chinese", true, "../thumb/ch8_1300_20090907_00_2S.jpg", "../thumb/ch8_1300_20090907_00_3S.jpg", "../thumb/ch8_1300_20090907_00_4S.jpg");
gDay[7][1] = new Array( "Day07_CH5 21:30 - English", "CH5 21:30 - English", true, "../thumb/ch5_2130_20090907_00_2S.jpg", "../thumb/ch5_2130_20090907_00_3S.jpg", "../thumb/ch5_2130_20090907_00_4S.jpg");
gDay[7][2] = new Array( "Day07_CHU 23:00 - Chinese", "CHU 23:00 - Chinese", true, "../thumb/chu_2300_20090907_00_2S.jpg", "../thumb/chu_2300_20090907_00_3S.jpg", "../thumb/chu_2300_20090907_00_4S.jpg");


function getDayData( date) {
	if( String( gDay[date]) == "undefined") return null;
	return gDay[date];
};

/*************************  News VoD Bulletin  *************************/
var gBulletinGroup = new Array();

gBulletinGroup[ "Day06_CNA 10:00 - English" ] = new Array();
gBulletinGroup[ "Day06_CNA 10:00 - English" ][0] = new Array( "Story00_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #00", "../thumb/cna_1000_20090906_00_0L.jpg", "Finance officials from twenty rich and developing countries have agreed on ways to regulate the global banking system; The details on how to rein in banking bonuses remains unclear; Divisions on bonuses remain despite G20 compromise");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][1] = new Array( "Story01_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #01", "../thumb/cna_1000_20090906_01_0L.jpg", "Two top officials in china's restive Xinjiang province have been sacked following three days of renewed ethnic violence; Fresh protests in restive Xinjiang capital; Police use tear gas to disperse Urumqi protesters");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][2] = new Array( "Story02_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #02", "../thumb/cna_1000_20090906_02_0L.jpg", "At least one hundred and ninety seven people died in Xinjiang during unrest in july; Tension returned three days ago with dozens of claims of attacks with syringe needles; At least five more people have died in the latest unrest");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][3] = new Array( "Story03_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #03", "../thumb/cna_1000_20090906_03_0L.jpg", "Fifteen dead as boat sinks in Macedonia lake; At least fifteen people are dead after a tourist boat sank in a lake in southwest Macedonia; Three more are said to be in critical condition");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][4] = new Array( "Story04_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #04", "../thumb/cna_1000_20090906_04_0L.jpg", "In the southern philippines two people were killed as a listing ferry was evacuated; Three others were injured; The coast guard says the super ferry nine issued a distress signal early this morning as it tilted in heavy seas");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][5] = new Array( "Story05_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #05", "../thumb/cna_1000_20090906_05_0L.jpg", "Ex-us soldier gets life in prison for rape murder of Iraqi girl; Consecutive life sentences for his role in the rape and murder of a fourteen year old iraq girl, and for killing three of her family members");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][6] = new Array( "Story06_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #06", "../thumb/cna_1000_20090906_06_0L.jpg", "Us general promises inquiry into nato air strike; About 90 killed as nato hits Afghan fuel trucks; Dozens of casualties as nato airstrike hits Afghan fuel trucks");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][7] = new Array( "Story07_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #07", "../thumb/cna_1000_20090906_07_0L.jpg", "No date for Afghan vote results; One of the leading candidates in afghanistan's presidential elections says the poll was so fraudulent that no more provisional results should be issued; Abdullah Abdullah has asked the country's independent election commission to stop updating t...");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][8] = new Array( "Story08_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #08", "../thumb/cna_1000_20090906_08_0L.jpg", "Photo finish in car versus plane race on Changi Airport's tarmac; An event to ramp up publicity for the Singapore Grand Prix; A sports car was pitted against a jetliner at the city state's Changi Airport");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][9] = new Array( "Story09_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #09", "../thumb/cna_1000_20090906_09_0L.jpg", "Football - World Cup; International teams continue to battle for a spot in the twenty ten World Cup in south africa; One big team in danger of missing out is portugal who only managed a draw with denmark");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][10] = new Array( "Story10_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #10", "../thumb/cna_1000_20090906_10_0L.jpg", "Tennis - us Open; Defending champion Roget Federer survives a scare to beat Lleyton Hewitt; Maria Sharapova crashes out of the tournament to seventeen year old american sensation Melanie Oudin");
gBulletinGroup[ "Day06_CNA 10:00 - English" ][11] = new Array( "Story11_Day06_CNA 10:00 - English", true, "CNA 10:00 - English", "CNA 10:00 06/09/2009 #11", "../thumb/cna_1000_20090906_11_0L.jpg", "Deaf Olympics; The twenty first summer games for the deaf Olympics kicks off today in Taiwan's capital taipei; The event will bring together some four thousand deaf athletes from over eighty countries");

gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ] = new Array();
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][0] = new Array( "Story00_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #00", "../thumb/ch8_1830_20090906_00_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][1] = new Array( "Story01_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #01", "../thumb/ch8_1830_20090906_01_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][2] = new Array( "Story02_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #02", "../thumb/ch8_1830_20090906_02_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][3] = new Array( "Story03_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #03", "../thumb/ch8_1830_20090906_03_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][4] = new Array( "Story04_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #04", "../thumb/ch8_1830_20090906_04_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][5] = new Array( "Story05_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #05", "../thumb/ch8_1830_20090906_05_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][6] = new Array( "Story06_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #06", "../thumb/ch8_1830_20090906_06_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][7] = new Array( "Story07_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #07", "../thumb/ch8_1830_20090906_07_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][8] = new Array( "Story08_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #08", "../thumb/ch8_1830_20090906_08_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][9] = new Array( "Story09_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #09", "../thumb/ch8_1830_20090906_09_0L.jpg", "");
gBulletinGroup[ "Day06_CH8 18:30 - Chinese" ][10] = new Array( "Story10_Day06_CH8 18:30 - Chinese", true, "CH8 18:30 - Chinese", "CH8 18:30 06/09/2009 #10", "../thumb/ch8_1830_20090906_10_0L.jpg", "");

gBulletinGroup[ "Day06_CH5 21:30 - English" ] = new Array();
gBulletinGroup[ "Day06_CH5 21:30 - English" ][0] = new Array( "Story00_Day06_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 06/09/2009 #00", "../thumb/ch5_2130_20090906_00_0L.jpg", "");
gBulletinGroup[ "Day06_CH5 21:30 - English" ][1] = new Array( "Story01_Day06_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 06/09/2009 #01", "../thumb/ch5_2130_20090906_01_0L.jpg", "");
gBulletinGroup[ "Day06_CH5 21:30 - English" ][2] = new Array( "Story02_Day06_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 06/09/2009 #02", "../thumb/ch5_2130_20090906_02_0L.jpg", "");
gBulletinGroup[ "Day06_CH5 21:30 - English" ][3] = new Array( "Story03_Day06_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 06/09/2009 #03", "../thumb/ch5_2130_20090906_03_0L.jpg", "");
gBulletinGroup[ "Day06_CH5 21:30 - English" ][4] = new Array( "Story04_Day06_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 06/09/2009 #04", "../thumb/ch5_2130_20090906_04_0L.jpg", "");

gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ] = new Array();
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][0] = new Array( "Story00_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #00", "../thumb/chu_2300_20090906_00_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][1] = new Array( "Story01_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #01", "../thumb/chu_2300_20090906_01_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][2] = new Array( "Story02_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #02", "../thumb/chu_2300_20090906_02_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][3] = new Array( "Story03_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #03", "../thumb/chu_2300_20090906_03_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][4] = new Array( "Story04_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #04", "../thumb/chu_2300_20090906_04_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][5] = new Array( "Story05_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #05", "../thumb/chu_2300_20090906_05_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][6] = new Array( "Story06_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #06", "../thumb/chu_2300_20090906_06_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][7] = new Array( "Story07_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #07", "../thumb/chu_2300_20090906_07_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][8] = new Array( "Story08_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #08", "../thumb/chu_2300_20090906_08_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][9] = new Array( "Story09_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #09", "../thumb/chu_2300_20090906_09_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][10] = new Array( "Story10_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #10", "../thumb/chu_2300_20090906_10_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][11] = new Array( "Story11_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #11", "../thumb/chu_2300_20090906_11_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][12] = new Array( "Story12_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #12", "../thumb/chu_2300_20090906_12_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][13] = new Array( "Story13_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #13", "../thumb/chu_2300_20090906_13_0L.jpg", "");
gBulletinGroup[ "Day06_CHU 23:00 - Chinese" ][14] = new Array( "Story14_Day06_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 06/09/2009 #14", "../thumb/chu_2300_20090906_14_0L.jpg", "");

gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ] = new Array();
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][0] = new Array( "Story00_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #00", "../thumb/ch8_1300_20090907_00_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][1] = new Array( "Story01_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #01", "../thumb/ch8_1300_20090907_01_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][2] = new Array( "Story02_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #02", "../thumb/ch8_1300_20090907_02_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][3] = new Array( "Story03_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #03", "../thumb/ch8_1300_20090907_03_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][4] = new Array( "Story04_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #04", "../thumb/ch8_1300_20090907_04_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][5] = new Array( "Story05_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #05", "../thumb/ch8_1300_20090907_05_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][6] = new Array( "Story06_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #06", "../thumb/ch8_1300_20090907_06_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][7] = new Array( "Story07_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #07", "../thumb/ch8_1300_20090907_07_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][8] = new Array( "Story08_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #08", "../thumb/ch8_1300_20090907_08_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][9] = new Array( "Story09_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #09", "../thumb/ch8_1300_20090907_09_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][10] = new Array( "Story10_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #10", "../thumb/ch8_1300_20090907_10_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][11] = new Array( "Story11_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #11", "../thumb/ch8_1300_20090907_11_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][12] = new Array( "Story12_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #12", "../thumb/ch8_1300_20090907_12_0L.jpg", "");
gBulletinGroup[ "Day07_CH8 13:00 - Chinese" ][13] = new Array( "Story13_Day07_CH8 13:00 - Chinese", true, "CH8 13:00 - Chinese", "CH8 13:00 07/09/2009 #13", "../thumb/ch8_1300_20090907_13_0L.jpg", "");

gBulletinGroup[ "Day07_CH5 21:30 - English" ] = new Array();
gBulletinGroup[ "Day07_CH5 21:30 - English" ][0] = new Array( "Story00_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #00", "../thumb/ch5_2130_20090907_00_0L.jpg", "Gems: Go the Extra Mile for Service Movement; Three giants of Singapore's service sector are taking the lead to put an extra shine on the next phase of gems; It has been four years since gems was launched in Singapore");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][1] = new Array( "Story01_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #01", "../thumb/ch5_2130_20090907_01_0L.jpg", "Changi motorsports hub bidders reveal proposals; A first peek at what Singapore's first permanent motor-racing track might look like; Three bidders for the Changi Motorsports Hub put forward their proposals today");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][2] = new Array( "Story02_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #02", "../thumb/ch5_2130_20090907_02_0L.jpg", "Recruitment agencies say outlook is picking up; More companies hiring in the past month");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][3] = new Array( "Story03_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #03", "../thumb/ch5_2130_20090907_03_0L.jpg", "Taiwan premier quits over Typhoon Morakot; Taiwan's premier has quit over the government's handling of last month's deadly typhoon");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][4] = new Array( "Story04_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #04", "../thumb/ch5_2130_20090907_04_0L.jpg", "Hong Kong police investigate acid attack that injured 11; Attack in shopping district of Mongkok last night");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][5] = new Array( "Story05_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #05", "../thumb/ch5_2130_20090907_05_0L.jpg", "Woman in Sudan fined us$200 for wearing trousers in public; Sentence in high-profile case handed down this evening");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][6] = new Array( "Story06_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #06", "../thumb/ch5_2130_20090907_06_0L.jpg", "Petrol price down by six cents; More households using eco-friendly appliances");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][7] = new Array( "Story07_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #07", "../thumb/ch5_2130_20090907_07_0L.jpg", "Drop in number of people who burn incense paper indiscriminately; Town councils are reporting a 10% drop in the number of cases of incense paper being burned indiscriminately");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][8] = new Array( "Story08_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #08", "../thumb/ch5_2130_20090907_08_0L.jpg", "Atic makes offer for Singapore's Chartered Semiconductor; Deal valued at around $5.6 billion");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][9] = new Array( "Story09_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #09", "../thumb/ch5_2130_20090907_09_0L.jpg", "Pan Hong's property pre-sales up 8.7% in August; Proposes warrant issue");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][10] = new Array( "Story10_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #10", "../thumb/ch5_2130_20090907_10_0L.jpg", "Indonesia facing deepening health crisis after last Wednesday's earthquake in West Java; Thousands of survivors have fallen ill");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][11] = new Array( "Story11_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #11", "../thumb/ch5_2130_20090907_11_0L.jpg", "Tennis - us open; Clijsters stuns Venus, Serena awaits at us Open; Nadal injury worry");
gBulletinGroup[ "Day07_CH5 21:30 - English" ][12] = new Array( "Story12_Day07_CH5 21:30 - English", true, "CH5 21:30 - English", "CH5 21:30 07/09/2009 #12", "../thumb/ch5_2130_20090907_12_0L.jpg", "McDonald's trademark battle with McCurry in Malaysia; Malaysia's highest court to decide tomorrow");

gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ] = new Array();
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][0] = new Array( "Story00_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #00", "../thumb/chu_2300_20090907_00_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][1] = new Array( "Story01_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #01", "../thumb/chu_2300_20090907_01_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][2] = new Array( "Story02_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #02", "../thumb/chu_2300_20090907_02_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][3] = new Array( "Story03_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #03", "../thumb/chu_2300_20090907_03_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][4] = new Array( "Story04_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #04", "../thumb/chu_2300_20090907_04_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][5] = new Array( "Story05_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #05", "../thumb/chu_2300_20090907_05_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][6] = new Array( "Story06_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #06", "../thumb/chu_2300_20090907_06_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][7] = new Array( "Story07_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #07", "../thumb/chu_2300_20090907_07_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][8] = new Array( "Story08_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #08", "../thumb/chu_2300_20090907_08_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][9] = new Array( "Story09_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #09", "../thumb/chu_2300_20090907_09_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][10] = new Array( "Story10_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #10", "../thumb/chu_2300_20090907_10_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][11] = new Array( "Story11_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #11", "../thumb/chu_2300_20090907_11_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][12] = new Array( "Story12_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #12", "../thumb/chu_2300_20090907_12_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][13] = new Array( "Story13_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #13", "../thumb/chu_2300_20090907_13_0L.jpg", "");
gBulletinGroup[ "Day07_CHU 23:00 - Chinese" ][14] = new Array( "Story14_Day07_CHU 23:00 - Chinese", true, "CHU 23:00 - Chinese", "CHU 23:00 07/09/2009 #14", "../thumb/chu_2300_20090907_14_0L.jpg", "");


function getBulletin( grid) {
	if( String( gBulletinGroup[grid]) == "undefined") return null;
	return gBulletinGroup[grid];
};

/*************************  Hot News Search  *************************/
var gHotNewsButtonInfo = new Array(
	new Array( "H1N1", true, "play.bml", "Story07_Recom_H1N1", "Hot News Search: H1N1"),
	new Array( "Formula 1", true, "play.bml", "Story04_Recom_Formula1", "Hot News Search: Formula 1"),
	new Array( "Earthquake", false, "play.bml", "xxxxxxxx", "Hot News Search: Earthquake"),
	new Array( "(HD) 18 Grams of Love", true, "play.bml", "Story00_Recom_Trailer", "Hot News Search: HD Content: MDA Trailer"),
	new Array( "(HD) Pianist", true, "play.bml", "Story01_Recom_Trailer", "Hot News Search: Full HD Content: Pianist"),
	//new Array( "(HD) CH5", true, "play.bml", "Story00_Recom_HD(CH5)", "Hot News Search: HD(CH5)"),
	
	new Array( "H1N1", true, "result.bml", "Recom_H1N1", "Recommended Recent Topics: H1N1"),
	new Array( "Formula 1", true, "result.bml", "Recom_Formula1", "Recommended Recent Topics: Formula 1"),
	new Array( "Tennis", true, "result.bml", "Recom_Tennis", "Recommended Recent Topics: Tennis"),
	new Array( "Football", true, "result.bml", "Recom_Football", "Recommended Recent Topics: Football"),
	new Array( "HD(CH5)", true, "result.bml", "Recom_HD(CH5)", "Recommended Recent Topics: HD(CH5)"),
	new Array( "", false, "", "", "input"),
	new Array( "", false, "", "", "input")
);

/*************************  VoD Search Result  *************************/
var gResultGroup = new Array();

gResultGroup[ "Recom_H1N1" ] = new Array();
gResultGroup[ "Recom_H1N1" ][0] = new Array( "Story00_Recom_H1N1", true, "H1N1", "CNA 22:00 28/05/2009 #02", "../thumb/cna_2200_20090528_02_0L.jpg", "Singaporeans concerned but calm as H1N1 virus arrives on country's shores; Singapore's first H1N1 patient is an smu student; Singapore confirms first case of H1N1");
gResultGroup[ "Recom_H1N1" ][1] = new Array( "Story01_Recom_H1N1", true, "H1N1", "CH5 21:30 29/05/2009 #01", "../thumb/ch5_2130_20090529_01_0L.jpg", "Flu outbreak; No difference in symptoms of H1N1 flu and seasonal flu; Simple throat and nasal swab test to tell the difference");
gResultGroup[ "Recom_H1N1" ][2] = new Array( "Story02_Recom_H1N1", true, "H1N1", "CNA 19:00 14/07/2009 #01", "../thumb/cna_1900_20090714_01_0L.jpg", "Who casts doubts on speedy H1N1 flu vaccinations; The chief of the world health organization Magaret Chan has expressed fear that poverty will prevent some countries from gaining access to vaccines for the H1N1flu; The battle plan is now to give all nations access to the vaccines");
gResultGroup[ "Recom_H1N1" ][3] = new Array( "Story03_Recom_H1N1", true, "H1N1", "CNA 10:00 15/07/2009 #00", "../thumb/cna_1000_20090715_00_0L.jpg", "The World health organization warns that a fully licensed H1N1 vaccine will not be available until the end of the year; This means that will not be a significant amount of vaccines in the market; This will impact many countries vaccination plans");
gResultGroup[ "Recom_H1N1" ][4] = new Array( "Story04_Recom_H1N1", true, "H1N1", "CNA 20:00 16/07/2009 #03", "../thumb/cna_2000_20090716_03_0L.jpg", "Hong kong is investigating its first possible human death from the H1N1 flu; The victim is a forty two year old man who was initially thought to have died last week from another drug resistant bacteria; Health officials have confirmed today that the men also had the H1N1 virus");
gResultGroup[ "Recom_H1N1" ][5] = new Array( "Story05_Recom_H1N1", true, "H1N1", "CNA 15:00 17/07/2009 #08", "../thumb/cna_1500_20090717_08_0L.jpg", "In the united kingdom the government has made plans to cope with nearly a third of the population being infected with H1N1; Britain is the worst hit country in europe; In the worst case scenario the british health department warns that up to sixty three thousand people could di...");
gResultGroup[ "Recom_H1N1" ][6] = new Array( "Story06_Recom_H1N1", true, "H1N1", "CNA 22:00 03/08/2009 #01", "../thumb/cna_2200_20090803_01_0L.jpg", "Obesity puts H1N1 patients in high-risk group; Singapore's Changi general hospital says that twenty nine year old H1N1 victim who died yesterday had no other underlying conditions besides being overweight; She's believed to have a body mass index of over thirty");
gResultGroup[ "Recom_H1N1" ][7] = new Array( "Story07_Recom_H1N1", true, "H1N1", "CNA 20:00 01/09/2009 #06", "../thumb/cna_2000_20090901_06_0L.jpg", "Japanese schools also start the new term today with a warning to prepare for new H1N1 outbreaks; The virus has already claimed seven lives in japan; More that half the country's one hundred fifty thousand cases so far are among school students");
gResultGroup[ "Recom_H1N1" ][8] = new Array( "Story08_Recom_H1N1", true, "H1N1", "CH5 21:30 01/09/2009 #02", "../thumb/ch5_2130_20090901_02_0L.jpg", "Hong Kong officials warn 100 schools could be hit by H1N1; Officials expect virus to spread more rapidly; Parents confident schools can handle situation");
gResultGroup[ "Recom_H1N1" ][9] = new Array( "Story09_Recom_H1N1", true, "H1N1", "CNA 00:00 04/09/2009 #10", "../thumb/cna_0000_20090904_10_0L.jpg", "Canned bacon, sausages and canned pork; Singapore's import of one thousand pigs daily from pulau Bulan constitute some twenty percent of its total pork consumption; In the philippines doctors are trying to battle the dengue virus as it passes through entire families");

gResultGroup[ "Recom_Formula1" ] = new Array();
gResultGroup[ "Recom_Formula1" ][0] = new Array( "Story00_Recom_Formula1", true, "Formula1", "CNA 15:00 28/09/2009 #04", "../thumb/cna_1500_20090928_04_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][1] = new Array( "Story01_Recom_Formula1", true, "Formula1", "CH8 13:00 28/09/2009 #12", "../thumb/ch8_1300_20090928_12_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][2] = new Array( "Story02_Recom_Formula1", true, "Formula1", "CNA 10:00 13/05/2009 #16", "../thumb/cna_1000_20090513_16_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][3] = new Array( "Story03_Recom_Formula1", true, "Formula1", "CNA 15:00 02/02/2008 #16", "../thumb/cna_1500_20080202_16_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][4] = new Array( "Story04_Recom_Formula1", true, "Formula1", "CNA 00:00 30/07/2009 #14", "../thumb/cna_0000_20090730_14_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][5] = new Array( "Story05_Recom_Formula1", true, "Formula1", "CNA 22:00 25/04/2008 #11", "../thumb/cna_2200_20080425_11_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][6] = new Array( "Story06_Recom_Formula1", true, "Formula1", "CNA 10:00 01/09/2007 #08", "../thumb/cna_1000_20070901_08_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][7] = new Array( "Story07_Recom_Formula1", true, "Formula1", "CNA 15:00 25/10/2007 #00", "../thumb/cna_1500_20071025_00_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][8] = new Array( "Story08_Recom_Formula1", true, "Formula1", "CH5 21:30 06/04/2007 #12", "../thumb/ch5_2130_20070406_12_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][9] = new Array( "Story09_Recom_Formula1", true, "Formula1", "CH5 21:30 27/04/2008 #10", "../thumb/ch5_2130_20080427_10_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][10] = new Array( "Story10_Recom_Formula1", true, "Formula1", "CH5 21:30 09/03/2008 #04", "../thumb/ch5_2130_20080309_04_0L.jpg", "");
gResultGroup[ "Recom_Formula1" ][11] = new Array( "Story11_Recom_Formula1", true, "Formula1", "CH5 21:30 31/08/2007 #00", "../thumb/ch5_2130_20070831_00_0L.jpg", "");

gResultGroup[ "Recom_Trailer" ] = new Array();
gResultGroup[ "Recom_Trailer" ][0] = new Array( "Story00_Recom_Trailer", true, "Trailer", "18GramsofLove", "../thumb/18GramsofLove_0L.jpg", "");
gResultGroup[ "Recom_Trailer" ][1] = new Array( "Story01_Recom_Trailer", true, "Trailer", "Pianist", "../thumb/Pianist_0L.jpg", "");
gResultGroup[ "Recom_Trailer" ][2] = new Array( "Story02_Recom_Trailer", true, "Trailer", "HD5", "../thumb/Pianist_0L.jpg", "");
gResultGroup[ "Recom_Trailer" ][3] = new Array( "Story03_Recom_Trailer", true, "Trailer", "HD5a", "../thumb/Pianist_0L.jpg", "");
gResultGroup[ "Recom_Trailer" ][4] = new Array( "Story04_Recom_Trailer", true, "Trailer", "HD5b", "../thumb/Pianist_0L.jpg", "");
gResultGroup[ "Recom_Trailer" ][5] = new Array( "Story05_Recom_Trailer", true, "Trailer", "HD5c", "../thumb/Pianist_0L.jpg", "");
gResultGroup[ "Recom_Trailer" ][6] = new Array( "Story06_Recom_Trailer", true, "Trailer", "HD5d", "../thumb/Pianist_0L.jpg", "");
gResultGroup[ "Recom_Trailer" ][7] = new Array( "Story07_Recom_Trailer", true, "Trailer", "HD5e", "../thumb/Pianist_0L.jpg", "");
gResultGroup[ "Recom_Trailer" ][8] = new Array( "Story08_Recom_Trailer", true, "Trailer", "HD5f", "../thumb/Pianist_0L.jpg", "");

gResultGroup[ "Recom_Football" ] = new Array();
gResultGroup[ "Recom_Football" ][0] = new Array( "Story00_Recom_Football", true, "Football", "CNA 10:00 06/09/2009 #09", "../thumb/cna_1000_20090906_09_0L.jpg", "Football - World Cup; International teams continue to battle for a spot in the twenty ten World Cup in south africa; One big team in danger of missing out is portugal who only managed a draw with denmark");

gResultGroup[ "Recom_Tennis" ] = new Array();
gResultGroup[ "Recom_Tennis" ][0] = new Array( "Story00_Recom_Tennis", true, "Tennis", "CNA 10:00 06/09/2009 #10", "../thumb/cna_1000_20090906_10_0L.jpg", "Tennis - us Open; Defending champion Roget Federer survives a scare to beat Lleyton Hewitt; Maria Sharapova crashes out of the tournament to seventeen year old american sensation Melanie Oudin");
gResultGroup[ "Recom_Tennis" ][1] = new Array( "Story01_Recom_Tennis", true, "Tennis", "CH5 21:30 07/09/2009 #11", "../thumb/ch5_2130_20090907_11_0L.jpg", "Tennis - us open; Clijsters stuns Venus, Serena awaits at us Open; Nadal injury worry");

gResultGroup[ "Recom_HD(CH5)" ] = new Array();
gResultGroup[ "Recom_HD(CH5)" ][0] = new Array( "Story00_Recom_HD(CH5)", true, "HD(CH5)", "digi_hd5_2130_###", "../thumb/cna_1000_20090906_10_0L.jpg", "HD5 - us Open; Defending champion Roget Federer survives a scare to beat Lleyton Hewitt; Maria Sharapova crashes out of the tournament to seventeen year old american sensation Melanie Oudin");
gResultGroup[ "Recom_HD(CH5)" ][1] = new Array( "Story01_Recom_HD(CH5)", true, "HD(CH5)", "digi_hd5_2130_###ar48000ab256aacmp4atry", "../thumb/ch5_2130_20090907_11_0L.jpg", "HD5a - us open; Clijsters stuns Venus, Serena awaits at us Open; Nadal injury worry");
gResultGroup[ "Recom_HD(CH5)" ][2] = new Array( "Story02_Recom_HD(CH5)", true, "HD(CH5)", "digi_hd5_2130_###44100442try", "../thumb/cna_1000_20090906_10_0L.jpg", "HD5c - us Open; Defending champion Roget Federer survives a scare to beat Lleyton Hewitt; Maria Sharapova crashes out of the tournament to seventeen year old american sensation Melanie Oudin");
gResultGroup[ "Recom_HD(CH5)" ][3] = new Array( "Story03_Recom_HD(CH5)", true, "HD(CH5)", "digi_hd5_2130_###ar64000ab234try", "../thumb/ch5_2130_20090907_11_0L.jpg", "HD5d - us open; Clijsters stuns Venus, Serena awaits at us Open; Nadal injury worry");
gResultGroup[ "Recom_HD(CH5)" ][4] = new Array( "Story04_Recom_HD(CH5)", true, "HD(CH5)", "digi_hd5_2130_###20091910shorter", "../thumb/ch5_2130_20090907_11_0L.jpg", "HD5e - us open; Clijsters stuns Venus, Serena awaits at us Open; Nadal injury worry");
gResultGroup[ "Recom_HD(CH5)" ][5] = new Array( "Story05_Recom_HD(CH5)", true, "HD(CH5)", "digi_hd5_2130_###20091910b_cut", "../thumb/ch5_2130_20090907_11_0L.jpg", "HD5f - us open; Clijsters stuns Venus, Serena awaits at us Open; Nadal injury worry");
gResultGroup[ "Recom_HD(CH5)" ][6] = new Array( "Story06_Recom_HD(CH5)", true, "HD(CH5)", "digi_hd5_2130_###20091910c_cut", "../thumb/ch5_2130_20090907_11_0L.jpg", "HD5g - us open; Clijsters stuns Venus, Serena awaits at us Open; Nadal injury worry");

function getResult( grid) {
	if( String( gResultGroup[grid]) == "undefined") return null;
	return gResultGroup[grid];
};

/*************************  Play  *************************/
var gContentsList = new Array();
var gAlertCrid = "Content_00g090mas3";

gContentsList[ "Story00_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyxf1xc", "../thumb/cna_1000_20090906_01_2S.jpg", "Story01_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_02_2S.jpg", "Story02_Day06_CNA 10:00 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyxdz9h", "../thumb/cna_1000_20090906_03_2S.jpg", "Story03_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_04_2S.jpg", "Story04_Day06_CNA 10:00 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story02_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #02", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyxddd8", "../thumb/cna_1000_20090906_05_2S.jpg", "Story05_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_06_2S.jpg", "Story06_Day06_CNA 10:00 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story03_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #03", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyxcn8g", "../thumb/cna_1000_20090906_07_2S.jpg", "Story07_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_08_2S.jpg", "Story08_Day06_CNA 10:00 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story04_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #04", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyxbhrf", "../thumb/cna_1000_20090906_09_2S.jpg", "Story09_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_10_2S.jpg", "Story10_Day06_CNA 10:00 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story05_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #05", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyxakoj", "../thumb/cna_1000_20090906_11_2S.jpg", "Story11_Day06_CNA 10:00 - English", "../thumb/ch8_1830_20090906_00_2S.jpg", "Story00_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story06_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #06", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyx9sin", "../thumb/ch8_1830_20090906_01_2S.jpg", "Story01_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_02_2S.jpg", "Story02_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story07_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #07", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyx8tia", "../thumb/ch8_1830_20090906_03_2S.jpg", "Story03_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_04_2S.jpg", "Story04_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story08_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #08", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyx7ykf", "../thumb/ch8_1830_20090906_05_2S.jpg", "Story05_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_06_2S.jpg", "Story06_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story09_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #09", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyx79v7", "../thumb/ch8_1830_20090906_07_2S.jpg", "Story07_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_08_2S.jpg", "Story08_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story10_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #10", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyx68h9", "../thumb/ch8_1830_20090906_09_2S.jpg", "Story09_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_10_2S.jpg", "Story10_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story11_Day06_CNA 10:00 - English" ] = new Array( "CNA 10:00 06/09/2009 #11", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyxfvfb", "../thumb/ch5_2130_20090906_00_2S.jpg", "Story00_Day06_CH5 21:30 - English", "../thumb/ch5_2130_20090906_01_2S.jpg", "Story01_Day06_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story00_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emhg80", "../thumb/ch5_2130_20090906_02_2S.jpg", "Story02_Day06_CH5 21:30 - English", "../thumb/ch5_2130_20090906_03_2S.jpg", "Story03_Day06_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emh14b", "../thumb/ch5_2130_20090906_04_2S.jpg", "Story04_Day06_CH5 21:30 - English", "../thumb/chu_2300_20090906_00_2S.jpg", "Story00_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story02_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #02", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emglr2", "../thumb/chu_2300_20090906_01_2S.jpg", "Story01_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_02_2S.jpg", "Story02_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story03_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #03", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emg69j", "../thumb/chu_2300_20090906_03_2S.jpg", "Story03_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_04_2S.jpg", "Story04_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story04_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #04", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emfs5e", "../thumb/chu_2300_20090906_05_2S.jpg", "Story05_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_06_2S.jpg", "Story06_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story05_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #05", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emf96m", "../thumb/chu_2300_20090906_07_2S.jpg", "Story07_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_08_2S.jpg", "Story08_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story06_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #06", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emev45", "../thumb/chu_2300_20090906_09_2S.jpg", "Story09_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_10_2S.jpg", "Story10_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story07_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #07", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emegc2", "../thumb/chu_2300_20090906_11_2S.jpg", "Story11_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_12_2S.jpg", "Story12_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story08_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #08", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emdq06", "../thumb/chu_2300_20090906_13_2S.jpg", "Story13_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_14_2S.jpg", "Story14_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story09_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #09", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0em9fjz", "../thumb/ch8_1300_20090907_00_2S.jpg", "Story00_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_01_2S.jpg", "Story01_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story10_Day06_CH8 18:30 - Chinese" ] = new Array( "CH8 18:30 06/09/2009 #10", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0em8yey", "../thumb/ch8_1300_20090907_02_2S.jpg", "Story02_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_03_2S.jpg", "Story03_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story00_Day06_CH5 21:30 - English" ] = new Array( "CH5 21:30 06/09/2009 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090n84a", "../thumb/ch8_1300_20090907_04_2S.jpg", "Story04_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_05_2S.jpg", "Story05_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Day06_CH5 21:30 - English" ] = new Array( "CH5 21:30 06/09/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090of18", "../thumb/ch8_1300_20090907_06_2S.jpg", "Story06_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_07_2S.jpg", "Story07_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story02_Day06_CH5 21:30 - English" ] = new Array( "CH5 21:30 06/09/2009 #02", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090ozd3", "../thumb/ch8_1300_20090907_08_2S.jpg", "Story08_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_09_2S.jpg", "Story09_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story03_Day06_CH5 21:30 - English" ] = new Array( "CH5 21:30 06/09/2009 #03", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090pewg", "../thumb/ch8_1300_20090907_10_2S.jpg", "Story10_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_11_2S.jpg", "Story11_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story04_Day06_CH5 21:30 - English" ] = new Array( "CH5 21:30 06/09/2009 #04", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090pudm", "../thumb/ch8_1300_20090907_12_2S.jpg", "Story12_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_13_2S.jpg", "Story13_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story00_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090qrz9", "../thumb/ch5_2130_20090907_00_2S.jpg", "Story00_Day07_CH5 21:30 - English", "../thumb/ch5_2130_20090907_01_2S.jpg", "Story01_Day07_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090rbs0", "../thumb/ch5_2130_20090907_02_2S.jpg", "Story02_Day07_CH5 21:30 - English", "../thumb/ch5_2130_20090907_03_2S.jpg", "Story03_Day07_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story02_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #02", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090ruku", "../thumb/ch5_2130_20090907_04_2S.jpg", "Story04_Day07_CH5 21:30 - English", "../thumb/ch5_2130_20090907_05_2S.jpg", "Story05_Day07_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story03_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #03", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090s872", "../thumb/ch5_2130_20090907_06_2S.jpg", "Story06_Day07_CH5 21:30 - English", "../thumb/ch5_2130_20090907_07_2S.jpg", "Story07_Day07_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story04_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #04", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090slnv", "../thumb/ch5_2130_20090907_08_2S.jpg", "Story08_Day07_CH5 21:30 - English", "../thumb/ch5_2130_20090907_09_2S.jpg", "Story09_Day07_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story05_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #05", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090t2ii", "../thumb/ch5_2130_20090907_10_2S.jpg", "Story10_Day07_CH5 21:30 - English", "../thumb/ch5_2130_20090907_11_2S.jpg", "Story11_Day07_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story06_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #06", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090tgll", "../thumb/ch5_2130_20090907_12_2S.jpg", "Story12_Day07_CH5 21:30 - English", "../thumb/chu_2300_20090907_00_2S.jpg", "Story00_Day07_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story07_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #07", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0anbscy", "../thumb/chu_2300_20090907_01_2S.jpg", "Story01_Day07_CHU 23:00 - Chinese", "../thumb/chu_2300_20090907_02_2S.jpg", "Story02_Day07_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story08_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #08", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0ancd4u", "../thumb/chu_2300_20090907_03_2S.jpg", "Story03_Day07_CHU 23:00 - Chinese", "../thumb/chu_2300_20090907_04_2S.jpg", "Story04_Day07_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story09_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #09", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0ancrm6", "../thumb/chu_2300_20090907_06_2S.jpg", "Story06_Day07_CHU 23:00 - Chinese", "../thumb/chu_2300_20090907_07_2S.jpg", "Story07_Day07_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story10_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #10", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0and459", "../thumb/chu_2300_20090907_08_2S.jpg", "Story08_Day07_CHU 23:00 - Chinese", "../thumb/chu_2300_20090907_09_2S.jpg", "Story09_Day07_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story11_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #11", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0andhkg", "../thumb/chu_2300_20090907_10_2S.jpg", "Story10_Day07_CHU 23:00 - Chinese", "../thumb/chu_2300_20090907_11_2S.jpg", "Story11_Day07_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story12_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #12", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0andutn", "../thumb/chu_2300_20090907_12_2S.jpg", "Story12_Day07_CHU 23:00 - Chinese", "../thumb/chu_2300_20090907_13_2S.jpg", "Story13_Day07_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story13_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #13", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0ane8dr", "../thumb/chu_2300_20090907_14_2S.jpg", "Story14_Day07_CHU 23:00 - Chinese", "../thumb/cna_2200_20090528_02_2S.jpg", "Story00_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story14_Day06_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 06/09/2009 #14", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0anejxk", "../thumb/ch5_2130_20090529_01_2S.jpg", "Story01_Recom_H1N1", "../thumb/cna_1900_20090714_01_2S.jpg", "Story02_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story00_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0eltdbe", "../thumb/cna_1000_20090715_00_2S.jpg", "Story03_Recom_H1N1", "../thumb/cna_2000_20090716_03_2S.jpg", "Story04_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elsxpf", "../thumb/cna_1500_20090717_08_2S.jpg", "Story05_Recom_H1N1", "../thumb/cna_2200_20090803_01_2S.jpg", "Story06_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story02_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #02", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elsis6", "../thumb/cna_2000_20090901_06_2S.jpg", "Story07_Recom_H1N1", "../thumb/ch5_2130_20090901_02_2S.jpg", "Story08_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story03_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #03", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0els2si", "../thumb/cna_0000_20090904_10_2S.jpg", "Story09_Recom_H1N1", "../thumb/cna_1500_20090928_04_2S.jpg", "Story00_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story04_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #04", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elrpti", "../thumb/ch8_1300_20090928_12_2S.jpg", "Story01_Recom_Formula1", "../thumb/cna_1000_20090513_16_2S.jpg", "Story02_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story05_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #05", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elrcuj", "../thumb/cna_1500_20080202_16_2S.jpg", "Story03_Recom_Formula1", "../thumb/cna_0000_20090730_14_2S.jpg", "Story04_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story06_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #06", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elqz6i", "../thumb/cna_2200_20080425_11_2S.jpg", "Story05_Recom_Formula1", "../thumb/cna_1000_20070901_08_2S.jpg", "Story06_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story07_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #07", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elqf9z", "../thumb/cna_1500_20071025_00_2S.jpg", "Story07_Recom_Formula1", "../thumb/ch5_2130_20070406_12_2S.jpg", "Story08_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story08_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #08", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elq2th", "../thumb/ch5_2130_20080427_10_2S.jpg", "Story09_Recom_Formula1", "../thumb/ch5_2130_20080309_04_2S.jpg", "Story10_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story09_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #09", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elpp1b", "../thumb/ch5_2130_20070831_00_2S.jpg", "Story11_Recom_Formula1", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );
gContentsList[ "Story10_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #10", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elpafl", "../thumb/cna_1000_20090906_10_2S.jpg", "Story00_Recom_Tennis", "../thumb/ch5_2130_20090907_11_2S.jpg", "Story01_Recom_Tennis", 100, 16, new Array( "                                   ") );
gContentsList[ "Story11_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #11", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0elor15", "../thumb/cna_1000_20090906_00_2S.jpg", "Story00_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_01_2S.jpg", "Story01_Day06_CNA 10:00 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story12_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #12", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0eloav8", "../thumb/cna_1000_20090906_02_2S.jpg", "Story02_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_03_2S.jpg", "Story03_Day06_CNA 10:00 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story13_Day07_CH8 13:00 - Chinese" ] = new Array( "CH8 13:00 07/09/2009 #13", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0eljz6q", "../thumb/cna_1000_20090906_04_2S.jpg", "Story04_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_05_2S.jpg", "Story05_Day06_CNA 10:00 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story00_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywhtib", "../thumb/cna_1000_20090906_06_2S.jpg", "Story06_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_07_2S.jpg", "Story07_Day06_CNA 10:00 - English", 100, 16, new Array( "",
"                         ",
" ... ",
"Tiga orang gergasi  sektor perkhidmatan Singapura sedang ambil  plumbum",
" ... ",
"Meletakkan suatu lebihan bersinar di atas  fasa  BATU PERMATA yang berikut.",
" ... ",
"Itu adalah  Percubaan  Lebih Batu untuk gerakan Perkhidmatan.",
" ... ",
"Sejak BATU PERMATA dilancarkan di Singapura telah  empat tahun.",
" ... ",
"Dan sejak itu, beberapa 170,000 orang pekerja telah belajar  kepentingan untuk pergi yang batu lebih",
" ... ",
"Menyimpan pelanggan-pelanggan mereka mari.",
" ... ",
"Tetapi sebagai  maraton sejagat demi mencapai keunggulan perkhidmatan menjadi lebih liat, itu adalah masa di atas piawai",
" ... ",
"Supaya  industri perkhidmatan juga dapat menjadi lebih murah, sebaiknya dan lebih cepat.",
" ... ",
"Tiga buah ikon besar di Singapura sedang ambil  plumbum memperbaiki peringkat perkhidmatan mereka",
" ... ",
"Dan menyediakan piawai untuk pertubuhan lain di  negara.",
" ... ",
"Lapangan Terbang Changi sedang mencipta  Kelas Changi mengalami,",
" ... ",
"Supaya pengembara dapat menikmati tanpa berkelim dan efisien perkhidmatan di setiap takat,",
" ... ",
"Semasa Sentosa hendak menjadi taman permainan kegemaran Asia.",
" ... ",
"Kami akan memandu ini dengan sebuah kempen baru perkhidmatan yang GELOMBANG dipanggil.",
" ... ",
"Ia merupakan singkatan untuk Dialukan, Meyakinkan, Menilai dan Bertenaga.",
" ... ",
"Dan ini  benar-benar daripada  perspektif tamu itu.",
" ... ",
"Di Dusun ION, kakitangan akan digalakkan ambil hak milik dalam menyampaikan perkhidmatan baik.",
" ... ",
"Semua kakitangan kita menembusi program ini dan semua penyewa kita menembusi  program",
" ... ",
"Dan ia  wajib. Kami semua percaya yang hanya apabila kami berkongsi suatu pesanan pusat",
" ... ",
"Dan tin terlatih yang pusat kami menyampaikan seperingkat berbeza perkhidmatan.",
" ... ",
"Tiga buah organisasi membawa sekitar 800 pertubuhan dan beberapa 18,500 orang pekerja bersama.",
" ... ",
"Kami mesti amat menyukai untuk sekurang-kurangnya suatu 1% kemajuan pada tahun 100%  syarikat perniagaan,",
" ... ",
"Untuk  perkhidmatan dan  anggota  rakyat itu. Bukan 1% setiap tahun, tetapi 1% setiap hari.",
" ... ",
"Dan di sepanjang  cara, kami harus menjaga mengukur,",
" ... ",
"Jejakan dan kebaikan keseluruhan kita berkhidmat piawai.",
" ... ",
"Semua ini untuk membuat industri perkhidmatan Singapura secara global bersaingan,",
" ... ",
"Dan membeli-belah atau khas lebihan pengalaman makanan itu.",
" ... ",
"                         ",
"") );
gContentsList[ "Story01_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywjzum", "../thumb/cna_1000_20090906_08_2S.jpg", "Story08_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_09_2S.jpg", "Story09_Day06_CNA 10:00 - English", 100, 16, new Array( "",
"                         ",
" ... ",
"Berikut -suatu pelihatan pertama di apa",
" ... ",
"Jejakan lumba-motor yang terlebih dahulu kekal Singapura mungkin menyerupai!",
" ... ",
"Tiga orang pembuat tawaran untuk  Motorsports Hub Changi mengetengahkan cadangan mereka hari ini.",
" ... ",
"Membawa  MOTOR GP-  F1  motor - ke Singapura.",
" ... ",
"Itu adalah suatu cadangan konsortium Agro Agriculture Singapura itu",
" ... ",
"Untuk projek Antarabangsa Perlumbaan Motorsikal Changi mereka.",
" ... ",
"Konsortium itu berkata bahawa ia telah menyelamatkan ini dan peristiwa lain selama lima tahun.",
" ... ",
"Jejakan 4.4 kilometer tidak dapat menganjurkan  F1, tetapi rancangan berkata bahawa ia dapat diperluaskan untuk membuat sedemikian.",
" ... ",
"Projek mungkin berharga $250 juta ke $300 juta.",
" ... ",
"Sebelah dana, kami pada masa ini berada tetap di dalam  proses,",
" ... ",
"Tetapi nya kebanyakan akan datang daripada Syarikat Induk Sulit SAA yang Terhad.",
" ... ",
"Tanggungan perniagaan adalah tujah utama  tawaran itu daripada Sukan Khidmat,",
" ... ",
"Suatu subsidiari Haw Par.",
" ... ",
"Rancangan Kelab Mewah Motorsportsnya, dengan beberapa 3,000 yang membayar anggota,",
" ... ",
"Akan melihat mereka menikmati faedah di sebalik memintal di sekitar jejakan.",
" ... ",
"Salah satu  ciri penting adalah  adat mengikat perjanjian kawasan,",
" ... ",
"Di mana  hak untuk memohon untuk suatu penyimpanan akan diberi kepada anggota angkasa,",
" ... ",
"Meletakkan kereta angkasa untuk kenderaan wajip-bukan-gaji.",
" ... ",
"$200 juta jejakannya akan melihat bangsa seperti V8 Australia dan GT Jepun.",
" ... ",
"Pembuat tawaran, SG Changi, ke-tiga itu disokong oleh niat Jepun pelaburan untuk membuat Singapura",
" ... ",
"Pusat Asia Tenggara untuk permulaan kereta mereka.",
" ... ",
"Setiap tahun, jualan kereta baru menjatuhkan lebih kurang 5% di dalam jualan ke  pasaran Jepun.",
" ... ",
"Kami sedang melihat di Asia Tenggara, memperkembangkan Singapura, Malaysia, Thailand",
" ... ",
"Dan di sekitar Indonesia. Kami melihat suatu pertumbuhan yang sangat kuat untuk  perusahaan automobil.",
" ... ",
"$280 juta jejakannya tidak dapat menganjurkan  Moto Gp,",
" ... ",
"Tetapi dapat beroperasi sebagai dua jejakan berasingan dengan dua buah bangunan lubang.",
" ... ",
"Mereka merancang membawa masuk GT Jepun dan bangsa Nippon Formula tersebut,",
" ... ",
"Bersama-sama dengan  gula-gula-mata berlumba permaisuri.",
" ... ",
"Juga merancang, sebuah hotel bilik 120 untuk  kemudahan  kipas dan pemandu.",
" ... ",
"Tiga buah tawaran sekarang akan ditaksir oleh  Majlis Sukan Negara,",
" ... ",
"Bersama dengan perwakilan lain pemerintah dan  pakar runding projek.",
" ... ",
"Dan tawaran menang itu akan diumumkan suku daripada 2010 yang oleh pertama.",
" ... ",
"Di antara  kriterion penilaian -",
" ... ",
"Meletakkan Singapura sebagai sebuah motor antarabangsa memperagakan pusat,",
" ... ",
"Dan  kewangan dan tanggungan projek perniagaan.",
" ... ",
"                         ",
"") );
gContentsList[ "Story02_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #02", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywli2e", "../thumb/cna_1000_20090906_10_2S.jpg", "Story10_Day06_CNA 10:00 - English", "../thumb/cna_1000_20090906_11_2S.jpg", "Story11_Day06_CNA 10:00 - English", 100, 16, new Array( "",
"                         ",
" ... ",
"Beberapa cahaya di hujung terowong di hadapan pekerjaan.",
" ... ",
"Perwakilan perekrutan berkata bahawa pandangan sedang ambil,",
" ... ",
"Dengan lebih banyak syarikat yang disewa di dalam bulan lalu.",
" ... ",
"Pandangan pekerjaan tahun ini adalah apa-apa pun untuk menjerit.",
" ... ",
"Dengan menyebabkan kekosongan pekerjaan kecut, penghentian kerja dan gaji memotong,",
" ... ",
"Banyak sekarang sedang harap mendapat berita yang lebih baik pada YEAR END.",
" ... ",
"Dan membawa yang berita baik adalah perwakilan perekrutan.",
" ... ",
"Mereka kata yang mana bait daripada menaikkan mereka kepala syarikat mengira,",
" ... ",
"Sedang mula membuat sedemikian sekarang.",
" ... ",
"Dan pemain industri penting sikap optimis tentang prospek",
" ... ",
"Di dalam kewangan dan sektor insurans. Tetapi mereka kekal waspada",
" ... ",
"Tentang prospek untuk industri penghasilan dan jualan runcit.",
" ... ",
"Perwakilan itu juga waspada ketika ia sampai ke meramal",
" ... ",
"Jika  pandangan semasa berada di sini untuk tinggal.",
" ... ",
"Saya mempunyai ragu-ragu saya. Secara tradisional, bila ia sampai ke aktiviti YEAR END untuk sewaan,",
" ... ",
"Banyak syarikat sudah akan mengeringkan anggaran belanjawan perekrutan mereka",
" ... ",
"Dan anda akan melihat suatu perlahan di activites perekrutan.",
" ... ",
"Maka soalan juta-dolar di dalam fikiran saya adalah, berapa lama ini dapat menjadi dapat dikekal.",
" ... ",
"Mungkin terdapat berita baik untuk pekerja yang ingin tahu tentang kenaikan gaji dan ganjaran.",
" ... ",
"Kali ini, syarikat itu  sekurang-kurangnya ingin tahu di dalam cuba mendapat lain bagaimana syarikat",
" ... ",
"Sedang membuat dan apa saya haruskah membuat tentangnya, maka ia bukan  semasa ditutup sepertimana ia  lebih awal",
" ... ",
"Di dalam tahan beberapa bulan di mana, rata keluar, syarikat tidak memberi kenaikan",
" ... ",
"Dan tidak memberi ganjaran. Sekurang-kurangnya mereka hendak mendapat sekarang.",
" ... ",
"Maka semasa pandangan pekerjaan boleh melihat berjanji di bawah mikroskop buat masa kini,",
" ... ",
"Gambar besar tetap kekal tidak jelas.",
" ... ",
"                         ",
"") );
gContentsList[ "Story03_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #03", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywmcs7", "../thumb/ch8_1830_20090906_00_2S.jpg", "Story00_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_01_2S.jpg", "Story01_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "",
"                         ",
" ... ",
"Perdana menteri Taiwan harus berhenti di atas pemegang pemerintah",
" ... ",
"Untuk bulan lalu'S taufan maut.",
" ... ",
"Chao-Shiuan Liu membuat pengumuman kejutan",
" ... ",
"Di suatu persidangan di atur dengan tergopoh-gapah media.",
" ... ",
"Dia berkata bahawa orang harus ambil tanggung jawab politik untuk mala petaka.",
" ... ",
"Dia bertambah yang dia kain felt \"misi\" sendirinya akan lewat,",
" ... ",
"Sebagai 90% daripada mangsa taufan telah menerima bayaran tempat perlindungan dan kelegaan.",
" ... ",
"Perdana menteri baru itu telah dinamakan.",
" ... ",
"Dia adalah Tuntut-Yi Wu, setiausaha utama Warga Jamu berpengaruh itu.",
" ... ",
"Seluruh Kabinet juga rasmi akan meletak jawatan pada Hari Khamis, membuka jalan untuk suatu rombakan.",
" ... ",
"Typhoon Morakot dan akibatnya adalah krisis paling buruk politik",
" ... ",
"Memukul Ma Ying - Jeou Adminstration sejak ia ambil kuasa tahun lalu.",
" ... ",
"Dijangka anggota berpangkat tinggi Kabinet En. Ma mesti berhenti.",
" ... ",
"Walau bagaimanapun, penganalisis berkata  politik dan ekonomi hentaman mungkin terhad,",
" ... ",
"Memberi bahawa kuasa sebenar kekal di dalam tangan Presiden.",
" ... ",
"                         ",
"") );
gContentsList[ "Story04_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #04", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywnado", "../thumb/ch8_1830_20090906_02_2S.jpg", "Story02_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_03_2S.jpg", "Story03_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "",
"                         ",
" ... ",
"Polis di Hong Kong sedang menyiasat tentang sebotol asid menyerang",
" ... ",
"Di daerah beli-belah malam semalam Mongkok, 11 orang kiri yang manakah menghangus.",
" ... ",
"Penyiasatan kata dua orang mangsa utama, seorang lelaki dan seorang wanita,",
" ... ",
"Didengar berbalah dengan yang tertuduh itu sebelum serangan.",
" ... ",
"Yang tertuduh itu kemudian menyemburkan asid daripada botol di mereka.",
" ... ",
"Sembilan orang yang lalu sakit dalam  kacau bilau.",
" ... ",
"Saya mendengar orang teriakan, \"Rompakan, rompakan !\"",
" ... ",
"Dan kemudian seorang lelaki ditahan selepas suatu pengejaran pendek.",
" ... ",
"Yang tertuduh 28-tahun itu berada di dalam jagaan, dan  tujuan tidak mungkin telah rompakan.",
" ... ",
"Orang sedang menyiasat kemungkinan yang dia rasa bahawa isterinya telah mempunyai suatu urusan.",
" ... ",
"Para pegawai percaya tiada bahawa hubungan ke tiga botol asid lain menyerang",
" ... ",
"Di  bidang yang sama di atas 10 bulan lalu.",
" ... ",
"Peristiwa itu - yang mana botol mengisi dengan cecair kakis",
" ... ",
"Nampaknya dilemparkan daripada bangunan berhampiran - sekitar 100 kecederaan kiri orang.",
" ... ",
"                         ",
"") );
gContentsList[ "Story05_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #05", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywntvn", "../thumb/ch8_1830_20090906_04_2S.jpg", "Story04_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_05_2S.jpg", "Story05_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "",
"                         ",
" ... ",
"Seorang wanita di Sudan telah didenda US$200 untuk seluar terpakai di dalam awam.",
" ... ",
"Ayat di dalam kes HIGH-PROFILE tersebut diturun petang ini.",
" ... ",
"al-hussein Lubna Ahmed kelihatan di sini, mengelilingi oleh penyokong,",
" ... ",
"Mengetuai untuk memikat lebih awal hari ini.",
" ... ",
"Di bawah undang-undang Sudan, dia mungkin diikat 40 kali  kononnya tidak sopan.",
" ... ",
"Dia sekarang sedang menegaskan bahawa dia tidak akan membayar dendanya, dan lebih suka pergi memenjara.",
" ... ",
"Lubna ditahan bersama-sama dengan 12 orang wanita lain di dalam Julai.",
" ... ",
"Mereka semua telah memakai seluar di sebuah restoran Khartoum.",
" ... ",
"10 orang wanita kemudiannya disebat.",
" ... ",
"Tetapi Lubna mencabar  bayaran.",
" ... ",
"Sebagai suatu Pertubuhan Bangsa-bangsa Bersatu menekan pegawai, dia mungkin mencari kekebalan sah,",
" ... ",
"Tetapi menepi yang kanan menyokong suatu percubaan awam.",
" ... ",
"Suatu menyelamatkan keajaiban di Filipina, milik selepas semalam penenggelaman feri.",
" ... ",
"Seorang wanita ditarik dari perairan kerumun-yu dari Zamboanga,",
" ... ",
"Lebih daripada 24 jam selepas nahas.",
" ... ",
"Dia dilaporkan untuk berada di dalam keadaan stabil.",
" ... ",
"Sekurang-kurangnya seorang  tetap bernyanyi salah, dan jumlah kematian mendiri pada sembilan.",
" ... ",
"Tetapi berdasar tokoh rasmi menunjuk bahawa 968 orang  di atas  saluran.",
" ... ",
"Naik di atas Berita 5,",
" ... ",
"Berita baik untuk majlis perbandaran tempatan bulan ke-tujuh ini!",
" ... ",
"Dia sedang membuat tajuk berita sekali lagi!",
" ... ",
"Mengapa buah hati Hong Kong ini boleh hampir-hampir ambil di atas peranan yang terbesar dalam hidupnya!",
" ... ",
"                         ",
"") );
gContentsList[ "Story06_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #06", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywobrc", "../thumb/ch8_1830_20090906_06_2S.jpg", "Story06_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_07_2S.jpg", "Story07_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "",
"                         ",
" ... ",
"Ini adalah Berita 5 Malam.",
" ... ",
"Pam harga telah jatuh oleh enam sen setiap liter.",
" ... ",
"Ini menggunakan kepada semua markah petrol dan diesel.",
" ... ",
"Semua empat orang mejar meminyaki syarikat - Kulit, Caltex, SPC dan ExxonMobil -",
" ... ",
"Telah membuat penyelarasan.",
" ... ",
"Lebih banyak keluarga Singapura sekarang sedang menggunakan alat kawan-eco",
" ... ",
"Itu juga adalah kawan-saku dalam jangka masa panjang.",
" ... ",
"Ini menurut suatu penelitian yang dialir oleh  Perwakilan Warga Sekitar.",
" ... ",
"Lebih Rakyat Singapura sedang mengambil langkah-langkah membuat keluarga mereka efisien-tenaga.",
" ... ",
"Menurut  NEA, lagi 9% Rakyat Singapura menerima tabiat tenaga baik tahun lalu,",
" ... ",
"Membandingkan dengan 2007.",
" ... ",
"Perangkaan ditarik daripada keputusan untuk 10% Tenaga Cabar,",
" ... ",
"Sebuah kempen nasional mengarah pada mengurangkan 10% penggunaan kuasa elektrik setiap keluarga menjelang 2012.",
" ... ",
"Keterangan penggunaan tenaga keluarga untuk sekitar 17%",
" ... ",
"Untuk kuasa elektrik menyeluruh yang digunakan di Singapura. Tetapi diakibatkan milik dari NEA berterusan",
" ... ",
"10% Tenaga Cabar mendedahkan bahawa suatu 2% jatuh di dalam",
" ... ",
"Penggunaan menyeluruh tenaga keluarga negara tahun lalu,",
" ... ",
"Membandingkan ke tahun dahulu.",
" ... ",
"Di bawah Tenaga Label Skim yang Bertauliah, lebih banyak detik sebuah alat mempunyai,",
" ... ",
"Lebih efisien-tenaga ia .",
" ... ",
"Pada masa ini, skim menggunakan kepada satu-satunya alat-hawa-dingin, memakai kekeringan dan peti sejuk.",
" ... ",
"Tetapi NEA kata rancangan terdapat untuk berkembang ia ke alat lain suka menyalakan perlawanan.",
" ... ",
"Tinjauan juga jumpa bahawa alat efisien-tenaga lebih murah untuk berlari.",
" ... ",
"Harga sederhana membeli dan mengendali suatu alat-hawa-dingin-efisien tenaga",
" ... ",
"Lapan jam setiap hari, selama tujuh tahun, adalah sekitar 7,000.",
" ... ",
"Begitu juga, harga untuk suatu peti ais efisien-tenaga",
" ... ",
"Akan bermaksud sama seperti kurang daripada $2,500 selama 10 tahun.",
" ... ",
"Kami perlu jadi sedar akan semua teknologi boleh didapati di bahagian lain  dunia,",
" ... ",
"Dan juga sedar akan jenis skim insentif dan berbagai-bagai skim lain",
" ... ",
"Itu  berkesan, supaya apa kami menyediakan dan apa kami kemudiannya melaksanakan di Singapura",
" ... ",
"Tentu praktis.",
" ... ",
"NEA harap menyebarkan pesanan melalui Tenaga Cabar Minggunya, yang mana sekarang.",
" ... ",
"Majlis perbandaran sedang melaporkan bahawa suatu 10% jatuh",
" ... ",
"                         ",
"") );
gContentsList[ "Story07_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #07", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywp1ns", "../thumb/ch8_1830_20090906_08_2S.jpg", "Story08_Day06_CH8 18:30 - Chinese", "../thumb/ch8_1830_20090906_09_2S.jpg", "Story09_Day06_CH8 18:30 - Chinese", 100, 16, new Array( "",
"                         ",
" ... ",
"Majlis perbandaran sedang melaporkan bahawa suatu 10% jatuh",
" ... ",
"Di dalam bilangan kes dupa kertas indiscriminately dihanguskan",
" ... ",
"Di atas tampung awam rumput.",
" ... ",
"Ia menampakkan lebih banyak orang sedang menggunakan untuk logam bekas atau kebakaran",
" ... ",
"Dibekalkan oleh majlis perbandaran sebaliknya, membuat persembahan agama",
" ... ",
"Bulan ke-tujuh yang bulan ini.",
" ... ",
"Walau bagaimanapun, terdapat tetap masalah di beberapa bidang -",
" ... ",
"Dengan rumput luka bakar dan pohon rata kiri sebagai bukti.",
" ... ",
"Beberapa buah daerah telah menetapkan poster untuk mengangkat kesedaran.",
" ... ",
"Residen juga digesa supaya meletakkan  bekas logam kepada penggunaan betul,",
" ... ",
"Dan tidak lemparkan sampah-sarap ke dalam mereka.",
" ... ",
"                         ",
"") );
gContentsList[ "Story08_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #08", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywq2mi", "../thumb/ch8_1830_20090906_10_2S.jpg", "Story10_Day06_CH8 18:30 - Chinese", "../thumb/ch5_2130_20090906_00_2S.jpg", "Story00_Day06_CH5 21:30 - English", 100, 16, new Array( "",
"                         ",
" ... ",
"Di dalam berita perniagaan -",
" ... ",
"Kekayaan kedaulatan Abu Dhabi membiayai Labur Kumpul Teknologi Terkini,",
" ... ",
"Atau HANDALAN, telah sanggup untuk membeli Semikonduktor Bercarter Singapura",
" ... ",
"Untuk $2.5 bilion.",
" ... ",
"Harga menterjemahkan kepada $2.68, atau suatu 0.8% amat dihargai",
" ... ",
"Di atas Memberi Piagam'harga penutup S Jumaat lalu.",
" ... ",
"Termasuk hutang dan saham tebus keutamaan tukar,",
" ... ",
"Urusan dinilai pada sekitar 5.6 bilion.",
" ... ",
"Tawaran pembelian perniagaan kelihatan sebagai positif  Memberi Piagam,",
" ... ",
"Yang mana adalah dalam keadaan debit untuk  empat suku terakhir.",
" ... ",
"                         ",
"") );
gContentsList[ "Story09_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #09", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywr9yq", "../thumb/ch5_2130_20090906_01_2S.jpg", "Story01_Day06_CH5 21:30 - English", "../thumb/ch5_2130_20090906_02_2S.jpg", "Story02_Day06_CH5 21:30 - English", 100, 16, new Array( "",
"                         ",
" ... ",
"Pan Hong pemaju harta tanah China Senarai-Singapura",
" ... ",
"Merancang menawarkan beberapa 173 juta waran untuk mengangkat lebih kurang $114 juta.",
" ... ",
"Di bawah proposa, ia akan mengeluarkan satu waran untuk setiap tiga buah saham biasa yang wujud.",
" ... ",
"Setiap waran membawa  kanan untuk berlanggan untuk sebahagian biasa yang baru",
" ... ",
"Pada suatu harga latihan 66 sen.",
" ... ",
"Pan Hong bercadang untuk menggunakan hasil kutipan untuk memperluaskan portfolio harta tanahnya.",
" ... ",
"Ini adalah nombor-nombor pasar.",
" ... ",
"                         ",
"") );
gContentsList[ "Story10_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #10", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyws2sa", "../thumb/ch5_2130_20090906_03_2S.jpg", "Story03_Day06_CH5 21:30 - English", "../thumb/ch5_2130_20090906_04_2S.jpg", "Story04_Day06_CH5 21:30 - English", 100, 16, new Array( "",
"                         ",
" ... ",
"Indonesia sedang menghadapi sebuah krisis kesihatan dalam",
" ... ",
"Milik selepas Hari Rabu lalu gempa bumi besar di Tanah Jawa Barat.",
" ... ",
"Beribu-ribu orang yang terselamat telah jatuh sakit, dengan pada keseluruhannya jangkitan nafas atau cirit-birit.",
" ... ",
"Perubatan dan bantuan makanan sedang ambil suatu masa lama menghubungi mereka,",
" ... ",
"Terutama itu di bidang berjauhan.",
" ... ",
"Dengan satu-satunya tangan terdedahnya, Ibu Komala 40-tahun sedang cuba menyelamatkan apa yang diketinkan oleh dia",
" ... ",
"Daripada puing rumah, kekuatan dan azamnya dia hampir-hampir tidak menjejas yang cepat",
" ... ",
"Dia memperhatikan semasa bulan Ramadan yang suci Islam.",
" ... ",
"Saya belum memikirkan tentang bangunan semula. Saya tiada wang. Anda mesti mempunyai wang",
" ... ",
"Membina sebuah rumah. Saya tidak tahu. Buat masa kini, saya hanya hidup di mana sahaja.",
" ... ",
"Ibu Komala di antara lebih daripada 80,000 residen di Tanah Jawa Barat yang pulang dibawa turun",
" ... ",
"Milik pada Hari Rabu gempa bumi kuat.",
" ... ",
"Banyak sedang ambil tempat perlindungan dalam khemah sementara",
" ... ",
"Semasa menunggu bantuan menitis di dalam ke desa berjauhan ini.",
" ... ",
"Kelegaan keampunan, sebuah organisasi orang yang berperikemanusiaan Singapura,",
" ... ",
"Telah sampai desa Pangalengan dekat dengan Bandung.",
" ... ",
"Ia sedang membahagi khemah dan selimut sampai 2,000 gempa mangsa di sana.",
" ... ",
"Ia juga mendapat ramai menderita cirit-birit.",
" ... ",
"Terdapat ramai kanak-kanak yang dengan betul belum diberi makan dan kanak-kanak sedang bertatih.",
" ... ",
"Mi serta-merta telah diberi kepada Mereka Kebanyakan.",
" ... ",
"Maka kali ini di sekitar, Kelegaan Keampunan memfokuskan bantuan makanannya di atas kanak-kanak,",
" ... ",
"Sebagai perwakilan kelegaan lain membekalkan pada keseluruhannya orang dewasa.",
" ... ",
"Kelegaan keampunan telah menghubungkan dengan suatu Indonesia NGO perubatan",
" ... ",
"Menyelia kesihatan mangsa itu di desa ini.",
" ... ",
"Kami akan melihat membekalkan bekalan perubatan untuk memberi perhatian kepada penyakit harian,",
" ... ",
"Masalah terutamanya nafas. Pada masa yang sama,",
" ... ",
"Kami juga berkenaan tentang penjagaan kesihatan awam, ketika orang secara padat dipasang.",
" ... ",
"Tempat perlindungan sementara suka ini akan menjadi rumah kepada mangsa untuk COUPLE OF WEEK berikut",
" ... ",
"Untuk pun bulan. Maka  dijaga kebersihan mereka memang penting,",
" ... ",
"Mencegah penyakit daripada pecah.",
" ... ",
"Perlengkapan orang yang berperikemanusiaan Singapura juga merancang mendiri sekolah sementara,",
" ... ",
"Sebagai ia membuat akibat  malapetaka semulajadi sebelumnya tersebut di China dan Myanmar.",
" ... ",
"Itu adalah sepotong berita baik untuk Mita sembilan-tahun,",
" ... ",
"Siapakah tiada tempat untuk belajar sekarang sekolahnya telah dibinasakan.",
" ... ",
"Sujadi Siswo, Menyalurkan NewsAsia, di Pangelangan, Tanah Jawa Barat",
" ... ",
"Sukan masih datang di 5. Kami pergi courtside di AS Membuka.",
" ... ",
"Dan itu adalah seorang gergasi FAST FOOD lawan sebuah rumah tempatan kari,",
" ... ",
"Di dalam suatu pertempuran atas hak ternama!",
" ... ",
"                         ",
"") );
gContentsList[ "Story11_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #11", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywt4k2", "../thumb/chu_2300_20090906_00_2S.jpg", "Story00_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_01_2S.jpg", "Story01_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "",
"                         ",
" ... ",
"Ia  bahawa suatu hari drama di AS Membuka pertandingan tenis.",
" ... ",
"Kim Clijsters permaisuri kemunculan semula menakjubkan Suhrah Williams di dalam suatu buah perlawanan ROLLER - COAST.",
" ... ",
"Dan tawaran Rafael Nadal untuk menyiapkan suatu hempas besar kerjaya adalah di bawah ancaman baharu,",
" ... ",
"Selepasnya yang suatu kecederaan otot kanan abdomen dialami.",
" ... ",
"Walaupun dengan kesakitan, Rafael Nadal adalah perniagaan seperti biasa.",
" ... ",
"Dia telah bermain bertentang Nicolas Almagro empat kali,",
" ... ",
"Dan telah memukulnya setiap kali di dalam set lurus.",
" ... ",
"Kali ini tiada berbeza.",
" ... ",
"Nadal ambil perlawanan 7-5, 6-4, 6-4 untuk mendahulukan kepada 16 terakhir.",
" ... ",
"Tetapi keengganannya bercakap tentang kecederaannya mengangkat soalan tentang kesihatannya.",
" ... ",
"Saya kecil sedikit jemu untuk TALK ABOUT kecederaan. Saya berada di sini untuk berbuat yang terbaik setiap hari.",
" ... ",
"Saya menang perlawanan di dalam tiga set, maka saya gembira untuk itu.",
" ... ",
"Juga melalui Andy Murray Britain.",
" ... ",
"Biji benih ke-dua itu mengalahkan American Taylor Dent untuk mengirimkan suatu 6-3, 6-2, 6-2 kemenangan.",
" ... ",
"Di dalam tarikan wanita,",
" ... ",
"Mempertahankan Serena Williams juara menghancurkan Daniela Hantuchova Slovakia",
" ... ",
"Capai akhir-suku.",
" ... ",
"Williams menang 10 permainan lurus dari 2-2, yang mengalahkan lawan 6-2nya, 6-0.",
" ... ",
"Ya, ia adalah suatu masa lama sejak saya menang saya terlebih dahulu utama sekarang. Saya harus melemparkan sebuah jamuan.",
" ... ",
"Tetapi Suhrah saudara perempuan Serena keluar, di dalam apa yang membuktikan tarikan utama pada Hari Ahad.",
" ... ",
"Dia ambil di atas Kim Clijsters Belgium, siapakah telah bermain perlawanannya yang terbesar",
" ... ",
"Sejak dua setengah tahunnya memecah daripada tenis.",
" ... ",
"Williams boleh jururawat suatu lutut di kain pembalut dengan berat,",
" ... ",
"Tetapi juara utama masa-tujuh itu tidak akan berhenti tanpa suatu pertempuran.",
" ... ",
"Tetapi bekas Clijsters nombor satu menunjukkannya tetap punya dia.",
" ... ",
"Clijsters memukul cuti tiga-nombor yang Williams 6-0 biji benih, 0-6, 6-4.",
" ... ",
"Dia akan bermain China'Li Na S kemudian.",
" ... ",
"Saya harap bahawa saya dapat menang lagi tiga buah perlawanan. Saya tahu bahawa ia liat, demikian.",
" ... ",
"Li berada di dalam akhir-suku  AS itu Membuka di dalam buat pertama kalinya kerjayanya.",
" ... ",
"Dia mengalahkan Francesca Schiavone 6-2,6-3 Itali.",
" ... ",
"                         ",
"") );
gContentsList[ "Story12_Day07_CH5 21:30 - English" ] = new Array( "CH5 21:30 07/09/2009 #12", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywtvr5", "../thumb/chu_2300_20090906_02_2S.jpg", "Story02_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_03_2S.jpg", "Story03_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "",
"                         ",
" ... ",
"Apakah yang ada di dalam suatu nama?",
" ... ",
"Itu adalah soalan yang mana akan menghadapi Malaysia'S mahkamah yang paling tinggi esok.",
" ... ",
"Ia sedia membuat keputusan jika MCDONALD Amerika gergasi FAST FOOD",
" ... ",
"Dapat memburu suatu perlawanan cap dagang sebuah restoran tempatan yang McCurry dipanggil.",
" ... ",
"Hari ini MCDONALD memfailkan suatu rayuan bertentangan dengan suatu ketetapan yang lebih awal,",
" ... ",
"Yang McCurry yang benar untuk menyimpan namanya.",
" ... ",
"Adakah \"Mc\" kata membuat anda berfikir ini?",
" ... ",
"Namun, MCDONALD nampaknya berfikir sedemikian,",
" ... ",
"Yang mengapa ia mahu sebuah restoran India FAST FOOD tempatan mengubah namanya.",
" ... ",
"Tetapi pemilik  McCurry itu telah enggan membuat sedemikian,",
" ... ",
"Berkata ia bahawa orang tidak mungkin akan mengaitkan restorannya dengan pemburg itu rantai.",
" ... ",
"MCDONALD diiktirafkan oleh lengkungan emas dan warna berbeza mereka yang berwarna kuning dan merah.",
" ... ",
"Tetapi di dalam papan tanda kita, kami mempunyai McCurry restoran, campur kita juga mempunyai logo kita,",
" ... ",
"Yang mana sedang senyum ayam dengan dua penerimaan. Maka ia sangat sangat berbeza",
" ... ",
"Dan bahagian dalam, anda tahu bahawa, ia sama seperti lain-lain \"kedai MAKANAN\" kebiasaan.",
" ... ",
"Selain daripada logo dan bahagian dalam, menu itu juga sangat berbeza.",
" ... ",
"Kami tidak membekalkan kebaratan ANY KIND OF atau FAST FOOD.",
" ... ",
"Actually,McCurry merupakan singkatan untuk Ayam Kari Malaysia.",
" ... ",
"\"Mc\" adalah suatu singkatan untuk ayam Malaysia.",
" ... ",
"Tetapi jangan meyakinkan MCDONALD, yang mana mempunyai 185 saluran keluar di Malaysia.",
" ... ",
"Pertempuran sah itu memulakan lapan tahun dahulu dan pada tahun 2006, Mahkamah Tinggi Kuala Lumpur",
" ... ",
"Memutuskan bahawa rantai pemburg itu mempunyai kanan eksklusif kepada \"Mc\" awalan.",
" ... ",
"McCurry yang ditempur menyokong dan mahkamah rayuan memerintah di dalam hatinya di dalam April.",
" ... ",
"                         ",
"") );
gContentsList[ "Story00_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emkqea", "../thumb/chu_2300_20090906_04_2S.jpg", "Story04_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_05_2S.jpg", "Story05_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emk6vu", "../thumb/chu_2300_20090906_06_2S.jpg", "Story06_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_07_2S.jpg", "Story07_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story02_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #02", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emjtp9", "../thumb/chu_2300_20090906_08_2S.jpg", "Story08_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_09_2S.jpg", "Story09_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story03_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #03", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emjfub", "../thumb/chu_2300_20090906_10_2S.jpg", "Story10_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_11_2S.jpg", "Story11_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story04_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #04", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0emix3t", "../thumb/chu_2300_20090906_12_2S.jpg", "Story12_Day06_CHU 23:00 - Chinese", "../thumb/chu_2300_20090906_13_2S.jpg", "Story13_Day06_CHU 23:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story05_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #05", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=xxxxxxxx", "../thumb/chu_2300_20090906_14_2S.jpg", "Story14_Day06_CHU 23:00 - Chinese", "../thumb/ch8_1300_20090907_00_2S.jpg", "Story00_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story06_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #06", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0engax5", "../thumb/ch8_1300_20090907_01_2S.jpg", "Story01_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_02_2S.jpg", "Story02_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story07_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #07", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0enh9cr", "../thumb/ch8_1300_20090907_03_2S.jpg", "Story03_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_04_2S.jpg", "Story04_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story08_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #08", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0enhosg", "../thumb/ch8_1300_20090907_05_2S.jpg", "Story05_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_06_2S.jpg", "Story06_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story09_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #09", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0eni17h", "../thumb/ch8_1300_20090907_07_2S.jpg", "Story07_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_08_2S.jpg", "Story08_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story10_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #10", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0enig6g", "../thumb/ch8_1300_20090907_09_2S.jpg", "Story09_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_10_2S.jpg", "Story10_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story11_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #11", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0eniwdg", "../thumb/ch8_1300_20090907_11_2S.jpg", "Story11_Day07_CH8 13:00 - Chinese", "../thumb/ch8_1300_20090907_12_2S.jpg", "Story12_Day07_CH8 13:00 - Chinese", 100, 16, new Array( "                                   ") );
gContentsList[ "Story12_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #12", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0enjck0", "../thumb/ch8_1300_20090907_13_2S.jpg", "Story13_Day07_CH8 13:00 - Chinese", "../thumb/ch5_2130_20090907_00_2S.jpg", "Story00_Day07_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story13_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #13", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0enjsco", "../thumb/ch5_2130_20090907_01_2S.jpg", "Story01_Day07_CH5 21:30 - English", "../thumb/ch5_2130_20090907_02_2S.jpg", "Story02_Day07_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story14_Day07_CHU 23:00 - Chinese" ] = new Array( "CHU 23:00 07/09/2009 #14", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0enkats", "../thumb/ch5_2130_20090907_03_2S.jpg", "Story03_Day07_CH5 21:30 - English", "../thumb/ch5_2130_20090907_04_2S.jpg", "Story04_Day07_CH5 21:30 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story00_Recom_H1N1" ] = new Array( "CNA 22:00 28/05/2009 #02", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzza6cml", "../thumb/ch5_2130_20090529_01_2S.jpg", "Story01_Recom_H1N1", "../thumb/cna_1900_20090714_01_2S.jpg", "Story02_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Recom_H1N1" ] = new Array( "CH5 21:30 29/05/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzza88bl", "../thumb/cna_1000_20090715_00_2S.jpg", "Story03_Recom_H1N1", "../thumb/cna_2000_20090716_03_2S.jpg", "Story04_Recom_H1N1", 100, 16, new Array( "",
"                         ",
" ... ",
"Jika anda mula merasa sakit, jadi anda dapat beritahu bagaimana jika ia adalah selsema baru,",
" ... ",
"Atau hanya selsema sama?",
" ... ",
"Dan bagaimana haruskah anda melakukan mencari rawatan?",
" ... ",
"Pemberita kita mendapat beberapa jawapan daripada orang yang harus tahu.",
" ... ",
"Dr Koh Chong Cheng, siapakah berlari Tanamera Clinic di Selatan Bedok,  pakar perubatan",
" ... ",
"Siapakah cenderung kepada pesakit pertama selsema H1N1 Singapura.",
" ... ",
"Dia berkata bahawa gejala selsema H1N1 sangat serupa kepada yang untuk selsema musim itu.",
" ... ",
"Kedua-dua kumpulan pesakit menderita demam, batuk, tekak kudis dan kesakitan badan.",
" ... ",
"Satu-satunya cara mendapat jika anda telah menangkap pijat H1N1 harus pergi untuk suatu tekak mudah",
" ... ",
"Dan ujian kapas kesat nasal.",
" ... ",
"Dr Koh menekan yang jika anda ada sebarang sebab untuk percaya bahawa anda telah mengecut",
" ... ",
"Virus H1N1, anda harus memerlukan 993 buah ambulans atau doktor untuk nasihat anda.",
" ... ",
"Jika anda tidak pasti, panggil GP anda dan dapatkan nasihat daripada GP anda. Jangan menjadi lurus kepada",
" ... ",
"Klinik oleh kerana kami tidak mahu anda memberi virus kepada orang yang bersentuhan",
" ... ",
"Dengan anda kepada  klinik ON ONES WAY.",
" ... ",
"Sejauh ini, kadar kecelakaan untuk selsema H1N1 lebih rendah berbanding daripada selsema musim itu.",
" ... ",
"Dan menurut Dr Koh, apabila seorang pesakit telah pulih daripada virus H1N1,dia ataunya menggayakan",
" ... ",
"Tiada risiko kesihatan kepada orang ramai.",
" ... ",
"Dia berkata bahawa Rakyat Singapura tidak harus mencap itu siapakah sudah pergi",
" ... ",
"Jangkit dengan  virus H1N1.",
" ... ",
"Ia suatu perjalanan penelitian atau suatu cuti, mereka tidak ingin membawa kembali suatu virus dan sebab",
" ... ",
"Suatu cetusan besar masyarakat. Maka pada masa ini kami harus menyokong mereka,",
" ... ",
"Kami tidak harus mengasingkan mereka, kami tidak harus memanggil mereka nama.",
" ... ",
"Menurut  Kementerian Kesihatan, kedua puncak musim selsema di Singapura sedang datang",
" ... ",
"Mungkin ke bulan Jun dan dari bulan Disember ke bulan Januari.",
" ... ",
"Kementerian Kesihatan sedang cuba menghubungi 43 orang siapakah berada di atas penerbangan yang sama",
" ... ",
"Sebagai tiga buah kes yang paling baru.",
" ... ",
"Penerbangan Disatukan Sistem Penerbangan 895 dari Chicago,",
" ... ",
"                         ",
"") );
gContentsList[ "Story02_Recom_H1N1" ] = new Array( "CNA 19:00 14/07/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzza770w", "../thumb/cna_1500_20090717_08_2S.jpg", "Story05_Recom_H1N1", "../thumb/cna_2200_20090803_01_2S.jpg", "Story06_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story03_Recom_H1N1" ] = new Array( "CNA 10:00 15/07/2009 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzza7kk6", "../thumb/cna_2000_20090901_06_2S.jpg", "Story07_Recom_H1N1", "../thumb/ch5_2130_20090901_02_2S.jpg", "Story08_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story04_Recom_H1N1" ] = new Array( "CNA 20:00 16/07/2009 #03", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g00p86mo", "../thumb/cna_0000_20090904_10_2S.jpg", "Story09_Recom_H1N1", "../thumb/cna_2200_20090528_02_2S.jpg", "Story00_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story05_Recom_H1N1" ] = new Array( "CNA 15:00 17/07/2009 #08", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzza54d2", "../thumb/ch5_2130_20090529_01_2S.jpg", "Story01_Recom_H1N1", "../thumb/cna_1900_20090714_01_2S.jpg", "Story02_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story06_Recom_H1N1" ] = new Array( "CNA 22:00 03/08/2009 #01", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzza6rll", "../thumb/cna_1000_20090715_00_2S.jpg", "Story03_Recom_H1N1", "../thumb/cna_2000_20090716_03_2S.jpg", "Story04_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story07_Recom_H1N1" ] = new Array( "CNA 20:00 01/09/2009 #06", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzza5u30", "../thumb/cna_1500_20090717_08_2S.jpg", "Story05_Recom_H1N1", "../thumb/cna_2200_20090803_01_2S.jpg", "Story06_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story08_Recom_H1N1" ] = new Array( "CH5 21:30 01/09/2009 #02", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzza7wl1", "../thumb/cna_2000_20090901_06_2S.jpg", "Story07_Recom_H1N1", "../thumb/cna_0000_20090904_10_2S.jpg", "Story09_Recom_H1N1", 100, 16, new Array( "",
"                         ",
" ... ",
"Para pegawai kesihatan di Hong Kong sedang menjangka  virus H1N1 lebih merebak dengan cepat,",
" ... ",
"Dengan  permulaan  tahun akademik baru itu.",
" ... ",
"Mereka berkata bahawa lebih daripada 100 buah sekolah boleh dipukul oleh suatu cetusan.",
" ... ",
"Tetapi ibubapa berkata bahawa mereka  sekolah berkeyakinan dapat mengendalikan  keadaan.",
" ... ",
"Ia kembali utama untuk menyekolahkan hari ini untuk lebih daripada seribu dan",
" ... ",
"Sekolah menegah di sekitar  bandaraya.",
" ... ",
"Pelajar  ingin melihat kawan-kawan mereka dan memukul  buku",
" ... ",
"Selepas suatu musim panas memecah yang  lebih panjang daripada biasa.",
" ... ",
"Sekolah menutup awal di dalam Jun, selepas virus H1N1 itu menjadi di tempat sendiri hantar.",
" ... ",
"Sekarang  tahun akademik baru telah bermula, jangkitan boleh naik.",
" ... ",
"Para pegawai kesihatan berkata bahawa 100 buah sekolah boleh dipukul oleh suatu cetusan H1N1.",
" ... ",
"Itu berdasar  penghantaran luas yang dilihat semasa",
" ... ",
"Selsema musim sejuk musim tahun lalu.",
" ... ",
"Beberapa buah sekolah antarabangsa menyambung semula kelas di dalam Ogos Pertengahan 20 mempunyai sudah",
" ... ",
"H1N1 dilaporkan sebagai kes.",
" ... ",
"Tetapi ibubapa yang melihat budak mereka dari menyekolahkan hari ini, tidak kelihatan terlalu bimbang.",
" ... ",
"Saya rasa bahawa kami harus mempercayai pada  sekolah di Hong Kong dan  DEPARTMENT OF HEALTH dan",
" ... ",
"Ikuti arahan mereka. Saya berfikir yang tentu baik.",
" ... ",
"Penuh keyakinan, ia  baik, ya.",
" ... ",
"200 kepada 300 orang menangkapnya setiap hari. Kami hanya harus  berhati-hati. Jika orang menjadi sakit,",
" ... ",
"Kanak-kanak akan mendapat sebuah topeng. Mereka sudah pergi di luar sekolah",
" ... ",
"Lebih daripada 2 bulan, mereka perlu pulang.",
" ... ",
"Pemerintah akan mempertimbangkan menutup sekolah selama suatu minggu,",
" ... ",
"Jika lebih daripada 10% daripada pelajar jangkit.",
" ... ",
"Para pegawai kesihatan berkata bahawa  risiko  suatu cetusan selsema  jauh lebih tinggi ketika terdapat suatu besar",
" ... ",
"Mengumpul untuk kanak-kanak.",
" ... ",
"Dan dengan sekolah sekarang menyokong pada persidangan, mereka berkata bahawa mereka tentu mengejutkan jika di sana",
" ... ",
"Apakah beberapa ribu cetusan setiap minggu.",
" ... ",
"Leslie Tang, Menyalurkan NewsAsia. Hong Kong.",
" ... ",
"                         ",
"") );
gContentsList[ "Story09_Recom_H1N1" ] = new Array( "CNA 00:00 04/09/2009 #10", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzza8l22", "../thumb/cna_2200_20090528_02_2S.jpg", "Story00_Recom_H1N1", "../thumb/ch5_2130_20090529_01_2S.jpg", "Story01_Recom_H1N1", 100, 16, new Array( "                                   ") );
gContentsList[ "Content_00g090mas3" ] = new Array( "Home Surveillance", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090mas3", "../thumb/cna_1900_20090714_01_2S.jpg", "Story02_Recom_H1N1", "../thumb/cna_1000_20090715_00_2S.jpg", "Story03_Recom_H1N1", 100, 16, new Array( "     Emergency alert!     ", "     Emergency alert!     ", "     Emergency alert!     ", "     Emergency alert!     ") );
gContentsList[ "Story00_Recom_Formula1" ] = new Array( "CNA 15:00 28/09/2009 #04", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0hfov2w", "../thumb/ch8_1300_20090928_12_2S.jpg", "Story01_Recom_Formula1", "../thumb/cna_1000_20090513_16_2S.jpg", "Story02_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Recom_Formula1" ] = new Array( "CH8 13:00 28/09/2009 #12", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0ghz21c", "../thumb/cna_1500_20080202_16_2S.jpg", "Story03_Recom_Formula1", "../thumb/cna_0000_20090730_14_2S.jpg", "Story04_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story02_Recom_Formula1" ] = new Array( "CNA 10:00 13/05/2009 #16", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07rw8ej", "../thumb/cna_2200_20080425_11_2S.jpg", "Story05_Recom_Formula1", "../thumb/cna_1000_20070901_08_2S.jpg", "Story06_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story03_Recom_Formula1" ] = new Array( "CNA 15:00 02/02/2008 #16", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07rwsg4", "../thumb/cna_1500_20071025_00_2S.jpg", "Story07_Recom_Formula1", "../thumb/ch5_2130_20070406_12_2S.jpg", "Story08_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story04_Recom_Formula1" ] = new Array( "CNA 00:00 30/07/2009 #14", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07rxcr7", "../thumb/ch5_2130_20080427_10_2S.jpg", "Story09_Recom_Formula1", "../thumb/ch5_2130_20080309_04_2S.jpg", "Story10_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story05_Recom_Formula1" ] = new Array( "CNA 22:00 25/04/2008 #11", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07rxx9f", "../thumb/ch5_2130_20070831_00_2S.jpg", "Story11_Recom_Formula1", "../thumb/cna_1500_20090928_04_2S.jpg", "Story00_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story06_Recom_Formula1" ] = new Array( "CNA 10:00 01/09/2007 #08", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07ryecw", "../thumb/ch8_1300_20090928_12_2S.jpg", "Story01_Recom_Formula1", "../thumb/cna_1000_20090513_16_2S.jpg", "Story02_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story07_Recom_Formula1" ] = new Array( "CNA 15:00 25/10/2007 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07ryulp", "../thumb/cna_1500_20080202_16_2S.jpg", "Story03_Recom_Formula1", "../thumb/cna_0000_20090730_14_2S.jpg", "Story04_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story08_Recom_Formula1" ] = new Array( "CH5 21:30 06/04/2007 #12", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07rzbsw", "../thumb/cna_2200_20080425_11_2S.jpg", "Story05_Recom_Formula1", "../thumb/cna_1000_20070901_08_2S.jpg", "Story06_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story09_Recom_Formula1" ] = new Array( "CH5 21:30 27/04/2008 #10", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07rzxqu", "../thumb/cna_1500_20071025_00_2S.jpg", "Story07_Recom_Formula1", "../thumb/ch5_2130_20070406_12_2S.jpg", "Story08_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story10_Recom_Formula1" ] = new Array( "CH5 21:30 09/03/2008 #04", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07s0h9o", "../thumb/ch5_2130_20080427_10_2S.jpg", "Story09_Recom_Formula1", "../thumb/ch5_2130_20070831_00_2S.jpg", "Story11_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story11_Recom_Formula1" ] = new Array( "CH5 21:30 31/08/2007 #00", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g07s0vy2", "../thumb/cna_1500_20090928_04_2S.jpg", "Story00_Recom_Formula1", "../thumb/ch8_1300_20090928_12_2S.jpg", "Story01_Recom_Formula1", 100, 16, new Array( "                                   ") );
gContentsList[ "Story00_Recom_Trailer" ] = new Array( "18GramsofLove", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g090ksjj", "../thumb/Pianist_3S.jpg", "Story01_Recom_Trailer", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Recom_Trailer" ] = new Array( "Pianist", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fxeabr9f", "../thumb/18GramsofLove_3S.jpg", "Story00_Recom_Trailer", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );

gContentsList[ "Story00_Recom_HD(CH5)" ] = new Array( "digi_hd5_2130_###", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0kcgq6o", "../thumb/Pianist_3S.jpg", "Story01_Recom_Trailer", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Recom_HD(CH5)" ] = new Array( "digi_hd5_2130_###ar48000ab256aacmp4atry", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0kqqf6t", "../thumb/Pianist_3S.jpg", "Story01_Recom_Trailer", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );
gContentsList[ "Story02_Recom_HD(CH5)" ] = new Array( "digi_hd5_2130_###44100442try", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0kqr68q", "../thumb/Pianist_3S.jpg", "Story01_Recom_Trailer", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );
gContentsList[ "Story03_Recom_HD(CH5)" ] = new Array( "digi_hd5_2130_###ar64000ab234try", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0kqs1t0", "../thumb/Pianist_3S.jpg", "Story01_Recom_Trailer", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );
gContentsList[ "Story04_Recom_HD(CH5)" ] = new Array( "digi_hd5_2130_###20091910shorter", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0ynhiqh", "../thumb/Pianist_3S.jpg", "Story01_Recom_Trailer", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );
gContentsList[ "Story05_Recom_HD(CH5)" ] = new Array( "digi_hd5_2130_###20091910b_cut", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0ytpbez", "../thumb/Pianist_3S.jpg", "Story01_Recom_Trailer", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );
gContentsList[ "Story06_Recom_HD(CH5)" ] = new Array( "digi_hd5_2130_###20091910c_cut", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00g0ytpq7l", "../thumb/Pianist_3S.jpg", "Story01_Recom_Trailer", "../thumb/cna_1000_20090906_09_2S.jpg", "Story00_Recom_Football", 100, 16, new Array( "                                   ") );

gContentsList[ "Story00_Recom_Football" ] = new Array( "CNA 10:00 06/09/2009 #09", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyx79v7", "../thumb/cna_1000_20090906_10_2S.jpg", "Story00_Recom_Tennis", "../thumb/ch5_2130_20090907_11_2S.jpg", "Story01_Recom_Tennis", 100, 16, new Array( "                                   ") );
gContentsList[ "Story00_Recom_Tennis" ] = new Array( "CNA 10:00 06/09/2009 #10", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzyx68h9", "../thumb/ch5_2130_20090907_11_2S.jpg", "Story01_Recom_Tennis", "../thumb/cna_1000_20090906_00_2S.jpg", "Story00_Day06_CNA 10:00 - English", 100, 16, new Array( "                                   ") );
gContentsList[ "Story01_Recom_Tennis" ] = new Array( "CH5 21:30 07/09/2009 #11", "http://htvl-pgw.iptvf.jp:12345/pgw/resolvecontent?contract_id=1234567890&purchase_id=1234567890&promo=on&crypt=no&drmid=100400000005ee98&cid=00fzywt4k2", "../thumb/cna_1000_20090906_10_2S.jpg", "Story00_Recom_Tennis", "../thumb/cna_1000_20090906_00_2S.jpg", "Story00_Day06_CNA 10:00 - English", 100, 16, new Array( "",
"                         ",
" ... ",
"Ia  bahawa suatu hari drama di AS Membuka pertandingan tenis.",
" ... ",
"Kim Clijsters permaisuri kemunculan semula menakjubkan Suhrah Williams di dalam suatu buah perlawanan ROLLER - COAST.",
" ... ",
"Dan tawaran Rafael Nadal untuk menyiapkan suatu hempas besar kerjaya adalah di bawah ancaman baharu,",
" ... ",
"Selepasnya yang suatu kecederaan otot kanan abdomen dialami.",
" ... ",
"Walaupun dengan kesakitan, Rafael Nadal adalah perniagaan seperti biasa.",
" ... ",
"Dia telah bermain bertentang Nicolas Almagro empat kali,",
" ... ",
"Dan telah memukulnya setiap kali di dalam set lurus.",
" ... ",
"Kali ini tiada berbeza.",
" ... ",
"Nadal ambil perlawanan 7-5, 6-4, 6-4 untuk mendahulukan kepada 16 terakhir.",
" ... ",
"Tetapi keengganannya bercakap tentang kecederaannya mengangkat soalan tentang kesihatannya.",
" ... ",
"Saya kecil sedikit jemu untuk TALK ABOUT kecederaan. Saya berada di sini untuk berbuat yang terbaik setiap hari.",
" ... ",
"Saya menang perlawanan di dalam tiga set, maka saya gembira untuk itu.",
" ... ",
"Juga melalui Andy Murray Britain.",
" ... ",
"Biji benih ke-dua itu mengalahkan American Taylor Dent untuk mengirimkan suatu 6-3, 6-2, 6-2 kemenangan.",
" ... ",
"Di dalam tarikan wanita,",
" ... ",
"Mempertahankan Serena Williams juara menghancurkan Daniela Hantuchova Slovakia",
" ... ",
"Capai akhir-suku.",
" ... ",
"Williams menang 10 permainan lurus dari 2-2, yang mengalahkan lawan 6-2nya, 6-0.",
" ... ",
"Ya, ia adalah suatu masa lama sejak saya menang saya terlebih dahulu utama sekarang. Saya harus melemparkan sebuah jamuan.",
" ... ",
"Tetapi Suhrah saudara perempuan Serena keluar, di dalam apa yang membuktikan tarikan utama pada Hari Ahad.",
" ... ",
"Dia ambil di atas Kim Clijsters Belgium, siapakah telah bermain perlawanannya yang terbesar",
" ... ",
"Sejak dua setengah tahunnya memecah daripada tenis.",
" ... ",
"Williams boleh jururawat suatu lutut di kain pembalut dengan berat,",
" ... ",
"Tetapi juara utama masa-tujuh itu tidak akan berhenti tanpa suatu pertempuran.",
" ... ",
"Tetapi bekas Clijsters nombor satu menunjukkannya tetap punya dia.",
" ... ",
"Clijsters memukul cuti tiga-nombor yang Williams 6-0 biji benih, 0-6, 6-4.",
" ... ",
"Dia akan bermain China'Li Na S kemudian.",
" ... ",
"Saya harap bahawa saya dapat menang lagi tiga buah perlawanan. Saya tahu bahawa ia liat, demikian.",
" ... ",
"Li berada di dalam akhir-suku  AS itu Membuka di dalam buat pertama kalinya kerjayanya.",
" ... ",
"Dia mengalahkan Francesca Schiavone 6-2,6-3 Itali.",
" ... ",
"                         ",
"") );


function getCrid( crid) {
	if( String( gContentsList[crid]) == "undefined") return null;
	return gContentsList[crid];
};

