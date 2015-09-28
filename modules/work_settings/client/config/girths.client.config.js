'use strict';

// Configuring the Customers module
angular.module('work_settings.girths').run(['Menus',
  function (Menus) {
  	// Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'work_settings', {
      title: 'List Girths',
      state: 'girths.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'work_settings', {
      title: 'Add Girth',
      state: 'girths.create'
    });
  }
]);
