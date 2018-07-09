/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BadugaAdmin.pages.home')
      .directive('popularApp', popularApp);

  /** @ngInject */
  function popularApp() {
    return {
      restrict: 'E',
      controller :'DashboardPopularAppCtrl',
      templateUrl: 'app/pages/dashboard/popularApp/popularApp.html'
    };
  }
})();