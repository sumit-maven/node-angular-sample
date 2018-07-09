/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
 (function () {
  'use strict';

  angular.module('BadugaAdmin.pages.profile', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('dashboard.profile', {
      url: '/profile',

      templateUrl: 'app/pages/profile/profile.html',
      controller: 'ProfilePageCtrl',
      title: 'Profile Settings',
      sidebarMeta: {
        icon: 'fa fa-user',
        order: 300,
      },
    });
  }

})();
