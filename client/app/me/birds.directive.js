'use strict';

angular.module('resumeApp')
    .directive("birds", function() {
        return {
            restrict: 'E',
            scope: {
                data: '=?'
            },
            template: '<div class="container-fluid map-container">' +
                '<div class="row">' +
                '<div class="col-md-12" id="globeParent">' +
                '<div style="display:none;">' +
                '<img id="plane" src="plane-2_03-black.png">' +
                '</div>' +
                '</div>' +
                '</div>' +
                +'</div>',
            link: link
        };
    });
