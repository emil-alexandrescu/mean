'use strict';

// Setting up route
angular.module('work_settings.materials').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    	.state('materials', {
        abstract: true,
        url: '/materials',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('materials.list', {
        url: '',
        templateUrl: 'modules/work_settings/views/materials/list-materials.client.view.html'
      })
      .state('materials.create', {
        url: '/create',
        templateUrl: 'modules/work_settings/views/materials/create-material.client.view.html'
      })
      .state('materials.edit', {
        url: '/:materialId/edit',
        templateUrl: 'modules/work_settings/views/materials/edit-material.client.view.html'
      });
  }
]);
