angular.module("backgammonApp")
    .factory('UsersHttpService', ['$rootScope','Auth', '$location', '$http', function($rootScope, auth, $location, $http){
      return {
        createNewUser: (user) => {
          var headers = {'Content-Type':'application/json'}

      		var config = {
      			'method':'POST',
      			'url':'http://localhost:3000/users/',
      			'headers':headers,
      			'data':JSON.stringify(user)
      		}

      		$http(config)
      		.then(function onSuccess(response) {
      			if(response.status == 201){
      				$rootScope.isAuthenticated = true;
      				$rootScope.credentials = {username:JSON.parse(response.data).userName, password:JSON.parse(response.data).password};
      				auth.loginNonHttp(JSON.parse(response.data));
      				console.log("Navigating to lobby");
      				$location.path("/lobby");
      				$rootScope.socket.emit('room.join', 'lobby');
              return "created";
      			}
      			else if(response.status == 200){
              return "This User already exists in system, try to do LogIn..."
      			}
      			else if(response.status == 500){
      				console.log("Registeration failure");
              return "Failed to do registration."
      			}
      		},
      		function onError(response) {
      			  return "Failed to do registration.";
      		})
        }
      }
    }]);
