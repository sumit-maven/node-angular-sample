
(function () {
  'use strict';
  angular.module('BadugaAdmin.pages.smemgm')
  .controller('smemgmPageCtrl', smemgmPageCtrl, ['smemgmservice']);

  function smemgmPageCtrl($scope, smemgmservice, $filter, $window,$location) {
  //  alert("roles "+localStorage.adminRoles);
    if (localStorage.UserName==null || localStorage.UserName==undefined) {
      $window.location.href = '/#/dashboard/login';
    }
    else{
      $window.location.href = $location.absUrl();
    }
    $scope.adminRoles=localStorage.adminRoles;
    $scope.smartTablePageSize = 15;
    $scope.fetchAssesmentData = [];
    $scope.quesCatData = [];
    $scope.viewAssessData = [];
    $scope.addAssessQues = [];
    $scope.asData=[];
    $scope.assessData=[];
    $scope.dataDel=[];
    $scope.addQuestion=[];
    $scope.updateassessData=[];
    $scope.save=[];
    $scope.assToques=[];
    $scope.matchingQids=[];
    var viewQid=[];
    var addQid=[];
   // Function to show for Assessment List 
   $scope.GetAssessment = function(){
    smemgmservice.getAllAssessment(function(response,error){
      if(response != null){
        $scope.fetchAssesmentData = response;
      }else
      {
        console.log(error);    
      }
    });    
  }; 
  $scope.GetAssessment();

  // Function to fetch question catagory 
  $scope.getQuesCat = function(){ 
    smemgmservice.getAllcategory(function(response,error){
      if(response != null){
        $scope.quesCatData= response;
      }else
      {
        console.log(error);    
      }
    });    
  }; 
  $scope.getQuesCat();

    //Function to view assessment details//

    $scope.viewAsses = function(assessid){ 
      smemgmservice.viewAllAssessment(assessid,function(response,error){
        if(response != null){
          $scope.viewAssessData= response;
          for (var i = 0; i < response.length; i++) {
            var qid=response[i].questionId;
            viewQid.push(qid);
            console.log(qid);
          }
        }else
        {
          console.log(error);    
        }
      });    
    }; 

    $scope.getAllQuestions = function(assessId){ 
      $scope.assessId=assessId;$scope.newaddAssessQues=[];
      smemgmservice.getAllQuestions(function(response,error){
        if(response != null){
          $scope.addAssessQues= response;
          for (var i = 0; i < response.length; i++) {
            var qid=response[i].questionId;
            addQid.push(qid);
          }
          $window.location.href = '/#/dashboard/assesments/viewQuestions';
          $scope.matchingQids = $.grep(viewQid, function(element) {
            return $.inArray(element, addQid ) !== -1;
          });
          for(var i = 0; i < $scope.addAssessQues.length; i++) {
            var obj = $scope.addAssessQues[i];
            if($scope.matchingQids.indexOf(obj.questionId) !== -1) {
              $scope.addAssessQues.splice(i, 3);
            }
          }
          console.log($scope.matchingQids); 
          console.log($scope.addAssessQues);      
        }else
        {
          console.log(error);    
        }
      });    
    }; 

   //Function to Add Ques here (save).
   $scope.addAsesQues = function(assessId){
   // $scope.selectQuesData = [];
   angular.forEach($scope.addAssessQues, function(user){
    if (user.selected) viewQid.push(user.questionId);
  });
   var checkboxesdata=viewQid;
   smemgmservice.AddQuesToAssessment(assessId,checkboxesdata,function(response,error){
    if(response != null){
      $scope.addQuestion= response;
      alert("Selected questions have been added in this Assessment successfully!");
    }else
    {
      console.log(error);    
    }
  });
 }

    // delete single assessment
    $scope.deleteSingleAssess = function(qid){
      if (confirm("Are you sure to delete this Assessment?")) {
        smemgmservice.deleteAssess(qid,function(response,error){
          if(response != null){
            $scope.asData = response;
            $scope.GetAssessment();
          }else
          {
            console.log(error);    
          }
        });
      }
    };

//Function to edit assessment
$scope.assessmentDetail = function(qid){
  smemgmservice.getAssesById(qid,function(response,error){
    if(response != null){
      $scope.assessData = response;
    }else
    {
      console.log(error);    
    }
  });
};

// //Function to Add Assessment//
$scope.addAssess = function(question){ 
  console.log(question);
  smemgmservice.AddAssessment(question,function(response,error){
    if(response != null){
      $scope.addAs= response;
      $window.location.href = '/#/dashboard/assesments/assesmentslist';
    }else{
      console.log(error);    
    }$scope.GetAssessment();
  });    

}; 

$scope.deleteQue = function (questionId) {
  smemgmservice.deleteQue(questionId,function(response,error){
    if(response.success== true){
      $scope.dataDel = response;
      $scope.viewAsses();
      alert("Question has been deleted successfully!"); 
    }else
    {
      console.log(error);    
    }
  });
}
   //Function to update Assessment
   $scope.updateAsessment = function(qid,value){
    smemgmservice.updateAssess(qid,value,function(response,error){
      if(response != null){
        $scope.updateassessData = response;
        $window.location.href = '/#/dashboard/assesments/assesmentslist';
      }else
      {
        console.log(error);    
      }
      $scope.GetAssessment();
    });
  };

    // $scope.assToques = function(){ 
 //   window.location = "/#/dashboard/questions/questionsupdate";
 // };

//  $scope.click = function(){
//   window.location = "#/questions/questionslist";
// }
// $scope.redirect = function(){
//   window.location = "#/assesments/assesmentscreate";
// }

// $scope.asseessmentView = function(){
// }

$scope.deleteAss = function(index) {
  $scope.fetchAssesmentData.splice(index, 1);
};
$scope.uploadPicture = function () {
  var fileInput = document.getElementById('uploadFile');
  fileInput.click();
};

}
})();
