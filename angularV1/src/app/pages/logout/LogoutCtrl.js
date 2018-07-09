
(function () {
  'use strict';
  angular.module('BadugaAdmin.pages.logout')
  .controller('LogoutCtrl', LogoutCtrl,[]);

  /** @ngInject */
  function LogoutCtrl($scope,$window,$location) {

   $scope.logout = function(){
    localStorage.clear();
   // alert("localStorage.UserName= "+localStorage.UserName);
    if (localStorage.UserName==null || localStorage.UserName==undefined) {
      $window.location.href = '/#/login';
    }else{
      $window.location.href = '/#/dashboard/home';
    }
  }; 
  $scope.logout();

}
})();
