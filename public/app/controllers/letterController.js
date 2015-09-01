app.controller('letterController', ['$scope', '$http', function($scope, $http) {

    $scope.alerts = [];

    var loadTemplates = function() {
        $http.get("/api/templates").success(function(data) {
            $scope.templates = data;
        }).error(function() {
            $scope.alerts.push({
                code: 404,
                message: "Unable to load templates, check your network connectivity."
            });
        });
    };

    var loadWards = function() {
        $http.get("/api/wards").success(function(data) {
            $scope.wards = data;
        }).error(function() {
            $scope.alerts.push({
                code: 404,
                message: "Unable to load wards, check your network connectivity."
            });
        });
    };

    var loadReps = function() {
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
    $scope.selectedReps = [{}];
    $scope.user = {};

    $scope.getData = function() {
        console.log("Starting HTTPGet");
        loadReps();
        loadTemplates();
        loadWards();
    };

    $scope.setWard = function(w) {
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
        }
    };

    // Alerts Watcher
    $scope.$watch('alerts.length', function() {
        while ($scope.alerts.length > 0) {
            Materialize.toast($scope.alerts[0].message, 8000);
            $scope.alerts.shift();
        }
    });

    $scope.postData = function() {
        if ($scope.user.firstName && $scope.user.lastName && $scope.user.email && $scope.ward._id) {
            if ($scope.user._id) {
                $http.post('/api/emails', {
                    userId: $scope.user._id,
                    templateId: $scope.templates[0]._id,
                    wardId: $scope.user.wardId
                })
                .success(function(data, status, headers, config) {
                    console.log(data, " has been posted!");
                })
                .error(function(data, status, headers, config) {
                    $scope.alerts.push({
                        code: 400,
                        message: "Something went wrong sending the email... Please try again later."
                    });
                });
            }
            else {
                $http.post('/api/users', {
                        firstName: $scope.user.firstName,
                        lastName: $scope.user.lastName,
                        email: $scope.user.email,
                        postalCode: $scope.user.postalCode,
                        wardId: $scope.ward._id,
                        sub: $scope.user.sub
                    })
                    .success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $http.post('/api/emails', {
                                userId: data.user._id,
                                templateId: $scope.templates[0]._id,
                                wardId: data.user.wardId
                            })
                            .success(function(data, status, headers, config) {
                                console.log(data, " has been posted!");
                                window.location.href = "/next/";
                            })
                            .error(function(data, status, headers, config) {
                                $scope.alerts.push({
                                    code: 400,
                                    message: "Something went wrong sending the email... Please try again later."
                                });
                            });
                        $scope.user._id = data.user._id;
                        $scope.user.wardId = data.user.wardId;
                    })
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        $scope.alerts.push({
                            code: 400,
                            message: data.message || "Something went wrong..."
                        });
                        console.log("Data has not been posted to users: ", data);
                    });
            }
        }
        else {
            if (!$scope.ward._id) {
                $scope.alerts.push({
                    code: 400,
                    message: "<strong>Select a Ward in Step 1</strong>"
                });
            }
            if (!$scope.user.firstName) {
                $scope.alerts.push({
                    code: 400,
                    message: "<strong>Fill in your first name in Step 2</strong>"
                });
            }
            if (!$scope.user.lastName) {
                $scope.alerts.push({
                    code: 400,
                    message: "<strong>Fill in your last name in Step 2</strong>"
                });
            }
            if (!$scope.user.email) {
                $scope.alerts.push({
                    code: 400,
                    message: "<strong>Fill in your email in Step 2</strong>"
                });
            }
        }

    };

}]);