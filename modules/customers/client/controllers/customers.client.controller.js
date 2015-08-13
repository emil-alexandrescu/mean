'use strict';

// Customers controller
angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers', '$compile',
  function ($scope, $stateParams, $location, Authentication, Customers, $compile) {
    $scope.authentication = Authentication;

    // Create new Customer
    $scope.create = function () {
      // Create new Customer object
      var customer = new Customers({
        first_name: this.first_name,
        last_name: this.last_name,
        company: this.company
      });

      // Redirect after save
      customer.$save(function (response) {
        $location.path('customers/' + response._id);

        // Clear form fields
        $scope.first_name = '';
        $scope.last_name = '';
        $scope.company = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Customer
    $scope.remove = function (customer) {
      alertify.confirm('Do you really want to remove this customer?', function(result){
        if (!result){
          return;
        }
        
        if (customer) {
          customer.$remove();

          for (var i in $scope.customers) {
            if ($scope.customers[i] === customer) {
              $scope.customers.splice(i, 1);
            }
          }
        } else {
          $scope.customer.$remove(function () {
            $location.path('customers');
          });
        }
      });
    };

    // Update existing Customer
    $scope.update = function () {
      var customer = $scope.customer;

      customer.$update(function () {
        $location.path('customers/' + customer._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Customers
    $scope.find = function () {
      Customers.query().$promise.then(function(data){
        $scope.customers = _.map(data, function(d, index){
          return [
            index+1,
            '<a href="/customers/'+d._id+'">' + d.first_name + ' ' + d.last_name + '</a>',
            d.company,
            '<a class="btn btn-primary btn-xs" href="/customers/'+d._id+'/edit"><i class="fa fa-pencil"></i></a>'
          ];
        });
      });
    };

    // Find existing Customer
    $scope.findOne = function () {
      $scope.customer = Customers.get({
        customerId: $stateParams.customerId
      });
    };
  }
]);
