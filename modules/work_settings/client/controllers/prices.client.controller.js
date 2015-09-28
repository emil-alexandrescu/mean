'use strict';

// Prices controller
angular.module('work_settings.prices').controller('PricesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Prices', '$state', 'Materials', 'Girths', '$q',
  function ($scope, $stateParams, $location, Authentication, Prices, $state, Materials, Girths, $q) {
    $scope.authentication = Authentication;

    // Create new Price
    $scope.create = function (materialId, girthId, value) {
      // Create new Price object
      var price = new Prices({
        price: value,
        material: materialId,
        girth: girthId
      });

      // Redirect after save
      price.$save(function (response) {
        $scope.prices.push(_.extend(response, {material: materialId, girth: girthId}));
        alertify.success('new price created');
      }, function (errorResponse) {
        alertify.error(errorResponse.data.message);
      });
    };

    // Update existing Price
    $scope.update = function (price) {
      price.$update(function () {
        alertify.success('price updated');
      }, function (errorResponse) {
        alertify.error(errorResponse.data.message);
      });
    };

    $scope.save = function(materialId, girthId){
      var result = _.findWhere($scope.prices, {
        material: materialId,
        girth: girthId
      });
      var newPrice = $scope.priceTable[materialId][girthId].price;
      if (_.isUndefined(result)){
        $scope.create(materialId, girthId, newPrice);
      }else{
        if (newPrice !== result.price){
          result.price = newPrice;
          $scope.update(result);  
        }
      }
    };

    // Find a list of Prices
    $scope.find = function () {
      var $promises = [];

      $promises.push(Prices.query().$promise);
      $promises.push(Girths.query().$promise);
      $promises.push(Materials.query().$promise);

      $q.all($promises).then(function(datas) {
        $scope.prices = datas[0];
        $scope.girths = datas[1];
        $scope.materials = datas[2];

        $scope.priceTable = {};
        _.each($scope.materials, function(m){
          $scope.priceTable[m._id] = {};
          _.each($scope.girths, function(g){
            $scope.priceTable[m._id][g._id] = null;
          });
        });

        _.each($scope.prices, function(p){
          $scope.priceTable[p.material][p.girth] = {
            price: p.price,
            touched: false
          };
        });

        $scope.materials = _.chain($scope.materials)
          .pick('$resolved', 'length')
          .extend(_.indexBy($scope.materials, '_id'))
          .value();

      }, function(err) {

      });
    };

    $scope.touchPrice = function(materialId, girthId){
      $scope.priceTable[materialId][girthId].touched = true;
    };

    $scope.saveAll = function(){
      _.each($scope.priceTable, function(priceRow, materialId){
        _.each(priceRow, function(p, girthId){
          if (p && p.touched){
            $scope.save(materialId, girthId);
          }
        });
      });
    };
  }
]);
