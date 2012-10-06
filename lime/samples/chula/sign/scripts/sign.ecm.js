	var cur_selected_num;
	var cur_selected_alphabet;
	var cur_selected_sign;
	var temp;
	var num_alphabet;
	var cur_selected_small_frame;
	
	var alphabet_table=new Array(
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
	
	var pronunciation_table=new Array(
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
	var cur_display=new Array(Array(0,0,0,0,0,0));
	
	function load(){
		document.getElementById("num").focus();
		cur_selected_num = 1;
		cur_selected_alphabet = 1;
		cur_selected_sign = 1;
		cur_selected_small_frame = 1;
	}
	function num_keypress(){
	
		var keycode=document.currentEvent.keyCode;
		if(keycode==1 || keycode==2 || keycode==3 || keycode==4){ /* Up or Down */
			var num_button_element_id="num"+cur_selected_num.toString()+"_button";
			document.getElementById(num_button_element_id).data="media/button"+cur_selected_num.toString()+"_up.jpg";
			if(keycode==1) { /*Up*/
				if(cur_selected_num == 0)
					cur_selected_num = 10;
				else
					cur_selected_num--;
			}
			if(keycode==2) { /* Down */
				if(cur_selected_num==10)
					cur_selected_num=0;
				else
					cur_selected_num++;
			}
			if(keycode==4) { /* Right */
				if(cur_selected_num<7 && cur_selected_num!=0)
					cur_selected_num = cur_selected_num+4;
				else if(cur_selected_num==7)
					cur_selected_num=0;
				else if(cur_selected_num==0)
					cur_selected_num=0;
			}
			if(keycode==3) { /* left */
				if(cur_selected_num>4)
					cur_selected_num = cur_selected_num-4;
				else if(cur_selected_num==0)
					cur_selected_num = 7;
				
			}
			var num_button_element_id="num"+cur_selected_num.toString()+"_button";
			document.getElementById(num_button_element_id).data="media/button"+cur_selected_num.toString()+"_pressed.jpg";
			
			
		}
		if(keycode==24){ /* Yellow Key : Play Mode */
		    cur_selected_small_frame=1;
			document.getElementById("small_frame1").focus();
			clear_alphabet_button();
		}
		
		if(keycode==21){ /*Blue Key : Go to Main Page */
		
		}
		if(keycode==22){ /* Red Key : Go to Instruction Page */
			browser.launchDocument("instruction.bml", "cut");	
		}
		
		
		if(keycode==18){
			clear_alphabet_button();
			num_alphabet=0;
			for (i = 1;i<= 13;i++){
				if(alphabet_table[cur_selected_num][i]!=0){
					num_alphabet++;
					document.getElementById("alpha"+i.toString()+"_button").data="media/"+alphabet_table[cur_selected_num][i].toString()+"_up.jpg";
					if(i==1)
						document.getElementById("alpha"+i.toString()+"_button").data="media/"+alphabet_table[cur_selected_num][i].toString()+"_pressed.jpg";
				}
			}

			cur_selected_alphabet = 1;
			document.getElementById("pronunce_button").data = "media/"+alphabet_table[cur_selected_num][1].toString()+"_up.jpg";
		    document.getElementById("pronunce_text").firstChild.data = pronunciation_table[cur_selected_num][1];
			document.getElementById("alphabet").focus();
			
		}
		
		if(keycode==19){
			del_alphabet();
		}
		
	}
	
	function alphabet_keypress(){
		var keycode=document.currentEvent.keyCode;
		if(keycode==1 || keycode==2 || keycode==3 || keycode==4){ /* Up or Down */
			var alphabet_button_element_id="alpha"+cur_selected_alphabet.toString()+"_button";
			document.getElementById(alphabet_button_element_id).data="media/"+alphabet_table[cur_selected_num][cur_selected_alphabet].toString()+"_up.jpg";
			
			if(keycode==1) { /* Up */
				if(cur_selected_alphabet==1)
					cur_selected_alphetbet=1;
				else
					cur_selected_alphabet--;
			}
			if(keycode==2) { /* Down */
				if(cur_selected_alphabet == num_alphabet){
					cur_selected_alphabet = num_alphabet;}
				else{
					cur_selected_alphabet++;}
			}
			if(keycode==4) { /* right*/ 
				if(cur_selected_alphabet+4==13){
					cur_selected_alphabet = cur_selected_alphabet;}
				else if(cur_selected_alphabet+4<= num_alphabet){
					cur_selected_alphabet = cur_selected_alphabet+4;}
			}	
			if(keycode==3) { /* left */
				if(cur_selected_alphabet==13){
					cur_selected_alphabet=13;}
				else if(cur_selected_alphabet-4>0){
					cur_selected_alphabet = cur_selected_alphabet-4;}
			}
			var alphabet_button_element_id="alpha"+cur_selected_alphabet.toString()+"_button";
			document.getElementById(alphabet_button_element_id).data="media/"+alphabet_table[cur_selected_num][cur_selected_alphabet].toString()+"_pressed.jpg";
			document.getElementById("pronunce_button").data="media/"+alphabet_table[cur_selected_num][cur_selected_alphabet].toString()+"_up.jpg";
			document.getElementById("pronunce_text").firstChild.data=pronunciation_table[cur_selected_num][cur_selected_alphabet];
			
			
		}
		
		if(keycode==24){ /* Yellow Key : Play Mode */ 
		    cur_selected_small_frame=1;
			document.getElementById("small_frame1").focus();
			clear_alphabet_button();
		}
		
		if(keycode==18){
			if(cur_selected_sign<=5){
				document.getElementById("sign"+cur_selected_sign.toString()+"_char").data="media/"+alphabet_table[cur_selected_num][cur_selected_alphabet].toString()+"_up.jpg";
				
				/*document.getElementById("sign"+cur_selected_sign.toString()+"_pic").data="media/dummy.mng";*/
				
				cur_display[cur_selected_sign]=alphabet_table[cur_selected_num][cur_selected_alphabet].toString();
				
				/*uncomment here for Real MNG*/
				document.getElementById("sign"+cur_selected_sign.toString()+"_pic").data="media/"+alphabet_table[cur_selected_num][cur_selected_alphabet].toString()+".mng";
				
				cur_selected_sign++;
			}
			document.getElementById("num").focus();
			clear_alphabet_button();
		}
		if(keycode==21){ /* Blue Key : Go to Main Page */
		
		}
		if(keycode==22){ /* Red Key : Go to Instruction Page */
			browser.launchDocument("instruction.bml", "cut");	
		}
		if(keycode==19){
			del_alphabet();}
	}
	function small_frame_keypress(){
		var keycode=document.currentEvent.keyCode;
		if(keycode==23){ /* Green : Back to Edit Mode */
			document.getElementById("num").focus();
		}
		if(keycode==3 || keycode==4){ /* left & right */
			if(keycode==3){ /* left*/
				if(cur_selected_small_frame>1){
				  cur_selected_small_frame--;
				  document.getElementById("small_frame"+cur_selected_small_frame.toString()).focus();
				}
			}
			
			if(keycode==4){ /* right */
				if(cur_selected_small_frame<5){
					cur_selected_small_frame++;
					document.getElementById("small_frame"+cur_selected_small_frame.toString()).focus();
				}
			}
		}
		
		if(keycode==18){ /* enter */
			if(document.getElementById("sign"+cur_selected_small_frame.toString()+"_char").data!=""){
				document.getElementById("large_frame_alpha_button").data=document.getElementById("sign"+cur_selected_small_frame.toString()+"_char").data;
				/*document.getElementById("large_frame_sign_pic").data="media/dummy_big.mng";*/
				/*uncomment here for Real MNG */
				document.getElementById("large_frame_sign_pic").data="media/"+cur_display[cur_selected_small_frame].toString()+"_big.mng";
				/* For Debug Purpose */
				document.getElementById("dbug").firstChild.data=document.getElementById("large_frame_sign_pic").data;
			}
			document.getElementById("large_frame").focus();
		}
			
	}
	
	function large_frame_keypress(){
		var keycode=document.currentEvent.keyCode;
		if(keycode==18){ /* enter */
			document.getElementById("small_frame"+cur_selected_small_frame.toString()).focus();
			document.getElementById("large_frame_alpha_button").data="";
			document.getElementById("large_frame_sign_pic").data="";
			document.getElementById("dbug").firstChild.data="No Input Alphabet";
		}
	}
	function del_alphabet(){
		
		if(cur_selected_sign>1){
			document.getElementById("sign"+(cur_selected_sign-1).toString()+"_char").data="";
			document.getElementById("sign"+(cur_selected_sign-1).toString()+"_pic").data="";
			cur_selected_sign--;
			cur_display[cur_selected_sign]=0;
			
		}
		else{
			document.getElementById("sign1_char").data="";
			document.getElementById("sign1_pic").data="";
		}
			
	}
	
	function clear_alphabet_button(){
		for (i = 1;i<= 13;i++){
			document.getElementById("alpha"+i.toString()+"_button").data="";
		}
		document.getElementById("pronunce_text").firstChild.data="";
		document.getElementById("pronunce_button").data="";
	}

	