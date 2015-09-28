'use strict';

// Setting up route
angular.module('work_settings.girths').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    	.state('girths', {
        abstract: true,
        url: '/girths',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('girths.list', {
        url: '',
        templateUrl: 'modules/work_settings/views/girths/list-girths.client.view.html'
      })
      .state('girths.create', {
        url: '/create',
        templateUrl: 'modules/work_settings/views/girths/create-girth.client.view.html'
      })
      .state('girths.edit', {
        url: '/:girthId/edit',
        templateUrl: 'modules/work_settings/views/girths/edit-girth.client.view.html'
      });
  }
]);
