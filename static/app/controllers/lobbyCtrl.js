angular.module("backgammonApp").controller("LobbyCtrl",
['$scope', '$http', 'VirtualLobby', 'Auth', '$rootScope',
'$parse', '$location', 'LobbyHttpService',
function($scope, $http, VirtualLobby, Auth, $rootScope, $parse, $location, lobbyHttpService){
	$scope.rooms = VirtualLobby.virtualGameRooms.reverse();
	$scope.users = VirtualLobby.usersInLobby;
	$scope.isOpenRoom = false;
	$scope.select = "Select";
	$scope.register_error = false;
	$scope.isMadeSelection = false;

	var selectedGameRoomName;

	var createRoomModels = () => {
		var rooms = $scope.rooms;

		for(var i=0; i<rooms.length; i++){
			var model = $parse(rooms[i].name)
			model.assign($scope, false);
		}
	};

	var initLobby = function(){
		lobbyHttpService.loadAllGamesRooms().then((response) => {
			for(var i=0; i<response.gameRooms.length; i++){
				$scope.rooms = addRoomToArr($scope.rooms, response.gameRooms[i])
			}
		}, (response) => {
			console.log(response);
		});

		createRoomModels();
	};

	initLobby();

	$rootScope.socket.on('room.open', function(room){
			var temp = $scope.rooms;
			$scope.rooms = addRoomToArr(temp, room);
			$scope.$apply();
	});

	$rootScope.socket.on('room.close', function(room){
			var temp = $scope.rooms;
			$scope.rooms = removeRoom(temp, room);
			$scope.$apply();
	});

	$rootScope.socket.on('room.watcher', function(data){
			var temp = $scope.rooms;
			$scope.rooms = addUserAsWatcher($scope.rooms, data.username, data.gameRoomName);
			console.log($scope.rooms)
			$scope.$apply();
	});

	$rootScope.socket.on('lobby.update.view', (data) => {
		var roomsToDelete = JSON.parse(data).gameRoomsDelete;
		var watchersToDelete = JSON.parse(data).deleteWatchers;

		for(var i=0; i<roomsToDelete.length; i++){
			var temp = $scope.rooms;
			$scope.rooms = removeRoomByName(temp, roomsToDelete[i]);
		}

		for(var i=0; i<watchersToDelete.length; i++){
			var gameRoom = findGameRoomByName(watchersToDelete[i].gameRoomName);
			gameRoom = removeUserAsWatcher(watchersToDelete[i].watcher ,gameRoom);
			$scope.rooms = updateGameRoom(gameRoom);
		}
	});

	$scope.openNewGameRoom = () => {
		lobbyHttpService.openNewGameRoom()
		.then((response) => {
			if(response.status == 201){
				var temp = $scope.rooms;
				$scope.rooms = addRoomToArr(temp, JSON.parse(response.data).gameRoom);

				$scope.isOpenRoom = true;
				$rootScope.socket.emit('room.open', JSON.parse(response.data).gameRoom)

				$location.path("/white/" + JSON.parse(response.data).gameRoom.name);
			}
			else if(response.status == 200){
				console.log("Failed to open new game room...")
				$scope.register_error = "This User already exists in one of the game rooms, thus can not open a new game room..."
			}
		}, (response) => {
			console.log(response);
		});
	}

	$scope.watchGame = () => {
		lobbyHttpService.watchGame(selectedGameRoomName)
		.then((response) => {
			if(response === true){
				$scope.rooms = addUserAsWatcher($scope.rooms, Auth.currentUser().userName, selectedGameRoomName)
				$rootScope.socket.emit('room.watcher', {'username':Auth.currentUser().userName, 'gameRoomName':selectedGameRoomName})
			} else{
				$scope.register_error = "You can watch or play only one game at a time, Failed to add watcher into game room, try again later..."
			}
		}, (response) => {
				$scope.register_error = response;
		});
	}

	$scope.closeGameRoom = () =>{
		lobbyHttpService.closeGameRoom()
		.then((response) => {
			if(response.gameRoomDeleted == true){
				$scope.rooms = removeRoom($scope.rooms, response.gameRoom)
				$scope.isOpenRoom = false;
				$rootScope.socket.emit('room.close', response.gameRoom)
			}
			else {
				$scope.register_error = "Failed to delete and close game room, try again later..."
			}
		}, (response) => {
			$scope.register_error = response;
		});
	};

	$scope.selectGameRoom = function(gameRoomName){
		if($scope.select == "Select"){
			$scope.isMadeSelection = true;
			var rooms = $scope.rooms;
			for(var i=0; i<rooms.length; i++){
				var model = $parse('btn' + rooms[i].name)
				if((rooms[i].name) != gameRoomName) model.assign($scope, true);
				else $scope.select = "Unselect";
			}

			selectedGameRoomName = gameRoomName;
		}
		else if($scope.select == "Unselect"){
			$scope.isMadeSelection = false;

			var rooms = $scope.rooms;
			for(var i=0; i<rooms.length; i++){
				var model = $parse('btn' + rooms[i].name)
				if((rooms[i].name) != gameRoomName) model.assign($scope, false);
				else $scope.select = "Select";
			}

			selectedGameRoomName = undefined;
		}
	};

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

	var addRoomToArr = function(arr, item){
		var result = [];
		result.push(item);
		for(var i=0; i<arr.length; i++){
			result.push(arr[i]);
		}
		return result;
	};

	var removeRoom = function(arr, item){
		var result = [];

		for(var i=0; i<arr.length; i++){
			if(arr[i].name != item.name) result.push(arr[i]);
		}

		return result;
	};

	var removeRoomByName = function(arr, roomName){
		var result = [];

		for(var i=0; i<arr.length; i++){
			if(arr[i].name != roomName) result.push(arr[i]);
		}

		return result;
	};

	var addUserAsWatcher = function(arr, watcher, gameRoomName){
		var result = [];

		for(var i=0; i<arr.length; i++){
			if(arr[i].name == gameRoomName){
					arr[i].watchers.push(watcher);
			}
			result.push(arr[i]);
		}

		return result;
	};

	var findGameRoomByName = function(gameRoomName){
		var temp = $scope.rooms;

		for(var i=0; i<temp.length; i++){
			if(temp[i].name == gameRoomName) return temp[i];
		}
	}

	var removeUserAsWatcher = function(watcher, gameRoom){
		var watchers = gameRoom.watchers;
		delete gameRoom.watchers;
		gameRoom.watchers = new Array();

		for(var i=0; i<watchers.length; i++){
			if(watchers[i] != watcher){
				gameRoom.watchers.push(watchers[i]);
			}
		}

		return gameRoom;
	};

	var updateGameRoom = (gameRoom) => {
		var temp = $scope.rooms;
		var result = [];

		for(var i=0; i<temp.length; i++){
				if(temp[i].name == gameRoom.name) result.push(gameRoom);
				else result.push(temp[i]);
		}

		return result;
	}

}]);
