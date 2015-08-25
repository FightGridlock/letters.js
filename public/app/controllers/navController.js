app.controller('navController', ['$scope', '$location', function($scope, $location){
    

    var url = window.location.href;
    var temp = url.split('/');
    $scope.active = temp[3];
    
    $scope.isActive = function (viewLocation) {
        var active = (viewLocation === $scope.active);
        return active;
    };
}]);