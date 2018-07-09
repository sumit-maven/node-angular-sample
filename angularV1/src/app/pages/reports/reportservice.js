angular.module('BadugaAdmin.pages.reports')
.factory('reportservice', ['$http', function($http)
{
  var reports = []; 
//  alert("Serveice page");
reports.getAllusers = function(callback){
 var apiUrl='IP Address here.../users/geAllUsers';
//alert("Serveice  API: "+apiUrl);
var fetchuserData =[];
$http({
  method: 'GET',
  url:apiUrl
}).then(function successCallback(response) {
 fetchuserData=response.data;
 callback(fetchuserData);
}, function errorCallback(response) {
  callback(fetchuserData);
});
return fetchuserData;
}

reports.searchUser = function(userName,callback){
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

// reports.searchUser = function(userName,callback){
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

reports.updateUserbyId = function(userId,user,callback){
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



 reports.deleteUser= function(id,callback){

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

reports.getUserById = function(id,callback){
     //alert("service "+id);
     var apiUrl='IP Address here.../users/getUserById';
     
     // alert("api "+apiUrl);
     var qData =[];
     $http({
      method: 'POST',
      url:apiUrl,
      data: {"userId":id},
      headers: {
       'Content-Type': 'application/json'
     }

   }).then(function successCallback(response) {
     qData=response.data;
       //alert("fb json "+qData);
      // alert("User details "+JSON.stringify(qData));
      callback(qData);
    }, function errorCallback(response) {
      callback(qData);
    });
   return qData;
 }


return reports;
}]);