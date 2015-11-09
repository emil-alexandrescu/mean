'use strict';

angular.module('customers').directive('selectAddress', ['Address',
  function (Address) {
    return {
      restrict: 'A',
      scope: {
        customer: '=',
        address: '='
      },
      link: function (scope, element, attrs) {
        $(element).select2({
          ajax: {
            url: function(params) {
              return 'api/customers/' + scope.customer + '/addresses';
            },
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
          escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
          templateResult: function(address) {
            if (address.loading) return address.text;
            return '<div>' + [address.street_line1, address.street_line2, address.street_line3, address.street_line4,
              [address.city, address.state, address.zipcode].join(' ')].join('</div><div>') + '</div>';
          },
          templateSelection: function(address) {
            return Address.makeAddress(address);
          }
        }).on('change', function(){
          scope.$apply(function() {
            scope.address = $(this).val();  
          }.bind(this));
        });
      }
    };
  }
]);
