app.directive('navContent', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: false,
        templateUrl: '/app/partials/nav-content.html'
    };
});