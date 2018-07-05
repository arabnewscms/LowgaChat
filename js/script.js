$(document).ready(function(){
     
	 var arr = []; // List of users	
	
	$(document).on('click', '.msg_head', function() {	
		var chatbox = $(this).parents().attr("rel") ;
		$('[rel="'+chatbox+'"] .msg_wrap').slideToggle('slow');
		return false;
	});
	
	
	$(document).on('click', '.close', function() {	
		var chatbox = $(this).parents().parents().attr("rel") ;
		$('[rel="'+chatbox+'"]').hide();
		arr.splice($.inArray(chatbox, arr), 1);
		displayChatBox();
		return false;
	});
	
	$(document).on('click', '#sidebar-user-box', function() {
	
	 var userID = $(this).attr("class");
	 var username = $(this).children().text() ;
	 
	 if ($.inArray(userID, arr) != -1)
	 {
      arr.splice($.inArray(userID, arr), 1);
     }
	 
	 arr.unshift(userID);
	 chatPopup =  '<div class="msg_box" style="right:270px" rel="'+ userID+'">'+
					'<div class="msg_head">'+username +
					'<div class="close">x</div> </div>'+
					'<div class="msg_wrap"> <div class="msg_body">	<div class="msg_push"></div> </div>'+
					'<div class="msg_footer"><textarea class="msg_input" rows="4"></textarea></div> 	</div> 	</div>' ;					
				
     $("body").append(  chatPopup  );
	 displayChatBox();
	});
	
	
	$(document).on('keypress', 'textarea' , function(e) {       
        if (e.keyCode == 13 ) { 		
            var msg = $(this).val();		
			$(this).val('');
			if(msg.trim().length != 0){				
			var chatbox = $(this).parents().parents().parents().attr("rel") ;
			$('<div class="msg-right">'+msg+'</div>').insertBefore('[rel="'+chatbox+'"] .msg_push');
			$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
			}
        }
    });
	
		
    
	function displayChatBox(){ 
	    i = 270 ; // start position
		j = 260;  //next position
		
		$.each( arr, function( index, value ) {  
		   if(index < 4){
	         $('[rel="'+value+'"]').css("right",i);
			 $('[rel="'+value+'"]').show();
		     i = i+j;			 
		   }
		   else{
			 $('[rel="'+value+'"]').hide();
		   }
        });		
	}
	
	
	
	
});