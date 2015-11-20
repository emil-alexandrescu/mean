'use strict';

// Works controller
angular.module('works').controller('WorksListController', ['$scope', '$stateParams', '$location', 'Works', '$state', 'Customers', 'Address', 'Drawings', '$compile',
  function ($scope, $stateParams, $location, Works, $state, Customers, Address, Drawings, $compile) {
    // Remove existing Work
    $scope.remove = function (index) {
        var work = $scope.data[index];
        alertify.confirm('Do you really want to remove this work?', function(result){
            if (!result){
                return;
            }

            if (work) {
                work.$remove();
                $scope.works.splice(index, 1);
                $scope.data.splice(index, 1);
            }
        });
    };

    // Find a list of Works
    $scope.find = function () {
      Works.query().$promise.then(function(data){
        $scope.data = data;
        $scope.works = _.map(data, function(d, index){
          return [
            index+1,
            '<a href="/works/'+d._id+'/edit">' + d.order_number + '</a>',
            (d.customer)?(Customers.makeFullName(d.customer)):'',
            '<a class="btn btn-primary btn-xs" href="/works/'+d._id+'/edit"><i class="fa fa-pencil"></i></a> ' +
            '<a class="btn btn-danger btn-xs btn-delete-work" data-index="'+index+'"><i class="fa fa-trash-o"></i></a>'
          ];
        });
      });
    };

    $(document).on('click', '.btn-delete-work', function(){
        $scope.remove($(this).data('index'));
    });
  }
]);
