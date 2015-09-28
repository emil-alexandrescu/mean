'use strict';

// Configuring the Customers module
angular.module('work_settings.materials').run(['Menus',
  function (Menus) {
  	// Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'work_settings', {
      title: 'List Materials',
      state: 'materials.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'work_settings', {
      title: 'Add Material',
      state: 'materials.create'
    });
  }
]);
