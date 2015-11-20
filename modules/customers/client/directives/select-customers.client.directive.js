'use strict';

angular.module('customers').directive('selectCustomers', ['Customers',
  function (Customers) {
    return {
      restrict: 'A',
      scope: {
        customer: '=',
        defaultValue: '='
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
            return Customers.makeFullName(customer);
          },
          templateSelection: function(customer) {
            if (customer.text) return customer.text;
            return Customers.makeFullName(customer);
          }
      });

      scope.$watch('defaultValue', function(nv, ov){
          if (nv !== ov && nv && _.isObject(nv)){
              var $option = $('<option selected></option>').val(nv._id).text(Customers.makeFullName(nv));
              $(element).append($option).trigger('change');
          }
      }, true);

      $(element).on('change', function(){
          var val = $(this).val();
          if (val !== scope.customer) {
              scope.$apply(function() {
                  scope.customer = val;
              }.bind(this));
          }
      });

      }
    };
  }
]);
