'use strict';

// Configuring the Customers module
angular.module('work_settings').run(['Menus',
  function (Menus) {

  	Menus.addMenuItem('topbar', {
      title: 'Work Settings',
      icon: 'fa-gavel',
      state: 'work_settings',
      type: 'dropdown'
    });
  }
]);
