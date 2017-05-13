angular.module("backgammonApp").controller("LobbyCtrl", ['$scope', '$http', 'VirtualLobby', function($scope, $http, VirtualLobby){
	$scope.rooms = VirtualLobby.virtualGameRooms;
	$scope.users = VirtualLobby.usersInLobby;
}]);
