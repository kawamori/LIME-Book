<?php /*
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

vod top

2011/11/01

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
*/ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<link rel="stylesheet" href="style.css" type="text/css">

<style type="text/css">
.inner3 {
	width:930px;
	background-color:#000000;
	margin:0px auto 0px auto;
	overflow:hidden;
}
.v1g {
width:164px;
height:164px;
display:inline;
float:left;
overflow:hidden;
margin:0px 2px 2px 0px;
background-color:#97d162;
}
.v1g img {
border:2px solid #2b2b8f;
border:2px solid #000000;
}
.v1g a:hover img {
border:2px solid #ffffff;
}

.left_box {
	float:left;
	display:inline;
	width:450px;
	height:331px;
	border:2px solid #2b2b8f;
	border:2px solid #000000;
}
.l_ln2 {
	float:right;
	display:inline;
	width:460px;
	height:55px;
	background-color:#cccccc;
	border:2px solid #2b2b8f;
	padding:4px 0px 4px 8px;
}

.l_ln, .l_lnx {
	float:left;
	display:inline;
	width:453px;
	height:116px;
	border:2px solid #2b2b8f;
	border:2px solid #000000;
	padding:6px 0px 6px 8px;
	background:#ffffff;
}
.l_lnx {
	background:#999999;
}
a:hover .l_ln{
	border:2px solid #ffffff;
}

.l_ln img {
	display:inline;
	float:left;
}

.pp_left {
	display:inline;
	float:left;
	width:122px;
}
.p_one {
	width:316px;
	height:112px;
	display:inline;
	float:left;
	text-decoration:none;
	margin-left:8px;
	overflow:hidden;
}
.pp1x {
	font-size:15px;
	font-weight:bold;
	color:#ff0a78;
}
.pp1y {
	font-size:15px;
	font-weight:bold;
	color:#000000;
}
.pp1h {
	font-size:15px;
	font-weight:bold;
	color:#411aff
}
.pp1g {
	font-size:15px;
	font-weight:bold;
	color:#411aff
}
.pp1v {
	font-size:15px;
	font-weight:bold;
	color:#411aff
}
.pp2 {
	font-size:12px;
	line-height:1.2em;
	text-decoration:none;
	color:black;
}
.pp3 {
	margin-top:2px;
	float:right;
}
</style>

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
		case 'y':	$fname = "youga.txt"; $dr = "youga/"; $mt = "t_youga.gif";		$css2 = "pp1y";	break;	// 洋画
		case 'h':	$fname = "houga.txt";	$dr = "ho/";		$mt = "t_houga.gif";		$css2 = "pp1h";	break;
		case 'x':	$fname = "adult.txt";	$dr = "adult/";	$mt = "t_adult.gif";		$css2 = "pp1x";	break;
		case 'i':	$fname = "idol.txt";	$dr = "idol/";	$mt = "t_idol.gif";			$css2 = "pp1i";	break;
		case 'c':	$fname = "ca.txt";		$dr = "ca/";		$mt = "t_ca.gif";				$css2 = "pp1g";	break;
		case 'a':	$fname = "anime.txt";	$dr = "anime/";	$mt = "t_anime.gif";		$css2 = "pp1a";	break;
		case 'v':	$fname = "va.txt";		$dr = "va/";		$mt = "t_variety.gif";	$css2 = "pp1v";	break;
		default:	$fname = "youga.txt";	$dr = "youga/";	$mt = "t_youga.gif";		$css2 = "pp1y";	break;
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

<div class='contents'>

	<div class='vender_top'>
		<img src='img/<?=$mt;?>' alt='hotel vod'/>
	</div>

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
			$nw = "<img src='img/new.gif' />";
		else
			$nw = "";

		if ($pm == 0)
			$css4 = "l_lnx";
		else
			$css4 = "l_ln";

		echo "
		<a href='play_one.php?p=$pm&t=$tp&m=$mu'>
			<div class='$css4'>
				<div class='pp_left'>
					<img src='$im' width=122 height=90 />
					$nw
				</div>
				<div class='p_one'>
					<div class='$css2'>$tl</div>
					<div class='pp2'>$cm<br /><div class='pp3'>$sb</div></div>
				</div>
			</div>
		</a>
		";
	}

		echo "<div class='fclr'> </div>";
		echo "<a href='index.php'><div class='v_back'><img src='img/b_back.gif'/></div></a>";

		$nx = $tp + 6;
		$ww = floor(($cnt - 1) / 6) * 6;
		if ($nx > $ww)
			echo "<div class='v_next'><img src='img/b_next_b.gif'/></div>";
		else
			echo "<a href='?m=$mu&t=$nx'><div class='v_next'><img src='img/b_next.gif'/></div></a>";

		$pr = $tp - 6;
		if ($pr < 0)
			echo "<div class='v_pre'><img src='img/b_pre_b.gif'/></div>";
		else
			echo "<a href='?m=$mu&t=$pr'><div class='v_pre'><img src='img/b_pre.gif'/></div></a>";
?>

	</div class='inner'>

</div>

</body>
</html>
