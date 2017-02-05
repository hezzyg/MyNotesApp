(function() {

'use strict';


EditTaskController.$inject = ['TodoServices', '$scope'];
function EditTaskController (TodoServices, $scope) {
	var $ctrl = this;
	$ctrl.hideModal = true;

	$scope.$on('$editTask', function (event, data) {
		$ctrl.hideModal = false;		
	});

	$scope.$on('$closeModal', function (event, data) {
		$ctrl.hideModal = data;
	});

	
}


angular.module('ToDoApp')
.component('editTask', {
	templateUrl: 'src/edit-task/edit-task.template.html',
	controller: EditTaskController
	
});


})();