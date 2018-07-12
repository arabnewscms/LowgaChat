'use strict';

class Socket{

	constructor(socket)
	{
		this.io = socket;
	}


	socketConnection()
	{
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