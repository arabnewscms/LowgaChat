'use strict';

class Socket{

	constructor(socket){
		this.io = socket;
		this.online_users = [];
		this.status = '';
	}

	online_sockets(){
		return Object.keys(this.io.sockets.sockets);
	}

	ioConfig(){
		this.io.use((socket,next)=>{
			socket['id']     = 'user_'+socket.handshake.query.user_id;

			if(socket.handshake.query.mylist != '' || socket.handshake.query.mylist !== 'undefined'){	
			 socket['my_friend']     = socket.handshake.query.mylist.split(',');
			}else{
			 socket['my_friend']     = [];	
			}

			if(socket.handshake.query.username != '' || socket.handshake.query.username !== 'undefined'){	
			 socket['username']     = socket.handshake.query.username;
			}else{
			 socket['username']     = [];	
			}

		 	if(socket.handshake.query.status != '' || socket.handshake.query.status !== 'undefined'){
			 socket['status']     = socket.handshake.query.status;
			}else{
			 socket['status']     = 'online';
			}

			next();
		});
	}

	online(user_id){
		if(this.online_users.indexOf(user_id) != -1){
			return true;
		}else{
			return false;
		}
	}

	emit(user_id,name,data){
		if(this.online(user_id)){
		 this.io.sockets.connected[user_id].emit(name,data);
		}
	}

/////////// Check Online or OFfline Users //////////
	response_status(socket)
	{
		socket.on('response_status',(data)=>{
				this.emit(data.to_user,'is_online',{status:data.my_status,user_id:socket.id});
		});
	}

	check_online(socket)
	{
		socket.on('check_online',(data)=>{

				this.emit(data.user_id,'iam_online',{user_id:socket.id,status:socket.status});
				this.emit(data.user_id,'request_status',{user_id:socket.id,});

				this.emit(socket.id,'is_online',{user_id:data.user_id,status:'online'});
				this.emit(socket.id,'is_online',{user_id:data.user_id,status:'offline'});
 			 
			});
	}
/////////// Check Online or OFfline Users //////////


	socketConnection(){
 		this.ioConfig();
		this.io.on('connection',(socket)=>{
			this.online_users = this.online_sockets();
			this.check_online(socket);
			this.user_status(socket);
			this.broadcast_private(socket);
			this.response_status(socket);
			this.private_message(socket); // Here A Begin A Private Message from user to user
			this.socketDisconnect(socket); // DisConnect User List
		});
	}

	user_status(socket){
		socket.on('change_status',(data)=>{
			var myfirend = socket.my_friend;
			if(myfirend.length > 0){
			 	myfirend.forEach((user)=>{
					this.emit('user_'+user,'new_status',{user_id:socket.id,status:data.status});
			 	});		
			}
		 });
	}

	broadcast_private(socket){
		socket.on('broadcast_private',(data)=>{
			this.emit(data.to,'new_broadcast',{from:socket.id,to:data.to,username:data.username});
		});
	}

	private_message(socket){
		socket.on('send_private_msg',(data)=>{
		this.emit(socket.id,'new_private_msg',{username:socket.username,from_uid:data.to,whois:socket.id,message:data.message});
		this.emit(data.to,'new_private_msg',{username:socket.username,from_uid:socket.id,whois:socket.id,message:data.message});
		});
	}

	socketDisconnect(socket)
	{
		socket.on('disconnect',(data)=>{

		 	var myfirend = socket.my_friend;
		 	if(myfirend.length > 0)
			{
			 	myfirend.forEach((user)=>{
			 		this.emit('user_'+user,'iam_offline',{user_id:socket.id,status:'offline'});
			 	});		
		 	}
		 	socket.disconnect();
		 	var index = this.online_users.indexOf(socket.id);
		 	this.online_sockets().splice(index,1);
		 	this.online_users.splice(index,1);
		});
	}
}

module.exports = Socket;