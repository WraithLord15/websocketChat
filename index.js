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
  	wss.broadcast(constructMessage("connect", "A Client has joined", "green"));
  	numClients = numClients + 1;
    for(var i = 0; i < msgList.length; i++) {
  		ws.send(msgList[i]);
  	}
  	wss.broadcast(constructMessage("numClients", numClients));
  	ws.on('message', function(msg){
  		console.log('got message: ' + msg);
  		var message = constructMessage("message", msg, "black");
  		msgList.push(message);
		wss.broadcast(message);
  	});
  	ws.on('close', function() {
    	console.log('client left');
    	numClients = numClients - 1;
    	wss.broadcast(constructMessage("disconnect","A Client has left", "red"))
  	});
});

//construct a message to send to client
function constructMessage(type, msg, clr) {
    var date = Date.now();
    var message = {
        "type" : type,
        "message" : msg,
        "color" : clr,
        "date" : date
    };

    return JSON.stringify(message);
}