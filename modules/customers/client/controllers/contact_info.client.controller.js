'use strict';

// Customers controller
angular.module('customers.contact_info').controller('ContactInfoController', ['$scope', '$stateParams', '$state', 'Authentication', 'ContactInfo',
  function ($scope, $stateParams, $state, Authentication, ContactInfo) {
    $scope.authentication = Authentication;
    $scope.customerId = $stateParams.customerId;

    // Create new ContactInfo
    $scope.create = function () {
      // Create new ContactInfo object
      var contact_info = new ContactInfo({
        contact_type: this.contact_type,
        contact_value: this.contact_value,
        customerId: $stateParams.customerId
      });

      // Redirect after save
      contact_info.$save(function (response) {
        $state.go('customers.view', {customerId: $scope.customerId});

        // Clear form fields
        $scope.contact_type = '';
        $scope.contact_value = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing ContactInfo
    $scope.remove = function (contact_info) {
      alertify.confirm('Do you really want to remove this contact information?', function(result){
        if (!result){
          return;
        }
        
        if (contact_info) {
          contact_info.customerId = $stateParams.customerId;
          contact_info.$remove();

          for (var i in $scope.contact_infoes) {
            if ($scope.contact_infoes[i] === contact_info) {
              $scope.contact_infoes.splice(i, 1);
            }
          }
        } else {
          $scope.contact_info.$remove(function () {
            $state.go('customers.view', {customerId: $stateParams.customerId});
          });
        }
      });
    };

    // Update existing ContactInfo
    $scope.update = function () {
      var contact_info = _.extend($scope.contact_info, {
        customerId: $stateParams.customerId
      });

      contact_info.$update(function () {
        alertify.success('ContactInfo updated');
        // $state.go('customers.contact_info.view', {customerId: $stateParams.customerId, contact_infoId: $stateParams.contact_infoId});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of ContactInfoes
    $scope.find = function () {
      ContactInfo.query({customerId: $stateParams.customerId}).$promise.then(function(data){
        $scope.contact_infoes = _.extend(data, _.map(data, function(d, index){
          return _.extend(d, { 
            index: index+1,
            contact_type: d.contact_type,
            contact_value: d.contact_value
          });
        }));
      });
    };

    // Find existing ContactInfo
    $scope.findOne = function () {
      $scope.contact_info = ContactInfo.get({
        customerId: $stateParams.customerId,
        contact_infoId: $stateParams.contact_infoId
      });
    };
  }
]);
