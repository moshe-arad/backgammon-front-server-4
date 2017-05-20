angular.module("backgammonApp")
    .factory('SocketioHome', ['$rootScope', '$q', function($rootScope, $q){
      return {
        emailCheck: function(){
          var deferred = $q.defer();

          $rootScope.socket.on('emailCheckReply', (data) => {
            if(JSON.parse(data.body).isAvailable == false)  deferred.reject("Email is not available...")
            else deferred.resolve("Email available...");
          });

          return deferred.promise;
        },
        userNameCheck: function() {
          var deferred = $q.defer();

        	$rootScope.socket.on('userNameCheckReply', (data) => {
            if(JSON.parse(data.body).isAvailable == false) deferred.reject("User Name is not available...")
            else deferred.resolve("User Name available...")
          });

          return deferred.promise;
        }
      }
    }]);
