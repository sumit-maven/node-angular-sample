
 (function () {
  'use strict';

  angular.module('BadugaAdmin.pages.smemgm', [])
  .config(routeConfig);

  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('dashboard.smemgm', {
      url: '/smemgm',
      template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
      abstract: true,
      controller: 'smemgmPageCtrl',
      title: 'SMES',
      sidebarMeta: {
        icon: 'ion-android-contacts',
        order: 2,
      },

    }).state('dashboard.smemgm.smelist', {
      url: '/smemgmlist',
      templateUrl: 'app/pages/smemgm/smelist/smelist.html',
      title: 'SMES List',
      sidebarMeta: {
        order:1,
         icon: 'fa-question-circle-o',
      },

    // }).state('dashboard.smemgm.smemgmcreate', {
    //   url: '/smemgmcreate',
    //   templateUrl: 'app/pages/smemgm/smecreate/smecreate.html',
    // //  title: 'SME Detail',
    //   sidebarMeta: {
    //     order: 2,
    //   },

    })
    .state('dashboard.smemgm.smecreate', {
      url: '/smecreate',
      templateUrl: 'app/pages/smemgm/smecreate/smecreate.html',
      //title: 'Edit Questions',
          
        });

     $urlRouterProvider.when('/smemgm','/smemgm/smelist');
  }

})();
