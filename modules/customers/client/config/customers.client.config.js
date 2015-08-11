'use strict';

// Configuring the Customers module
angular.module('customers').run(['Menus',
  function (Menus) {
  	Menus.addMenuItem('topbar', {
      title: 'Manage Customers',
      state: 'customers',
      icon: 'fa-users',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'List Customers',
      state: 'customers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'Create A Customer',
      state: 'customers.create'
    });
  }
]);
