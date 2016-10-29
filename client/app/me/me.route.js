'use strict';

angular.module('resumeApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'app/me/me.html',

            });

    });
