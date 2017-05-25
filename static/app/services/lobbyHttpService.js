angular.module("backgammonApp")
    .factory('LobbyHttpService', ['$q', '$http', 'Auth', function($q, $http, auth){
      return{
        openNewGameRoom: () => {
          var deferred = $q.defer();

      		console.log("Will send request to open a new game room...")
      		var headers = { 'Content-Type':'application/json', 'Accept':'application/json' }
      		var config = { method:'POST', url:'http://localhost:3000/lobby/room', headers:headers, data:JSON.stringify({'username':auth.currentUser().userName})};

      		$http(config).then(function onSuccess(response){
      			console.log("A new game room created...");
      			  deferred.resolve(response);
      		}, function onError(response){
              deferred.reject("An error occured while trying to open a new game room..." + "Status code = " + response.status + ", text = " + response.statusText);
      		});

          return deferred.promise;
      	},
        watchGame: (selectedGameRoomName) => {
          var deferred = $q.defer();

      		console.log("Will try to add user as watcher...")
      		var headers = { 'Content-Type':'application/json', 'Accept':'application/json' }
      		var config = { method:'PUT', url:'http://localhost:3000/lobby/room/watcher', headers:headers,
            data:JSON.stringify({'username':auth.currentUser().userName, 'gameRoomName':selectedGameRoomName}) };

      		$http(config).then(function onSuccess(response){
            deferred.resolve(response);
      		}, function onError(response){
      			deferred.reject("Failed to add watcher into game room, try again later...");
      		});

          return deferred.promise;
      	},
        joinGame: (selectedGameRoomName) => {
          var deferred = $q.defer();

      		console.log("Will try to add user as second player...")
      		var headers = { 'Content-Type':'application/json', 'Accept':'application/json' }
      		var config = { method:'PUT', url:'http://localhost:3000/lobby/room/second/player', headers:headers,
            data:JSON.stringify({'username':auth.currentUser().userName, 'gameRoomName':selectedGameRoomName}) };

      		$http(config).then(function onSuccess(response){
            deferred.resolve(response);
      		}, function onError(response){
      			deferred.reject("Failed to add watcher into game room, try again later...");
      		});

          return deferred.promise;
        },
        closeGameRoom: () => {
          var deferred = $q.defer();

      		var headers = { 'Content-Type':'application/json', 'Accept':'application/json' }
      		var config = { method:'DELETE', url:'http://localhost:3000/lobby/room/close', headers:headers,
            data:JSON.stringify({'username':auth.currentUser().userName}) };

      		$http(config).then(function onSuccess(response){
      			var isGameRoomDeleted = JSON.parse(response.data);
            deferred.resolve(isGameRoomDeleted);
      		}, function onError(response){
      			console.log("Failed to delete and close game room...");
      			console.log("Status code = " + response.status + ", text = " + response.statusText);
            deferred.reject("Failed to delete and close game room, try again later...");
      		});

          return deferred.promise;
      	}
      }
    }]);
