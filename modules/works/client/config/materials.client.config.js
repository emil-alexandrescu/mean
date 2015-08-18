'use strict';

// Configuring the Customers module
angular.module('works.materials').run(['Menus',
  function (Menus) {
  	// Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'works', {
      title: 'List Materials',
      state: 'materials.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'works', {
      title: 'Add Material',
      state: 'materials.create'
    });
  }
]);
