var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , uuid = require('node-uuid');

var server = http.createServer(app);
server.listen(3000);
console.log('listening on 3000');

var wss = new WebSocketServer({server: server});
wss.broadcast = function(msg) {
	for (var i in this.clients){
		this.clients[i].send(msg);
	}
};

var msgList = [];
var numClients = 0;

wss.on('connection', function(ws) {
  	console.log('client connected');
  	numClients = numClients + 1;
  	for(var i = 0; i < msgList.length; i++) {
  		ws.send(constructMessage("message", msgList[i]));
  	}
//  	ws.send("numClients", numClients);
  	ws.on('message', function(msg){
  		console.log('got message: ' + msg);
  		msgList.push(msg);
//   	ws.send(msg);
		wss.broadcast(msg);
  	});
  	ws.on('close', function() {
    	console.log('client left');
    	numClients = numClients - 1;
  	});
});

//construct a message to send to client
function constructMessage(type, msg) {
    var message = {
        "type" : type,
        "message" : msg
    };

    return message;
}