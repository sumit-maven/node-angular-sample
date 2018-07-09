
(function () {
  'use strict';

  angular.module('BadugaAdmin.pages.moderator', [])
  .config(routeConfig);

  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('dashboard.moderator', {
      url: '/moderator',
      template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
      abstract: true,
      controller: 'moderatorCtrl',
      title: 'Moderators',
      sidebarMeta: {
        icon: 'fa fa-users',
        order: 0,
      },

    }).state('dashboard.moderator.moderatorList', {
      url: '/moderatorlist',
      templateUrl: 'app/pages/moderator/moderatorList/moderatorList.html',
      title: 'Moderators List',
      sidebarMeta: {
        order:1,
        icon: 'fa-question-circle-o',
      },

    }).state('dashboard.moderator.moderatorDetails', {
      url: '/moderatordetails',
      templateUrl: 'app/pages/moderator/moderatorDetails/moderatorDetails.html',
      sidebarMeta: {
        order: 2,
      },

    }).state('dashboard.moderator.createModerator', {
      url: '/addmoderator',
      templateUrl: 'app/pages/moderator/createModerator/createModerator.html',
      sidebarMeta: {
        order: 2,
      },

    });
    // .state('dashboard.usermgm.usermgmupdate', {
    //   url: '/usermgmupdate',
    //   templateUrl: 'app/pages/usermgm/usermgmcreate/usermgmQuestion.html',
    //   //title: 'Edit usermgm',

    //     });

    $urlRouterProvider.when('/moderator','/moderator/moderatorList');
  }

})();
