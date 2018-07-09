
(function () {
  'use strict';

  angular.module('BadugaAdmin.pages.groupmgm', [])
  .config(routeConfig);

  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('dashboard.groupmgm', {
      url: '/groupmgm',
      template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
      abstract: true,
      controller: 'groupmgmPageCtrl',
      title: 'Groups',
      sidebarMeta: {
        icon: 'ion-android-person-add',
        order: 1,
      },

    }).state('dashboard.groupmgm.grouplist', {
      url: '/grouplist',
      templateUrl: 'app/pages/groupmgm/grouplist/grouplist.html',
      title: 'Groups List',
      sidebarMeta: {
        order:1,
        icon: 'fa-question-circle-o',
      },

    }).state('dashboard.groupmgm.groupdetails', {
      url: '/groupdetails',
      templateUrl: 'app/pages/groupmgm/groupdetails/groupdetails.html',
   //   title: 'group Details',
   sidebarMeta: {
    order: 7,
  },

})
    .state('dashboard.groupmgm.groupcreate', {
      url: '/groupcreate',
      templateUrl: 'app/pages/groupmgm/groupcreate/groupcreate.html',
      //title: 'Edit groupmgm',
      sidebarMeta: {
        order: 3,
      },

    }).state('dashboard.groupmgm.quesview', {
      url: '/quesview',
      templateUrl: 'app/pages/groupmgm/quesview/quesview.html',
      //title: 'Edit groupmgm',
      sidebarMeta: {
        order: 4,
      },
    }).state('dashboard.groupmgm.assesmentslist', {
      url: '/assessmentslist',
      templateUrl: 'app/pages/groupmgm/assesmentslist/assesmentslist.html',
      title: 'Assessments List',
      sidebarMeta: {
        order: 5,
      },
    }).
    state('dashboard.groupmgm.quesupdate', {
      url: '/quesupdate',
      templateUrl: 'app/pages/groupmgm/quesupdate/quesupdate.html',
      //title: 'Edit groupmgm',
      sidebarMeta: {
        order: 6,
      },

    })
    .state('dashboard.groupmgm.tags', {
      url: '/tags',
      templateUrl: 'app/pages/groupmgm/tags/tagslist.html',
      title: 'Group Tags',
      sidebarMeta: {
        order: 2,
      },

    })
     .state('dashboard.groupmgm.tagdetails', {
      url: '/tagdetails',
      templateUrl: 'app/pages/groupmgm/tagdetails/tagdetails.html',
     // title: 'Group Tags',
      sidebarMeta: {
        order: 2,
      },

    })
     .state('dashboard.groupmgm.assesques', {
      url: '/assesques',
      templateUrl: 'app/pages/groupmgm/assesques/assesquesList.html',
     title: 'Question Bank',
      sidebarMeta: {
        order: 2,
      },

    })

      .state('dashboard.groupmgm.tagcreate', {
      url: '/tagcreate',
      templateUrl: 'app/pages/groupmgm/tagcreate/tagcreate.html',
     // title: 'Group Tags',
      sidebarMeta: {
        order: 2,
      },

    });

    $urlRouterProvider.when('/groupmgm','/groupmgm/groupmgmlist');
  }

})();


