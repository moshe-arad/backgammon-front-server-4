angular.module("backgammonApp").controller("BoardCtrl", ['$scope', '$http', 'Auth', '$routeParams','$rootScope', '$route', '$location',
function($scope, $http, Auth, $routeParams, $rootScope, $route, $location){
  // $route.routes["/white/:roomName"].permissions.push($routeParams.roomName)
  //
  // var authorizeUser = function(){
  //   if(Auth.userHasPermission([$routeParams.roomName]) == false) {
  //     $rootScope.credentials = {};
  //     $rootScope.isAuthenticated = false;
  //     console.log("You are not authorized...");
  //     $location.path("/error")
  //   }
  // }
  //
  // authorizeUser();

}]);
