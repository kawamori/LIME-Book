<?php

if (!isset($_GET['opt']))
{
	echo 'error input';
	exit();
}

$url = '';

switch ($_GET['opt'])
{
	//Ayer Rajah Expressway
case '1':
	//After Tuas West Road
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4712.html';
break;
case '2':
	//Pandan Gardens (Towards Tuas)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4710.html';
break;
case '3':
	//Near Dover ITE (Towards ECP)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4708.html';
break;
case '4':
	//Near NUS (Towards Tuas)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4706.html';
break;
case '5':
	//Alexandra Road (Towards ECP)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4701.html';
break;
case '6':
	//Lower Delta Road (Towards Tuas)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4704.html';
break;
case '7':
	//Keppel Viaduct
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4702.html';
break;

	//Bukit Timah Expressway (BKE)
case '8':
	//Woodlands South Flyover (Towards Woodlands)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/9703.html';
break;
case '9':
	//Woodlands Flyover
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/2704.html';
break;
case '10':
	//Diary Farm Flyover
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/2705.html';
break;
case '11':
	//Chantek Flyover
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/2703.html';
break;
	
	//Central Expressway (CTE)
case '12':
	//St George Road (Towards SLE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1703.html';
break;
case '13':
	//Moulmein Flyover (Towards AYE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1701.html';
break;
case '14':
	//Ang Mo Kio Ave 5 Flyover (Towards City)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1705.html';
break;
case '15':
	//Braddell Flyover (Towards SLE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1702.html';
break;

	//East Coast Parkway (ECP)
case '16':
	//Marina Bay (Towards AYE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/3799.html';
break;
case '17':
	//Benjamin Sheares Bridge
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/3798.html';
break;
case '18':
	//Tanjong Rhu (Towards AYE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/3797.html';
break;
case '19':
	//Tanjong Katong Flyover (Towards Changi)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/3796.html';
break;
case '20':
	//Marine Parade Flyover (Towards AYE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/3795.html';
break;
case '21':
	//Laguna Flyover (Towards Changi)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/3793.html';
break;

	//Kranji Expressway (KJE)
case '22':
	//Choa Chu Kang (Towards PIE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/8701.html';
break;

	//Pan-Island Expressway (PIE)
case '23':
	//Jurong West ST81 (Towards Jurong)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/6708.html';
break;
case '24':
	//Bukit Timah Expressway (Towards Changi)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/6706.html';
break;
case '25':
	//Adam Road (Towards Changi)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/6705.html';
break;
case '26':
	//Mount Pleasant (Towards Jurong)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/6704.html';
break;
case '27':
	//Thomson Road
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/6703.html';
break;
case '28':
	//Kim Keat (Towards Changi)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/6701.html';
break;
case '29':
	//Woodsville Flyover (Towards Changi)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/5799.html';
break;
case '30':
	//Kallang
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/5798.html';
break;
case '31':
	//Paya Lebar Flyover (Towards Jurong)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/5797.html';
break;
case '32':
	//Eunos Flyover (Towards Jurong)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/5795.html';
break;
case '33':
	//Bedok North (Towards Jurong)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/5794.html';
break;

	//Seletar Expressway (SLE)
case '34':
	//Lentor Flyover (Towards TPE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/9701.html';
break;
case '35':
	//Seletar Flyover (Towards BKE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/7798.html';
break;

	//Tampines Expressway (TPE)
case '36':
	//Rivervale Drive (Towards SLE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/7796.html';
break;
case '37':
	//Upper Changi Flyover
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/7791.html';
break;

	//Tuas Checkpoint
case '38':
	//Second link at Tuas
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4703.html';
break;
case '39':
	//Tuas Checkpoint
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4713.html';
break;
case '40':
	//After Tuas West Road
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4712.html';
break;

	//Woodlands Checkpoint
case '41':
	//Woodlands Causeway (Towards Johor)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/2701.html';
break;
case '42':
	//Woodlands Checkpoint (Towards BKE)
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/2702.html';
break;

	//Kallang-Paya Lebar Expressway (KPE)
case '43':
	//KPE/ECP
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1001.html';
break;
case '44':
	//Kallang Way Flyover
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1004.html';
break;
case '45':
	//KPE/PIE
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1003.html';
break;
case '46':
	//Kallang Bahru
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1002.html';
break;
case '47':
	//Defu Flyover
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1005.html';
break;
case '48':
	//KPE 8.5km
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/1006.html';
break;

	//Sentosa Gateway
case '49':
	//To HarbourFront
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4798.html';
break;
case '50':
	//To Sentosa
	$url = 'http://www.onemotoring.com.sg/trafficsmart/images/4799.html';
break;
}


$ch = curl_init();
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_FRESH_CONNECT,true);
curl_setopt($ch,CURLOPT_FAILONERROR,true);
curl_setopt($ch,CURLOPT_TIMEOUT,2);
curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);

$output = curl_exec($ch);
$info = curl_getinfo($ch);

if ($output === false || $info['http_code'] != 200) 
{
	echo 'error|';
	print_r($info);
 }
else
{
	$pos = strpos($output,'View from');
	$output = substr_replace($output,'',0,$pos);

	$pos = strpos($output,'<');
	$camera = substr($output,0,$pos);

	$pos = strpos($output,'Time:');
	$output = substr_replace($output,'',0,$pos);
	$pos = strpos($output,'<');
	$time = substr($output,0,$pos);

	$pos = strpos($output,'<img');
	$output = substr_replace($output,'',0,$pos);
	$pos = strpos($output,'>');
	$img = substr($output,0,$pos);
	$pos = strpos($img,'src="');
	$img = substr_replace($img,'',0,$pos+5);
	$pos = strpos($img,'"');
	$img = substr($img,0,$pos);

	echo $camera.'|';
	echo $time.'|';
	echo $img;
}

?>