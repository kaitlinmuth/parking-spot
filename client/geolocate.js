/**
 * Created by kaitlinmuth on 5/29/15.
 */
angular.module('app').factory('geolocation', ['$q','$rootScope','$window', function geolocationFactory($q,$rootScope,$window) {
    return {
        getLocation: function () {
            var deferred = $q.defer();
            if ($window.navigator.geolocation) {
                $window.navigator.geolocation.getCurrentPosition(function (position) {
                    $rootScope.$apply(function () {
                        deferred.resolve(position);
                    });
                }, function (error) {
                    switch (error){
                        case 1:
                            deferred.reject('Permission denied');
                            break;
                        case 2:
                            deferred.reject('Position unavailable');
                            break;
                        case 3:
                            deferred.reject('Request timeout');
                            break;
                    }
                }, {enableHighAccuracy: true, timeout: 10000, maximumAge: 0});
            }
            else deferred.reject('Unsupported browser.');
            return deferred.promise;
        }
    };
}]);