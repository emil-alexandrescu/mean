'use strict';

// Configuring the Customers module
angular.module('works.girths').run(['Menus',
  function (Menus) {
  	// Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'works', {
      title: 'List Girths',
      state: 'girths.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'works', {
      title: 'Add Girth',
      state: 'girths.create'
    });
  }
]);
