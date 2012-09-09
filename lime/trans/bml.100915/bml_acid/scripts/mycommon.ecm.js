//Some utility functions to make things easier

function println(str,display){
	var obj = document.getElementById(display);
	obj.firstChild.data += str + "\r\n";
}

function print(str,display){
	var obj = document.getElementById(display);
	obj.firstChild.data = str ;
}


function printd(str){
	var obj = document.getElementById("display");
	obj.firstChild.data = str ;
}


function printlnd(str){
	var obj = document.getElementById("display");
	obj.firstChild.data += str + "\r\n";
}


function alert(str){
	var obj = document.getElementById("display");
	obj.firstChild.data += str + "\r\n";
}

function $(id) {
		return document.getElementById(id);
	}

function setTimeout(code,delay){
         return   browser.setInterval(code,delay,1);
        }
        

function replace(str,reg,replaced){

return str.substring(0,str.indexOf(reg)) + replaced +str.substring(str.indexOf(reg)+reg.length,str.lastIndexOf(""));

}

