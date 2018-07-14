function status_user(class1,class2)
{
	var status_user = ['online','offline','dnd','bys'];
	$.each(status_user,function(k,v){
		$('.'+class1).removeClass(v);
	});
		$('.'+class1).addClass(class2);

}

$(document).ready(function(){

   		 var mylist = [];
   		 $('.user').each(function(){
				var uid = $(this).attr('uid');
				 mylist.push(uid);
			});

   		 //////
   		 var my_status = $('.current_status').attr('status');

   		var socket = io.connect('http://localhost:5000',{
   			query:'user_id='+user_id+'&username='+username+'&mylist='+mylist.join(',')+'&status='+my_status
   		});


   		var array_emit = ['is_online','iam_online','iam_offline','new_status'];
   		$.each(array_emit,function(k,v){
   			socket.on(v,function(data){
   				status_user(data.user_id,data.status);
   			});

   		});
   		
   		

		socket.on('connect',function(data){
			$('.user').each(function(){
				var uid = $(this).attr('uid');
				socket.emit('check_online',{
					user_id:'user_'+uid
				});
			});
		});



		$(document).on('click','.status',function(){
			var status_user = $(this).attr('status');
			$('.current_status').attr('status',status_user);

			if(status_user == 'dnd')
			{
			 $('.current_status').text("don't disturb");
			}else if(status_user == 'bys'){
			 $('.current_status').text('Busy');
			}else{	
			 $('.current_status').text(status_user);
			}

			socket.emit('change_status',{
				status:status_user
			});
		});

		 

   		   
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
	

	function private_chatbox(username,userID)
	{
	 if ($.inArray(userID, arr) != -1)
	 {
      arr.splice($.inArray(userID, arr), 1);
     }
	 
	 arr.unshift(userID);
	 chatPopup =  '<div class="msg_box box'+userID+'" style="right:270px" rel="'+userID+'">'+
					'<div class="msg_head">'+username +
					'<div class="close">x</div> </div>'+
					'<div class="msg_wrap"> <div class="msg_body">	<div class="msg_push"></div> </div>'+
					'<div class="msg_footer"><textarea class="msg_input" rows="4"></textarea></div> 	</div> 	</div>' ;					
				
      $("body").append(  chatPopup  );
	  displayChatBox();
	}



	$(document).on('click', '#sidebar-user-box', function() {
		var userID = $(this).attr("uid");
	   var username = $(this).children().text() ;
	   private_chatbox(username,'user_'+userID);
	 
	});

	socket.on('new_private_msg',function(data){
		/*
		username:socket.username,
				from_uid:socket.id,
				message:data.message
		*/
		//msg_box
		if(!$('.msg_box').hasClass('box'+data.from_uid))
		{	
		 private_chatbox(data.username,data.from_uid);
		}
		$('<div class="msg-right">'+data.username+':'+data.message+'</div>').insertBefore('[rel="'+data.from_uid+'"] .msg_push');
		$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
	});
	
	
	$(document).on('keypress', 'textarea' , function(e) {       
        if (e.keyCode == 13 ) { 		
            var msg = $(this).val();		
			$(this).val('');
			if(msg.trim().length != 0){				

			var chatbox = $(this).parents().parents().parents().attr("rel");
			socket.emit('send_private_msg',{
				message:msg,
				to:chatbox
			})
			//$('<div class="msg-right">'+username+':'+msg+'</div>').insertBefore('[rel="'+chatbox+'"] .msg_push');
			//$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
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