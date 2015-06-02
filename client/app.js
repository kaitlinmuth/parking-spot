/**
 * Created by kaitlinmuth on 5/26/15.
 */
var app = angular.module('app', []);

// Controllers
app.controller("IndexController", ['$scope', '$http', '$sce', 'geolocation', function($scope, $http, $sce, geolocation){

    // ===== Authorization Login =====
    $scope.auth = false;
    $scope.tab = 1;

    $scope.logIn = function(){
        console.log("Clicked! sending request", $scope.login);
        $http.post('/users/login', $scope.login).success(function() {
                getUser();

            }
        );
    };

    // ===== Database Logic =====
    // initialize variable spot
    $scope.spot = {};

    var getUser = function(){
        $http.get('/users/username').success(function(data){
            console.log('user data is',data);
            if (data != false){
                $scope.user = data;
                $scope.auth = true;
            }

        })
    };

    console.log("Current user is ",$scope.user);

    var fetchSpot = function(){
        return $http.get('/spot').then(function(response){
            if (response.status !== 200) {
                throw new Error('Failed to fetch Spot from API');
            }
           $scope.spot = response.data;
            return response.data;
        });
    };

    $scope.saveSpot = function(){
        console.log("Saving spot",$scope.spot);
        return $http.post('/spot', $scope.spot);
    };

    // ===== Positioning Logic =====

    //park gets a position, sets Spot to position, drops a pin and saves the spot to the database
    $scope.park = function(){
        getPosition()
            .then(
            function(){map.addPin()},
            function(err){logError(err);},
            function(msg){sendUpdate(msg);})
            .then(
            function(){$scope.saveSpot();},
            function(err){logError(err);},
            function(msg){sendUpdate(msg);});
    };

    // setPosition saves a given position to $scope.spot
    //TODO add user data to the spot
    var setPosition = function(position){
        console.log("set position", position);
        $scope.spot.created = new Date();
        $scope.spot.latitude = position.coords.latitude;
        $scope.spot.longitude = position.coords.longitude;
        console.log("spot set to", $scope.spot);
        map.setView([$scope.spot.latitude, $scope.spot.longitude], 15);
        return true;
    };

    var getPosition = function(){
        var promise = geolocation.getLocation();
            promise.then(
                function(value){setPosition(value);},
                function(err){logError(err)},
                function(update){sendUpdate(update);});
        return promise;
    };

    var logError = function(error){
        console.log('Failed: ',error);
        next(error);
    };

    var sendUpdate = function(message){
        console.log('Update: ', message);
    };

    // ===== Mapbox Set Up =====
    // TODO move map functionality into separate module
    // Initialize map
    L.mapbox.accessToken='pk.eyJ1Ijoia2FpdGxpbm11dGgiLCJhIjoiNzZmNzg3OTE5N2ExMTgxNTcxYzdiM2RlMGQxN2Q2YzcifQ.YENWVyAaFMg0ngZEc1aP7A';
    var mapLayer = L.mapbox.tileLayer('mapbox.streets');
    var map = L.map('map')
        .addLayer(mapLayer);
    map.attributionControl.setPosition('bottomleft');

    // initialize map spot
    getPosition();

    //function addPin drops pin in map for parked location
    map.addPin = function() {
        L.marker([$scope.spot.latitude, $scope.spot.longitude], {"draggable": true})
            .on('dragend', function(){
                var newLatLng = this.getLatLng();
                $scope.spot.latitude = newLatLng.lat;
                $scope.spot.longitude = newLatLng.lng;
                $scope.saveSpot();
            })
            .addTo(map);
    };

    //function getDirections gets directions back to the pinned location
    $scope.getDirections = function(){
        console.log("Getting directions!");
        var directions = L.mapbox.directions();
        var directionsLayer = L.mapbox.directions.layer(directions)
            .addTo(map);
        var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions)
            .addTo(map);
        var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions)
            .addTo(map);
        var directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions)
            .addTo(map);
        directions.setOrigin(getPosition());
    };

    // set map width to update dynamically with page size
    $scope.mapStyle = {"width": "100%"};



}]);
