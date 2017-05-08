
var backgammonApp = angular.module("backgammonApp", [ "ngRoute" , "ngCookies"]);

backgammonApp.config(function ($routeProvider) {

	$routeProvider
	.when("/", {controller: "HomeCtrl", templateUrl: "/app/partials/home.html"})
	.when("/error", {controller: "HomeCtrl", templateUrl: "/app/partials/error.html"})
	.when("/lobby", {controller: "LobbyCtrl", templateUrl: "/app/partials/lobby.html"});
});
