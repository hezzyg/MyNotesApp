(function() {

'use strict';


TaskCardController.$inject = ['TodoServices', '$rootScope', '$scope'];
function TaskCardController (TodoServices, $rootScope, $scope) {
	var $ctrl = this;

	//INITIALIZING
	$ctrl.labelList = TodoServices.labelList;
	$ctrl.task.tempLabels = {};

	$ctrl.showCardActionBtns = function (index) {
		$ctrl.showCardActionBtns[index] = true;
	}

	$ctrl.deleteTask = function (id) {		
		TodoServices.deleteTask(id);
	};

	$ctrl.editTask = function (id) {		
		$rootScope.$broadcast('$editTask', id);
	}

	// cause the task list to reload so can update by time view
	$ctrl.dateChangedEvent = function () {
		$rootScope.$broadcast('$closeModal', true);
	}

	// cause the task list to reload so can update label change
	$scope.$on('$mdMenuClose', function (event, data) {
		if ($ctrl.labelChanged) $rootScope.$broadcast('$closeModal', true);
		$ctrl.labelChanged = false;
	});
}


angular.module('ToDoApp')
.component('taskCard', {
	templateUrl: 'src/task-card/task-card.template.html',
	controller: TaskCardController,
	bindings: {
		task: '<',
		index: '<',
		searchterm: '<'

	}
});


})();