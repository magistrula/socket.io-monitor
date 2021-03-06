monitor.controller('radarController', ['$scope', '$timeout', '$interval', function($scope, $timeout, $interval){
  var socket = io('http://localhost:5001', {transports: ['websocket']});
  var interval = 10000;
  var firstPingTime;

  $scope.monitoredSockets = {}

  socket.on('disconnected_received', function(data){
    if($scope.monitoredSockets[data.socketId]){
      $scope.monitoredSockets[data.socketId].disconnected = true
      $timeout(removeSocket.bind(this, data), 2000);
    }
  });

  socket.on('ping_received', function(data){
    if (!$scope.firstPongProcessed) {
      saveFirstPing(data);
    }
    $timeout(saveActiveSocket.bind(this, data), 0);
    $timeout(deactivateSocket.bind(this, data), 200);
  });

  var saveFirstPing = function(data){
    firstPingTime = Date.parse(data.date);
    $scope.firstPongProcessed = true;
  }

  var saveActiveSocket = function(data){
    $scope.monitoredSockets[data.socketId] = {
      id: data.socketId,
      active: true,
      offset: calculateOffset(data.date)
    }
  }

  var deactivateSocket = function(data){
    $scope.monitoredSockets[data.socketId].active = false;
  }

  var removeSocket = function(data){
    delete $scope.monitoredSockets[data.socketId];
  }

  var calculateOffset = function(date){
    var time = Date.parse(date) - firstPingTime;
    return (time % interval)/interval;
  }
}]);