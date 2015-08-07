app.directive('letterBody', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: './app/partials/letter-body.html'
    };
});