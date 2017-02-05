(function () {

'use strict';


TopController.$inject = ['$window', '$rootScope', '$scope'];
function TopController ($window, $rootScope, $scope) {
	//INITIALIZING
	var topCtrl = this;	
	var sidebarStatus = true;
	var data = {};
	topCtrl.screenSize;
	topCtrl.searchTerm = '';

	// check window width to decide if to show sidebar
  	var wrapper = angular.element( document.querySelector('.mainWrapper'));
	
	function CheckSize () {			
	    if ($window.innerWidth < 768) {
	    	wrapper.addClass('toggled');
	    	data = {
	    		status: false,
	    		isSmallScreen: true
	    	};
	    	$rootScope.$broadcast('$SidebarOpenStatus', data);
	    	topCtrl.screenSize = true
	    	sidebarStatus = false;
	    } else {
	         	wrapper.removeClass('toggled');
	         	data = {
	    			status: true,
	    			isSmallScreen: false
	    		};
	         	$rootScope.$broadcast('$SidebarOpenStatus', data);
	         	topCtrl.screenSize = false;
	         	sidebarStatus = true;
	    	}
  	}

	CheckSize ();

	function CheckScreenSize () {
		if ($window.innerWidth < 768) topCtrl.screenSize = true;
		 	else topCtrl.screenSize = false;
		$scope.$digest();
	}

	angular.element($window).on('resize',function() {		
		// CheckSize();
		CheckScreenSize();
		$rootScope.$broadcast('$ResizeHasMade', true);
	});
	// end of window size check

	topCtrl.sidebarToggle = function () {
		$(".mainWrapper").toggleClass("toggled");
		sidebarStatus = !sidebarStatus;
		data.status = sidebarStatus;
		$rootScope.$broadcast('$SidebarOpenStatus', data);
	};
	
	$scope.$on('$CloseSidebar', function(event, d) {
		if (d) topCtrl.sidebarToggle();
	});

	$scope.$watch('topCtrl.showSearchXs', function() {		
		$rootScope.$broadcast('$topbarHeightExtended', topCtrl.showSearchXs);
	})

}


angular.module('ToDoApp')
.controller('TopController', TopController);


})();