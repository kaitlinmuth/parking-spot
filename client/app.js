/**
 * Created by kaitlinmuth on 5/26/15.
 */
var app = angular.module('app', []);
app.controller("IndexController", ['$scope', '$http', function($scope, $http){
    $scope.spot = {};
    var fetchSpot = function(){
        return $http.get('/spot').then(function(response){
            if (response.status !== 200) {
                throw new Error('Failed to fetch Spot from API');
            }
           $scope.spot = response.data;
            return response.data;
        });
    };
    $scope.add = function(spot) {
        return $http.post('/add', spot).then(fetchSpot);
    };
    //fetchSpot();

    L.mapbox.accessToken='pk.eyJ1Ijoia2FpdGxpbm11dGgiLCJhIjoiNzZmNzg3OTE5N2ExMTgxNTcxYzdiM2RlMGQxN2Q2YzcifQ.YENWVyAaFMg0ngZEc1aP7A';
    var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/spatial.b625e395/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    });

    var map = L.map('map')
        .addLayer(mapboxTiles)
        .setView([44.832419, -93.300534], 10);
}]);