//letters.js Angular App
'use strict';

var app = angular.module('letterApp', [])

app.filter('newlines', ['$sce', function ($sce) {
    return function(input) {
        return $sce.trustAsHtml(input.replace(/\\n/g, "<br />"));
    };
}]);
/*
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('form', {
            url: '/form',
            templateUrl: '/views/form.html',
            controller: 'letterController'
        })
        
        .state('form.ward', {
            url: '/ward',
            templateUrl: '/views/form-ward.html'
        })
        
        .state('form.info', {
            url: '/info',
            templateUrl: '/views/form-info.html'
        })
        
        .state('form.letter', {
            url: '/letter',
            templateUrl: '/views/form-letter.html'
        });
        
        $urlRouterProvider.otherwise('/form/ward');
});
*/