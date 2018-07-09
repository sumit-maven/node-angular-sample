/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
 (function () {
  'use strict';

  angular.module('BadugaAdmin.pages.home', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('dashboard.home', {
      url: '/home',
        templateUrl: 'app/pages/dashboard/dashboard.html',
          
          title: 'Home',
          controller: 'dashboardPageCtrl',
          sidebarMeta: {
            icon: 'ion-android-home',
            order: 0,
          },
        });
  }

})();
