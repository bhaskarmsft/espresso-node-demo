Application.controller('PurchaseOrdersCtrl', [
	'$rootScope', '$scope', '$http', '$compile', '$timeout',
	function ($rootScope, $scope, $http, $compile, $timeout) {
		//user interface methods
		$scope.controls = {};
		//user exposed values
		$scope.data = {};
		$scope.params = {};

		$rootScope.customer = customers[0];
		$rootScope.errorDialog = function (message) {
			$.Dialog({
				overlay: true,
				shadow: true,
				flat: true,
				title: 'Warning',
				padding: 10,
				content: $compile(
					'<div class="full-height">' +
						'<p>' + message + '</p>' +
						'<button class="btn dialogClose" onclick="$.Dialog.close()">Close</button>' +
						'<button class="btn"><a href="http://www.espressologic.com/" target="_blank">Espresso Logic</a></button>' +
						' <button class="btn"><a href="https://sites.google.com/a/espressologic.com/site/docs/live-api/node-sdk/sample-app" target="_blank">Docs</a></button>' +
					'</div>')($scope)
			});
		};

		$scope.controls.requestOrders = function () {
			$http.post('/customerPurchaseOrders', $rootScope.customer).success(function (data) {
				$http.get('/customer').success(function (customers) {
					$rootScope.customer = customers[0];
				});
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
		};

		$scope.controls.isActive = function (orderNumber) {
			if ($rootScope.activeOrderIndex == orderNumber) {
				return true;
			}
			return false;
		};

		$scope.$on('ActivateOrder', function (event, order) {
			$scope.data.order = order;
		});

		$scope.$on('RefreshOrders', function () {
			$scope.controls.requestOrders();
		});
		$rootScope.$watch('customer.balance', function (current, previous) {
			if (current && current != previous) {
				$scope.params.balanceUpdate = true;
				$timeout(function () {
					$scope.params.balanceUpdate = false
				}, 1000);
			}
		});
	}
]);