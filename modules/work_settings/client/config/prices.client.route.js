'use strict';

// Setting up route
angular.module('work_settings.prices').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    	.state('prices', {
        url: '/prices',
        templateUrl: 'modules/work_settings/views/prices/prices.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
