'use strict';

// Customers controller
angular.module('customers.address').controller('AddressController', ['$scope', '$stateParams', '$state', 'Authentication', 'Address', '$compile',
  function ($scope, $stateParams, $state, Authentication, Address, $compile) {
    $scope.authentication = Authentication;
    $scope.customerId = $stateParams.customerId;

    // Create new Address
    $scope.create = function () {
      // Create new Address object
      var address = new Address({
        first_name: this.first_name,
        last_name: this.last_name,
        street_line1: this.street_line1,
        street_line2: this.street_line2,
        street_line3: this.street_line3,
        street_line4: this.street_line4,
        city: this.city,
        state: this.state,
        country: this.country,
        zipcode: this.zipcode,
        customerId: $stateParams.customerId
      });

      // Redirect after save
      address.$save(function (response) {
        $state.go('customers.view', {customerId: $scope.customerId});

        // Clear form fields
        $scope.first_name = '';
        $scope.last_name = '';
        $scope.street_line1 = '';
        $scope.street_line2 = '';
        $scope.street_line3 = '';
        $scope.street_line4 = '';
        $scope.city = '';
        $scope.state = '';
        $scope.country = '';
        $scope.zipcode = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Address
    $scope.remove = function (address) {
      alertify.confirm('Do you really want to remove this address?', function(result){
        if (!result){
          return;
        }
        
        if (address) {
          address.customerId = $stateParams.customerId;
          address.$remove();

          for (var i in $scope.addresses) {
            if ($scope.addresses[i] === address) {
              $scope.addresses.splice(i, 1);
            }
          }
        } else {
          $scope.address.$remove(function () {
            $state.go('customers.view', {customerId: $stateParams.customerId});
          });
        }
      });
    };

    // Update existing Address
    $scope.update = function () {
      var address = _.extend($scope.address, {
        customerId: $stateParams.customerId
      });

      address.$update(function () {
        alertify.success('Address updated');
        // $state.go('customers.address.view', {customerId: $stateParams.customerId, addressId: $stateParams.addressId});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Addresses
    $scope.find = function () {
      Address.query({customerId: $stateParams.customerId}).$promise.then(function(data){
        $scope.addresses = _.extend(data, _.map(data, function(d, index){
          return _.extend(d, { 
            index: index+1,
            name: d.first_name + ' ' + d.last_name,
            address: Address.makeAddress(d)
          });
        }));
      });
    };

    // Find existing Address
    $scope.findOne = function () {
      $scope.address = Address.get({
        customerId: $stateParams.customerId,
        addressId: $stateParams.addressId
      });
    };
  }
]);
