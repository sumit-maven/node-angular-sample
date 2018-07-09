/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
 (function () {
  'use strict';
//alert("ModelModel");
angular.module('Protopper.pages.assessments.modals', [])
.config(routeConfig);

/** @ngInject */
function routeConfig($stateProvider) {
  $stateProvider
  .state('assessments.modals', {
    url: '/modals',
    templateUrl: 'app/pages/assessments/modals/basicModal.html',
    controller: 'assessmentsCtrl',

    title: 'Modals',
    sidebarMeta: {
      order: 300,
    },
  });
}

})();
