'use strict';

// Drawings controller
angular.module('drawings').controller('DrawingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Drawings', '$state', 'Girths', 'Materials',
  function ($scope, $stateParams, $location, Authentication, Drawings, $state, Girths, Materials) {
    $scope.authentication = Authentication;

    $scope.body = {};
    $scope.directions = {
      t: 'Top',
      tr: 'Top Right',
      r: 'Right',
      br: 'Bottom Right',
      b: 'Bottom',
      bl: 'Bottom Left',
      l: 'Left',
      tl: 'Top Left'
    };

    $scope.editing = -1;
    $scope.newLine = {
    };

    $scope.length = 0;

    // $scope.$watch('body.start_point', function(nv){
    // }, true);

    $scope.$watch('body.lines', function(nv){
      $scope.length = _.reduce($scope.body.lines, function(sum, l){
        return sum + l.length*1;
      }, 0);
    }, true);

    // Create new Drawing
    $scope.create = function () {
      // Create new Drawing object
      var drawing = new Drawings({
        title: $scope.title,
        body: $scope.body,
        girthId: $scope.girth,
        materialId: $scope.material,
      });

      // Redirect after save
      drawing.$save(function (response) {
        $state.go('drawings.edit', {drawingId: response._id});

        // Clear form fields
        $scope.title = '';
        $scope.body = {};

        alertify.success(response.size + ' drawing created');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Drawing
    $scope.remove = function (drawing) {
      alertify.confirm('Do you really want to remove this drawing?', function(result){
        if (!result){
          return;
        }
        
        if (drawing) {
          drawing.$remove();

          for (var i in $scope.drawings) {
            if ($scope.drawings[i] === drawing) {
              $scope.drawings.splice(i, 1);
            }
          }
        } else {
          $scope.drawing.$remove(function () {
            $state.go('drawings.list');
          });
        }

        alertify.success(drawing.title + ' removed from Drawings');
      });
    };

    // Update existing Drawing
    $scope.update = function () {
      var drawing = $scope.drawing;
      drawing.materialId = $scope.drawing.material;
      drawing.girthId = $scope.drawing.girth;
      delete drawing.material;
      delete drawing.girth;
      drawing.$update(function () {
        alertify.success(drawing.title + ' updated');
        
        $state.go('drawings.edit', {drawingId: $stateParams.drawingId}, {reload: true});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Drawings
    $scope.find = function () {
      Drawings.query().$promise.then(function(data){
        $scope.drawings = _.extend(data, _.map(data, function(d, index){
          return _.extend(d, { 
            index: index+1,
            title: d.title
          });
        }));
      });
    };

    // Find existing Drawing
    $scope.findOne = function () {
      $scope.init();
      Drawings.get({
        drawingId: $stateParams.drawingId
      }).$promise.then(function(res){
        $scope.drawing = res;
        DRAW.load(res.body);
        $scope.body = DRAW.getBody();
      });
    };

    //Init
    $scope.init = function(){
      $scope.info = 'Click on the canvas to start drawing from the point.';
      $scope.girths = Girths.query();
      $scope.materials = Materials.query();

      DRAW.init('drawing-canvas');
      $scope.body = DRAW.getBody();
    };



    $scope.addLine = function(){
      if ($scope.editing !== -1){
        $scope.body.lines[$scope.editing] = $scope.newLine;
        $scope.draw();
      }else{
        DRAW.addLine($scope.newLine);
        $scope.newLine = {};
        $('#direction').focus();  
      }
    };

    $scope.startLine = function(){
      $scope.editing = -1;
      $scope.newLine = {};
    };

    $scope.removeLine = function(index){
      $scope.body.lines.splice(index, 1);
      $scope.draw();
    };

    $scope.editLine = function(index){
      $scope.newLine = $scope.body.lines[index];
      $scope.editing = index;
    };

    $scope.draw = function(){
      DRAW.draw();
    };

    $scope.treatInput = function(evt){
      if (evt.which === 13){
          $scope.addLine();
      }
    };

  }
]);
