'use strict';

// Setting up route
angular.module('drawings').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    	.state('drawings', {
        abstract: true,
        url: '/drawings',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('drawings.list', {
        url: '',
        templateUrl: 'modules/drawings/views/drawings/list-drawings.client.view.html'
      })
      .state('drawings.create', {
        url: '/create',
        templateUrl: 'modules/drawings/views/drawings/create-drawing.client.view.html'
      })
      .state('drawings.edit', {
        url: '/:drawingId/edit',
        templateUrl: 'modules/drawings/views/drawings/edit-drawing.client.view.html'
      });
  }
]);
