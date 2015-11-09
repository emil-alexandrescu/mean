'use strict';

// Works controller
angular.module('works').controller('WorksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Works', '$state', 'Customers', 'Address', 'Drawings',
  function ($scope, $stateParams, $location, Authentication, Works, $state, Customers, Address, Drawings) {
    $scope.authentication = Authentication;

    $scope.customer = '';
    $scope.command = '';

    var keyStack = {h: '', v: ''};
    var keyMap = {};
    var keyString = {37: 'l', 38: 't', 39: 'r', 40: 'b'};
    var allowedKeys = 'dfDF0123456789';

    $(document).keydown(function(e){
        var key = e.which;
        if (key == 37 || key == 39){
            keyStack.h = key;
        }
        if (key == 38 || key == 40){
            keyStack.v = key;
        }
        keyMap[key] = true;
    });

    $(document).keyup(function(e){
        //TODO: implement only for selected drawing
        var key = e.keyCode;
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
            $scope.$apply();
            console.log($scope.command);
        }
    });
    // // Create new Work
    // $scope.create = function () {
    //   // Create new Work object
    //   var work = new Works({
    //     title: this.title,
    //     description: this.description,
    //     customerId: this.customer,
    //     order_number: this.order_number,
    //     req_date: this.req_date,
    //     addressId: this.address,
    //     delivery_charge: this.delivery_charge,
    //     price: this.price,
    //     tax: this.tax,
    //     order_or_quote: this.order_or_quote,
    //     status: this.status,
    //     drawingId: this.drawing
    //   });

    //   // Redirect after save
    //   work.$save(function (response) {
    //     alertify.success(work.title + ' saved');
    //     $state.go('works.edit', {workId: work._id});
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
    //   });
    // };

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

    // // Update existing Work
    // $scope.update = function () {
    //   var work = _.extend($scope.work, {
    //     customerId: $scope.customer,
    //     drawingId: $scope.drawing,
    //     addressId: $scope.address
    //   });

    //   work.$update(function () {
    //     alertify.success(work.title + ' updated');
    //     $state.go('works.edit', {workId: work._id});
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
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

    // // Find existing Work
    // $scope.findOne = function () {
    //   Works.get({
    //     workId: $stateParams.workId
    //   }).$promise.then(function(data){
    //     if (_.isObject(data.address)){
    //       $scope.addressName = Address.makeAddress(data.address);
    //       $scope.address = data.address._id;
    //       delete data.address;
    //     }
    //     if (_.isObject(data.customer)){
    //       $scope.customerName = data.customer.first_name + ' ' + data.customer.last_name + ' (' + data.customer.company + ')';
    //       $scope.customer = data.customer._id;
    //       delete data.customer;
    //     }
    //     if (_.isObject(data.drawing)){
    //       $scope.drawingName = data.drawing.title;
    //       $scope.drawing = data.drawing._id;
    //       delete data.drawing;
    //     }
    //     $scope.work = data;
    //   });
    // };

    // //ajax calls
    // $scope.getCustomers = function(q){
    //   $scope.customer = '';
    //   return Customers.query({q: q}).$promise.then(function(data){
    //     return _.map(data, function(d){
    //       return _.extend(d, {name: d.first_name + ' ' + d.last_name + ' (' + d.company + ')'});
    //     });
    //   });
    // };

    // $scope.getAddresses = function(q){
    //   $scope.address = '';
    //   return Address.query({customerId: $scope.customer, q:q}).$promise.then(function(data){
    //     return _.map(data, function(d){
    //       return _.extend(d, {name: Address.makeAddress(d)});
    //     });
    //   });
    // };

    // $scope.getDrawings = function(q){
    //   $scope.drawing = '';
    //   return Drawings.query({q: q}).$promise;
    // };

    // $scope.onSelectCustomer = function($item, $model, $label){
    //   $scope.customer = $item._id;
    // };

    // $scope.onSelectAddress = function($item, $model, $label){
    //   $scope.address = $item._id;
    // };

    // $scope.onSelectDrawing = function($item, $model, $label){
    //   $scope.drawing = $item._id;
    // };

    // $scope.clearCustomer = function(){
    //   $scope.customerName = '';
    //   $scope.customer = '';
    // };

    // $scope.clearAddress = function(){
    //   $scope.addressName = '';
    //   $scope.address = '';
    // };

    // $scope.clearDrawing = function(){
    //   $scope.drawingName = '';
    //   $scope.drawing = '';
    // };

  }
]);
