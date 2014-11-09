Application.controller('OrderDetailsCtrl', [
	'$rootScope', '$scope', '$http', '$compile',
	function ($rootScope, $scope, $http, $compile) {
		//user interface methods
		$scope.controls = {};
		//user exposed  values
		$scope.data = {};
		//internal values 
		$scope.params = {};

		//Popup Edit Item Dialog
		$scope.controls.editLineItem = function (index) {
			//set necessary params for modal
			$scope.params.productName = $scope.data.order.LineItems[index].Product.name;
			$scope.params.lineItemIndex = index;
			$scope.params.lineItem = $scope.data.order.LineItems[index];

			//init modal
			$.Dialog({
				overlay: true,
				shadow: true,
				flat: true,
				title: 'Line Item Dialog',
				padding: 10,
				width: 300,
				content: $compile(
					'<div ng-controller="LineItemCtrl">' +
						'<label>Product:</label> <select ng-model="data.product" ng-options="product.name for (index, product) in data.products"></select>' +
						'<label>Quantity:</label> <input type="number" ng-model="data.quantity" />' +
						'<label>Estimated Price:<label> <span class="text-muted">{{data.estimatedPrice}}</span>' +
						'<button class="btn primary float-right" ng-click="controls.closeDialog();">Save</button>' +
					'</div>')($scope)
			});
		};

		//Immediately delete this LineItem[index] and remove it from the list
		$scope.controls.delLineItem = function (index) {
			var lineItems, lineItem;
			lineItems = $scope.data.order.LineItems;
			lineItem = lineItems[index];
			$http.post('/del', lineItem).success(function (reply) {
				lineItems.splice(index, 1);
				$scope.controls.refreshOrder();
			});
		};

		//Popup Add Item Dialog
		$scope.controls.addLineItem = function () {
			//init modal
			$.Dialog({
				overlay: true,
				shadow: true,
				flat: true,
				title: 'Line Item Dialog',
				padding: 10,
				width: 300,
				content: $compile(
					'<div ng-controller="LineItemCtrl">' +
						'<label>Product:</label> <select ng-model="data.product" ng-options="product.name for (index, product) in data.products"></select>' +
						'<label>Quantity:</label> <input type="number" ng-model="data.quantity" />' +
						'<label>Estimated Price:<label> <span class="text-muted">{{data.estimatedPrice}}</span>' +
						'<button class="btn primary float-right" ng-click="controls.closeDialog();">Save</button>' +
					'</div>')($scope)
			});
		};

		//Enables/disables edit note mode
		$scope.controls.editOrderNote = function () {
			$scope.params.editMode = !$scope.params.editMode;
		};

		//Immediately deletes this order
		$scope.controls.delOrder = function () {

		};

		//Updates the data.order.paid boolean
		$scope.controls.togglePaymentStatus = function () {
			if ($scope.data.order.paid) {
				$scope.data.status = 'PAID';
			}
			else {
				$scope.data.status = 'UNPAID';
			}
		};

		$scope.controls.saveLineItem = function (lineItem) {
			$http.post('/put', lineItem).success(function (txSummary) {
				$scope.controls.refreshOrder();
			});
		};

		$scope.controls.saveOrder = function () {
			//Indicate to Espresso we're updating an existing record
			$scope.data.order['@metadata'].action = 'UPDATE';

			//The /put endpoint is a demonstration of an update PUT request using the npm package,
			//and it is not strictly speaking a proper RESTful endpoint
			$http.post('/put', $scope.data.order).success(function (txSummary) {
				$scope.controls.refreshOrder();
			});
		};

		$scope.controls.refreshOrder = function () {
			$rootScope.$broadcast('RefreshOrders');
		};

		$scope.$watch('data.order.paid', function (current, previous) {
			if (angular.isDefined(current)) {
				$scope.controls.togglePaymentStatus();
			}
		});

		$scope.$on('ActivateOrder', function (event, order) {
			$scope.data.order = order;
			$scope.controls.togglePaymentStatus();
		});

		$scope.$on('UpdateLineItem', function (event, data) {
			var lineItem;
			lineItem = $scope.data.order.LineItems[data.index];
			lineItem.qty_ordered = data.quantity;
			lineItem.product_number = data.product.product_number;
			$scope.controls.saveLineItem(lineItem);
		});

		$scope.getOrderHref = function () {
			var projectFragment;
			projectFragment = '/' + $scope.data.order.order_number;

			return angular.copy($scope.data.order['@metadata'].href).replace(projectFragment, '');
		};

		$scope.$on('AddLineItem', function (event, data) {
			var newLineItem, metadata;

			newLineItem = {
				order_number: $scope.data.order.order_number,
				product_number: data.product.product_number,
				qty_ordered: data.quantity
			};

			//Define the @metadata.href, which corresponds to the subresource within the CustomerBusinessObject resource
			//Define the @metadata.action, which indicates to Espresso we're creating a new record
			metadata = {
				href: $scope.getOrderHref() + '.LineItems',
				action: 'INSERT'
			};

			newLineItem['@metadata'] = metadata;

			//The /put endpoint is a demonstration of an INSERT PUT request using the npm package,
			//and it is not strictly speaking a proper RESTful endpoint
			$http.post('/put', newLineItem).success(function (txSummary) {
				$scope.controls.refreshOrder();
			});
		});
	}
]);