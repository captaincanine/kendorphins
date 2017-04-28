angular.module('content')

.constant('cIntensity', [
	{id: '1', label: 'Beginner'},
	{id: '2', label: 'Intermediate'},
	{id: '3', label: 'Advanced'},
	{id: '4', label: 'Expert'},
])

.constant('cUsesWeights', [
	{id: 'no-weights', label: 'No Weights'},
	{id: 'one-weight', label: 'One Weight'},
	{id: 'two-weights', label: 'Two Weights'},
])

.constant('cWeightTypes', [
	{id: 'light', label: 'Light Weight'},
	{id: 'medium', label: 'Medium Weight'},
	{id: 'heavy', label: 'Heavy Weight'},
])

.constant('cMuscleGroups', [
	{id: 'upper body', label: 'Upper Body', col: 1},
	{id: 'chest', label: 'Chest', col: 1},
	{id: 'back', label: 'Back', col: 1},
	{id: 'shoulders', label: 'Shoulders', col: 1},
	{id: 'biceps', label: 'Biceps', col: 1},
	{id: 'triceps', label: 'Triceps', col: 1},
	{id: 'lower body', label: 'Lower Body', col: 2},
	{id: 'quads', label: 'Quads', col: 2},
	{id: 'glutes', label: 'Glutes', col: 2},
	{id: 'hips', label: 'Hips', col: 2},
	{id: 'core', label: 'Core', col: 2},
	{id: 'obliques', label: 'Obliques', col: 2}
])

.controller('ExercisesCtrl', 
	function($scope, $location, $routeParams, fbUrl, $firebase, cWeightTypes, cMuscleGroups, cUsesWeights, cIntensity) {
		
		$scope.muscleGroups = parseMuscleGroupColumns(cMuscleGroups);
		$scope.usesWeights = cUsesWeights;
		$scope.weightTypes = cWeightTypes;
		$scope.intensity = cIntensity;
		$scope.mode = 'list';
		
		var ref = new Firebase(fbUrl + 'app/exercises');
	    var fb = $firebase(ref);
		$scope.exercises = fb.$asArray();
		
		$scope.createExercise = function(){
			$scope.mode = 'create';
			$scope.exercise = {title: "This is my new exercise", usesWeights: "no-weights"};
		}
		
		$scope.cancelEdit = function() {
	        $scope.mode = 'list';
		}
		
		$scope.editExercise = function(e) {
			$scope.mode = 'edit';
			$scope.exercise = e;		
		}

		$scope.saveExercise = function(){
			
			var ref = new Firebase(fbUrl + 'app/exercises/');

			if ($scope.mode == 'create') {
				
				try {
			        ref.push($scope.exercise);
			        $scope.mode = 'list';
			    } catch(e) {
				    console.log(e);
			    }
			}
			
			if ($scope.mode == 'edit') {

				try {
					var temp = JSON.parse(JSON.stringify($scope.exercise));
					delete temp.$id;
					delete temp.$priority;
					delete temp.$$hashKey;
			        ref.child($scope.exercise.$id).set(temp);
			        
			        $scope.mode = 'list';
			    } catch(e) {
				    console.log(e);
			    }
				
			}
			
		}
		
	}

);


function parseMuscleGroupColumns(wholeList) {
	
	var temp = { columns: { '1': [], '2': [] }}; 

	wholeList.forEach(function(e) {
		temp.columns[e.col].push(e);
	});
	
	return temp;		
	
}
