angular.module('content', ['ngRoute', 'ngAnimate', 'firebase'])
 
.constant('fbUrl', 'https://kendorphins.firebaseio.com/')

.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
})

.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/guests', {
      controller:'guestsCtrl',
      templateUrl:'/templates/guests.html'
    })
    .when('/editor', {
      controller:'EditCtrl',
      templateUrl:'/templates/editor.html'
    })
    .when('/', {
      controller:'LoginCtrl',
      templateUrl:'/templates/login.html'
    });

	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: true
	});
})

.controller('LoginCtrl', 
  function($scope, $location, $routeParams, fbUrl) {
		  
	var ref = new Firebase(fbUrl);
	var auth = ref.getAuth();
	
	if (auth !== null) {
		
		ref.once("value", function(snapshot) {
			if (snapshot.child("users").child("admin").child(auth.uid).exists()) {
				$location.path('editor');
			}
		});
		
		//$location.path('editor');
	}
	
	$scope.register = function() {

		ref.authWithOAuthPopup("google", function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
			console.log(authData);
			ref.child('users/requests').push(authData);
			$('.info').append('<div class="alert alert-success" role="alert">Thank you. An administrator will contact you when you have been approved for access.</div>');
		  }
		}, {
		  scope: "email" // the permissions requested
		});		
	
	    return false;
		
	}

	$scope.getFacebookAuth = function() {

		ref.authWithOAuthPopup("google", function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
			  
			ref.once("value", function(snapshot) {
				if (snapshot.child("users").child("admin").child(authData.uid).exists()) {
		  			$scope.$apply(
		  				function() { $location.path('editor'); }
		  			)
				} else {
					$('.info').append('<div class="alert alert-warning" role="alert">You must register with the site and be approved to login.</div>');
				}
			});

		  }
		}, {
		  scope: "email" // the permissions requested
		});		
	
	    return false;
			
	}

})

.controller('guestsCtrl',
  function($scope, $location, $firebase, $firebaseAuth, $routeParams, fbUrl) {
	  var ref = new Firebase(fbUrl + 'events/birthday2016');
	  $scope.guests = $firebase(ref).$asArray();
	  console.log($scope.guests);
  }
)

.controller('EditCtrl', 
  function($scope, $location, $firebase, $firebaseAuth, $routeParams, fbUrl) {

    var ref = new Firebase(fbUrl);

    var contentUrl = fbUrl;
    var fb = $firebase(new Firebase(contentUrl));
    $scope.content = ref;

    $scope.editPress = function(key) {
	    var l = $scope.content.press[key];
	    l.key = key;
	    $scope.press = l;
	    $('#pressModal .modal-title').text('Edit a Press Item');
		$('#pressModal').modal('show');
    }

    $scope.addPress = function() {
	    $('#pressModal .modal-title').text('Add a Press Item');
	    $scope.press = null;
		$('#pressModal').modal('show');
    }
   
   	$scope.savePress = function() {
	   $scope.content.press[$scope.press.key] = { title: $scope.press.title, description: $scope.press.description, url: $scope.press.url, image_url: $scope.press.image_url }
   	} 
   
    $scope.removePress = function(press) {
		delete $scope.content.press[press];
    }

    $scope.editLocation = function(key) {
	    var l = $scope.content.locations[key];
	    l.key = key;
	    $scope.location = l;
	    $('#locationModal .modal-title').text('Edit a Location');
		$('#locationModal').modal('show');
    }

    $scope.addLocation = function() {
	    $('#locationModal .modal-title').text('Add a Location');
	    $scope.location = null;
		$('#locationModal').modal('show');
    }
   
   	$scope.saveLocation = function() {
	   $scope.content.locations[$scope.location.key] = { name: $scope.location.name, description: $scope.location.description, url: $scope.location.url }
   	} 
   
    $scope.removeLocation = function(location) {
		delete $scope.content.locations[location];
    }
    
    $scope.logout = function() {
		var ref = new Firebase(fbUrl);
		ref.unauth();
		$location.path("/");
    }
 
    $scope.save = function() {	    
        $scope.content.$save();
		$location.path("/");
    };

  }
);