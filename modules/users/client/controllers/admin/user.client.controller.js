'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'Admin', '$stateParams',
  function ($scope, $state, Authentication, Admin, $stateParams) {
    $scope.authentication = Authentication;

    // Create new User
    $scope.create = function () {
      // Create new User object
      var user = new Admin({
        username: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        roles: this.roles,
        password: this.password
      });

      // Redirect after save
      user.$save(function (response) {
        // Clear form fields
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.email = '';
        $scope.password = '';
        $scope.username = '';
        $scope.roles = [];
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function () {
      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.users.view', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Users
    $scope.find = function () {
      Admin.query().$promise.then(function(data){
        $scope.users = _.map(data, function(d, index){
          return [
            index+1,
            '<a data-ui-sref="admin.users.view({userId: \''+d._id+'\'})">' + d.firstName + ' ' + d.lastName + '</a>',
            d.email,
            d.roles,
            '<a class="btn btn-primary btn-xs" data-ui-sref="admin.users.edit({userId: \''+d._id+'\'})"><i class="fa fa-pencil"></i></a>'
          ];
        });
      });
    };

    // Find existing User
    $scope.findOne = function () {
      $scope.user = Admin.get({
        userId: $stateParams.userId
      });
    };
  }
]);
