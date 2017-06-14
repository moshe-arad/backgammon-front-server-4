angular.module("backgammonApp").controller("LobbyCtrl",
['$scope', '$http', 'VirtualLobby', 'Auth', '$rootScope',
'$parse', '$location', 'LobbyHttpService', '$interval',
function($scope, $http, VirtualLobby, Auth, $rootScope, $parse, $location, lobbyHttpService, $interval){
	$scope.rooms = VirtualLobby.virtualGameRooms().reverse();
	$scope.users = VirtualLobby.usersInLobby;

	$scope.isOpenRoom = false;
	$scope.select = "Select";
	$scope.register_error = false;
	$scope.isMadeSelection = false;

	var selectedGameRoomName;
	var roomName;
	var promise;

	var createRoomModels = () => {
		var rooms = $scope.rooms;

		for(var i=0; i<rooms.length; i++){
			var model = $parse(rooms[i].name)
			model.assign($scope, false);
		}
	};

	var initLobby = function(){
		lobbyHttpService.loadAllGamesRooms();
		$rootScope.socket.emit('lobby.update', {'user':Auth.currentUser().userName});
		createRoomModels();
	};

	initLobby();


	$rootScope.socket.on('room.close', function(room){
			var temp = $scope.rooms;
			$scope.rooms = removeRoom(temp, room);
			$scope.$apply();
	});

	$rootScope.socket.on('room.watcher', function(data){
			var temp = $scope.rooms;
			$scope.rooms = addUserAsWatcher($scope.rooms, data.username, data.gameRoomName);
			$scope.$apply();
	});

	$rootScope.socket.on('lobby.update.view', (data) => {
		console.log("Lobby Update View Recieved...")
		var roomsToDelete = JSON.parse(data).gameRoomsDelete;
		var watchersToDelete = JSON.parse(data).deleteWatchers;
		var gameRoomsAdd = JSON.parse(data).gameRoomsAdd;
		var gameRoomsUpdate = JSON.parse(data).gameRoomsUpdate;
		var addWatchers = JSON.parse(data).addWatchers;
		var addSecondPlayers = JSON.parse(data).addSecondPlayer
		var leavingPlayers = JSON.parse(data).leavingPlayers

		console.log("*** Update view message accepted ***");

		if(angular.isDefined(addSecondPlayers) == true){
			for(var i=0; i<addSecondPlayers.length; i++){
				var gameRoom = findGameRoomByName(addSecondPlayers[i].gameRoomName);
				gameRoom.secondPlayer = addSecondPlayers[i].secondPlayer;

				if(addSecondPlayers[i].secondPlayer == Auth.currentUser().userName){
					roomName = addSecondPlayers[i].gameRoomName;
					promise = $interval(goToBlackBoard, 50);
				}

			}
		}

		if(angular.isDefined(roomsToDelete) == true){
			for(var i=0; i<roomsToDelete.length; i++){
				var temp = $scope.rooms;
				$scope.rooms = removeRoomByName(temp, roomsToDelete[i]);
				$rootScope.$apply(function() {
					$location.path("/lobby");
				});
			}
		}

		if(angular.isDefined(addWatchers) == true){
			for(var i=0; i<addWatchers.length; i++){
				var gameRoom = findGameRoomByName(addWatchers[i].gameRoomName);
				var watchers = gameRoom.watchers;
				watchers.push(addWatchers[i].watcher);
				delete gameRoom.watchers;
				gameRoom.watchers = watchers;
				$scope.rooms = updateGameRoom(gameRoom);

				if(addWatchers[i].watcher == Auth.currentUser().userName){
					roomName = addWatchers[i].gameRoomName;
					promise = $interval(goToWhiteBoard, 50);
				}
			}
		}

		if(angular.isDefined(watchersToDelete) == true){
			for(var i=0; i<watchersToDelete.length; i++){
				var gameRoom = findGameRoomByName(watchersToDelete[i].gameRoomName);
				gameRoom = removeUserAsWatcher(watchersToDelete[i].watcher ,gameRoom);
				$scope.rooms = updateGameRoom(gameRoom);
				$scope.$apply();
			}
		}

		if(angular.isDefined(gameRoomsAdd) == true){
			for(var i=0; i<gameRoomsAdd.length; i++){
				var temp = $scope.rooms;
				temp.push(gameRoomsAdd[i])
				$scope.rooms = temp;
				$scope.$apply();
				if(gameRoomsAdd[i].openBy == Auth.currentUser().userName){
					$scope.isOpenRoom = true;
					$rootScope.socket.emit('room.join', gameRoomsAdd[i].name);
					roomName = gameRoomsAdd[i].name;
					promise = $interval(goToWhiteBoard, 50);
				}
			}
		}

		if(angular.isDefined(gameRoomsUpdate) == true){
			for(var i=0; i<gameRoomsUpdate.length; i++){
				$scope.rooms = updateGameRoom(gameRoomsUpdate[i]);
			}
		}

		if(angular.isDefined(leavingPlayers) == true){
			for(var i=0; i<leavingPlayers.length; i++){
				if(leavingPlayers[i] == Auth.currentUser().userName){
					$rootScope.$apply(function() {
        		$location.path("/lobby");
      		});
				}
			}
		}
	});

	var goToWhiteBoard = () => {
		if(Auth.currentUser().user_permissions.indexOf(roomName)  != -1){
			$location.url("/white/" + roomName);
			$interval.cancel(promise);
		}
	}

	var goToBlackBoard = () => {
		if(Auth.currentUser().user_permissions.indexOf(roomName)  != -1){
			$location.url("/black/" + roomName);
			$interval.cancel(promise);
		}
	}

	$scope.openNewGameRoom = () => {
		lobbyHttpService.openNewGameRoom()
		.then((response) => {
			if(response.status == 201) {
				$rootScope.socket.emit('users.update', {'user':Auth.currentUser().userName});
				// console.log("Lobby Update Sent..")
			}
			else{
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
			$rootScope.socket.emit('users.update', {'user':Auth.currentUser().userName});
		}, (response) => {
				$scope.register_error = response;
		});
	}

	$scope.joinGame = () => {
		lobbyHttpService.joinGame(selectedGameRoomName)
		.then((response) => {
			$rootScope.socket.emit('users.update', {'user':Auth.currentUser().userName});
		}, (response) => {
				$scope.register_error = response;
		});
	};

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
