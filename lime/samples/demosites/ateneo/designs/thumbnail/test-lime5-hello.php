<?xml version="1.0" encoding="UTF-8" ?>
<?bml bml-version="100.0" ?>
<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>first LIME-PHP</title>
<style><![CDATA[
		p	{left:200px;top:200px;
		width:300px;height:300px;
		background-color-index:4;
		color-index:7;
		font-size:24px;
	}
	#text {left:100px;top:20px;
		width:650px;height:200px;
		background-color-index:2;
		color-index:0;
		font-size:36px;
	}

]]></style>
         <script><![CDATA[
            var txt = document.getElementById("text");
            txt.firstChild.data="Hello,world! \n\nWelcome to my first LIME PHP.";
           ]]></script>
    </head>
    <body style="background-color-index:7";>
        <p id="text"><![CDATA[ ]]></p>

<p>
<?php


$i = 1;
while ($i <= 10) {
    echo $i++;  
}

echo "<br/>";

$i = 1;
while ($i <= 10):
    echo $i;
    $i++;
endwhile;
?>

</p>

    </body>
</html>
