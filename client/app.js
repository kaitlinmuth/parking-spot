/**
 * Created by kaitlinmuth on 5/26/15.
 */
var app = angular.module('app', []);

// Controllers
app.controller("IndexController", ['$scope', '$http', function($scope, $http){

    // ===== Mapbox Set Up =====
    //TODO move map functionality into separate module
    //Initialize map
    L.mapbox.accessToken='pk.eyJ1Ijoia2FpdGxpbm11dGgiLCJhIjoiNzZmNzg3OTE5N2ExMTgxNTcxYzdiM2RlMGQxN2Q2YzcifQ.YENWVyAaFMg0ngZEc1aP7A';
    var mapLayer = L.mapbox.tileLayer('mapbox.pencil');
    var map = L.map('map')
        .addLayer(mapLayer)
        //TODO set map position dynamically
        .setView([44.832419, -93.300534], 15);

    //function addPin drops pin in map for parked location
    var addPin = function(lat, lon) {
        console.log("Dropping pin at ",lat," ",lon);
        L.marker([lat, lon])
        .addTo(map);
    };

    // set map width to update dynamically with page size
    $scope.mapStyle = {"width": "100%"};

    // ===== Database Logic =====
    // initialize variable spot
    $scope.spot = {};

    //TODO fix $http.get functionality
    var fetchSpot = function(){
        return $http.get('/spot').then(function(response){
            if (response.status !== 200) {
                throw new Error('Failed to fetch Spot from API');
            }
           $scope.spot = response.data;
            return response.data;
        });
    };

    //TODO fix $http.post functionality
    var saveSpot = function(){
        return $http.post('/spot', $scope.spot);
    };

    // ===== Positioning Logic =====
    // setPosition takes in a position parameter and:
    // - saves a given position to $scope.spot
    // - calls the function addPin to drop a pin to the map
    // - calls the function saveSpot to save the spot to the database
    //TODO add user data to the spot
    $scope.setPosition = function(position){
        console.log("set position", position);
        $scope.spot.created = new Date();
        $scope.spot.latitude = position.coords.latitude;
        $scope.spot.longitude = position.coords.longitude;
        console.log("spot set to",$scope.spot);
        addPin($scope.spot.latitude, $scope.spot.longitude);
        return saveSpot();
    };

    // getPosition retrieves the user's current position using the browser's geolocation
    $scope.getPosition = function() {
        console.log("Clicked!");
        if (navigator.geolocation) {
            console.log("Locating...");
            var location = navigator.geolocation.getCurrentPosition(
                $scope.setPosition,
                logErr,
                {enableHighAccuracy:true, timeout: 10000000, maximumAge:0});
        } else alert("Geolocation is not supported by this browser.");
    };

    //logErr is an error logging function to support getPosition
    var logErr = function(error){
        var errors = {
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
        alert("Error: " + errors[error.code]);
    };

    //fetchSpot();


}]);