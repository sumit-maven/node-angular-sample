angular.module('BadugaAdmin.pages.profile')
.factory('profileService', ['$http', function($http)
{

  
  var profileService = [];
  var id = localStorage.adminId;
 
  profileService.getAdmindetail = function(callback){
     var apiUrl='IP Address here.../admin/getAdminProfile';  
    
    var adminData =[];
    $http({
        method: 'POST',
        url:apiUrl,
        data: {"adminId":id},
        headers: {
       'Content-Type': 'application/json'
     }
    }).then(function successCallback(response) {
     
      adminData=response.data;
     
      callback(adminData);
    }, function errorCallback(response) {
      callback(adminData);
    });
    return adminData;

  }


//update
profileService.updateProfile = function(adminId,admin,callback){
  
  var apiUrl='IP Address here.../admin/updateAdmin';
  adminId=adminId;
  adName=admin.adName;
  email=admin.email;
  password=admin.password;
  
  var formData = {
    adName:adName,
    email:email,
    password:password,
    adminId:adminId
  };
  var adminProfileData =[];
   $http({
    method: 'POST',
    url:apiUrl,
    data: formData,
        headers: {
         'Content-Type': 'application/json'
       }
  }).then(function successCallback(response) {
   adminProfileData=response.data;
   
       callback(adminProfileData);
     }, function errorCallback(response) {
      callback(adminProfileData);
    });
  return adminProfileData;
}
return profileService ;

  }]);