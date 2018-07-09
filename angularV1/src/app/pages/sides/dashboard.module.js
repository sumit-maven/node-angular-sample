/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BadugaAdmin.pages.dashboard', [])
      .config(routeConfig);
  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('dashboard', {
          url: '/dashboard',
           title: 'dashboard',
          templateUrl: 'app/pages/sides/sides.html',
          redirectTo: 'dashboard.home'


        });
  }

})();
