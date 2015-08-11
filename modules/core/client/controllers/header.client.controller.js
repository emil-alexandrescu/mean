'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$timeout',
  function ($scope, $state, Authentication, Menus, $timeout) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
      if (Authentication.user){
        //destry bg from login
        $.backstretch('destroy', false);
        $('.backstretch').remove();

        //setup sidebar accordion
        if (!$('#nav-accordion').hasClass('accordion-setup')){
          $('#nav-accordion').addClass('accordion-setup').dcAccordion({
            eventType: 'click',
            autoClose: true,
            saveState: true,
            disableLink: true,
            speed: 'slow',
            showCount: false,
            autoExpand: true,
            // cookie: 'dcjq-accordion-1',
            classExpand: 'dcjq-current-parent'
          });
        }
      }
    });
  }
]);
