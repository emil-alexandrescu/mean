'use strict';

angular.module('customers.contact_info').factory('ContactInfo', ['$resource',
  function ($resource) {
    var resource = $resource('api/customers/:customerId/contact_info/:contact_infoId', {
    	customerId: '@customerId',
      contact_infoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return resource;
  }
]);
