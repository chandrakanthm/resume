'use strict';

angular.module('resumeApp')
    .directive("globe", function() {
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

        function link(scope, element, attrs) {
            var width = 400,
                height = 400;

            var projection = d3.geo.orthographic()
                .translate([width / 2, height / 2])
                .scale(width / 2 - 20)
                .clipAngle(90)
                .precision(0.6);

            var canvas = d3.select("#globeParent").append("canvas")
                .attr("width", width)
                .attr("height", height);

            var c = canvas.node().getContext("2d");

            var path = d3.geo.path()
                .projection(projection)
                .context(c);

            var title = d3.select("h1");

            d3.queue()
                .defer(d3.json, "/app/me/world-110m.json")
                .defer(d3.tsv, "/app/me/world-country-names.tsv")
                .await(ready);

            function ready(error, world, names) {
                if (error) throw error;

                var globe = { type: "Sphere" },
                    land = topojson.feature(world, world.objects.land),
                    countries = topojson.feature(world, world.objects.countries).features,
                    borders = topojson.mesh(world, world.objects.countries, function(a, b) {
                        return a !== b;
                    }),
                    i = -1,
                    n = countries.length;

                countries = countries.filter(function(d) {
                    return names.some(function(n) {
                        if (d.id == n.id) return d.name = n.name;
                    });
                }).sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });

                (function transition() {
                    d3.transition()
                        .duration(1250)
                        .each("start", function() {
                            title.text(countries[i = (i + 1) % n].name);
                        })
                        .tween("rotate", function() {
                            var p = d3.geo.centroid(countries[i]),
                                r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                            return function(t) {
                                projection.rotate(r(t));
                                c.clearRect(0, 0, width, height);
                                c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
                                c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();
                                c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
                                c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
                            };
                        })
                        .transition()
                        .each("end", transition);
                })();
                planetaryjs.plugins.drag = function(options) {
                    options = options || {};
                    var noop = function() {};
                    var onDragStart = options.onDragStart || noop;
                    var onDragEnd = options.onDragEnd || noop;
                    var onDrag = options.onDrag || noop;
                    var afterDrag = options.afterDrag || noop;

                    return function(planet) {
                        planet.onInit(function() {
                            var drag = d3.behavior.drag()
                                .on('dragstart', onDragStart.bind(planet))
                                .on('dragend', onDragEnd.bind(planet))
                                .on('drag', function() {
                                    onDrag.call(planet);
                                    var dx = d3.event.dx;
                                    var dy = d3.event.dy;
                                    var rotation = planet.projection.rotate();
                                    var radius = planet.projection.scale();
                                    var scale = d3.scale.linear()
                                        .domain([-1 * radius, radius])
                                        .range([-90, 90]);
                                    var degX = scale(dx);
                                    var degY = scale(dy);
                                    rotation[0] += degX;
                                    rotation[1] -= degY;
                                    if (rotation[1] > 90) rotation[1] = 90;
                                    if (rotation[1] < -90) rotation[1] = -90;
                                    if (rotation[0] >= 180) rotation[0] -= 360;
                                    planet.projection.rotate(rotation);
                                    afterDrag.call(planet);
                                });
                            d3.select(planet.canvas).call(drag);
                        });
                    }

                    d3.select(self.frameElement).style("height", height + "px");

                }
            }
        }
    });
