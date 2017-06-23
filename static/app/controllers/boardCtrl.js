angular.module("backgammonApp").controller("BoardCtrl", ['$scope', '$http', 'Auth', '$routeParams','$rootScope', '$route', '$location',
function($scope, $http, auth, $routeParams, $rootScope, $route, $location){

  $route.routes["/white/:roomName"].permissions.push($routeParams.roomName)
  $route.routes["/black/:roomName"].permissions.push($routeParams.roomName)

  $scope.messageWhite = "";
  $scope.messageBlack = "";

  $scope.roomName = $routeParams.roomName;

  $scope.disableWhiteDice = true;
  $scope.disableBlackDice = true;

  $scope.disableWhitePlayMove = true;
  $scope.disableBlackPlayMove = true;

  $scope.disableWhiteCancelMove = true;
  $scope.disableBlackCancelMove = true;

  $scope.fromColumn = "";
  $scope.toColumn = "";

  var isMyTurn = false;
  var isCanSelectMove = false;
  var blackPath = "/black/" + $routeParams.roomName;
  var whitePath = "/white/" + $routeParams.roomName;

  var authorizeUser = function(){
    if(auth.userHasPermission([$routeParams.roomName]) == false) {
      $rootScope.credentials = {};
      $rootScope.isAuthenticated = false;
      console.log("You are not authorized...");
      $location.path("/error")
    }
    else console.log("WELCOME...");
  }

  var init = () => {
    authorizeUser();
    if($location.path() == blackPath) {
        $rootScope.socket.emit('game.update', {'group':$routeParams.roomName});
    }
  }

  init();

  $rootScope.socket.on('game.update.view', (data) => {

		var messageToWhite = JSON.parse(data).messageToWhite;
		var messageToBlack = JSON.parse(data).messageToBlack;
    var isToShowRollDiceBtnToWhite = JSON.parse(data).isToShowRollDiceBtnToWhite;
    var isToShowRollDiceBtnToBlack = JSON.parse(data).isToShowRollDiceBtnToBlack;
    var isWhiteTurn = JSON.parse(data).isWhiteTurn;
    var isBlackTurn = JSON.parse(data).isBlackTurn;
    var isToApplyMove = JSON.parse(data).isToApplyMove;

    console.log(data);

    if($location.path() == whitePath && isWhiteTurn == true){
      isMyTurn = true;
      isCanSelectMove = true;
      console.log("White's turn to play...")
    }
    else if($location.path() == blackPath && isBlackTurn == true){
      isMyTurn = true;
      isCanSelectMove = true;
      console.log("Black's turn to play...")
    }
    else {
      isMyTurn = false;
      isCanSelectMove = false;
    }

		if($location.path() == whitePath && angular.isDefined(messageToWhite) == true){
      $scope.messageWhite = messageToWhite;
      $scope.$apply();
		}

    if($location.path() == blackPath && angular.isDefined(messageToBlack) == true){
      $scope.messageBlack = messageToBlack;
      $scope.$apply();
		}

    if($location.path() == whitePath && isToShowRollDiceBtnToWhite == true){
      $scope.$apply(()=>{
        $scope.disableWhiteDice = false;
      });
    }
    else{
      $scope.$apply(()=>{
        $scope.disableWhiteDice = true;
      });
    }

    if($location.path() == blackPath && isToShowRollDiceBtnToBlack == true){
      $scope.$apply(()=>{
        $scope.disableBlackDice = false;
      });
    }
    else {
      $scope.$apply(()=>{
        $scope.disableBlackDice = true;
      });
    }

    if(isToApplyMove == false && isWhiteTurn == true && $location.path() == whitePath){
      $scope.fromColumn = "";
      $scope.toColumn = "";
      $scope.disableWhitePlayMove = true;
      $scope.disableWhiteCancelMove = true;
      $scope.disableWhitePlayMove = true;
      isCanSelectMove = true;
    }
    else if(isToApplyMove == false && isBlackTurn == true && $location.path() == blackPath){
      $scope.fromColumn = "";
      $scope.toColumn = "";
      $scope.disableWhitePlayMove = true;
      $scope.disableWhiteCancelMove = true;
      $scope.disableWhitePlayMove = true;
      isCanSelectMove = true;
    }
	});

  $scope.leaveGameRoom = () => {
    console.log("Will try to leave game room...")
    var headers = { 'Content-Type':'application/json', 'Accept':'application/json' }
    var config = { method:'PUT', url:'http://localhost:3000/lobby/room/leave', headers:headers, data:JSON.stringify({'username':auth.currentUser().userName})};

    $http(config).then(function onSuccess(response){
      console.log("User left game room response accepted...");
      $rootScope.socket.emit('room.leave', $routeParams.roomName);
      $rootScope.socket.emit('room.join', 'lobby');
      $rootScope.socket.emit('users.update', {'user':auth.currentUser().userName});
    }, function onError(response){
        console.log("An error occured while trying to open a new game room..." + "Status code = " + response.status + ", text = " + response.statusText);
    });
  };

  $scope.rollDice = () => {
    console.log("Will try to roll dice...")
    var headers = { 'Content-Type':'application/json', 'Accept':'application/json' }
    var config = { method:'POST', url:'http://localhost:3000/game/rollDice', headers:headers, data:JSON.stringify({'username':auth.currentUser().userName, 'gameRoomName':$routeParams.roomName})};

    $http(config).then(function onSuccess(response){
      console.log("Roll dice response accepted...");
      $rootScope.socket.emit('game.update', {'group':$routeParams.roomName});
    }, function onError(response){
        console.log("An error occured while trying to open a new game room..." + "Status code = " + response.status + ", text = " + response.statusText);
    });
  };

  $scope.pawnSelect = (column) => {
    if(isCanSelectMove == true){
      if($scope.fromColumn == ""){
        $scope.fromColumn = column;
        if($location.path() == whitePath) {
          $scope.disableWhiteCancelMove = false;
          $scope.messageWhite = auth.currentUser().userName + ", You have selected to move pawn from column # " + $scope.fromColumn;
          console.log(auth.currentUser().userName + ", You have selected to move pawn from column # " + $scope.fromColumn);
        }
        else if($location.path() == blackPath) {
            $scope.disableBlackCancelMove = false;
            $scope.messageBlack = auth.currentUser().userName + ", You have selected to move pawn from column # " + $scope.fromColumn;
            console.log(auth.currentUser().userName + ", You have selected to move pawn from column # " + $scope.fromColumn)
        }
      }
      else if($scope.toColumn == ""){
        $scope.toColumn = column;
        isCanSelectMove = false;
        if($location.path() == whitePath) {
          $scope.disableWhitePlayMove = false;
          $scope.messageWhite = auth.currentUser().userName + ", You have selected to move pawn to column # " + $scope.toColumn;
          console.log(auth.currentUser().userName + ", You have selected to move pawn to column # " + $scope.toColumn);
        }
        else if($location.path() == blackPath) {
          $scope.disableBlackPlayMove = false;
          $scope.messageBlack = auth.currentUser().userName + ", You have selected to move pawn to column # " + $scope.toColumn;
          console.log(auth.currentUser().userName + ", You have selected to move pawn to column # " + $scope.toColumn);
        }
      }
    }
  };

  $scope.cancelMove = () => {
    $scope.fromColumn = "";
    $scope.toColumn = "";
    if($location.path() == whitePath) {
      $scope.disableWhitePlayMove = true;
      $scope.disableWhiteCancelMove = true;
      $scope.disableWhitePlayMove = true;
      $scope.messageWhite = auth.currentUser().userName + ", You have canceled your selection";
    }
    else if($location.path() == blackPath) {
      $scope.disableBlackPlayMove = true;
      $scope.disableWhiteCancelMove = true;
      $scope.disableWhitePlayMove = true;
      $scope.messageBlack = auth.currentUser().userName + ", You have canceled your selection";
    }

    isCanSelectMove = true;
  };

  $scope.playMove = () => {
    $scope.fromColumn = "";
    $scope.toColumn = "";

    isCanSelectMove = false;

    $scope.disableWhitePlayMove = true;
    $scope.disableBlackPlayMove = true;

    $scope.disableWhiteCancelMove = true;
    $scope.disableBlackCancelMove = true;

    console.log("Will try to play a move...")
    var headers = { 'Content-Type':'application/json', 'Accept':'application/json' }
    var config = { method:'POST', url:'http://localhost:3000/game/move', headers:headers,
    data:JSON.stringify({'username':auth.currentUser().userName, 'gameRoomName':$routeParams.roomName, 'from':$scope.fromColumn, 'to':$scope.toColumn})}

    $http(config).then(function onSuccess(response){
      console.log("Play move response accepted...");
      $rootScope.socket.emit('game.update', {'group':$routeParams.roomName});
    }, function onError(response){
        console.log("An error occured while trying to open a new game room..." + "Status code = " + response.status + ", text = " + response.statusText);
    });
  };

}]);
