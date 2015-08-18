'use strict';

// Data table directive
angular.module(ApplicationConfiguration.applicationModuleName).directive('datatable', ['$compile',
  function ($compile) {
    return {
      restrict: 'AE',
      scope: {
        tableConfig: '=?',
        tableData: '=',
        tableScope: '=?'
      },
      link: function(scope, element, attrs){
        scope.tableConfig = scope.tableConfig || {};
        scope.tableScope = scope.tableScope || scope;
        scope.tableConfig = _.extend(scope.tableConfig, {
          'searching' : true,
          'info': false,
          'lengthMenu': [[10,20,50,100], [10,20,50,100]]
        });
        var tableAPI = $(element).dataTable(scope.tableConfig).api();
        //watch table data and draw if any data applied
        scope.$watch('tableData.length', function(nv){
          if (nv){
            tableAPI.clear().draw();
            _.each(scope.tableData, function(d){
              tableAPI.row.add(d);
            });
            tableAPI.draw();
          }
        });

        $(element).on('draw.dt', function(){
          $(this).find('tr').each(function(index){
            var html = $(this).html();
            $(this).empty().append($compile(html)(scope.tableScope));
          });
        });
      }
    };
  }
]);
