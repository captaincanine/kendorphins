var app = angular.module('appPrototype', []);

app.controller('controllerPrototype', function($scope, $http, $interval) {

    $scope.timerRunning = false;	
	$scope.segment = 0;
	$scope.roundCounter = 0;
	$scope.video = {};
	$scope.timer = { secondsRemaining: 0, state: 'unstarted' };
	$scope.round = { title: 'Kendorphins App Prototype', message: 'Start Your Workout', }
	
	$scope.workout = [
		{
			title: "Warmup Round",
			type: "sequence",
			message: "Nice and Easy, Get the Blood pumping",
			time: 4,
			exercises: [
				{ countdown: 20, message: "20 Second Pep Talk" },
				{ countdown: 30, message: "Jumping Jacks" },
				{ countdown: 30, message: "Butt Kickers" },
				{ countdown: 20, message: "High Knees" },
				{ countdown: 60, message: "Inch Worm" },
				{ countdown: 30, message: "Jumping Jacks" },
				{ countdown: 30, message: "Butt Kickers" },
				{ countdown: 20, message: "High Knees" },
			]
		},
		{
			title: "HIIT Round",
			type: "random",
			message: "As fast as you can go without sacrificing form",
			time: 480,
			exercises: [
				{ count: 10, message: 'Dumbbell Swings (half on each side)' },
				{ count: 10, message: 'Bicep Curls' },
				{ count: 10, message: 'Overhead Tricep Extension (half on each side)' },
				{ count: 10, message: 'Shoulder Presses' },
				{ count: 10, message: 'Alternating Hammer Curls' },
				{ count: 10, message: 'Bent Over Rows (half on each side)' },
				{ count: 10, message: 'Tricep Bench Dips' },
				{ count: 10, message: 'Bent Over Rear Delt Raises' },
				{ count: 10, message: 'Thrusters' },
				{ count: 10, message: 'Plank - Knee to Opposite Elbow (half on each side)' },
			],
			powerUps: [
				{ count: 10, message: 'One and a half bicep curls' },
				{ count: 10, message: 'Arnold Presses' },
				{ count: 10, message: 'Renegade Rows' },
				{ count: 10, message: 'Overhead Tricep Extension with Pulse (half on each side)' },
			]
		}	
	];

	$scope.tickTimer = function() {
		
		var preTime = $scope.timer.secondsRemaining;
		
		$scope.timer.secondsRemaining = Math.ceil(($scope.timer.timeRemaining - (Date.now() - $scope.timer.timeStarted))/1000);		
		$scope.segment.secondsRemaining += $scope.timer.secondsRemaining - (preTime || $scope.timer.secondsRemaining);
		
		if ($scope.segment.secondsRemaining == 0) {
			
			$scope.segmentCounter++;
			$scope.segment = $scope.round.exercises[$scope.segmentCounter];
			$scope.segment.timeStarted = Date.now();
			$scope.segment.secondsRemaining = $scope.segment.countdown;

		}

		if ($scope.timer.secondsRemaining == 0) {

			$scope.roundCounter++;

			if ($scope.roundCounter >= $scope.workout.length) {
				$scope.timer.state = 'finished';
				$interval.cancel($scope.ticker);				
			} else {
				$interval.cancel($scope.ticker);				
				$scope.startRound();
			}
			
		}

	}

	$scope.pauseWorkout = function() {
		$scope.timer.state = 'paused';
		$scope.timer.timeRemaining -= Date.now() - $scope.timer.timeStarted;
		$interval.cancel($scope.ticker);
	}

	$scope.resumeWorkout = function() {
		$scope.timer.timeStarted = Date.now();
		$scope.timer.state = 'running';
		$scope.ticker = $interval($scope.tickTimer, 100);
	}

	$scope.startWorkout = function() {
		
		$scope.timer.state = 'running';
		$scope.segment = 0;

		$scope.startRound();

	}
	
	$scope.startRound = function() {
		
		$scope.round = $scope.workout[$scope.roundCounter];
		$scope.timer.state = 'running';

		$scope.timer.timeRemaining = $scope.round.time * 1000;
		$scope.timer.timeStarted = Date.now();
		
		$scope.ticker = $interval($scope.tickTimer, 100);

		$scope.segmentCounter = 0;

		$scope.segment = $scope.round.exercises[$scope.segmentCounter];
		$scope.segment.timeStarted = Date.now();
		$scope.segment.secondsRemaining = $scope.segment.countdown;

	}

	$scope.nextExercise = function(powered) {
		
		if (powered) {
			pool = $scope.round.powerUps;
		} else {
			pool = $scope.round.exercises;
		}

		var possibilities = pool.length - 1;
		var newIndex = getRandomIntInclusive(0, possibilities);
		
		while (newIndex == $scope.segmentCounter) {
			newIndex = getRandomIntInclusive(0, possibilities);	
		}
				
		$scope.segmentCounter = newIndex;
		$scope.segment = pool[newIndex];		
	
	}

	$scope.startSegment = function() {
		
		var segment = $scope.workout[$scope.segment];
		
		$scope.video = { message: segment.message };
		$scope.timer.secondsRemaining = segment.countdown;

		$scope.timer.state = 'running';

		$scope.timer.timeRemaining = $scope.timer.secondsRemaining * 1000;
		$scope.timer.timeStarted = Date.now();
		
		$scope.ticker = $interval($scope.tickTimer, 100);

	}

	$scope.toTimeString = function(seconds, format) {
				
		var time = new Date(seconds * 1000);
		var minutes = time.getUTCMinutes();
		var seconds = time.getUTCSeconds();
		var str = "";
		
		if (seconds < 10) {
			if (minutes == 0 && format == 'short') {
				str = seconds;
			} else {
				str = minutes + ':0' + seconds;
			}
		} else {
			str = minutes + ':' + seconds;
		}	
		
		return str;

	}

});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



/*

.component('prototypeViewer', {

	templateUrl: '/templates/prototype-viewer.html',

	controller: [
	
		function PrototypeController() {
			
            this.timerRunning = true;
 
            this.startTimer = function (){
                this.$broadcast('timer-start');
                this.timerRunning = true;
            };
 
            this.stopTimer = function (){
                this.$broadcast('timer-stop');
                this.timerRunning = false;
            };
			
			this.video = {};
			this.timer = { timeLeft: 0 };

			this.test = 'Finally';
 
			this.startWorkout = function() {

				this.video = { message: '30 Second Pep Talk' };
				this.timer.timeLeft = 67;

			} 
 
			this.toTimeString = function(seconds) {
				
				var time = new Date(seconds * 1000);
				var minutes = time.getUTCMinutes();
				var seconds = time.getUTCSeconds();
				
				if (seconds < 10) seconds = '0' + seconds;
				
				return minutes + ':' + seconds;
				
				
				//return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d)/)[0];
			}

		}

	]

});

.controller('PrototypeController', function($scope) {

	$scope.test = 'Hmmm...';
	  
	var protoCtrl = this;
	  
	protoCtrl.test = "Gotcha!";
	
	protoCtrl.startWorkout = function() {
		console.log(protoCtrl.test);
	}
	
  	$scope.startWorkout = function() {
	  	
	  	var video = { message: '30 Second Pep Talk' };
	  	
	  	$scope.video = video;
	  	
	  	console.log($scope);
	  	
  	    setTimeout(function () {
	  	    $scope.$apply(function() {
		        $scope.message = "Timeout called!";
		        console.log($scope.video);
		        // AngularJS unaware of update to $scope
			});
	    }, 2000);
	  	
  	}

});
*/
