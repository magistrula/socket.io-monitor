monitor.directive('socketDot', function(){
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
      var radius = 50 + Math.random() * 230;

      scope.$watch('socketOffset', function(offset, oldOffset){
        var angle = offset * 2 * Math.PI;
        var x = Math.sin(angle) * radius;
        var y = Math.cos(angle) * radius;
        element.css('left', x);
        element.css('top', -y);
      });
    }
  }
});