(function() {

'use strict';


MainController.$inject = ['$scope', '$timeout'];
function MainController ($scope, $timeout) {
	var $ctrl = this;

	$("#mainWindow").niceScroll({
     	cursorcolor:"#43c0f6",
     	cursorwidth: '10px',
     	horizrailenabled: false,
     	grabcursorenabled: false
     });

	/* ******** adding top padding on small screen, when topbar height is extended ***********/
	$scope.$on('$topbarHeightExtended', function (event, data) {
		$ctrl.addTopPadding = data;		
		$('#mainWindow').toggleClass('addTopPadding');		
	});

}


angular.module('ToDoApp')
.controller('MainController', MainController);


})();