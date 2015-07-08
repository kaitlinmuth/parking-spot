/**
 * Created by kaitlinmuth on 5/26/15.
 */
var app = angular.module('app', []);

// Controllers
app.controller("IndexController", ['$scope', '$http', '$q', function($scope, $http, $q){

    // ===== Authorization Login =====
    $scope.auth = false;
    $scope.tab = 1;

    $scope.logIn = function() {
        $http.post('/users/login', $scope.login).success(function () {
            getUser();
        });
    };

    $scope.register = function(){
        $http.post('/users/register', $scope.login).success(function(){
            $scope.logIn();
        })
    };

    // ===== Database Logic =====
    // initialize variable spot
    $scope.spot = {};
    $scope.loading = false;

    var getUser = function(){
        $http.get('/users/username').success(function(data){
            if (data){
                $scope.user = data;
                $scope.auth = true;
                if ($scope.user.spots[$scope.user.spots.length - 1]) {
                    addPin({
                        latitude: $scope.user.spots[$scope.user.spots.length - 1].latitude,
                        longitude: $scope.user.spots[$scope.user.spots.length - 1].longitude
                    });
                }
            }

        })
    };

    var saveSpot = function(){
        var req = {'user._id': $scope.user._id,
            'spot' : $scope.spot};
        return $http.post('/spots/add/', req);
    };

    var updateSpot = function(){
        var req = {'user._id': $scope.user._id, 'spot' : $scope.spot};
        return $http.put('/spots/update', req);
    }

    // ===== Positioning Logic =====

    //park gets a position, sets Spot to position, drops a pin and saves the spot to the database
    $scope.park = function(){
        $scope.loading = true;
        var promise = promisePosition();
        promise.then(
            function(value){
                addPin($scope.spot);
                saveSpot();
                var center = new google.maps.LatLng($scope.spot.latitude, $scope.spot.longitude);
                map.setCenter(center);
                map.setZoom(15);
                $scope.loading = false;
            },
            function(reason) {
                console.log("Failed: ", reason);
                $scope.loading = false;
            }
        );
    };

    $scope.route = function(){
        $scope.loading = true;
        var promise = promisePosition();
        promise.then(
            function(value){
                getDirections();
                $scope.loading = false;
            },
            function(reason) {
                console.log("Failed: ", reason);
                $scope.loading = false;
            }
        );
    };

    var promisePosition = function(){
        return $q(function(resolve, reject){
            setTimeout(function(){
                if (getPosition() == true) {
                    resolve('Position acquired')
                } else {
                    reject('Could not resolve position')
                }
            }, 1000);
        });
    };

    // setPosition saves a given position to $scope.spot
    var setPosition = function(position){
        $scope.spot.created = new Date();
        $scope.spot.latitude = position.coords.latitude;
        $scope.spot.longitude = position.coords.longitude;
        if (map == null) createMap();
        return true;
    };

    var getPosition = function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setPosition);
            return true;
        } else {
            throw new Error("In-browser geolocation not supported");
        }
    };

    // ===== Google Maps Set-Up =====
    // set map width to update dynamically with page size
    $scope.mapStyle = {"width": "100%"};

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var map;
    var marker = new google.maps.Marker;
    google.maps.event.addDomListener(window, 'load', getPosition);

    //createMap initializes a new google map centered at $scope.spot
    function createMap() {
        var center = new google.maps.LatLng($scope.spot.latitude, $scope.spot.longitude);
        map = new google.maps.Map(document.getElementById("map-canvas"),
        {
            zoom: 14,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }

    // map.addPin adds a new marker to the map. if there is an existing marker, it will be overwritten
    var addPin = function(position){
        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
        marker.setMap(null);
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(position.latitude, position.longitude),
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: "Parking Spot"
        });
        google.maps.event.addListener(marker, 'dragend', function(){
            directionsDisplay.setMap(null);
            directionsDisplay.setPanel(null);
            var newSpot = marker.getPosition();
            $scope.spot.latitude = newSpot.A;
            $scope.spot.longitude = newSpot.F;
            $scope.spot.created = new Date();
            updateSpot();
            getPosition();
        });
        marker.setMap(map);
    };

    //map.getDirections gets directions from Google Maps
    var getDirections = function(){
        var panel = document.getElementById('directionsPanel');
        directionsService.route({
            origin: new google.maps.LatLng($scope.spot.latitude, $scope.spot.longitude),
            destination: marker.position,
            travelMode: google.maps.TravelMode.WALKING
        }, function(result, status){
            if (status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(result);
                directionsDisplay.setMap(map);
                directionsDisplay.setPanel(panel);
            }
        });
    };

}]);
