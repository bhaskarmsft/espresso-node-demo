Application.controller('LineItemCtrl', [
	'$rootScope', '$scope', '$http',
	function ($rootScope, $scope, $http) {
		//view exposed values
		$scope.data = $scope.$eval('data');
		//internal values
		$scope.params = $scope.$eval('params');
		//user interface methods acting on $scope.data
		$scope.controls = {};

		//Request all products for selection
		$http.get('/products').success(function (products) {
			var productsByName = _.indexBy(products, 'name');

			//set view output
			$scope.data.products = productsByName;
			if (angular.equals($scope.params, {})) {
				//Adding a new line item
				
				//initially grab the first product
				$scope.data.product = productsByName[products[0].name];
				//initially set quantity to at least 1
				$scope.data.quantity = 1;
			}
			else {
				//Editting a line item
				$scope.data.product = productsByName[$scope.params.productName];
				$scope.data.quantity = $scope.params.lineItem.qty_ordered;
			}
		});

		//This just serves to estimate the price
		//the demo API does discount items at a quantity specified in the project rules
		$scope.controls.updatePrice = function () {
			$scope.data.estimatedPrice = $scope.data.product.price * $scope.data.quantity;
		};

		//Close the dialog and broadcast UpdateLineItem or AddLineItem
		$scope.controls.closeDialog = function () {
			$.Dialog.close();
			if ($scope.params.lineItemIndex) {
				$rootScope.$broadcast('UpdateLineItem', {
					index: $scope.params.lineItemIndex,
					product: $scope.data.product,
					quantity: $scope.data.quantity
				});
			}
			else {
				$rootScope.$broadcast('AddLineItem', {
					product: $scope.data.product,
					quantity: $scope.data.quantity
				});
			}
		};

		//if data.product changes, update the price
		$scope.$watch('data.product', function (current, previous) {
			if (current && (current != previous)) {
				$scope.controls.updatePrice();
			}
		});

		//if data.quantity changes, update the price
		$scope.$watch('data.quantity', function (current) {
			if (current) {
				$scope.controls.updatePrice();
			}
		});
	}
]);