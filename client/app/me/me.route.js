'use strict';

angular.module('resumeApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'app/me/me.html',

            })
            .state('resume', {
                url: '/resume',
                templateUrl: 'app/me/planet.html',
                controller: 'ctrl1'

            });

    });
