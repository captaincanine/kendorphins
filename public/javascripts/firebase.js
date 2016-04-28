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

    $scope.addLocation = function() {
		$('#locationModal').modal('show');
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