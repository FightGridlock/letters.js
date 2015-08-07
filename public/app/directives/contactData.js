app.directive('contactData', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: './app/partials/contact-data.html'
    };
});