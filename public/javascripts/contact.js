angular.module('contact', ['vcRecaptcha'])

.controller('contactCtrl', ['vcRecaptchaService', '$http', 
  function(vcRecaptchaService, $http) {

	var vm = this;
	
	// test key
	vm.publicKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
	vm.mode = "contact";
	
	// kendorphins key
	//vm.publicKey = "6LdLHSUTAAAAAAivtlfkbffOQKMz3jgPJe2DZukS";
	
	vm.showContact = function() {
		
		vm.name = '';
		vm.email = '';
		vm.note = '';
		
		vm.mode = 'contact';
				
		$('#contactModal').modal('show');
		
	}
	
  	vm.sendEmail = function() {

		if (vcRecaptchaService.getResponse() === ""){ //if string is empty
			
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