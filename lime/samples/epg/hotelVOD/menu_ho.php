<?xml version="1.0" encoding="EUC-JP" ?>
<!DOCTYPE bml PUBLIC
  "-//IPTVF CDN:2008//DTD BML Document for IPTV//JA"
  "http://www.iptvforum.jp/CDN/DTD/bml_100_0_iptv.dtd">
<?bml bml-version="100.0" ?>

<bml>
<head>
<!--	
	<link rel="stylesheet" href="style.css" type="text/css">
-->

<style><![CDATA[
	body{
		clut:url(../img/default.clt);
		background-color-index:0;
	}

div:focus	{background-color-index:72;}
div:blur	{background-color-index:7;}

.vender_top {
        height:70px;
	width:926px;
}

.inner3 {top:10px;
        left:17px;
	width:930px;
        height:540px;
	background-color-index:0;
font-size:8px;
}

.l_ln { 
	width:453px;
	height:116px;
	background-color-index:7;
        color-index:1;
}

.pp_left {
	width:122px;
        height:112px;
}

.p_one {
	width:356px;
	height:112px;
color-index:2;
}


.pp1h {	width:316px;
        height:24px;
	font-size:18px;
        color-index:4;
	background-color-index:7;
       top:0px;left:0px;
}

.pp2 {	width:350px;
        height:240px;
        top:24px;
        left:0px;
	font-size:16px;
	color-index:0;
}

.pp3 {	top:75px;
        left:160px;
width:322px;
        height:112px;
	margin-top:2px;
        font-size:12px;
       color-index:1;
}

.v_back, .v_pre, .v_next, .v_play {
	width:120px;
	height:60px;
	margin-top:10px;
}

.icon {top:10px;left:10px;width:120px;height:90px;}

.button {top:0px;left:0px;height:60px;width:120px;}
.v_back { height:100px;width:180px; }
.v_play { height:100px;width:180px; }
.v_next { margin-left:10px; }



]]></style>



<script ><![CDATA[

	
function goback(){ browser.launchDocument("../top.bml", "cut");	}

function launch(){

    var e = document.currentEvent;
    var name = e.target.id;

if(name==1){
     browser.launchDocument("play_m10040.bml", "cut");
  }else if(name==2){
     browser.launchDocument("play_m10053.bml", "cut");
}else if(name==3){
     browser.launchDocument("play_m10065.bml", "cut");
}else if(name==4){
     browser.launchDocument("play_m10074.bml", "cut");
}else if(name==5){
     browser.launchDocument("play_one.bml", "cut");
}else {browser.launchDocument("../top.bml", "cut");}

}
	]]></script>
</head>
<?php

		//
		//===============================================================
		//
		//                     パラメータ　読み込み
		//
		//===============================================================
		//
	$mu = $_GET['m'];

	

		//
		//===============================================================
		//
		//                コンテンツ情報　読み込み
		//
		//===============================================================
		//
	$cnt = 0;
	switch ($mu) {
		case 'y':	$fname = "youga.txt"; $dr = "youga/"; $mt = "t_youga.png";		$css2 = "pp1y";	break;	// 洋画
		case 'h':	$fname = "houga.txt";	$dr = "ho/";		$mt = "t_houga.png";		$css2 = "pp1h";	break;
		case 'x':	$fname = "adult.txt";	$dr = "adult/";	$mt = "t_adult.png";		$css2 = "pp1x";	break;
		case 'i':	$fname = "idol.txt";	$dr = "idol/";	$mt = "t_idol.png";			$css2 = "pp1i";	break;
		case 'c':	$fname = "ca.txt";		$dr = "ca/";		$mt = "t_ca.png";				$css2 = "pp1g";	break;
		case 'a':	$fname = "anime.txt";	$dr = "anime/";	$mt = "t_anime.png";		$css2 = "pp1a";	break;
		case 'v':	$fname = "va.txt";		$dr = "va/";		$mt = "t_variety.png";	$css2 = "pp1v";	break;
		default:	$fname = "youga.txt";	$dr = "youga/";	$mt = "t_youga.png";		$css2 = "pp1y";	break;
	}
	$fp = fopen($fname, "r");
	//$fp = fopen("houga.txt", "r");
	//$fp = fopen("adult.txt", "r");
	if ($fp != false) {
		while ($s = fgets($fp)) {
			//$s = mb_convert_encoding($s,"utf-8","sjis");
			$n = (int)$s;
			//echo $num;
			if ($n < 1)
				break;
			$num[$cnt] = $n;
			$s = fgets($fp); $ttl[$cnt] = trim($s);
			$s = fgets($fp); $img[$cnt] = $dr.trim($s).".jpg";
			$s = fgets($fp); $cmt[$cnt] = trim($s);
			$s = fgets($fp); $sub[$cnt] = trim($s);
			$s = fgets($fp); $ymd[$cnt] = trim($s);
			$s = fgets($fp); $yb1[$cnt] = trim($s);
			$s = fgets($fp); $yb2[$cnt] = trim($s);
			$cnt++;
		}
	}
	fclose($fp);

		//
		// パラメータ　読み込み 2
		//
	$tp = (int)$_GET['t'];		// そのページの先頭コンテンツ番号
	if ($tp < 0)
		$tp = 0;
	$lp = floor(($cnt - 1) / 6) * 6;
	if ($tp > $lp)
		$tp = $lp;	// ここを 0 にしたら先頭へ戻る
	$tp = floor($tp / 6) * 6;

