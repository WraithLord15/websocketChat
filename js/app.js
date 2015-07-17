(function(){
	var app = angular.module('myApp', ['ui.bootstrap']);
	

	app.factory('websocketClient', function() {
		var websocketClient = {};
		
		websocketClient.setup = function() {
			if(websocketClient.ws) {
				return;
			}

			var ws = new WebSocket('ws://10.0.0.12:3000');
			ws.onopen = function(){
				console.log('opened');
			};
			
			ws.onerror = function() {
				console.log('there was an error');
			};
			
			ws.onclose = function() {
				console.log('socket closed');
			};
			
			ws.onmessage = function(message) {
				var data = JSON.parse(message.data);
				websocketClient.callback(data);
				console.log('message says: ' + data.message);
			};
			
			websocketClient.ws = ws;
		};
		
		websocketClient.send = function(msg) {
			console.log('sending');
			websocketClient.ws.send(msg);
		};
		
		websocketClient.subscribe = function(callback) {
    		websocketClient.callback = callback;
  		}
		
		return websocketClient;
	});

	app.controller('ChatController', ['websocketClient','$scope', 
		function(websocketClient, $scope) {
		$scope.messages = [];
		this.text = '';
		websocketClient.setup();
		
		this.testSend = function() {
			if(this.text !== '') {
				websocketClient.send(this.text);
				this.text = '';
			}
		};
		
		websocketClient.subscribe(function(message) {
		    if(message.type == 'message') {
			    $scope.messages.push(message.message);
			} else if (message.type == 'numClients') {
			    $scope.numClients = message.message;
			}
			$scope.$apply();
		});
		
	}]);

	app.controller('UserListController', function () {
	    this.testUserList = ['Randell', 'Alexa'];
	});
})();