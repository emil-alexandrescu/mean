'use strict';

// Configuring the Customers module
angular.module('works.prices').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'works', {
      title: 'Price Table',
      state: 'prices'
    });
  }
]);
