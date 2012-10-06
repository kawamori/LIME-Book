	var cur_selected_num;
	var cur_selected_alphabet;
	var cur_selected_sign;
	var temp;
	var num_alphabet;
	var cur_selected_small_frame;
		var alphabet_table=new Array();
		var pronunciation_table new Array();
		var cur_display new Array();
		
	 alphabet_table= Array(
						Array(0,45,46,47,48,49,50,51,52,0,0,0,0,0),
						Array(0,1,2,3,4,5,0,0,0,0,0,0,0,0),
						Array(0,6,7,8,9,0,0,0,0,0,0,0,0,0),
						Array(0,10,11,12,13,0,0,0,0,0,0,0,0,0),
						Array(0,14,15,16,17,18,19,0,0,0,0,0,0,0),
						Array(0,20,21,22,23,24,0,0,0,0,0,0,0,0),
						Array(0,25,26,27,28,29,0,0,0,0,0,0,0,0),
						Array(0,30,31,32,33,34,0,0,0,0,0,0,0,0),
						Array(0,35,36,37,38,39,0,0,0,0,0,0,0,0),
						Array(0,40,41,42,43,44,0,0,0,0,0,0,0,0),
						Array(0,53,54,55,56,57,58,59,60,61,62,63,64,65));
	
	pronunciation_table= Array(
						Array("","ee","aee","oo","ay","ay","a","aa","am","","","","",""),
						Array("","k","kh","kh","kh","kh","","","","","","","",""),
						Array("","kh","ng","c","ch","","","","","","","","",""),
						Array("","ch","s","ch","y","","","","","","","","",""),
						Array("","d","t","th","d or th","th","n","","","","","","",""),
						Array("","d","t","th","th","th","","","","","","","",""),
						Array("","n","b","p","ph","f","","","","","","","",""),
						Array("","ph","f","ph","m","y","","","","","","","",""),
						Array("","r","l","l","v","s","","","","","","","",""),
						Array("","s","s","h","a","h","","","","","","","",""),
						Array("","a","i","ii","ue","uee","u","uu","au","","","","",""));
	
	cur_display= Array(Array(0,0,0,0,0,0));
	
	function load(){	}
	
	function num_keypress(){	}
	
	function alphabet_keypress(){ 	}
	function small_frame_keypress(){ 	}
	
	function large_frame_keypress(){ }
	
	function del_alphabet(){ 	}
	
	function clear_alphabet_button(){ }

	