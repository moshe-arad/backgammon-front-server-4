angular.module("backgammonApp").controller("LobbyCtrl",
['$scope', '$http', 'VirtualLobby', 'Auth', '$rootScope',
'$parse', 'SocketioLobby', '$location', 'LobbyHttpService',
function($scope, $http, VirtualLobby, Auth, $rootScope, $parse, socketioLobby, $location, lobbyHttpService){
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

	socketioLobby.init();
	initLobby();



	$scope.openNewGameRoom = () => {
		lobbyHttpService.openNewGameRoom()
		.then((response) => {
			console.log(response)
			if(response.status == 201){
				console.log(response);
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
				$scope.rooms = removeRoomByName($scope.rooms, response.gameRoom)
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

	var removeRoomByName = function(arr, item){
		var result = [];

		for(var i=0; i<arr.length; i++){
			if(arr[i].name != item.name) result.push(arr[i]);
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

}]);
