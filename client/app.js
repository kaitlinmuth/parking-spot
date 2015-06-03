/**
 * Created by kaitlinmuth on 5/26/15.
 */
var app = angular.module('app', []);

// Controllers
app.controller("IndexController", ['$scope', '$http', function($scope, $http){

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

    var saveSpot = function(){
        console.log("Saving spot",$scope.spot);
        return $http.post('/spot', $scope.spot);
    };

    // ===== Positioning Logic =====

    //park gets a position, sets Spot to position, drops a pin and saves the spot to the database
    $scope.park = function(){
        getPosition();
        addPin();
        saveSpot();
    };

    // setPosition saves a given position to $scope.spot
    //TODO add user data to the spot
    var setPosition = function(position){
        console.log("set position", position);
        if ($scope.user) $scope.spot._id = $scope.user.username;
        $scope.spot.created = new Date();
        $scope.spot.latitude = position.coords.latitude;
        $scope.spot.longitude = position.coords.longitude;
        console.log("spot set to", $scope.spot);
        if (map == null) createMap();
        return true;
    };

    var getPosition = function(){
        if (navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition(setPosition);
        } else {
            throw new Error("In-browser geolocation not supported");
        }

        //console.log("Getting position");
        //var promise = geolocation.getLocation();
        //    promise.then(
        //        function(value){
        //            console.log("promise returned");
        //            setPosition(value);},
        //        function(err){
        //            console.log("error: ", err);
        //            logError(err);},
        //        function(update){sendUpdate(update);});
        //return promise;
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
            zoom: 13,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        directionsDisplay.setMap(map);
    }

    // map.addPin adds a new marker to the map. if there is an existing marker, it will be overwritten
    var addPin = function(){
        marker.setMap(null);
        marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.spot.latitude, $scope.spot.longitude),
            draggable: true,
            title: "Parking Spot"
        });
        marker.setMap(map);
    };

    //map.getDirections gets directions from Google Maps
    $scope.getDirections = function(){
        var panel = document.getElementById('directionsPanel');
        directionsService.route({
            origin: new google.maps.LatLng($scope.spot.latitude, $scope.spot.longitude),
            destination: marker.position,
            travelMode: google.maps.TravelMode.WALKING,
        }, function(result, status){
            if (status == google.maps.DirectionsStatus.OK){
                console.log(result);
                directionsDisplay.setDirections(result);
                directionsDisplay.setPanel(panel);
                console.log("directionsDisplay",directionsDisplay);
            }
        });
    };

}]);
