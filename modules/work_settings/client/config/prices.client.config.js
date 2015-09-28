'use strict';

// Configuring the Customers module
angular.module('work_settings.prices').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'work_settings', {
      title: 'Price Table',
      state: 'prices'
    });
  }
]);
