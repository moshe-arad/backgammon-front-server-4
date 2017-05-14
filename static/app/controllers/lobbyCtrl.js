angular.module("backgammonApp").controller("LobbyCtrl", ['$scope', '$http', 'VirtualLobby', 'Auth', '$rootScope',
function($scope, $http, VirtualLobby, Auth, $rootScope){
	$scope.rooms = VirtualLobby.virtualGameRooms.reverse();
	$scope.users = VirtualLobby.usersInLobby;
	$scope.isOpenRoom = false;

	$rootScope.socket.on('room.open', function(room){
			var temp = $scope.rooms;
			$scope.rooms = addItemToArr(temp, room);
			$scope.$apply();
	});

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
			}
		}, function onError(response){
			console.log("An error occured while trying to open a new game room...");
			console.log("Status code = " + response.status + ", text = " + response.statusText);
		});

	};

	$scope.closeGameRoom = function(){
		//TODO complete code logic
	};

	var addItemToArr = function(arr, item){
		var result = [];
		result.push(item);
		for(i=0; i<arr.length; i++){
			result.push(arr[i]);
		}
		return result;
	};

}]);
