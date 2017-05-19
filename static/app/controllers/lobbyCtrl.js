angular.module("backgammonApp").controller("LobbyCtrl", ['$scope', '$http', 'VirtualLobby', 'Auth', '$rootScope', '$parse', 'SocketioLobby',
function($scope, $http, VirtualLobby, Auth, $rootScope, $parse, socketioLobby){
	$scope.rooms = VirtualLobby.virtualGameRooms.reverse();
	$scope.users = VirtualLobby.usersInLobby;
	$scope.isOpenRoom = false;
	$scope.select = "Select";
	$scope.register_error = false;
	$scope.isMadeSelection = false;

	var selectedGameRoomName;

	var initLobby = function(){
		loadAllGamesRooms();

		var rooms = $scope.rooms;

		for(i=0; i<rooms.length; i++){
			var model = $parse(rooms[i].name)
			model.assign($scope, false);
		}
	};

	var loadAllGamesRooms = function(){
		console.log("Will try to load all game rooms...")

		var headers = {'Content-Type':'application/json', 'Accept':'application/json'}

		var config = {
			method:'GET',
			url:'http://localhost:3000/lobby/room/all',
			headers:headers
		};

		$http(config).then(function onSuccess(response){
			console.log("Loading all game rooms...");
			if(response.status == 200){
				var rooms = JSON.parse(response.data);

				for(i=0; i<rooms.gameRooms.length; i++)
					$scope.rooms = addItemToArr($scope.rooms, rooms.gameRooms[i])
			}
		}, function onError(response){
			console.log("An error occured while trying to all game rooms...");
			console.log("Status code = " + response.status + ", text = " + response.statusText);
		});
	};

	socketioLobby.init();
	initLobby();


	$scope.highlightGameRoom = function(gameRoomName){
		if(!$scope.isMadeSelection){
			var model = $parse(gameRoomName)
			model.assign($scope, true);
		}
	};

	$scope.cancelHighlightGameRoom = function(gameRoomName){
		if(!$scope.isMadeSelection){
			var model = $parse(gameRoomName)
			model.assign($scope, false);
		}
	};

	$scope.selectGameRoom = function(gameRoomName){
		if($scope.select == "Select"){
			$scope.isMadeSelection = true;
			var rooms = $scope.rooms;
			for(i=0; i<rooms.length; i++){
				var model = $parse('btn' + rooms[i].name)
				if((rooms[i].name) != gameRoomName) model.assign($scope, true);
				else $scope.select = "Unselect";
			}

			selectedGameRoomName = gameRoomName;
		}
		else if($scope.select == "Unselect"){
			$scope.isMadeSelection = false;

			var rooms = $scope.rooms;
			for(i=0; i<rooms.length; i++){
				var model = $parse('btn' + rooms[i].name)
				if((rooms[i].name) != gameRoomName) model.assign($scope, false);
				else $scope.select = "Select";
			}

			selectedGameRoomName = undefined;
		}
	};

	$scope.openNewGameRoom = function(){
		console.log("Will send request to open a new game room...")

		var headers = {'Content-Type':'application/json', 'Accept':'application/json'}

		var config = {
			method:'POST',
			url:'http://localhost:3000/lobby/room',
			headers:headers,
			data:JSON.stringify({'username':Auth.currentUser().userName})
		};

		$http(config).then(function onSuccess(response){
			console.log("A new game room created...");
			if(response.status == 201){
				var temp = $scope.rooms;
				$scope.rooms = addItemToArr(temp, JSON.parse(response.data).gameRoom);

				$scope.isOpenRoom = true;
				$rootScope.socket.emit('room.open', JSON.parse(response.data).gameRoom)
			}
			else if(response.status == 200){
				console.log("Failed to open new game room...")
				$scope.register_error = "This User already exists in one of the game rooms, thus can not open a new game room..."
			}
		}, function onError(response){
			console.log("An error occured while trying to open a new game room...");
			console.log("Status code = " + response.status + ", text = " + response.statusText);
		});

	};

	$scope.watchGame = function(){
		console.log("Will try to add user as watcher...")

		var headers = {'Content-Type':'application/json', 'Accept':'application/json'}

		var config = {
			method:'PUT',
			url:'http://localhost:3000/lobby/room/watcher',
			headers:headers,
			data:JSON.stringify({'username':Auth.currentUser().userName, 'gameRoomName':selectedGameRoomName})
		};

		$http(config).then(function onSuccess(response){
			var isUserAddedAsWatcher = JSON.parse(response.data);

			if(isUserAddedAsWatcher.userAddedAsWatcher == true){
				$scope.rooms = addUserAsWatcher($scope.rooms, Auth.currentUser().userName, selectedGameRoomName)

				console.log($scope.rooms)
				$rootScope.socket.emit('room.watcher', {'username':Auth.currentUser().userName, 'gameRoomName':selectedGameRoomName})
			}
			else {
				$scope.register_error = "Failed to add watcher into game room, try again later..."
			}
		}, function onError(response){
			console.log("Failed to add watcher into game room...");
			$scope.register_error = "Failed to add watcher into game room, try again later..."
			console.log("Status code = " + response.status + ", text = " + response.statusText);
		});
	};

	$scope.closeGameRoom = function(){
		var headers = {'Content-Type':'application/json', 'Accept':'application/json'}

		var config = {
			method:'DELETE',
			url:'http://localhost:3000/lobby/room/close',
			headers:headers,
			data:JSON.stringify({'username':Auth.currentUser().userName})
		};

		$http(config).then(function onSuccess(response){
			var isGameRoomDeleted = JSON.parse(response.data);

			if(isGameRoomDeleted.gameRoomDeleted == true){
				$scope.rooms = removeRoomByName($scope.rooms, isGameRoomDeleted.gameRoom)
				$scope.isOpenRoom = false;

				$rootScope.socket.emit('room.close', JSON.parse(response.data).gameRoom)
			}
			else {
				$scope.register_error = "Failed to delete and close game room, try again later..."
			}
		}, function onError(response){
			console.log("Failed to delete and close game room...");
			$scope.register_error = "Failed to delete and close game room, try again later..."
			console.log("Status code = " + response.status + ", text = " + response.statusText);
		});
	};

	var addItemToArr = function(arr, item){
		var result = [];
		result.push(item);
		for(i=0; i<arr.length; i++){
			result.push(arr[i]);
		}
		return result;
	};

	var removeRoomByName = function(arr, item){
		var result = [];

		for(i=0; i<arr.length; i++){
			if(arr[i].name != item.name) result.push(arr[i]);
		}

		return result;
	};

	var addUserAsWatcher = function(arr, watcher, gameRoomName){
		var result = [];

		for(i=0; i<arr.length; i++){
			if(arr[i].name == gameRoomName){
					arr[i].watchers.push(watcher);
			}
			result.push(arr[i]);
		}

		return result;
	};
}]);
