  (function () {
    'use strict';
    angular.module('BadugaAdmin.pages.home')
    .controller('dashboardPageCtrl', dashboardPageCtrl,[]);
    function dashboardPageCtrl($scope,$window,$location) {
   //  alert("dash "+localStorage.UserName);
      if (localStorage.UserName==null || localStorage.UserName==undefined) {
         $window.location.href = '/#/login';
      }
      else{
      //  alert($location.absUrl());
        $window.location.href =  $location.absUrl();
      }
      
    }
    
  })();

