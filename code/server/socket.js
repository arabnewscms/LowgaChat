'use strict';

class Socket{

	constructor(socket)
	{
		this.io = socket;
	}

	ioConfig()
	{
		this.io.use((socket,next)=>{
			socket['id'] = socket.handshake.query.user_id;
			console.log(socket.id);
			next();
		});
	}

	socketConnection()
	{
		
 		this.ioConfig();

		this.io.on('connection',(socket)=>{
			console.log('a new visitor here as session id => ',socket.id);
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