angular.module("backgammonApp")
    .factory('SocketioLobby', ['$rootScope', function($rootScope){
      return {
        init: function(){
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

        	$rootScope.socket.on('room.watcher', function(data){
        			var temp = $scope.rooms;
        			$scope.rooms = addUserAsWatcher($scope.rooms, data.username, data.gameRoomName);
        			console.log($scope.rooms)
        			$scope.$apply();
        	});
        }
      }
    }]);
