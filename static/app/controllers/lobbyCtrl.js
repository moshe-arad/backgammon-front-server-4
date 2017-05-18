angular.module("backgammonApp").controller("LobbyCtrl", ['$scope', '$http', 'VirtualLobby', 'Auth', '$rootScope',
function($scope, $http, VirtualLobby, Auth, $rootScope){
	$scope.rooms = VirtualLobby.virtualGameRooms.reverse();
	$scope.users = VirtualLobby.usersInLobby;
	$scope.isOpenRoom = false;

	$scope.register_error = false;

	$rootScope.socket.on('room.open', function(room){
			var temp = $scope.rooms;
			$scope.rooms = addItemToArr(temp, room);
			$scope.$apply();
	});

	$rootScope.socket.on('room.close', function(room){
			var temp = $scope.rooms;
			$scope.rooms = removeRoomByName(temp, room);
			$scope.$apply();
	});

	var loadAllGamesRooms = function(){

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

	$scope.watchGame = function(roomName){

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
}]);
