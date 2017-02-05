(function() {

'use strict';


ShowTasksController.$inject = ['TodoServices', '$scope', 'CONST'];
function ShowTasksController (TodoServices, $scope, CONST) {
	var $ctrl = this;
	
	//INITIALIZING
	$ctrl.tasksList = TodoServices.tasksList;
	$ctrl.labelList = TodoServices.labelList;
	var currentTimePeriod = 0;
	var currentLabel = null;

	// function to filter tasks list by time & labels
	function HandleSelections(timeChosen, labelChosen) {	
		var startOfWeek = moment().startOf('week').format();
		var endOfWeek = moment().endOf('week').format();				
		var startOfNextWeek = moment(startOfWeek).add(7, 'days').format();
		var endOfNextWeek = moment(endOfWeek).add(7, 'days').format();
		
		switch (timeChosen) {
			case 0:
				$ctrl.tasksList = TodoServices.tasksList;
				if ($ctrl.tasksList.length == 0 && labelChosen == null) $ctrl.showVacationMsg = true;
					else $ctrl.showVacationMsg = false;
				break;
			case 1:					
				$ctrl.showVacationMsg = false;
				$ctrl.tasksList = TodoServices.tasksList.filter(function(obj) {
					return moment(obj.date).format() == moment(CONST.today).format();
				});				
				break;
			case 2:
				$ctrl.showVacationMsg = false;
				$ctrl.tasksList = TodoServices.tasksList.filter(function(obj) {
					return moment(obj.date).format() == moment(CONST.tomorrow).format();
				});
				break;
			case 3:
				$ctrl.showVacationMsg = false;
				$ctrl.tasksList = TodoServices.tasksList.filter(function(obj) {
					return (moment(obj.date).isSameOrAfter(startOfWeek) && 
							moment(obj.date).isSameOrBefore(endOfWeek));
				});
				break;
			case 4:
				$ctrl.showVacationMsg = false;
				$ctrl.tasksList = TodoServices.tasksList.filter(function(obj) {
					return (moment(obj.date).isSameOrAfter(startOfNextWeek) && 
							moment(obj.date).isSameOrBefore(endOfNextWeek));
				});
				break;
		}

		switch (labelChosen) {
			case null:				
				break;
			default:		
				$ctrl.tasksList = $ctrl.tasksList.filter(function(obj) {
					return obj.labels[labelChosen];
				});			
		}

	}
	

	/* ****** filtering ****** */
	$scope.$on('$timePeriodChosen', function (event, timeChosen) {
		HandleSelections(timeChosen, currentLabel);		
		currentTimePeriod = timeChosen;
	});

	$scope.$on('$labelChosen', function (event, labelChosen) {
		HandleSelections(currentTimePeriod, labelChosen);
		currentLabel = labelChosen;
	});

	$scope.$on('$closeModal', function (event, data) {
		data ? HandleSelections(currentTimePeriod, currentLabel) : '';
	});
	
	$ctrl.searchTerm = '';
	//listen to changes to search term
	$scope.$on('$updateSearchResults', function (event, data) {
		$ctrl.searchTerm = data;		
	});


	/* ******** grid view releated ***********/
	var $grid = $('.grid').masonry({
		transitionDuration: '0.4s',
	  	itemSelector: '.grid-item',
	  	columnWidth: '.grid-sizer',
	  	percentPosition: true,
	  	fitWidth: true,
	  	stagger: 30
	});

	$grid.masonry()
	  .append( $ctrl.tasksList )
	  .masonry( 'appended', $ctrl.tasksList );

	$ctrl.indexOf = function (task) {
		return $ctrl.tasksList.indexOf(task);
	};
	
}


angular.module('ToDoApp')
.component('showTasksCards', {
	templateUrl: 'src/show-tasks-cards/show-tasks-cards.template.html',
	controller: ShowTasksController,
	bindings: {
		date: '<',
		label: '<'
	}
});


})();