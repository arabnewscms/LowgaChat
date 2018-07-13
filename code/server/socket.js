'use strict';

class Socket{

	constructor(socket)
	{
		this.io = socket;
		this.online_users = [];
	}

	ioConfig()
	{
		this.io.use((socket,next)=>{
			socket['id'] = 'user_'+socket.handshake.query.user_id;
			next();
		});
	}


/////////// Check Online or OFfline Users //////////
	check_online(socket)
	{
		socket.on('check_online',(data)=>{

				if(this.online_users.indexOf(data.user_id) != -1)
				{
					var status = 'online';
	 				this.io.sockets.connected[data.user_id].emit('iam_online',{
	 					user_id:socket.id,
	 					status:'online'
	 				});
				}else{
					var status = 'offline';
				}
 				
 				this.io.sockets.connected[socket.id].emit('is_online',{
 					user_id:data.user_id,
 					status:status
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
			
		 	//console.log(this.io.sockets.clients());	
		    //console.log('a new visitor here as session id => ',socket.id);
		   
 

			this.socketDisconnect(socket); // DisConnect User List
		});
	}


	socketDisconnect(socket)
	{
		socket.on('disconnect',(data)=>{
		 
		});
	}
}

module.exports = Socket;