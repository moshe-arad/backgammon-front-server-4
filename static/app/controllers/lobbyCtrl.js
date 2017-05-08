(function(){
	
	function LobbyCtrl($scope, $http){
		
		$scope.rooms = ["a","b","c","d","e","f"];
	}
	
	backgammonApp.controller("LobbyCtrl", LobbyCtrl);
})();