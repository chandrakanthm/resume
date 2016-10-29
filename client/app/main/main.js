'use strict';

angular.module('resumeApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('me', {
                url: '/me',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            });

    });
