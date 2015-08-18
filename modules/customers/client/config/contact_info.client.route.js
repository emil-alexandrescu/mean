'use strict';

// Setting up route
angular.module('customers.contact_info').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    	.state('customers.contact_info', {
        abstract: true,
        url: '/:customerId/contact_info',
        template: '<ui-view/>',
      })
      .state('customers.contact_info.create', {
        url: '/create',
        templateUrl: 'modules/customers/views/contact_info/create-contact_info.client.view.html'
      })
      .state('customers.contact_info.edit', {
        url: '/:contact_infoId/edit',
        templateUrl: 'modules/customers/views/contact_info/edit-contact_info.client.view.html'
      });
  }
]);
