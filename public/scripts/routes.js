'use strict';
Application.config([
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/', {controller: 'ProjectsController', templateUrl: 'app/partials/index.html'})
			.otherwise({redirectTo: '/'});
	}
]);