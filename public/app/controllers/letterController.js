app.controller('letterController', ['$scope', '$http', function($scope, $http) {

    $scope.alerts = [];

    $scope.loadTemplates = function() {
        $http.get("/api/templates").success(function(data) {
            $scope.templates = data;
        }).error(function() {
            $scope.alerts.push({
                code: 404,
                message: "Unable to load templates, check your network connectivity."
            });
        });
    }

    $scope.loadWards = function() {
        $http.get("/api/wards").success(function(data) {
            $scope.wards = data;
        }).error(function() {
            $scope.alerts.push({
                code: 404,
                message: "Unable to load wards, check your network connectivity."
            });
        });
    };

    $scope.loadReps = function() {
        $http.get("/api/reps").success(function(data) {
            $scope.reps = data;
        }).error(function() {
            $scope.alerts.push({
                code: 404,
                message: "Unable to load representatives, check your network connectivity."
            });
        });
    };


    $scope.ward = {};
    $scope.template = {};
    $scope.selectedReps = [{
        firstName: "John",
        lastName: "Smith",
    }];
    $scope.user = {};

    $scope.getData = function() {
        console.log("Starting HTTPGet");
        $scope.loadReps();
        $scope.loadTemplates();
        $scope.loadWards();
    };
    
    $scope.setWard = function(w){
        $scope.user.wardId = w._id;
        $scope.ward = w;
    };
    
    $scope.findReps = function(wardId) {
        $scope.selectedReps = [];
        var length = $scope.reps.length;
        for (var i = 0; i < length; i++) {
            if ($scope.reps[i].wardId === wardId) {
                $scope.selectedReps.push($scope.reps[i]);
            }

            if (!($scope.selectedReps.length)) {
                $scope.selectedReps.push({
                    firstName: "John",
                    lastName: "Smith",
                });
            }
        }
    };

    // Simple POST request (passing data) :
    $scope.postData = function() {
        $http.post('/api/users', {
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName,
                email: $scope.user.email,
                postalCode: $scope.user.postalCode,
                wardId: $scope.ward._id
            })
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $http.post('/api/emails', {
                    userId: data.user._id,
                    templateId: $scope.templates[0]._id,
                    wardId: data.user.wardId
                }).success(function(data, status, headers, config) {
                    console.log(data, " has been posted!");
                })
                .error(function(data, status, headers, config){
                    $scope.alerts.push({
                        code: 400,
                        message: "Something went wrong. Reload the page and try again."
                    });
                });
                console.log(data, " has been posted!");
            })
            .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                $scope.alerts.push({
                    code: 400,
                    message: "Something went wrong. Reload the page and try again."
                });
                console.log("Data has not been posted to users: ", data);
            });
    };
    
}]);