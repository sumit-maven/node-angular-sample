
 (function () {
  'use strict';

  angular.module('BadugaAdmin.pages.reports', [])
  .config(routeConfig);

  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('dashboard.reports', {
      url: '/reports',
      template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
      abstract: true,
      controller: 'reportPageCtrl',
      title: 'Reports/Graphs',
      sidebarMeta: {
        icon: 'fa fa fa-bar-chart',
        order: 0,
      },

    }).state('dashboard.reports.reportlist', {
      url: '/reportlist',
      templateUrl: 'app/pages/reports/reportlist/reportlist.html',
      title: 'Report List',
      sidebarMeta: {
        order:1,
         icon: 'fa-question-circle-o',
      },

    }).state('dashboard.reports.reportdetails', {
      url: '/reportdetails',
      templateUrl: 'app/pages/reports/reportdetails/reportdetails.html',
   //   title: 'User Details',
      sidebarMeta: {
        order: 2,
      },

    })
    .state('dashboard.reports.pieChart', {
      url: '/pieChart',
      templateUrl: 'app/pages/reports/pieChart/pieChart.html',
      title: 'Graph List',
        sidebarMeta: {
        order: 3,
      },
          
        });

     $urlRouterProvider.when('/reports','/reports/reportslist');
  }

})();
