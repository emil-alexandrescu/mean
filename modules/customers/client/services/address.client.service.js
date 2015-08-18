'use strict';

//TODO this should be Users service
angular.module('customers.address').factory('Address', ['$resource',
  function ($resource) {
    var resource = $resource('api/customers/:customerId/addresses/:addressId', {
    	customerId: '@customerId',
      addressId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    resource.makeAddress = function(address){
      return address.street_line1 + ' ' +
        address.street_line2 + ' ' + 
        address.street_line3 + ' ' + 
        address.street_line4 + ' ' +
        address.city + ' ' +
        address.state + ' ' +
        address.country + ' ' +
        address.zipcode;
    };

    return resource;
  }
]);
