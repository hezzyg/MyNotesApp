(function() {

'use strict';


angular.module('ToDoApp')
.config(Init);


Init.$inject = ['minicolorsProvider', '$mdDateLocaleProvider'];
function Init (minicolorsProvider, $mdDateLocaleProvider) {	

	angular.extend(minicolorsProvider.defaults, {
      control: 'hue',
      position: 'bottom left',
      theme: 'bootstrap'
    });


	$mdDateLocaleProvider.formatDate = function(date) {
      var m = moment(date);
      return m.isValid() ? m.format('DD/MM/YY') : '';
    };	    
}


})();