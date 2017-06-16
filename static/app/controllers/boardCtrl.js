angular.module("backgammonApp").controller("BoardCtrl", ['$scope', '$http', 'Auth', '$routeParams','$rootScope', '$route', '$location',
function($scope, $http, auth, $routeParams, $rootScope, $route, $location){

  $route.routes["/white/:roomName"].permissions.push($routeParams.roomName)
  $route.routes["/black/:roomName"].permissions.push($routeParams.roomName)

  var authorizeUser = function(){
    if(auth.userHasPermission([$routeParams.roomName]) == false) {
      $rootScope.credentials = {};
      $rootScope.isAuthenticated = false;
      console.log("You are not authorized...");
      $location.path("/error")
    }
    else console.log("WELCOME...");
  }

  authorizeUser();

  $scope.leaveGameRoom = () => {
    console.log("Will try to leave game room...")
    var headers = { 'Content-Type':'application/json', 'Accept':'application/json' }
    var config = { method:'PUT', url:'http://localhost:3000/lobby/room/leave', headers:headers, data:JSON.stringify({'username':auth.currentUser().userName})};

    $http(config).then(function onSuccess(response){
      console.log("User left game room response accepted...");
      $rootScope.socket.emit('room.leave', $routeParams.roomName);
      $rootScope.socket.emit('room.join', 'lobby');
      $rootScope.socket.emit('users.update', {'user':auth.currentUser().userName});
    }, function onError(response){
        console.log("An error occured while trying to open a new game room..." + "Status code = " + response.status + ", text = " + response.statusText);
    });
  };
}]);
