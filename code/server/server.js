'use strict';

const express = require('express');
const http    = require('http');
const socket  = require('socket.io');

const SocketServer = require('./socket');
class Server{

	constructor()
	{
		this.port = 5000;
		this.host = 'localhost';

		this.app = express();
		this.http = http.Server(this.app); // Node Js Server 
		this.socket = socket(this.http,false);  // Here Run a Socket io Module
	}

	runServer()
	{

		new SocketServer(this.socket).socketConnection(); // This Is socket Class
		

		/* Listening A node Js Server */
		this.http.listen(this.port,this.host,()=>{
			console.log(`the server is runing at http://${this.host}:${this.port}`);
		});
		/* Listening A node Js Server */
	}

}

const app = new Server();
app.runServer(); // Run The Server Class