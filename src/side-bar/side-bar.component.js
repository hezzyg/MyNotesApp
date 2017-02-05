(function () {

'use strict';


SideBarController.$inject = ['TodoServices', '$timeout', '$rootScope', '$scope', '$document'];
function SideBarController (TodoServices, $timeout, $rootScope, $scope, $document) {
	var $ctrl = this;

	//INITIALIZING
	$ctrl.labelList = TodoServices.labelList;
	$ctrl.tempList = new Array($ctrl.labelList.length);
	$ctrl.tempList.fill(Object({label:'', color:''}));	
	$ctrl.labelErrorMsg = new Array($ctrl.labelList.length);
	$ctrl.timeSections = TodoServices.timeSections;
	$ctrl.labelColorPopoverTemplateUrl = "src/side-bar/popover-templates/label-color-popover.template.html"
	$ctrl.newLabelColorPopoverTemplateUrl = "src/side-bar/popover-templates/new-label-color-popover.template.html"
	$ctrl.InputErrorPopoverTemplateUrl = "src/side-bar/popover-templates/input-error-popover.template.html"

	$("#sideBar").niceScroll({
	 	cursorcolor:"#f6ce21",
	 	cursorwidth: '10px',
	 	railalign: 'left',
	 	cursorborder: 0,
	 	horizrailenabled: false,
	 	grabcursorenabled: false
    });
    $("#sideBar").getNiceScroll().resize();

	// side bar menu item animation
	$ctrl.timeSectionsLength = $ctrl.timeSections.length;
	$ctrl.sidebarTotalItems = $ctrl.timeSections.length + $ctrl.labelList.length;
	function AnimateSidebar (i, length) {		
		if (i < length) {
			$timeout(function() {
				$ctrl.showSidebarMenu[i] = true;
				i++;
				AnimateSidebar(i, length);
			}, 150);
		} else $timeout(function() {
					$ctrl.showAddNewLabel = true;
					$timeout(function() {
						$ctrl.showHR = true;
					}, 700);
				}, 300);
	};

	$ctrl.showSidebarMenu = Array($ctrl.sidebarTotalItems);
	AnimateSidebar(0, $ctrl.sidebarTotalItems);

	// LABEL EDIT BTN SETTINGS
	$ctrl.mouseHoverLabel = false;

	$ctrl.editLabel = function (id) {
		$ctrl.editLabel[id] = true;
	};

	$ctrl.showError = function (id) {
		$ctrl.showError[id] = true;
	};


	$ctrl.saveTempLabelName = function (id) {
		if ($ctrl.labelList[id].label)
			if ($ctrl.tempList[id]) $ctrl.tempList[id].label = $ctrl.labelList[id].label;
				else $ctrl.tempList.push($ctrl.labelList[id]);
	};	


	$ctrl.checkValidLabelName = function (id) {		
		// show error msg if label too short or empty
		$timeout(function() {
			$ctrl.showError[id] = false;			
		}, 3000);
		
		if ($ctrl.labelList[id].label) {
			if ($ctrl.labelList[id].label.length < 2) {				
				$ctrl.editLabel[id] = true;
				$ctrl.labelErrorMsg[id] = "Label is too short! 2 letters minimun";
				$ctrl.showError[id] = true;
				$('#label_' + id).focus();
			} else 
					$timeout(function() {
						$ctrl.editLabel[id] = false;
					},200);
		} else {
				$ctrl.labelList[id].label = $ctrl.tempList[id].label;
				$ctrl.editLabel[id] = true;
				$ctrl.labelErrorMsg[id] = "Label is too short! 2 letters minimun";
				$ctrl.showError[id] = true;
				$('#label_' + id).focus();
				}
	};


    // settings for display label color picker in popup
    $ctrl.inlinesettings = {
      inline: true
    };

    //Delete label
    $ctrl.showDeleteDialog = function (id) {
    	$ctrl.showDeleteDialog[id] = true;
    };    

    $ctrl.showDelDiag = function (id) {
    	$ctrl.showDeleteDialog[id] = true;     	
    };

    $ctrl.mouseleave = function (id) {
    	$ctrl.mouseleave[id] = false;
    };

	$ctrl.checkHide = function (id) {
		if (!$ctrl.mouseleave[id]) 
			$ctrl.showDeleteDialog[id] = !$ctrl.showDeleteDialog[id];
	};

	$ctrl.deleteLabel = function (id) {	
    	$ctrl.showDeleteDialog[id] = false;  
    	TodoServices.deleteLabel(id);
    };

    /* ***** Add new label section ****** */
	$ctrl.labelAddedMsg = undefined; 
	$ctrl.newLabelshowError = false;   

    $ctrl.openAddNewLabel = function () {
    	$ctrl.labelAddedMsg = undefined;
    	$ctrl.showNewLabelForm = !$ctrl.showNewLabelForm;
    	$ctrl.newLabel = {
    		label: '',
    		color: '#000e5e'
    	};
    };

    $ctrl.saveNewlabel = function () {
    	TodoServices.addNewLabel($ctrl.newLabel);
    	// show success msg
    	$ctrl.labelAddedMsg = 'Label was added successfully';
    	$timeout(function() {
    		$ctrl.labelAddedMsg = undefined;
    		$ctrl.showNewLabelForm = !$ctrl.showNewLabelForm;
    	},3000);
    	$ctrl.newLabel = null;
    	// show new label in labels menu
    	$timeout(function() {
    		$ctrl.showSidebarMenu.push('true');
    	},200);

    };

    //choose label from menu
    $ctrl.chosenLabel = null;
    $ctrl.chooseLabel = function (index) {
    	if (!$ctrl.editLabel[index] && !$ctrl.showDeleteDialog[index]) {
	    	if (index == $ctrl.chosenLabel) {
	    		$rootScope.$broadcast('$labelChosen', null);
	    		$ctrl.chosenLabel = null;
	    	}	else {
	    			$rootScope.$broadcast('$labelChosen', index);
	    			$ctrl.chosenLabel = index;
	    		}
	    }
	};

    //choose time period from menu
    $ctrl.chosenTime = 0;
    $ctrl.chooseTime = function (index) {    	    	
    	$rootScope.$broadcast('$timePeriodChosen', index);
    	$ctrl.chosenTime = index;
	};

	//closing sidebar when clicking outside on small screen	
	var sidebarIsOpen;
	var isSmallScreen;
	$scope.$on('$SidebarOpenStatus', function(event, data) {
		sidebarIsOpen = data.status;
		isSmallScreen = data.isSmallScreen;
	});

	$document.bind('click', function (event) {		
		if (sidebarIsOpen && isSmallScreen) {
			if (event.pageX > 240) {
					$rootScope.$broadcast('$CloseSidebar', true);
			} 
		}
	});
}


angular.module('ToDoApp')
.component('sideBar', {
	templateUrl: 'src/side-bar/side-bar.template.html',
	controller: SideBarController
});


})();