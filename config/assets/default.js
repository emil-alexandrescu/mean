'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/assets/css/bootstrap.css',
        //dashio
        'public/assets/font-awesome/css/font-awesome.css',
        'public/assets/js/gritter/css/jquery.gritter.css',
        'public/assets/css/style.css',
        'public/assets/css/style-responsive.css',
        'public/lib/datatables/media/css/jquery.dataTables.css',
        'public/assets/js/advanced-datatable/media/css/DT_bootstrap.css',
        //libs
        'public/lib/alertify.js/themes/alertify.core.css',
        'public/lib/alertify.js/themes/alertify.bootstrap.css'
      ],
      js: [
        //dashio
        'public/assets/js/jquery-1.8.3.min.js',
        'public/assets/js/jquery.scrollTo.min.js',
        'public/assets/js/jquery.nicescroll.js',
        'public/assets/js/jquery.sparkline.js',
        'public/assets/js/jquery.dcjqaccordion.2.7.js',
        'public/assets/js/bootstrap.min.js',
        'public/assets/js/jquery.backstretch.min.js',
        'public/assets/js/common-scripts.js',
        //libs
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/lodash/lodash.js',
        'public/lib/alertify.js/lib/alertify.js',
        'public/lib/datatables/media/js/jquery.dataTables.js',
        'public/lib/fabric/dist/fabric.min.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
