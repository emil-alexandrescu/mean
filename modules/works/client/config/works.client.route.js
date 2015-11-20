'use strict';

// Setting up route
angular.module('works').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    	.state('works', {
        abstract: true,
        url: '/works',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('works.list', {
        url: '',
        templateUrl: 'modules/works/views/works/list-works.client.view.html'
      })
      .state('works.create', {
        url: '/create',
        templateUrl: 'modules/works/views/works/create-work.client.view.html'
      })
      .state('works.edit', {
        url: '/:workId/edit',
        templateUrl: 'modules/works/views/works/create-work.client.view.html'
      });
  }
]);
