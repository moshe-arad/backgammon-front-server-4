(function(){

	function HomeCtrl ($rootScope, $scope, $interval, $timeout, $location, $http, Auth) {

		$scope.user = {};
		$scope.register_error = false;

		var isEmailAvailable = false;
		var isUserNameAvailable = false;

		var isFirstNamePassedValidation = false;
		var isLastNamePassedValidation = false;
		var isEmailPassedValidation = false;
		var isUserNamePassedValidation = false;
		var isPasswordPassedValidation = false;

		var socket = io();

    socket.on('emailCheckReply', (data) => {
      if(JSON.parse(data.body).isAvailable == false){
        angular.element("#invalidEmail").html("Email is not available.");
        angular.element("#invalidEmail").removeClass("hidden");
        isEmailPassedValidation = false;
      }
      else{
        isEmailPassedValidation = true;
        console.log("Email available...")
      }
    });

    socket.on('userNameCheckReply', (data) => {
      if(JSON.parse(data.body).isAvailable == false){
        angular.element("#invalidUserName").html("User name is not available.")
        angular.element("#invalidUserName").removeClass("hidden");
        isUserNamePassedValidation = false;
      }
      else{
        isUserNamePassedValidation = true;
        console.log("User Name available...")
      }
    });

		$scope.register = function() {
			console.log(isPassedValidation());
			if(isPassedValidation() == "valid"){
				submitForm();
			}
			else{
				$scope.register_error = isPassedValidation();
			}
		}

		var submitForm = function(){
			console.log("submitting form...");

			var headers = {'Content-Type':'application/json'}

      var config = {
        'method':'POST',
        'url':'http://localhost:3000/users/',
        'headers':headers,
        'data':JSON.stringify($scope.user)
      }

			$http(config)
			.then(function(response) {
				if(response.status == 201){
					$rootScope.isAuthenticated = true;
					$rootScope.credentials = {username:JSON.parse(response.data).userName, password:JSON.parse(response.data).password};
					Auth.loginNonHttp(JSON.parse(response.data));
					console.log("Navigating to lobby");
					$location.path("/lobby");
				}
				else if(response.status == 200){
					$scope.register_error = "This User already exists in system, try to do LogIn..."
				}
				else if(response.status == 500){
					console.log("Registeration failure");
					$scope.register_error = "Failed to do registration."
				}
			},
			function (response) {
              	register_error = "Failed to do registration.";
			});
		}

		var isPassedValidation = function(){

			isFirstNamePassedValidation = isValidName($scope.user.firstName);
			isLastNamePassedValidation = isValidName($scope.user.lastName);
			var password = isValidPassword($scope.user.password) == "valid" ? true:false;
			var passwordMatch = $scope.user.confirm == $scope.user.password ? true:false;
			isPasswordPassedValidation = password && passwordMatch;

			if((isFirstNamePassedValidation == true)&&
			   (isLastNamePassedValidation == true)&&
			   (isEmailPassedValidation == true)&&
			   (isUserNamePassedValidation == true)&&
			   (isPasswordPassedValidation == true))
				return "valid";
			else return "not valid";
		}

		var isValidName = function(name){

			var re = /^[A-Z|a-z| \\-]+$/;

			if(!re.test(name)) return false;
			else return true;
		}

		/******** shared with view ************/

		$scope.onEmailInsert = checkValidEmail;

		$scope.onUserNameInsert = checkUserNameValid;

		$scope.onCheckValidPassword = checkValidPassword;

		$scope.onCheckPasswordsMatch = checkPasswordsMatch;

		/***** email *****/

		function checkValidEmail(){
			if($scope.user.email != undefined && ($scope.user.email).trim() != ""){
				if(isValidEmail($scope.user.email))
				{
					angular.element("#invalidEmail").addClass("hidden");
          socket.emit('emailCheck', {'email': $scope.user.email});
				}
				else{
					angular.element("#invalidEmail").html("Invalid email address.");
					angular.element("#invalidEmail").removeClass("hidden");
				}
			}
		}

		var isValidEmail = function (email){
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			if(!re.test(email)) return false;
			else return true;
		}

		/***** user name *****/

		function checkUserNameValid(user){
			if($scope.user.userName != undefined && ($scope.user.userName).trim() != ""){
				if(isValidUserName($scope.user.userName)){
					angular.element("#invalidUserName").addClass("hidden");
          socket.emit('userNameCheck', {'userName': $scope.user.userName});
				}
				else{
					angular.element("#invalidUserName").html("Invalid user name.");
					angular.element("#invalidUserName").removeClass("hidden");
				}
			}
		}

		var isValidUserName = function(name){

			var re = /^[A-Z|a-z|0-9| \\-]+$/;

			if(!re.test(name)) return false;
			else return true;
		}

		/************** password ************/

		function checkValidPassword(user){

			$interval(function(){
				if(typeof user.password != "undefined"){
					var result = isValidPassword(user.password);
					if(result != "valid") {
						angular.element("#invalidPassword").html(result);
						angular.element("#invalidPassword").removeClass("hidden")
					}
					else{
						angular.element("#invalidPassword").addClass("hidden")
					}
				}
			}, 3000, 0, false, user);

		}

		function isValidPassword(password){

			if(password.length < 8) return "Password length must be at least 8 characters.";
			if(!twoNumbersValidation(password)) return "Password must contain at least 2 numbers.";
			if(!oneUpperCaseValidation(password)) return "Password must contain at least 1 upper case letter.";
			if(!oneUniqueCharacter(password)) return "Password must contain at least 1 unique character.";
			if(!threeLowerCaseValidation(password)) return "Password must contain at least 3 lower case letters.";

			return "valid";
		}

		function twoNumbersValidation(password){
			var pattern = /^[^(0-9)]*[0-9]{1}[^(0-9)]*[0-9]{1}.*/;
			return pattern.test(password);
		}


		function oneUpperCaseValidation(password){
			var pattern = /[A-Z]+/;
			return pattern.test(password);
		}

		function oneUniqueCharacter(password){
			var pattern = /[^(A-Z)|^(a-z)|^(0-9)]+/;
			return pattern.test(password);
		}

		function threeLowerCaseValidation(password){
			var pattern = /^[^(a-z)]*[a-z]{1}[^(a-z)]*[a-z]{1}[^(a-z)]*[a-z]{1}.*/;
			return pattern.test(password);
		}

		function clearPasswordMessage(){

			if($scope.password_error != "") {
				$scope.password_error = "";
			}
		}

		/************* password match ***********/
		function checkPasswordsMatch(user){

			$interval(function(){
				if(angular.isDefined(user.confirm) && angular.isDefined(user.password)){
					if(user.confirm != user.password){
						angular.element("#invalidConfirmPassword").html("Passwords does not match.");
						angular.element("#invalidConfirmPassword").removeClass("hidden");
					}
					else{
						angular.element("#invalidConfirmPassword").addClass("hidden");
					}
				}
			}, 500, 0, false, user);

		}
	}

	$(function () {
	    $("registerForm").on('submit', function (e) {
	        e.preventDefault();
	    });
	});

	backgammonApp.controller("HomeCtrl", HomeCtrl);
})();
