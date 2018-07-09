
(function () {
  'use strict';
  angular.module('BadugaAdmin.login', [])
  .config(routeConfig);
  //alert("router "+routeConfig);
  function routeConfig($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      controller: 'loginCtrl',
      title: 'login',
      templateUrl: 'app/pages/login/login.html'
    });
  }

})();
