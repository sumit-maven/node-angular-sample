angular.module('BadugaAdmin.pages.smemgm')
.factory('smemgmservice', ['$http', function($http)
{

  var assessment = []; 
  
  assessment.getAllAssessment = function(callback){
   var apiUrl='IP Address here.../users/geAllUsers';
   var fetchAssesmentData =[];
   $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   fetchAssesmentData=response.data;
   callback(fetchAssesmentData);
 }, function errorCallback(response) {
  callback(fetchAssesmentData);
});
}
assessment.getAllcategory = function(callback){
  var apiUrl='http://35.154.82.13:5000/questions/getcategoryQues';
  var quesCatData =[];
  $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   quesCatData=response.data;

   callback(quesCatData);
 }, function errorCallback(response) {
  callback(quesCatData);
});
}

assessment.viewAllAssessment = function(id,callback){
  //alert("Service viewAssessData Id  "+ id);
  var apiUrl='http://35.154.82.13:5000/questions/'+id+'/fetchQuestOfAssess';
  alert(apiUrl);
  var viewAssessData =[];
  $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   viewAssessData=response.data;
   callback(viewAssessData);
 }, function errorCallback(response) {
  callback(viewAssessData);
});
  //return viewAssessData;
}

assessment.getAllQuestions = function(callback){
  var apiUrl='http://35.154.82.13:5000/questions/getQuestions';
  var addAssessQues =[];
  $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   addAssessQues=response.data;
   callback(addAssessQues);
 }, function errorCallback(response) {
  callback(addAssessQues);
});
}

assessment.deleteAssess = function(id,callback){
  var apiUrl='http://35.154.82.13:5000/questions/'+id+'/deleteassessments';
  var asData =[];
  $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
    asData=response.data;
    console.log("api response "+asData );
    callback(asData);
  }, function errorCallback(response) {
    callback(asData);
  });
}

assessment.getAssesById = function(id,callback){
 var apiUrl='http://35.154.82.13:5000/questions/'+id+'/getAssessmentsById';
 var assessData =[];
 $http({
  method: 'POST',
  url:apiUrl
}).then(function successCallback(response) {
 assessData=response.data;
 callback(assessData);
}, function errorCallback(response) {
  callback(assessData);
});
}

assessment.AddAssessment = function(question,callback){
  console.log(question);
  assessment=question.Assessment;
  questionMarks=question.marks;
  passingMarks=question.passing;
  negativeMarking=question.negative; 
  category = question.category,
  subCategory = question.subCategory,
  totalTime=question.time;
  privateType=question.privateType;
  image=question.image;
  allow=question.allow;
  var formData = {assessmentName:assessment,totalMarks:questionMarks,passingMarks:passingMarks,
    negativeMarks:negativeMarking,timePeriod:totalTime,reattempt:allow,category:category,
    assessmentImage:image,subCategory:subCategory,privateType:privateType};
    var apiUrl='http://35.154.82.13:5000/questions/insertassesment';
    var addAs =[];
    $http({
      method: 'POST',
      url:apiUrl,
      data: formData,
      headers: {
       'Content-Type': 'application/json'
     }
   }).then(function successCallback(response) {
     addAs=response.data;
     callback(addAs);
   }, function errorCallback(response) {
    callback(addAs);
  });
 }

 assessment.AddQuesToAssessment = function(id,checkboxesdata,callback){
  alert(checkboxesdata);
  var formData = {questionId:checkboxesdata};
  var apiUrl='http://35.154.82.13:5000/questions/'+id+'/addQuesToAss';
  var addQuestion =[];
  $http({
    method: 'POST',
    url:apiUrl,
    data: formData,
    headers: {
     'Content-Type': 'application/json'
   }
 }).then(function successCallback(response) {
   addQuestion=response.data;
   callback(addQuestion);
 }, function errorCallback(response) {
  callback(addQuestion);
});
 return addQuestion;
}

assessment.updateAssess = function(qid,value,callback){
  assessName=value.assessmentName;
  Marks=value.totalMarks;
  passingMarks=value.passingMarks;
  negativeMarking=value.negativeMarks; 
  totalPeriod=value.timePeriod;
  allow=value.reattempt;
  var formData = {assessmentName:assessName,totalMarks:Marks,passingMarks:passingMarks,negativeMarks:negativeMarking,timePeriod:totalPeriod,reattempt:allow};
  var apiUrl='http://35.154.82.13:5000/questions/'+qid+'/updateassessments';
  var addAs =[];
  $http({
    method: 'POST',
    url:apiUrl,
    data: formData,
    headers: {
     'Content-Type': 'application/json'
   }

 }).then(function successCallback(response) {
   addAs=response.data;
   callback(addAs);
 }, function errorCallback(response) {
  callback(addAs);
});
}

assessment.deleteQue = function(id,callback){
  var apiUrl='http://35.154.82.13:5000/questions/'+id+'/deletequestion';
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
}

return assessment;
}]);