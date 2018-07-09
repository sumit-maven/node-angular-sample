/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
 (function () {
  'use strict';

  angular.module('BadugaAdmin.pages.profile')
  .controller('ProfilePageCtrl', ProfilePageCtrl ,['profileService']);
  /** @ngInject */
  function ProfilePageCtrl($scope, profileService,fileReader, $filter, $uibModal,$window,$location) {
     if (localStorage.UserName==null || localStorage.UserName==undefined || localStorage.adminId==null) {
      $window.location.href = '/#/login';
     }else{
       $window.location.href = $location.absUrl();
     }
     
     var id = localStorage.adminId;
     
   $scope.adminProfileData = [];
   $scope.adminData = [];
   //getProfileDetails//
   $scope.GetAdminProfileDetail = function(){
    profileService.getAdmindetail(function(response,error){
      if(response != null){
        $scope.adminData =[response];   
        

      }else
      {
        console.log(error);    
      }
    });    
  }; 
  $scope.GetAdminProfileDetail();

  $scope.updateProfileDetail = function(adminId, admin){  
    profileService.updateProfile(adminId,admin, function(response,error){
   
      if(response != null){
        $scope.adminProfileData = response;      
        alert( 'Your profile has been updated successfully.');
        // alert("ProfilePageCtrl: "+ JSON.stringify(adminProfileData));
      }else
      {
        console.log(error);    
      }
    });    
  };



}

})();
