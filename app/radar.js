monitor.controller('radarController', ['$scope', '$timeout', function($scope, $timeout){
  // $scope.radar = 'Hello, Radar';
  var socket = io('http://localhost:5001', {transports: ['websocket']});
  var interval = 10000;

  $scope.monitoredSockets = {
    // 'adsflkjasdf': { active: true }
  }

  socket.on('ping_received', function(data){
    // $scope.radar = $scope.radar + '<br> ping: ' + data;
    // console.log(data);
  });

  socket.on('pong_received', function(data){
    $timeout(function(){
      $scope.monitoredSockets[data.socketId] = {
        active: true,
        offset: calculateOffset(data.date)
      };
      // console.log($scope.monitoredSockets);
    });
    $timeout(function(){
      $scope.monitoredSockets[data.socketId].active = false;
    }, 200);
  });

  var calculateOffset = function(date){
    var time = Date.parse(date);
    var offset = (time % interval)/interval;
    // console.log(offset);
    return offset;
  }

}]);