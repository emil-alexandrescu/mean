'use strict';

// Works controller
angular.module('works').controller('WorksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Works', '$state', 'Customers', 'Address', 'Drawings',
  function ($scope, $stateParams, $location, Authentication, Works, $state, Customers, Address, Drawings) {
    var keyStack = {h: '', v: ''};
    var keyMap = {};
    var keyString = {37: 'l', 38: 't', 39: 'r', 40: 'b'};
    var allowedKeys = 'DF0123456789';

    $(document).keydown(function(e){
        if (e.target.tagName === 'INPUT') {
            return;
        }
        if ($scope.currentIndex === -1) {
            return;
        }
        var key = e.which;
        if (key == 37 || key == 39){
            keyStack.h = key;
            e.preventDefault();
        }
        if (key == 38 || key == 40){
            keyStack.v = key;
            e.preventDefault();
        }
        keyMap[key] = true;
    });

    $(document).keyup(function(e){
        if (e.target.tagName === 'INPUT') {
            return;
        }
        if ($scope.currentIndex === -1) {
            return;
        }
        //TODO: implement only for selected drawing
        var key = e.keyCode;
        if (key >= 96 && key<=105) { // numpad keys
            key -= 48;
        }
        var s = String.fromCharCode(key);
        var oldCommand = $scope.command;
        keyMap[key] = false;
        if (key >= 37 && key <= 40){
            if (!(keyMap[37] || keyMap[38] || keyMap[39] || keyMap[40])){
                if (keyStack.v){
                    $scope.command += keyString[keyStack.v];
                }
                if (keyStack.h){
                    $scope.command += keyString[keyStack.h];
                }
                keyStack = {};
            }
        }
        if (allowedKeys.indexOf(s) !== -1){
            $scope.command += s;
        }
        if (key === 190 || key === 110){
            $scope.command += '.';
        }
        if (key == 46){
            $scope.command = '';
        }

        if (oldCommand != $scope.command){
            $scope.drawings[$scope.currentIndex].command = $scope.command;
            $scope.$apply();
            console.log($scope.command);
        }
    });

    $scope.authentication = Authentication;
    $scope.defaultValues = {};
    var isCreate = false;
    if ($state.current.name === 'works.create'){
        isCreate = true;
    }

    // Find existing Work
    $scope.findOne = function () {
        if (isCreate) {
            $scope.work = {
                description: '',
                order_number: '',
                req_date: '',
                total: '',
                sub_total: 0,
                po: '',
                order_or_quote: 'order'
            };
            $scope.drawings = [{}, {}, {}, {}];
        } else {
            Works.get({
                workId: $stateParams.workId
            }).$promise.then(function(data){
                $scope.work = data;
                $scope.defaultValues = _.pick($scope.work, 'customer', 'ship_address', 'bill_address');
                if (data.customer) {
                    $scope.work.customer = data.customer._id;
                }
                if (data.bill_address){
                    $scope.work.bill_address = data.bill_address._id;
                }
                if (data.ship_address){
                    $scope.work.ship_address = data.ship_address._id;
                }
                $scope.drawings = _.map($scope.work.drawings, function(d){
                    return d?d:{};
                });
            });
        }
    };

    $scope.customer = '';
    $scope.command = '';
    $scope.currentIndex = -1;

    $scope.selectDrawing = function(index) {
        $scope.currentIndex = index;
        $scope.command = $scope.drawings[index].command || '';
    };

    $scope.addDrawings = function() {
        $scope.drawings.push({});
        $scope.drawings.push({});
    };

    $scope.save = function () {
        if (isCreate) {
            $scope.create();
        }else {
            $scope.update();
        }
    };

    // Create new Work
    $scope.create = function () {
      // Create new Work object
      var work = new Works(_.extend($scope.work, {
          drawings: $scope.drawings
      }));

      // Redirect after save
      work.$save(function (response) {
        alertify.success(work.title + ' saved');
        $state.go('works.edit', {workId: work._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Update existing Work
    $scope.update = function () {
      $scope.work.$update(function () {
        alertify.success($scope.work.order_number + ' updated');
        $state.go('works.edit', {workId: $scope.work._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // // Remove existing Work
    // $scope.remove = function (work) {
    //   alertify.confirm('Do you really want to remove this work?', function(result){
    //     if (!result){
    //       return;
    //     }

    //     if (work) {
    //       work.$remove();

    //       for (var i in $scope.works) {
    //         if ($scope.works[i] === work) {
    //           $scope.works.splice(i, 1);
    //         }
    //       }
    //     } else {
    //       $scope.work.$remove(function () {
    //         $state.go('works');
    //         alertify.success($state.work.title + ' removed');
    //       });
    //     }
    //   });
    // };

    // // Find a list of Works
    // $scope.find = function () {
    //   Works.query().$promise.then(function(data){
    //     $scope.works = _.map(data, function(d, index){
    //       return [
    //         index+1,
    //         '<a href="/works/'+d._id+'/edit">' + d.title + '</a>',
    //         d.description,
    //         '<a class="btn btn-primary btn-xs" href="/works/'+d._id+'/edit"><i class="fa fa-pencil"></i></a>'
    //       ];
    //     });
    //   });
    // };
  }
]);
