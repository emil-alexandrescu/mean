'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        abstract: true,
        url: '/users',
        template: '<ui-view/>'
      })
      .state('admin.users.list', {
        url: '',
        templateUrl: 'modules/users/views/admin/user-list.client.view.html',
        controller: 'UserController'
      })
      .state('admin.users.create', {
        url: '/create',
        templateUrl: 'modules/users/views/admin/user-create.client.view.html',
        controller: 'UserController'
      })
      .state('admin.users.view', {
        url: '/:userId',
        templateUrl: 'modules/users/views/admin/user.client.view.html',
        controller: 'UserController'
      })
      .state('admin.users.edit', {
        url: '/:userId/edit',
        templateUrl: 'modules/users/views/admin/user-edit.client.view.html',
        controller: 'UserController'
      });
  }
]);
