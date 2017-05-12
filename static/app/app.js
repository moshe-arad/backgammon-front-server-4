
var backgammonApp = angular.module("backgammonApp", [ "ngRoute" , "ngCookies", "ngResource", "ngStorage"]);

backgammonApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    Auth.init();

    $rootScope.$on('$routeChangeStart', function (event, next) {
        if (!Auth.checkPermissionForView(next)){
            event.preventDefault();
            $location.path("#/login");
        }
    });
}]);


backgammonApp.config(['$httpProvider', '$routeProvider', function ($httpProvider, $routeProvider) {

	$routeProvider
	.when("/", {
		controller: "HomeCtrl",
		templateUrl: "/app/partials/home.html",
        requiresAuthentication: false
	})
	.when("/error", {
		controller: "HomeCtrl",
		templateUrl: "/app/partials/error.html",
        requiresAuthentication: false
	})
	.when("/lobby", {
		controller: "LobbyCtrl",
		templateUrl: "/app/partials/lobby.html",
        requiresAuthentication: true,
        permissions: ["user"]
	});
}]);
