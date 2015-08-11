'use strict';

// Data table directive
angular.module(ApplicationConfiguration.applicationModuleName).directive('datatable', [
  function () {
    return {
      restrict: 'AE',
      scope: {
        tableConfig: '=?',
        tableData: '='
      },
      link: function(scope, element, attrs){
        scope.tableConfig = scope.tableConfig || {};
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

      }
    };
  }
]);
