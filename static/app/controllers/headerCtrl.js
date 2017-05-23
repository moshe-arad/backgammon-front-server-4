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
                  $location.path("/lobby");
                  $rootScope.socket.emit('room.join', 'lobby');
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
        Auth.logout();
		    $rootScope.isAuthenticated = false;
		    $location.path("/");
		    $rootScope.logoutSuccess = true;
        $rootScope.credentials = {};

        $rootScope.socket.emit('lobby.update');
        
		  },function(response) {
		    $rootScope.authenticated = false;
		  });
		};
    }]);
