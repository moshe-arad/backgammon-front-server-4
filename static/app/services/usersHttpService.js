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
      				$rootScope.credentials = {username:JSON.parse(response.data).userName, password:JSON.parse(response.data).password};
              auth.loginNonHttp(JSON.parse(response.data));
              $rootScope.socket.emit('auth', $rootScope.credentials);
              $rootScope.socket.emit('users.update', {'user':$rootScope.credentials.username});
      			}
      		},
      		function onError(response) {
      			  return "Failed to do registration.";
      		})
        }
      }
    }]);
