var monitor = angular.module('monitor', ['ngRoute']);

monitor.controller('messagesController', ['$scope','$http', '$interval', function($scope, $http, $interval){

  $scope.hello = 'HELLO WORLD';

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

monitor.directive('dot', function(){
  return {
    restrict: 'E',
    template: '<span class="socket" ng-class="{active: socketActive}"></span>',
    replace: true,
    scope: {
      socketOffset : '=',
      socketId : '=',
      socketActive : '='
    },
    link: function(scope, element, attrs){
      scope.$watch('socketOffset', function(offset, oldOffset){
        var position = offset * 1400;
        // element.html(position);
        element.css('left', offset*1400);
        // if (oldOffset === undefined){
        //   element.css('top', Math.random()*500);
        // }
      });
    }
  }
});