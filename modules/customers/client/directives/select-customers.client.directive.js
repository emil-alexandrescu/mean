'use strict';

angular.module('customers').directive('selectCustomers', [
  function () {
    return {
      restrict: 'A',
      scope: {
        customer: '='
      },
      link: function (scope, element, attrs) {
        $(element).select2({
          ajax: {
            url: 'api/customers',
            dataType: 'json',
            delay: 250,
            data: function (params) {
              return {
                q: params.term // search term
              };
            },
            processResults: function (data, page) {
              return {
                results: _.map(data, function(d){
                  return _.extend(d, {id: d._id});
                })
              };
            },
            cache: true
          },
          minimumInputLength: 0,
          templateResult: function(customer) {
            if (customer.loading) return customer.text;
            return customer.first_name + ' ' + customer.last_name + ' (' + customer.company + ')';
          },
          templateSelection: function(customer) {
            return customer.first_name + ' ' + customer.last_name + ' (' + customer.company + ')';
          }
        }).on('change', function(){
          scope.$apply(function() {
            scope.customer = $(this).val();  
          }.bind(this));
        });
      }
    };
  }
]);
