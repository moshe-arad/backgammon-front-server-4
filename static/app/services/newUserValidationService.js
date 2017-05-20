angular.module("backgammonApp")
    .factory('NewUserValidationService', [function(){
      var obj = {};

        obj.isValidName = (name) => {
      		var re = /^[A-Z|a-z| \\-]+$/;
      		if(!re.test(name)) return false;
      		else return true;
      	};

        obj.isValidEmail = (email) => {
      		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(!re.test(email)) return false;
      		else return true;
      	};

        obj.isValidUserName = (name) => {
      		var re = /^[A-Z|a-z|0-9| \\-]+$/;
      		if(!re.test(name)) return false;
      		else return true;
      	};

        obj.isValidPassword = (password) => {

      		if(password.length < 8) return "Password length must be at least 8 characters.";
      		if(!obj.twoNumbersValidation(password)) return "Password must contain at least 2 numbers.";
      		if(!obj.oneUpperCaseValidation(password)) return "Password must contain at least 1 upper case letter.";
      		if(!obj.oneUniqueCharacter(password)) return "Password must contain at least 1 unique character.";
      		if(!obj.threeLowerCaseValidation(password)) return "Password must contain at least 3 lower case letters.";

      		return "valid";
      	};

      	obj.twoNumbersValidation = (password) =>{
      		var pattern = /^[^(0-9)]*[0-9]{1}[^(0-9)]*[0-9]{1}.*/;
      		return pattern.test(password);
      	};

        obj.oneUpperCaseValidation = (password) => {
      		var pattern = /[A-Z]+/;
      		return pattern.test(password);
      	};

      	obj.oneUniqueCharacter = (password) => {
      		var pattern = /[^(A-Z)|^(a-z)|^(0-9)]+/;
      		return pattern.test(password);
      	};

      	obj.threeLowerCaseValidation = (password) => {
      		var pattern = /^[^(a-z)]*[a-z]{1}[^(a-z)]*[a-z]{1}[^(a-z)]*[a-z]{1}.*/;
      		return pattern.test(password);
      	}

        return obj;
    }]);
