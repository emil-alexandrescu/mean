'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users.list'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create A User',
      state: 'admin.users.create'
    });
  }
]);
