angular.module("backgammonApp")
	.controller("HomeCtrl",
		['$scope', '$interval','NewUserValidationService', 'UsersHttpService', '$rootScope', 'SocketioHome', '$location',
			function($scope, $interval, newUserValidationService, usersHttpService, $rootScope, SocketioHome, $location){

	$scope.user = {};
	$scope.register_error = false;
	$scope.isInvalidEmail = false;
	$scope.isInvalidUserName = false;
	$scope.passwordMessage = "";
	$scope.isShowPasswordMessage = false;
	$scope.confirmPasswordMessage = "";
	$scope.isShowConfirmPasswordMessage = false;
	$scope.emailAvailable = false;
	$scope.userNameAvailable = false;
	$scope.emailMessage = "";

	$rootScope.socket.on('users.update.view', (data) => {
		var usersLoggedIn = JSON.parse(data).usersViewChanges.usersLoggedIn;

		console.log(usersLoggedIn);

		if(angular.isDefined(usersLoggedIn) == true){
			for(var i=0; i<usersLoggedIn.length; i++){
				if(usersLoggedIn[i].userName == $rootScope.credentials.username){
					console.log("Navigating to lobby");
					$rootScope.socket.emit('room.join', 'lobby');
					$rootScope.isAuthenticated = true;
					$location.path("/lobby");
					$scope.$apply();
				}
			}
		}
	});

	$scope.register = () => {
		console.log(isPassedValidation());
		if(isPassedValidation() == "valid") submitForm();
		else $scope.register_error = isPassedValidation();
	}

	var submitForm = () => {
		console.log("submitting form...");
		usersHttpService.createNewUser($scope.user);
	}

	var isPassedValidation = () => {
		var condition1 = newUserValidationService.isValidName($scope.user.firstName);
		var condition2 = newUserValidationService.isValidEmail($scope.user.email);
		var condition3 = $scope.emailAvailable;
		var condition4 = $scope.userNameAvailable;
		var condition5 = (newUserValidationService.isValidPassword($scope.user.password) === "valid");
		var condition6 = ($scope.user.confirm === $scope.user.password);

		if((condition1 == true)&&
		(condition2 == true)&&
		(condition3 == true)&&
		(condition4 == true)&&
		(condition5 == true)&&
		(condition6 == true))
			return "valid";
		else return "not valid";
	}

	var emailCallback = () => {
		SocketioHome.emailCheck().then((response) => {
			$scope.emailAvailable = true;
			$scope.emailMessage = "";
			$scope.isInvalidEmail = false;
			console.log(response)
		}, (response) => {
			$scope.emailAvailable = false;
			$scope.emailMessage = "Email is not available."
			$scope.isInvalidEmail = true;
			console.log(response)
		});
	}

	$scope.onEmailInsert = () => {
		if($scope.user.email != undefined && ($scope.user.email).trim() != ""){
			if(newUserValidationService.isValidEmail($scope.user.email) == true) {
				emailCallback();
				$rootScope.socket.emit('emailCheck', {'email': $scope.user.email});
				$scope.isInvalidEmail = false
			}
			else {
				$scope.emailMessage = "Email is invalid."
				$scope.isInvalidEmail = true;
			}
		}
		else $scope.isInvalidEmail = false;
	}

	var userNameCallback = () => {
		SocketioHome.userNameCheck().then((response) => {
			$scope.userNameAvailable = true;
			$scope.isInvalidUserName = false
			console.log(response)
		}, (response) => {
			$scope.userNameAvailable = false;
			$scope.isInvalidUserName = true;
			console.log(response)
		});
	}

	$scope.onUserNameInsert = (user) => {
		if($scope.user.userName != undefined && ($scope.user.userName).trim() != ""){
			if(newUserValidationService.isValidUserName($scope.user.userName)) {
				userNameCallback();
				$rootScope.socket.emit('userNameCheck', {'userName': $scope.user.userName});
			}
		}
		else $scope.isInvalidUserName = false
	}

	$scope.onCheckValidPassword = (user) => {

		$interval(function(){
			if(typeof user.password != "undefined"){
				var result = newUserValidationService.isValidPassword(user.password);
				if(result != "valid") {
					$scope.passwordMessage = result
					$scope.isShowPasswordMessage = true;
				}
				else{
					$scope.passwordMessage = ""
					$scope.isShowPasswordMessage = false;
				}
			}
		}, 3000, 0, false, user);

	}

	$scope.onCheckPasswordsMatch = (user) => {

		$interval(function(){
			if(angular.isDefined(user.confirm) && angular.isDefined(user.password)){
				if(user.confirm != user.password){
					$scope.confirmPasswordMessage = "Passwords does not match.";
					$scope.isShowConfirmPasswordMessage = true;
				}
				else{
					$scope.isShowConfirmPasswordMessage = false;
				}
			}
		}, 500, 0, false, user);

	}
}]);
