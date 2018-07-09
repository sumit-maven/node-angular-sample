angular.module('BadugaAdmin.pages.home')
.factory('popService', ['$http', function($http)
{
 
  var apicall = []; 
  
  apicall.getAllapi = function(callback){
  
   var apiUrl='http://35.154.82.13:5000/questions/countAllQuestions';
   var fetchApiData =[];
   $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   fetchApiData=response.data;
       //alert("fb json "+fetchApiData);
       callback(fetchApiData);
     }, function errorCallback(response) {
      callback(fetchApiData);
    });
  return fetchApiData;
}

apicall.getAllUser = function(callback){
  
   var apiUrl='http://35.154.82.13:5000/users/countAllUsers';
   var fetchusersData =[];
   $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   fetchusersData=response.data;
       //alert("fb json "+fetchusersData);
       callback(fetchusersData);
     }, function errorCallback(response) {
      callback(fetchusersData);
    });
  return fetchusersData;
}

apicall.getAllattemt = function(callback){
  
   var apiUrl='http://35.154.82.13:5000/users/countAllAttempts';
   var fetchAttemptData =[];
   $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   fetchAttemptData=response.data;
      
       callback(fetchAttemptData);
     }, function errorCallback(response) {
      callback(fetchAttemptData);
    });
  return fetchAttemptData;
}

apicall.getAllAssess = function(callback){
  
   var apiUrl='http://35.154.82.13:5000/questions/countAllAssesment';
   var fetchAssessData =[];
   $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   fetchAssessData=response.data;
       
       callback(fetchAssessData);
     }, function errorCallback(response) {
      callback(fetchAssessData);
    });
  return fetchAssessData;
}

return apicall;
}]);
