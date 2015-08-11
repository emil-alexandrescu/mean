'use strict';

// Setting up route
angular.module('customers').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    	.state('customers', {
        abstract: true,
        url: '/customers',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('customers.list', {
        url: '',
        templateUrl: 'modules/customers/views/customers/list-customers.client.view.html'
      })
      .state('customers.create', {
        url: '/create',
        templateUrl: 'modules/customers/views/customers/create-customer.client.view.html'
      })
      .state('customers.view', {
        url: '/:customerId',
        templateUrl: 'modules/customers/views/customers/view-customer.client.view.html'
      })
      .state('customers.edit', {
        url: '/:customerId/edit',
        templateUrl: 'modules/customers/views/customers/edit-customer.client.view.html'
      });
  }
]);
