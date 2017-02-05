(function() {

'use strict';


NewTaskController.$inject = ['TodoServices', '$timeout', '$document', '$scope', '$rootScope'];
function NewTaskController (TodoServices, $timeout, $document, $scope, $rootScope) {
	var $ctrl = this;
	var menuIsOpen = false;
	var menuEvent;
	var menuData;

	//INITIALIZING
	$ctrl.tasksList = TodoServices.tasksList;
	$ctrl.labelList = TodoServices.labelList;
	$ctrl.showNewTaskPlaceholder = true;	
	$ctrl.noScroll = true;	


	$ctrl.showTextarea = function () {
		// clear the input fields		
		$ctrl.newTaskTitle = '';
		$ctrl.newTaskTextBox = '';		
		$ctrl.newTaskDate = null;	
		$ctrl.newTaskLabels = [];
		$ctrl.showNewTaskPlaceholder = false;		
	};


	//closing box if pressing ESC on title
	$ctrl.closeOnEsc = function (event) {
		if (event.keyCode == 27) clearAndClose();
	};
	
	// expanding textarea height on keyup
	$ctrl.autoExpand = function(e) {
        if (e.keyCode == 27) clearAndClose();
        	else {		        
		        var element = typeof e === 'object' ? e.target : document.getElementById(e);        
				if (element) {	    			    	
			        var height = (parseInt(element.value.split("\n").length) * 20 + 30);			       
			        element.style.height = height + "px";
			        if (parseInt(height) > 360) $ctrl.noScroll = false;
			        	else $ctrl.noScroll = true;
				}				
			}		
		$("#mainWindow").getNiceScroll().resize();		
    };		
	 
    // label menu open/close events to prevent modal closing
	$scope.$on('$mdMenuOpen', function (event, data) {
  		menuIsOpen = true;
	});

	$scope.$on('$mdMenuClose', function (event, data) {
  		menuIsOpen = false;  		
	});	

	// indication when calendar menu is closed
	$ctrl.menuIsClose = function (event) {		
		$timeout(function() {
			$ctrl.menuOpen = false;
		},200);
	};

	
	$scope.$on('$editTask', function (event, taskId) {   		
  		EditTask(taskId);
	});

	function EditTask (taskId) {
  		var task = TodoServices.getTaskById(taskId);  		
		$timeout(function () {
			$ctrl.newTaskTitle = task.title;
			$('.newTaskTextarea').val(task.description);
			$ctrl.newTaskTextBox = task.description;
			$ctrl.newTaskDate = task.date;			
			$ctrl.newTaskLabels = task.labels;
  			$ctrl.float = true;
			$ctrl.showNewTaskPlaceholder = false;
			var element = document.getElementById('newTaskTextBoxId');
	        var height = (parseInt(task.description.split("\n").length) * 20 + 30);	        
		    element.style.height = height + "px";
		    if (height > 360) element.style.overflow = 'auto';	        
		}, 300);
		$ctrl.taskId = taskId;		
	}
	
	//closing modal when clicking outside
	var newTaskBox = angular.element( document.querySelector('#newTaskBox'));	
	var newTaskBoxPos = newTaskBox.offset();
	var topPos;
	$document.bind('click', function (event) {
		topPos = document.querySelector('#newTaskBox').getBoundingClientRect().top;		
		if (!menuIsOpen && !$ctrl.menuOpen && !$ctrl.showNewTaskPlaceholder) {
			if (event.pageX < newTaskBoxPos.left || event.pageX > (newTaskBoxPos.left + newTaskBox[0].clientWidth)) {
					$ctrl.checkSaveAndHide();					
			} else if (event.pageY < topPos || event.pageY > (topPos + newTaskBox[0].clientHeight)) {
					$ctrl.checkSaveAndHide();
				}
		}
	});

	// updating new task box position after window resize
	$scope.$on('$ResizeHasMade', function (event, data) {		
		newTaskBoxPos = newTaskBox.offset();
		topPos = document.querySelector('#newTaskBox').getBoundingClientRect().top;		
	});

	// updating new task box position after closing / opening sidebar
	$scope.$on('$SidebarOpenStatus', function (event, data) {
		$timeout(function() {
			newTaskBoxPos = newTaskBox.offset();
			topPos = document.querySelector('#newTaskBox').getBoundingClientRect().top;
		}, 500);
	});

	
	function clearAndClose () {
		// clear the input fields
		$ctrl.showNewTaskPlaceholder = true;
		$ctrl.float = false;
		$ctrl.newTaskTitle = '';
		$ctrl.newTaskDate = '';
		$ctrl.newTaskLabels = [];
		$ctrl.taskId = -1;
		$ctrl.noScroll = true;
		$timeout(function(){
			$('.newTaskTextarea').val('');
			$('.newTaskTextarea').css('height', '50px');			
		}, 200);
		$rootScope.$broadcast('$closeModal', true);
	}


	$ctrl.checkSaveAndHide = function () {			
			$timeout(function() {
				// close the new task box
				$ctrl.showNewTaskPlaceholder = true;
				$ctrl.float = false;
			},400);
			// check if there is content to save
			if ($ctrl.newTaskTitle !== '' || $ctrl.newTaskTextBox !== '') {				
				//give default first label if no other label is chosen
				if ($ctrl.newTaskLabels.indexOf(true) < 0)  $ctrl.newTaskLabels[0] = true;
				// make new Task Obj
				var newTask = {					
					id: $ctrl.tasksList.length, 
					title: $ctrl.newTaskTitle, 
					description: $ctrl.newTaskTextBox,
					date: $ctrl.newTaskDate,
					labels: $ctrl.newTaskLabels
				};				
				//update existing task mode
				if ($ctrl.taskId > -1) {
					newTask.id = $ctrl.taskId;
					TodoServices.updateTask(newTask, $ctrl.taskId);
				}
					// Save the new task
					else TodoServices.saveNewTask(newTask);
			}		
			clearAndClose();
	};
}


angular.module('ToDoApp')
.component('newTask', {
	templateUrl: 'src/new-task/new-task.template.html',
	controller: NewTaskController,	
});


})();