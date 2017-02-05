(function () {

"use strict";


angular.module('ToDoApp')
.config(RoutesConfig);


RoutesConfig.$uinject = ['$stateProvider', '$urlRouterProvider'];
function RoutesConfig ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('main', {
		url: '/',
		templateUrl: 'src/main/main.template.html',
		controller: 'MainController as MainCtrl'
	});

}


})();