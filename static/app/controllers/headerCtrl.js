angular.module("backgammonApp")
    .controller('HeaderCtrl',
    ['$rootScope', '$location', '$http', 'Auth','$scope',
    function ($rootScope, $location, $http, Auth, $scope) {

    if(Auth.isLoggedIn()){
      $rootScope.credentials = {username: Auth.currentUser().userName, password: Auth.currentUser().password};
  		$rootScope.isAuthenticated = true;
    }else{
      $rootScope.credentials = {};
      $rootScope.isAuthenticated = false;
    }

    $rootScope.error = false;

	  $rootScope.login = function() {
          Auth.login($rootScope.credentials.username, $rootScope.credentials.password)
              .then(function() {
                  $rootScope.credentials.username = $rootScope.credentials.username;
                  $rootScope.isAuthenticated = true;
                  $rootScope.error = false;
                  $rootScope.socket.emit('auth', $rootScope.credentials);
                  $rootScope.socket.emit('users.update', {'user':$rootScope.credentials.username});
              }, function() {
                console.log("User not found...");
      	         $rootScope.isAuthenticated = false;
                  $location.path("/");
                  $rootScope.error = true;
                  $scope.failed = true;
              });
	  };

	  $rootScope.logout = function() {
      var headers = { 'Content-Type':'application/json' }

      var config = { 'method':'POST', 'url':'http://localhost:3000/logout', 'headers':headers,
        'data':JSON.stringify({'username':$rootScope.credentials.username, 'password':$rootScope.credentials.password} )
      }

		  $http(config).then(function (response) {
		    $location.path("/");
		    $rootScope.logoutSuccess = true;
        $rootScope.credentials = {};
        Auth.logout();
        if($rootScope.roomName !== undefined){
            $rootScope.socket.emit('room.leave', $rootScope.roomName);
            $rootScope.socket.emit('game.update', {'group':$rootScope.roomName});
        }
        $rootScope.socket.emit('room.leave', 'lobby');
        $rootScope.socket.emit('lobby.update', {'group':'lobby', 'includeMe':'no'});
        $rootScope.isAuthenticated = false;
		  },function(response) {
		    $rootScope.authenticated = false;
		  });
		};
    }]);
