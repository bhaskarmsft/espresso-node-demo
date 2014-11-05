Application.controller('PurchaseOrdersCtrl', [
	'$rootScope', '$scope', '$http',
	function ($rootScope, $scope, $http) {
		//user interface methods
		$scope.controls = {};
		//user exposed values
		$scope.data = {};

		$rootScope.customer = customers[0];

		$scope.controls.requestOrders = function () {
			$http.post('customerPurchaseOrders', $rootScope.customer).success(function (data) {
				var ordersByOrderNumber, keys;
				ordersByOrderNumber = _.indexBy(data, 'order_number');
				keys = _.keys(ordersByOrderNumber);

				$scope.data.orders = ordersByOrderNumber;

				if ($rootScope.activeOrderIndex) {
					$scope.controls.setActiveOrder($rootScope.activeOrderIndex);
				}
				else {
					$scope.controls.setActiveOrder(ordersByOrderNumber[keys[0]].order_number);
				}
			});
		};

		$scope.controls.requestOrders();

		$scope.controls.setActiveOrder = function (index) {
			$rootScope.activeOrderIndex = index;
			$rootScope.$broadcast('ActivateOrder', $scope.data.orders[index]);
		};

		$scope.controls.addOrder = function () {
			var newOrder = {
				customer_name: $scope.data.order.customer_name,
				notes: '',
				paid: false,
				amount_total: 0
			};

			$scope.data.orders.unshift(newOrder);

			$scope.controls.setActiveOrder(0);
			console.log('addOrder', $scope.data.order);
		};

		$scope.$on('ActivateOrder', function (event, order) {
			$scope.data.order = order;
		});

		$scope.$on('RefreshOrders', function () {
			$scope.controls.requestOrders();
		});
	}
]);