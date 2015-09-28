'use strict';

// Materials controller
angular.module('work_settings.materials').controller('MaterialsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Materials', '$state',
  function ($scope, $stateParams, $location, Authentication, Materials, $state) {
    $scope.authentication = Authentication;

    // Create new Material
    $scope.create = function () {
      // Create new Material object
      var material = new Materials({
        title: this.title,
        description: this.description
      });

      // Redirect after save
      material.$save(function (response) {
        $state.go('materials.edit', {materialId: response._id});

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        alertify.success(response.title + ' created');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Material
    $scope.remove = function (material) {
      alertify.confirm('Do you really want to remove this material?', function(result){
        if (!result){
          return;
        }
        
        if (material) {
          material.$remove();

          for (var i in $scope.materials) {
            if ($scope.materials[i] === material) {
              $scope.materials.splice(i, 1);
            }
          }
        } else {
          $scope.material.$remove(function () {
            $state.go('materials.list');
          });
        }

        alertify.success(material.title + ' removed from Materials');
      });
    };

    // Update existing Material
    $scope.update = function () {
      var material = $scope.material;

      material.$update(function () {
        alertify.success(material.title + ' updated');
        
        $state.go('materials.edit', {materialId: $stateParams.materialId});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Materials
    $scope.find = function () {
      Materials.query().$promise.then(function(data){
        $scope.materials = _.extend(data, _.map(data, function(d, index){
          return _.extend(d, { 
            index: index+1,
            title: d.title,
            description: d.description
          });
        }));
      });
    };

    // Find existing Material
    $scope.findOne = function () {
      $scope.material = Materials.get({
        materialId: $stateParams.materialId
      });
    };
  }
]);
