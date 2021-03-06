(function() {

'use strict';


SearchBarController.$inject = ['$rootScope'];
function SearchBarController ($rootScope) {
	var $ctrl = this;	

	$ctrl.updateSearchResults = function (event) {
		event.keyCode == 27 ? $ctrl.term = '' : '';
		$rootScope.$broadcast('$updateSearchResults', $ctrl.term);
	};

	$ctrl.clearSearch = function () {
		$ctrl.term = '';
		$rootScope.$broadcast('$updateSearchResults', $ctrl.term);
	};

}


angular.module('ToDoApp')
.component('searchBar', {
	templateUrl: 'src/search-bar/search-bar.template.html',
	controller: SearchBarController,
	bindings: {
		term: '='
	}
});


})();