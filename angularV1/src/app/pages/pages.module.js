/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
 (function () {
  'use strict';

  angular.module('BadugaAdmin.pages', [
    'ui.router',

    'BadugaAdmin.pages.dashboard',
    'BadugaAdmin.pages.home',
    'BadugaAdmin.pages.logout',
    'BadugaAdmin.pages.reports',
    'BadugaAdmin.pages.usermgm',
    'BadugaAdmin.pages.groupmgm',
    'BadugaAdmin.pages.smemgm',
    'BadugaAdmin.pages.profile',
    'BadugaAdmin.pages.moderator'
    ])
  
  .config(routeConfig);

  /** @ngInject  676013067993-4th1cnl2r1f0t4ijr4133b16kfoaqlng.apps.googleusercontent.com */
  function routeConfig($urlRouterProvider,baSidebarServiceProvider,$locationProvider) { 
  // $urlRouterProvider.otherwise('/login');

 }

})();
