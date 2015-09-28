'use strict';

angular.module('works').run(['Menus',
  function (Menus) {

  	Menus.addMenuItem('topbar', {
      title: 'Work',
      icon: 'fa-tasks',
      state: 'works',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'works', {
      title: 'List Works',
      state: 'works.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'works', {
      title: 'Create A Work',
      state: 'works.create'
    });
  }
]);
