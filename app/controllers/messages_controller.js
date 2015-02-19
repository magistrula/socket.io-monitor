monitor.controller('messagesController', ['$scope','$http', '$interval', function($scope, $http, $interval){

  var convertDataToArray = function(messageData){
    var messageRecords = [];
    for (var type in messageData){
      for (var name in messageData[type]){
        messageRecords.push({type: type, name: name, count: messageData[type][name]});
      }
    }
    return messageRecords;
  }

  var getMessageData = function(){
    $http.get('/messages').success(function(data){
      $scope.inboundData = convertDataToArray(data.inbound);
      $scope.outboundData = convertDataToArray(data.outbound);
    });
  }

  $interval(getMessageData, 1000);

}]);