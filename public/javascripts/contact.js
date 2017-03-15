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
	
	vm.showContact = function() {
		
		vm.name = '';
		vm.email = '';
		vm.note = '';
		
		vm.mode = 'contact';
				
		$('#contactModal').modal('show');
		
	}
	
	vm.showComment = function(type) {
		
		vm.name = '';
		vm.email = '';
		vm.note = '';
		vm.type = type;
		
		vm.mode = 'comment';
				
		$('#commentModal').modal('show');
		
	}
	
	vm.leaveComment = function() {

/*
		if (vcRecaptchaService.getResponse() === ""){ //if string is empty
			
			console.log('No recaptcha');
			
		} else {
*/
			var post_data = {  //prepare payload for request
				'name':vm.name,
				'email':vm.email,
				'note':vm.note,
				'type':vm.type,
				'g-recaptcha-response':vcRecaptchaService.getResponse()  //send g-captcha-response to our server
			}
		
			$http.post('/comment', post_data).success(function(response){
				
				if (response === 'thanks'){
					vm.mode = 'thanks';
				} else {
					alert("I was unable to leave a comment.");
				}
			})
			.error(function(error){
			
			})
		}		
		
//	}

  	vm.sendEmail = function() {
	  	
		if (vcRecaptchaService.getResponse() === ""){ //if string is empty
			
			console.log('No recaptcha');
			
		} else {

			var post_data = {  //prepare payload for request
				'name':vm.name,
				'email':vm.email,
				'note':vm.note,
				'g-recaptcha-response':vcRecaptchaService.getResponse()  //send g-captcah-response to our server
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
		
  	}

}]);