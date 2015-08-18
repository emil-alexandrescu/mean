'use strict';

// Setting up route
angular.module('customers.address').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    	.state('customers.address', {
        abstract: true,
        url: '/:customerId/address',
        template: '<ui-view/>',
      })
      .state('customers.address.create', {
        url: '/create',
        templateUrl: 'modules/customers/views/address/create-address.client.view.html'
      })
      .state('customers.address.edit', {
        url: '/:addressId/edit',
        templateUrl: 'modules/customers/views/address/edit-address.client.view.html'
      });
  }
]);