?>

<body>

<!--<div class='contents'>-->

<!---

m10040  小泉里子のスタイルゴルフ    カルチャー   ゴルフ
m10053  長崎萠のコスプレ大辞典     カルチャー   コスプレマニア
m10065  Beauty 太極拳      カルチャー   健康・体操
m10074  くつろぎの宿　癒しの美湯女紀行　福島スペシャル カルチャー   旅行
m10098  PARIS AIR SHOW  カルチャー   飛行機

-->
	<div class='inner3'>
<?php
	
	for ($i = $tp; $i < ($tp + 6); $i++) {
		$pm = $num[$i];
		$tl = $ttl[$i];
		$im = $img[$i];
		$cm = $cmt[$i];
		$sb = $sub[$i];
		$ym = (int)$ymd[$i];
		$y1 = $yb1[$i];
		$y2 = $yb2[$i];
		
		if ($ym > 20111031)
			$nw = "";
		else
			$nw = "";

		if ($pm == 0)
			$css4 = "l_lnx";
		else
			$css4 = "l_ln";

		echo "
		<a href='play_one.php?p=$pm&t=$tp&m=$mu'>
			<div class='$css4'>
				<div class='pp_left'  style="top:0;left:0"> 
					<img src='$im' width=122 height=90 />
                                        <object type="image/jpeg" data='$im' style="top:10px;left:10px;width:120px;height:90px"/>

					$nw
				</div>
				<div class='p_one' style="top:0;left:130px">
					<p class='$css2' style="top:0;left:0px;"> $tl</p>
				<p class='pp2' style="top:24px;left:0px">$cm<br/> <p class='pp3'>$sb</p></p>
				</div>
			</div>
		</a>
		";
	}

		echo "<div class='fclr'> </div>";
		echo "<a href='index.php'><div class='v_back' style='top:470px;left:17px;height:64px;width:128px;background-color-index:1;'></a>";
                echo "<object class='button' style='top:2px;left:2px;height:60px;width:120px;' type='image/X-arib-png' data='img/b_back.png' accesskey='R' onclick='goback();'/></div>";


		$nx = $tp + 6;
		$ww = floor(($cnt - 1) / 6) * 6;
		if ($nx > $ww)
			echo 	"<div class='v_next' style='top:470px;left:817px;height:70px;width:126px;'>\n
                    <object class='button' style='top:0px;left:0px;height:60px;width:120px;' accesskey='B' type='image/X-arib-png' data='img/b_next_b.png'/></div>";
		else
			echo "<a href='?m=$mu&t=$nx'><div class='v_next' style='top:470px;left:817px;height:70px;width:126px;'>\n
                    <object class='button' style='top:0px;left:0px;height:60px;width:120px;' accesskey='B' type='image/X-arib-png' data='img/b_next_b.png'/></div></a>";

		$pr = $tp - 6;
		if ($pr < 0)
			echo "<div class='v_pre' style='top:470px;left:570px;height:70px;width:126px;'><object  class='button' style='top:0px;left:0px;height:60px;width:120px;'  type='image/X-arib-png' data='img/b_pre_b.png'/></div>";
		else
			echo "<a href='?m=$mu&t=$pr'><div class='v_pre'><div class='v_pre' style='top:470px;left:570px;height:70px;width:126px;'><object  class='button' style='top:0px;left:0px;height:60px;width:120px;'  type='image/X-arib-png' data='img/b_pre_b.png'/></div></a>";
?>


<!-- 

<div id=$id class='l_ln' style='top:70px;left:0;nav-index:0;nav-down:2;nav-right:1;'  onclick="launch();">
				<div class='pp_left'  style="top:0;left:0"> 
				<object type="image/jpeg" data="ho/h1001.jpg" style="top:10px;left:10px;width:120px;height:90px"/>
				<!--<object type="image/X-arib-png" data="img/new.png" />-->
				</div>
				<div class='p_one' style="top:0;left:130px">
					<p class='pp1h' style="top:0;left:0px;"> $text-title</p>
				<p class='pp2' style="top:24px;left:0px">$short-description <br />
<p class='pp3'>$text-credit</p></p>

				</div>
			</div>


 -->

<!-- buttons  -->



<!--</div>-->

	<div class='vender_top' style="top:0px;left:17px;height:70px;width:926px;">
	<object type="image/X-arib-png" data="img/t_houga.png" style="top:0;left:0;height:70px;	width:926px;"/>
	</div>
</body>
</bml>




