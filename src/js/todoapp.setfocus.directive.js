(function() {

'use strict';


angular.module('ToDoApp')
.directive('focusThis', FocusThis);


FocusThis.$inject = ['$timeout', '$parse'];
function FocusThis ($timeout, $parse) {
	return {
		link: function (scope, element, attrs) {
			var model = $parse(attrs.focusThis);
			scope.$watch(model, function(value) {
				if (value === true) {
					$timeout(function() {						
						element[0].focus();
					},100)
				}
			})
		}
	}
}


})();