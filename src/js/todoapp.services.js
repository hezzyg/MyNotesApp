(function() {

'use strict';


TodoServices.$inject = ['CONST', '$timeout', '$rootScope'];
function TodoServices (CONST, $timeout, $rootScope) {
	var service = this;
	var date = new Date();	
	var today = date.getDate();	
	var tommorow = date.setDate(date.getDate() + 1);	

	service.labelList = [
		{
			label:"Personal", 
			color:"#00aa00"
		}, 
		{
			label:"Work", 
			color:"#ef861c"
		}, 
		{
			label:"Family", 
			color:"#f922d6"
		}, 
		{
			label:"Custom Label", 
			color:"#e6ff29"
		}];
	service.timeSections = ["All", "Today", "Tommorow", "This Week", "Next Week"];
	service.tasksList = [
		new Task(
			0, 
			"Doctor appointment", 
			"16:00 \n30th Hertzel St.",
			CONST.today, 
			[false, true, false, true]
		),
		new Task(
			1, 
			"Groceries List", 
			"1. Bakery and Bread \n2. Meat and Seafood \n3. Pasta and Rice \n4. Oils, Sauces, Salad Dressings, and Condiments \n5. Cereals and Breakfast Foods \n6. Soups and Canned Goods \n7. Frozen Foods \n8. Dairy, Cheese, and Eggs \n9. Snacks and Crackers \n10. Produce \n11. Drinks",
			CONST.tomorrow,
			[false, true, true, false]
		),
		new Task(
			2, 
			"My Special Task", 
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. \nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, \nwhen an unknown printer took a galley of type and scrambled it \nto make a type specimen book.",
			CONST.today,			
			[true, false, false, true]
		)
	];

	function Task (id, title, desc, date, labels) {
		this.id = id;
		this.title = title;
		this.description = desc;
		this.date = date;
		this.labels = labels;
	}


	service.addNewLabel = function (newLabel) {		
		service.labelList.push(newLabel);
	};

	service.deleteLabel = function (id) {
		service.labelList.splice(id, 1);
		service.tasksList.forEach(function(task) {
			task.labels.splice(id, 1);
		});


	};

	service.saveNewTask = function (task) {
		service.tasksList.push(task);
	};

	service.deleteTask = function (taskId) {
		var index = service.tasksList.map(function(e) { return e.id; }).indexOf(taskId);		
		service.tasksList.splice(index, 1);
		//refresh task list in the show task component
		$rootScope.$broadcast('$closeModal', true);
	}

	service.updateTask = function (task, taskId) {
		var index = service.tasksList.map(function(e) { return e.id; }).indexOf(taskId);
		service.tasksList[index] = task;
	};

	service.getTaskById = function (taskId) {		
		var index = service.tasksList.map(function(e) { return e.id; }).indexOf(taskId);		
		return service.tasksList[index];
	}
}


angular.module('ToDoApp')
.service('TodoServices', TodoServices);


})();