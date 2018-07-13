'use strict';

class Socket{

	constructor(socket)
	{
		this.io = socket;
		this.online_users = [];
		this.status = '';
	}

	ioConfig()
	{
		this.io.use((socket,next)=>{
			socket['id']     = 'user_'+socket.handshake.query.user_id;

			if(socket.handshake.query.mylist != '' || socket.handshake.query.mylist != 'undefined')
			{	
			 socket['my_friend']     = socket.handshake.query.mylist.split(',');
			}else{
			 socket['my_friend']     = [];	
			}

			 

			if(this.status != '')
			{
				socket['status'] = this.status;
			}else if(socket.handshake.query.status != '' || socket.handshake.query.status != 'undefined'){
				socket['status']     = socket.handshake.query.status;
				this.status          = socket.handshake.query.status;
			}

			next();
		});
	}


/////////// Check Online or OFfline Users //////////
	check_online(socket)
	{
		socket.on('check_online',(data)=>{
				if(this.online_users.indexOf(data.user_id) != -1)
				{
					var status = 'online' ;
	 				this.io.sockets.connected[data.user_id].emit('iam_online',{
	 					user_id:socket.id,
	 					status:status 
	 				});
				}else{
					var status = 'offline';
				}
 				
 				this.io.sockets.connected[socket.id].emit('is_online',{
 					user_id:data.user_id,
 					status:this.status
 				});
			});
	}
/////////// Check Online or OFfline Users //////////


	socketConnection()
	{
		
 		this.ioConfig();
		this.io.on('connection',(socket)=>{
			this.online_users = Object.keys(this.io.sockets.sockets);

			this.check_online(socket);

			this.user_status(socket);
				


		 	//console.log(this.io.sockets.clients());	
		    //console.log('a new visitor here as session id => ',socket.id);
		   
 

			this.socketDisconnect(socket); // DisConnect User List
		});
	}

	user_status(socket)
	{
		socket.on('change_status',(data)=>{
			var myfirend = socket.my_friend;
			if(myfirend.length > 0)
			{
				this.status = data.status;
			 	myfirend.forEach((user)=>{
			 			var uid = 'user_'+user;
			 		if(this.online_users.indexOf(uid) != -1)
			 		{		
			 			this.io.sockets.connected[uid].emit('new_status',{
		 					user_id:socket.id,
		 					status:data.status
		 				});
		 			 
			 		}
			 	});		
			}
		 });

	}

	socketDisconnect(socket)
	{
		socket.on('disconnect',(data)=>{
		 	var myfirend = socket.my_friend;
		 	if(myfirend.length > 0)
			{
			 	myfirend.forEach((user)=>{
			 			var uid = 'user_'+user;
			 		if(this.online_users.indexOf(uid) != -1)
			 		{		  
			 			this.io.sockets.connected[uid].emit('iam_offline',{
		 					user_id:socket.id,
		 					status:'offline'
		 				});
			 		}
			 	});		
		 	}
		});
	}
}

module.exports = Socket;