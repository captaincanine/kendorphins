angular.module('content', ['ngRoute', 'ngAnimate', 'firebase'])
 
.constant('fbUrl', 'https://kendorphins.firebaseio.com')

.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}])

.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])

.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
})

.config(function($routeProvider) {
  $routeProvider
    .when('/editor', {
      controller:'EditCtrl',
      templateUrl:'/templates/editor.html'
    })
    .when('/', {
      controller:'LoginCtrl',
      templateUrl:'/templates/login.html'
    })
})

.controller('LoginCtrl', 
  function($scope, $location, $routeParams) {
		  
	var ref = new Firebase("https://kendorphins.firebaseio.com");
	var auth = ref.getAuth();
	console.log(auth);
	
	if (auth !== null) {
		$location.path('editor');
	}

	$scope.logout = function() {
		ref.unauth();
	}

	$scope.getFacebookAuth = function() {

		ref.authWithOAuthRedirect("facebook", function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
		    console.log("Authenticated successfully with payload:", authData);
		  }
		});		
	
	    return false;
			
	}

})

.controller('EditCtrl', 
  function($scope, $firebase, $firebaseAuth, $routeParams, fbUrl) {

    var ref = new Firebase(fbUrl);
    var auth = $firebaseAuth(ref);
    
    var contentUrl = fbUrl;
    var fb = $firebase(new Firebase(contentUrl));
    $scope.content = fb.$asObject();

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

/* 
    $scope.save = function() {
      $scope.content.$save();
      setTimeout(function() { location.reload(); }, 1000);
      setTimeout(function() { location.href = '/' + $scope.content.category + '/' + $scope.content.slug; }, 500);
    };
*/    
  }
);