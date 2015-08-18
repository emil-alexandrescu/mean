'use strict';

// Configuring the Customers module
angular.module('works').run(['Menus',
  function (Menus) {

  	Menus.addMenuItem('topbar', {
      title: 'Work Settings',
      icon: 'fa-gavel',
      state: 'works',
      type: 'dropdown'
    });
  }
]);
