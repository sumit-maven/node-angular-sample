angular.module('BadugaAdmin.pages.moderator')
.factory('moderatorService', ['$http', function($http)
{
  var moderatormgm = []; 
  moderatormgm.getAllMods = function(callback){
   var apiUrl='IP Address here.../moderator/getAllMods';
   var allmodsdata =[];
   $http({
    method: 'GET',
    url:apiUrl
  }).then(function successCallback(response) {
   allmodsdata=response.data;
   callback(allmodsdata);
 }, function errorCallback(response) {
  callback(allmodsdata);
});
// return allmodsdata;
}

moderatormgm.addModerator = function(obj,callback){
  var apiUrl='IP Address here.../moderator/addModerator';
  var addModerator =[];
  $http({
    method: 'POST',
    url:apiUrl,
    data:obj,
    headers: {
     'Content-Type': 'application/json'
   }
 }).then(function successCallback(response) {
   addModerator=response.data;
   callback(addModerator);
 }, function errorCallback(response) {
  callback(addModerator);
});
}

moderatormgm.getModById = function(id,callback){
  var apiUrl='IP Address here.../moderator/getModById';
  var moderatorData =[];
  $http({
    method: 'POST',
    url:apiUrl,
    data: {"modId":id},
    headers: {
     'Content-Type': 'application/json'
   }
 }).then(function successCallback(response) {
   moderatorData=response.data;
   callback(moderatorData);
 }, function errorCallback(response) {
  callback(moderatorData);
});
}

moderatormgm.searchUser = function(userName,callback){
 var apiUrl='IP Address here.../users/searchUser';
 var searchUserData =[];
 $http({
  method: 'POST',
  url:apiUrl,
  data: {userName:userName},
  headers: {
   'Content-Type': 'application/json'
 }
}).then(function successCallback(response) {
 searchUserData=response.data;
 callback(searchUserData);
}, function errorCallback(response) {
  callback(searchUserData);
});
  //return fetchgroupData;
}

// moderatormgm.searchUser = function(userName,callback){
//  var apiUrl='IP Address here.../users/searchUser';
//  var searchUserData =[];
//  $http({
//   method: 'POST',
//   url:apiUrl,
//   data: {userName:userName},
//   headers: {
//    'Content-Type': 'application/json'
//  }
// }).then(function successCallback(response) {
//  searchUserData=response.data;
//  callback(searchUserData);
// }, function errorCallback(response) {
//   callback(searchUserData);
// });
//   //return fetchgroupData;
// }

moderatormgm.updateUserbyId = function(userId,user,callback){
  alert(userId);
  userId =user.userId;
  userName=user.userName;
  email=user.email;
  mobileNo=user.mobileNo;
  userType=user.userType;
  address=user.address; 
  userStatus=user.userStatus;
  work=user.work; 
  topicInterest=user.topicInterest; 
  certification=user.certification; 
  education=user.education; 
  
  var formData = {
    userName:userName,
    email:email,
    mobileNo:mobileNo,
    userType:userType,
    address:address,
    userStatus:userStatus,
    userId:userId,
    work:work,
    topicInterest:topicInterest,
    certification:certification,
    education:education
  };
  var apiUrl='IP Address here.../users/updateUserById';
    //alert(apiUrl);
    var updateData =[];
    $http({
      method: 'POST',
      url:apiUrl,
      data: formData,
      headers: {
       'Content-Type': 'application/json'
     }

   }).then(function successCallback(response) {
     updateData=response.data;
    // alert("Shubha"+ JSON.stringify(updateData));
    callback(updateData);
  }, function errorCallback(response) {
    callback(updateData);
  });
 }



 moderatormgm.deleteUser= function(id,callback){

  var apiUrl='IP Address here.../users/'+id+'/deleteSingluser';
  var delData =[];
  $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   delData=response.data;
   callback(delData);
 }, function errorCallback(response) {
  callback(delData);
});
  return delData;
}




return moderatormgm;
}]);