'use strict';

angular.module('drawings').run(['Menus',
  function (Menus) {

  	Menus.addMenuItem('topbar', {
      title: 'Draw',
      icon: 'fa-picture-o',
      state: 'drawings',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'drawings', {
      title: 'List Drawings',
      state: 'drawings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'drawings', {
      title: 'Create A Drawing',
      state: 'drawings.create'
    });
  }
]);
