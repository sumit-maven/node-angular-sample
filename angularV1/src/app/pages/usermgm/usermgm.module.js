
 (function () {
  'use strict';

  angular.module('BadugaAdmin.pages.usermgm', [])
  .config(routeConfig);

  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('dashboard.usermgm', {
      url: '/usermgm',
      template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
      abstract: true,
      controller: 'usermgmPageCtrl',
      title: 'Users',
      sidebarMeta: {
        icon: 'fa fa-users',
        order: 0,
      },

    }).state('dashboard.usermgm.userlist', {
      url: '/userlist',
      templateUrl: 'app/pages/usermgm/userlist/userlist.html',
      title: 'Users List',
      sidebarMeta: {
        order:1,
         icon: 'fa-question-circle-o',
      },

    }).state('dashboard.usermgm.userdetails', {
      url: '/userdetails',
      templateUrl: 'app/pages/usermgm/userdetails/userdetails.html',
   //   title: 'User Details',
      sidebarMeta: {
        order: 2,
      },

    });
    // .state('dashboard.usermgm.usermgmupdate', {
    //   url: '/usermgmupdate',
    //   templateUrl: 'app/pages/usermgm/usermgmcreate/usermgmQuestion.html',
    //   //title: 'Edit usermgm',
          
    //     });

     $urlRouterProvider.when('/usermgm','/usermgm/usermgmlist');
  }

})();
