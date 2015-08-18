'use strict';

// Girths controller
angular.module('works.girths').controller('GirthsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Girths', '$state',
  function ($scope, $stateParams, $location, Authentication, Girths, $state) {
    $scope.authentication = Authentication;

    // Create new Girth
    $scope.create = function () {
      // Create new Girth object
      var girth = new Girths({
        size: this.size,
        description: this.description
      });

      // Redirect after save
      girth.$save(function (response) {
        $state.go('girths.edit', {girthId: response._id});

        // Clear form fields
        $scope.size = '';
        $scope.description = '';
        alertify.success(response.size + ' girth created');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Girth
    $scope.remove = function (girth) {
      alertify.confirm('Do you really want to remove this girth?', function(result){
        if (!result){
          return;
        }
        
        if (girth) {
          girth.$remove();

          for (var i in $scope.girths) {
            if ($scope.girths[i] === girth) {
              $scope.girths.splice(i, 1);
            }
          }
        } else {
          $scope.girth.$remove(function () {
            $state.go('girths.list');
          });
        }

        alertify.success(girth.size + ' removed from Girths');
      });
    };

    // Update existing Girth
    $scope.update = function () {
      var girth = $scope.girth;

      girth.$update(function () {
        alertify.success(girth.size + ' updated');
        
        $state.go('girths.edit', {girthId: $stateParams.girthId});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Girths
    $scope.find = function () {
      Girths.query().$promise.then(function(data){
        $scope.girths = _.extend(data, _.map(data, function(d, index){
          return _.extend(d, { 
            index: index+1,
            size: d.size,
            description: d.description
          });
        }));
      });
    };

    // Find existing Girth
    $scope.findOne = function () {
      $scope.girth = Girths.get({
        girthId: $stateParams.girthId
      });
    };
  }
]);
