angular.module("backgammonApp").controller("LobbyCtrl", ['$scope', '$http', 'VirtualLobby', 'Auth',
function($scope, $http, VirtualLobby, Auth){
	$scope.rooms = VirtualLobby.virtualGameRooms.reverse();
	$scope.users = VirtualLobby.usersInLobby;

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
				var tempArr = VirtualLobby.virtualGameRooms;
				tempArr.push(JSON.parse(response.data).gameRoom);
				$scope.rooms = tempArr.reverse();
			}
			else if(response.status == 200){
				console.log("Failed to open new game room...")
			}
		}, function onError(response){
			console.log("An error occured while trying to open a new game room...");
			console.log("Status code = " + response.status + ", text = " + response.statusText);
		});

	};
}]);
