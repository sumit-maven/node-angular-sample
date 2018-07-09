angular.module('BadugaAdmin.pages.groupmgm')
.factory('groupmgmservice', ['$http', function($http)
{
  var groupmgm = []; 
  groupmgm.getAllgroups = function(callback){
   var apiUrl='IP Address here.../group/geAllGroup';
   var fetchgroupData =[];
   $http({
    method: 'GET',
    url:apiUrl
  }).then(function successCallback(response) {
   fetchgroupData=response.data;
   callback(fetchgroupData);
 }, function errorCallback(response) {
  callback(fetchgroupData);
});
  return fetchgroupData;
}

 groupmgm.getAllquestion = function(callback){
   var apiUrl='IP Address here.../questions/getQuestions';
   var fetchquestions =[];
   $http({
    method: 'GET',
    url:apiUrl
  }).then(function successCallback(response) {
   fetchquestions=response.data;
   callback(fetchquestions);
 }, function errorCallback(response) {
  callback(fetchquestions);
});
  return fetchquestions;
}

groupmgm.searchGroup = function(groupName,callback){
 var apiUrl='  /group/searchGroup';
 var searchGroupData =[];
 $http({
  method: 'POST',
  url:apiUrl,
  data: {groupName:groupName},
  headers: {
   'Content-Type': 'application/json'
 }
}).then(function successCallback(response) {
 searchGroupData=response.data;
 callback(searchGroupData);
}, function errorCallback(response) {
  callback(searchGroupData);
});
  //return fetchgroupData;
}

groupmgm.addGroup = function(user,callback){
  groupName=user.groupName;
  groupType=user.technology;
  var formData = {groupName:groupName,groupType:groupType };
  var apiUrl='  /group/CreateGroup';
  var addGrp =[];
  $http({
    method: 'POST',
    url:apiUrl,
    data: formData,
    headers: {
     'Content-Type': 'application/json'
   }
 }).then(function successCallback(response) {
   addGrp=response.data;
   callback(addGrp);
 }, function errorCallback(response) {
  callback(addGrp);
});
}

//update Group//
groupmgm.updateGroupbyId = function(groupId,user,callback){
  groupId =user.groupId;
  groupName=user.groupName;
  technology=user.technology;
  tags=user.tags;
  noOfMember=user.noOfMember;
  noOfQues=user.noOfQues; 
  groupStatus=user.groupStatus;
  SMEsType=user.SMEsType; 
  noOfSMEs=user.noOfSMEs; 
  noOfFavorite=user.noOfFavorite; 
  var formData = {
    groupName:groupName,
    tags:tags,
    technology:technology,
    noOfMember:noOfMember,
    noOfQues:noOfQues,
    groupStatus:groupStatus,
    SMEsType:SMEsType,
    noOfSMEs:noOfSMEs,
    noOfFavorite:noOfFavorite,
    groupId:groupId
  };
  var apiUrl='  /group/updateGroupById'; 
  var updateGData =[];
  $http({
    method: 'POST',
    url:apiUrl,
    data: formData,
    headers: {
     'Content-Type': 'application/json'
   }
 }).then(function successCallback(response) {
   updateGData=response.data;
   callback(updateGData);
 }, function errorCallback(response) {
  callback(updateGData);
});
}

groupmgm.deleteUser= function(id,callback){
  var apiUrl='  /users/'+id+'/deleteSingluser';
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

groupmgm.getGroupById = function(id,callback){
  var apiUrl='  /questions/getQuesByGroup';
  var qData =[];
  $http({
    method: 'POST',
    url:apiUrl,
    data: {"groupId":id},
    headers: {
     'Content-Type': 'application/json'
   }
 }).then(function successCallback(response) {
   qData=response.data;
   callback(qData);
 }, function errorCallback(response) {
  callback(qData);
});
 return qData;
}


groupmgm.getQuesById = function(id,callback){
  var apiUrl='  /questions/'+id+'/getQuestionsById';
  var qData =[];
  $http({
    method: 'POST',
    url:apiUrl,
  }).then(function successCallback(response) {
   qData=response.data;
   callback(qData);
 }, function errorCallback(response) {
  callback(qData);
});
}

groupmgm.groupDetail = function(id,callback){
  var apiUrl='  /group/'+id+'/getGroupDetail';
  var groupData =[];
  $http({
    method: 'GET',
    url:apiUrl
  }).then(function successCallback(response) {
   groupData=response.data;
   callback(groupData);
 }, function errorCallback(response) {
  callback(groupData);
});
  return groupData;
}


  
  groupmgm.getAllAssessment = function(callback){
   var apiUrl='  /assessment/getAllAssessment';
   var fetchAssesmentData =[];
   $http({
    method: 'GET',
    url:apiUrl
  }).then(function successCallback(response) {
   fetchAssesmentData=response.data;
   callback(fetchAssesmentData);
 }, function errorCallback(response) {
  callback(fetchAssesmentData);
});
}

//update question
// groupmgm.updateusermgm = function(id,value,callback){
//   //alert("Service valuesn  "+JSON.stringify(value));
//   userName=value.userName;
//   technology=value.technology;
//   tags=value.tags;
//   SMEs=value.answers.SMEs;
//   level=value.level; 
//   groupStatus=value.groupStatus; 


//  // var formData = {userName:userName,technology:technology,tags:tags,
//   // SMEs:SMEs,level:level,groupStatus:groupStatus};

//  var formData = {userName:userName,technology:technology,tags:tags,
//    SMEs:SMEs,level:level,groupStatus:groupStatus};
//       //alert("formData shubha "+ formData); 
//       var apiUrl='  /group/'+id+'/group/updateGroupById';

//       var updateQuestionsData =[];
//       var apiUrl;
//       //alert("API "+apiUrl); 
//       $http({
//         method: 'POST',
//         url:apiUrl
//       }).then(function successCallback(response) {
//        updateQuestionsData=response.data;
//        //alert("fb json "+JSON.stringify(updateQuestionsData));
//        callback(updateQuestionsData);
//      }, function errorCallback(response) {
//       callback(updateQuestionsData);
//     });
//       return updateQuestionsData;
//     }

return groupmgm;
}]);