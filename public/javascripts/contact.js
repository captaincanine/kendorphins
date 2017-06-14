angular.module('contact', ['vcRecaptcha', 'firebase'])

.controller('contactCtrl', ['vcRecaptchaService', '$http', '$scope',
  function(vcRecaptchaService, $http, $scope) {

	var vm = this;
	
	// test key
	//vm.publicKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
	vm.mode = "contact";
	
	// kendorphins key
	vm.publicKey = "6LdLHSUTAAAAAAivtlfkbffOQKMz3jgPJe2DZukS";

	var ref = new Firebase('https://kendorphins.firebaseio.com/comments');
	ref.once('value', function(dataSnapshot) {
		$scope.$apply(function() {
			$scope.comments = dataSnapshot.val();
		});
	});
	
	vm.setResponse = function(response) {
		vm.myRecaptchaResponse = response;
	}
	
	vm.showComment = function(type) {
		
		vm.name = '';
		vm.email = '';
		vm.note = '';
		vm.type = type;
		
		vm.mode = 'comment';
		
	}
	
	vm.sendComment = function() {
		
		var post_data = {  //prepare payload for request
			'name':vm.name,
			'email':vm.email,
			'note':vm.note,
			'type':vm.type,
			'g-recaptcha-response': vm.myRecaptchaResponse  //send g-captcha-response to our server
		}
		
		vm.name = '';
		vm.email = '';
		vm.note = '';
				
		$http.post('/comment', post_data).success(function(response){
			
			if (response.responseCode === 0){
				vm.mode = 'thanks';
			} else {
				console.log(response);
				alert("I was unable to leave a comment.");
			}
		})
		.error(function(error){
			console.log(response);
		})
		
	}

  	vm.sendEmail = function() {
	  	
	  	vm.type = 'contact';
	  	
		var post_data = {  //prepare payload for request
			'name': vm.name,
			'email': vm.email,
			'note': vm.note,
			'g-recaptcha-response': vm.myRecaptchaResponse  //send g-captcah-response to our server
		}
		
		$http.post('/contact', post_data).success(function(response){
			
			if (response.responseCode === 0){
				vm.mode = 'thanks';
			} else {
				alert("Contact form submission failed.");
			}
		})
		.error(function(error){
		
		})
		
  	}

}]);