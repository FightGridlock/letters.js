app.directive('districtPicker', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: './app/partials/district-picker.html'
    };
})