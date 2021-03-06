angular.module('invite', ['vcRecaptcha', 'ngRoute', 'ngAnimate', 'firebase'])
 
.constant('fbUrl', 'https://kendorphins.firebaseio.com/')

.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/birthday/guests', {
      controller:'guestsCtrl',
      templateUrl:'/templates/guests.html'
    })
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: true
	});
})

.controller('inviteCtrl', ['vcRecaptchaService', '$http', 
  function(vcRecaptchaService, $http) {

	var vm = this;
	
	// test key
	vm.publicKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
	vm.mode = "rsvp";
	
	// kendorphins key
	vm.publicKey = "6LdLHSUTAAAAAAivtlfkbffOQKMz3jgPJe2DZukS";
		
	vm.showRsvp = function() {
		
		vm.name = '';
		vm.attending = '';
		vm.note = '';
		
		vm.mode = 'rsvp';
				
		$('#rsvpModal').modal('show');
		
	}
	
  	vm.sendRsvp = function() {

		if (vcRecaptchaService.getResponse() === ""){ //if string is empty
			
		} else {

			var post_data = {  //prepare payload for request
				'name':vm.name,
				'attending':vm.attending,
				'note':vm.note,
				'g-recaptcha-response':vcRecaptchaService.getResponse()  //send g-captcah-response to our server
			}
		
			$http.post('/rsvp', post_data).success(function(response){
								
				if (response == 'thanks'){
					vm.mode = 'thanks';
				} else {
					alert("Could not R.S.V.P. Please send email to kenneth@kendorphins.com.");
				}
			})
			.error(function(error){
			
			})
		}
		
  	}

}]);