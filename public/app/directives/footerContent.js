app.directive('footerContent', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '/app/partials/footer-content.html'
    };
});