/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
 (function () {
  'use strict';

  angular.module('BadugaAdmin.pages.logout', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('dashboard.logout', {
      controller: 'LogoutCtrl',
      title: 'Logout',
      sidebarMeta: {
        icon: 'ion-log-out',
        order: 500,
      },
    });
  }

})();
