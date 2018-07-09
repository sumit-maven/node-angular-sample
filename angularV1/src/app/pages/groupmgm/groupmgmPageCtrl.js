 (function () {
 	'use strict';
 	angular.module('BadugaAdmin.pages.groupmgm')
 	.controller('groupmgmPageCtrl', groupmgmPageCtrl, ['groupmgmservice','fileUpload','Upload']);
 	function groupmgmPageCtrl($scope,groupmgmservice,Upload,$http,$window,$location) {
   // alert("roles "+localStorage.adminRoles);
   if (localStorage.UserName==null || localStorage.UserName==undefined) {
   	$window.location.href = '/#/dashboard/login';
   }
   else{
   	$window.location.href = $location.absUrl();
   }
   $scope.adminRoles=localStorage.adminRoles;
   //$scope.smartTablePageSize = 5;
   $scope.qData=[];
   $scope.updateusermgmData=[];
   $scope.addGrp=[];
   $scope.groupData=[];
   $scope.updateGData=[];
   $scope.getuserlist=[];
   $scope.fetchgroupData=[];
   $scope.fetchquestions=[];

   $scope.currentPage = 0;
   $scope.pageSize = 5;
   $scope.numberOfPages=function(){
   	return Math.ceil($scope.fetchgroupData.length/$scope.pageSize);                
   }

//For table sorting
$scope.sort = {
	column: '',
	descending: false
};    

$scope.changeSorting = function(column) {
	var sort = $scope.sort;
	if (sort.column == column) {
		sort.descending = !sort.descending;
	} else {
		sort.column = column;
		sort.descending = false;
	}
};

$scope.selectedCls = function(column) {
	return column == scope.sort.column && 'sort-' + scope.sort.descending;
};

$scope.GetAssessments = function(){
	groupmgmservice.getAllAssessment(function(response,error){
		if(response != null){
			console.log(response);
			$scope.fetchAssesmentData = response;
		}else
		{
			console.log(error);    
		}
	});    
}; 
$scope.GetAssessments();

$scope.getAllgroups= function(){
	groupmgmservice.getAllgroups(function(response,error){
		if(response != null){
			$scope.fetchgroupData = response;
		}else
		{
			console.log(error);    
		}
	});    
}; 
$scope.getAllgroups();

$scope.searchGroup = function(groupName){
	groupmgmservice.searchGroup(groupName,function(response,error){
		if(response != null){
			$scope.fetchgroupData = response;
		}else
		{
			console.log(error);    
		}
	});    
}; 

$scope.updateQuestions = function(obj){
	alert(JSON.stringify(obj));

}; 
   //Upload Question Image//
   $scope.uploadQuesImg = function(){
   	var file = $scope.quesImg;
   	console.log(file);
   	Upload.upload({
   		url: 'http://35.154.82.13:5000/usermgm/uploadQuesImg',
   		file: file,            
   	}).progress(function(e) {
   	}).then(function(data, status, headers, config) {
   		console.log(data);
   	}); 
   };

   $scope.userDetail = function(qid){
   	groupmgmservice.getUserById(qid,function(response,error){
   		if(response != null){
   			$scope.qData = response;
   		}else
   		{
   			console.log(error);    
   		}
   	});
   };

   $scope.getGroupByid = function(id){
   	groupmgmservice.getGroupById(id,function(response,error){
   		if(response != null){
   			$scope.qData = response;
   		}else
   		{
   			console.log(error);    
   		}
   	});
   };


   $scope.getQuesById = function(id){
   	groupmgmservice.getQuesById(id,function(response,error){
   		if(response != null){
   			alert(response);
   			$scope.quesData =[response];
   			for (var i = 0; i < $scope.quesData.length; i++) {
   				$scope.quesData[i];
   				console.log($scope.quesData[i].answers);
   			}
   		}else
   		{
   			console.log(error);    
   		}
   	});
   };


//groupDetails//
$scope.groupDetail = function(id){
	groupmgmservice.groupDetail(id,function(response,error){
		if(response != null){
			$scope.groupData = response;
		}else
		{
			console.log(error);    
		}
	});
};

//Group Create//
$scope.addGroup = function(user){ 
	console.log(user);
	groupmgmservice.addGroup(user,function(response,error){
		if(response != null){
			$scope.addGrp= response;
		}else{
			console.log(error);    
		}$scope.getuserlist();
	});    
}; 
$scope.groupDetail();

//Update Group//
$scope.updateGroup = function(groupId,user){ 
	console.log(user);
	groupmgmservice.updateGroupbyId(groupId,user,function(response,error){
		if(response != null){
			$scope.updateGData = response;
			$window.location.href = '/#/dashboard/groupmgm/grouplist';
		}else
		{
			console.log(error);    
		}
		$scope.getuserlist();
	});
};

$scope.reset = function() {
	$scope.addQuestion();
}

$scope.deleteUser = function (id) {
	groupmgmservice.deleteUser(id,function(response,error){
		if(response.success== true){
			$scope.dataDel = response;
			$scope.getuserlist();
		}else
		{
			console.log(error);    
		}
	});
};

$scope.updateusermgm = function(id,value){
	groupmgmservice.updateusermgm(id,value,function(response,error){
		if(response != null){
			$scope.updateusermgmData = response;
			$window.location.href = '/#/dashboard/usermgm/usermgmlist';
		}else
		{
			console.log(error);    
		}
	});    
}; 
//GetAll Questions
$scope.getAllquestion= function(){
  groupmgmservice.getAllquestion(function(response,error){
    if(response != null){
      $scope.fetchquestions = response;
    }else
    {
      console.log(error);    
    }
  });    
}; 
$scope.getAllquestion();


//Download
var style = {
	sheetid: 'Group Table',
	headers: true,
	caption: {
		title:'Group-list',
          style:'font-size: ; color:;' // Sorry, styles do not works
      },
      style:'background:',
      column: {
      	style:'font-size:'
      },
      columns: [

        // {columnid:'EmpId',title:'Employee Id'},
        {columnid:'groupName',title:'User Name'},
        {columnid:'technology',title:'Type/Tech'},
        {columnid:'tags',title:'Tags'},
        {columnid:'noOfMember',title:'No of Users'},
        {columnid:'noOfQues',title:'No of Question'},
        {columnid:'SMEs',title:'SME Type'},
        // {columnid:'Actions',title:'Actions'},

        ],
        row: {
        	style: function(sheet,row,rowidx){
        		return 'background:'+(rowidx%2?'':'');
        	}
        },
        rows: {
        	4:{cell:{style:'background:'}}
        },
        cells: {
        	6:{
        		6:{
        			style: 'width:100px;',
        			value: function(value){return value.substr(1,3);}
        		}
        	}
        }
    };
    $scope.exportData = function (tableData) {
    	console.log(tableData);        
    	alasql('SELECT * INTO XLS("Group-list.xls",?) FROM ?',[style,tableData]);       
    };



}
})();

angular.module('BadugaAdmin.pages.groupmgm').filter('firstPage', function() {
	return function(input, start) {
		start = +start;
		return input.slice(start);
	}
});
