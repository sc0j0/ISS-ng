


  angular.module('ISS', ['ngRoute'])
  .config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "./partials/partial1.html",
          controller: "MainController"
        })
        .otherwise({
           redirectTo: '/'
        });
    }
  ]);

  //Load controller
  angular.module('ISS')

  .controller('MainController', function($scope, $http) {

    $scope.saved          = localStorage.getItem('savedLocations');
    $scope.savedLocations = (localStorage.getItem('savedLocations')!==null) ? JSON.parse($scope.saved) : [];

    $scope.searchInit = function() {

      if ($scope.location === 'undefined') {
        return;
      }

      $scope.loading = true;
      //need to turn location into lat/lon
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.location + '&key=AIzaSyCLH--06Xt3eiKJSL3QOANF0qNZh_KdvtA';

      $http.get(url)

      .then(function(response) {

        //there could be any number of results, (5 cities named Paris for example), we're just going to grab the first one
        var lat = response.data.results[0].geometry.location.lat,
            lon = response.data.results[0].geometry.location.lng;

        requestISSPass(lat, lon);
        

      });
    }, 
    requestISSPass = function(lat, lon) {

      $http.jsonp('http://api.open-notify.org/iss-pass.json?lat=' + lat + '&lon=' + lon + '&n=1' + '&callback=JSON_CALLBACK').

      success(function(data) {
       //using moment.js to reliably convert this timestamp
       var time = moment.unix(data.response[0].risetime);


        $scope.time = time._d;

        console.log($scope.time);

         $scope.addLocation();

      });

    }, 

    $scope.addLocation = function() {

      $scope.savedLocations.push({
        location: $scope.location,
        date: $scope.time    

      });

      localStorage.setItem('savedLocations', JSON.stringify($scope.savedLocations))


    }



  });
