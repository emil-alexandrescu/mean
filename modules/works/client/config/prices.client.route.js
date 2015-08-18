'use strict';

// Setting up route
angular.module('works.prices').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    	.state('prices', {
        url: '/prices',
        templateUrl: 'modules/works/views/prices/prices.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
