(function() {

'use strict';


var date = new Date();
date.setHours(0,0,0,0);

var tomorrow = new Date();
tomorrow.setHours(0,0,0,0);
tomorrow.setDate(date.getDate(date) + 1);


angular.module('ToDoApp')
.constant("CONST", {
	today: date,
	tomorrow: tomorrow
});


})();