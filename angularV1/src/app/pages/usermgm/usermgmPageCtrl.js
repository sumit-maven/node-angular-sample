
(function () {
  'use strict';

  angular.module('BadugaAdmin.pages.usermgm')
  .controller('usermgmPageCtrl', usermgmPageCtrl, ['usermgmservice','fileUpload','Upload']);
  /** @ngInject */
  function usermgmPageCtrl($scope,usermgmservice,Upload,$http,$window,$location) {
    // alert("roles "+localStorage.adminRoles);
    if (localStorage.UserName==null || localStorage.UserName==undefined) {
      $window.location.href = '/#/dashboard/login';
    }
    else{
      $window.location.href = $location.absUrl();
    }
    $scope.adminRoles=localStorage.adminRoles;
    if ( $scope.adminRoles!="superAdmin") {
      $scope.superAdmin="NA";
    }

  //   $scope.checkButnVal = function() {
  //    if ($scope.adminRoles=="users" || $scope.adminRoles=="superAdmin") {
  //     $scope.buttonVal=true;
  //     return true;
  //   }else{
  //     $scope.buttonVal=false;
  //     return false;
  //   }
  // };

  $scope.smartTablePageSize = 5;
  $scope.qData=[];
  $scope.updateusermgmData=[];
  $scope.updateData=[];
  $scope.correctAns;
  $scope.getuserlist=[];
   $scope.currentPage = 0;
   $scope.pageSize = 5;
   $scope.numberOfPages=function(){
    return Math.ceil($scope.fetchuserData.length/$scope.pageSize);                
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



  $scope.getuserlist = function(){
    usermgmservice.getAllusers(function(response,error){
     if(response != null){
      $scope.fetchuserData = response;
 					// console.log($scope.fetchuserData);
 				}else
 				{
 					console.log(error);    
 				}
 			});    
  }; 
 		//$scope.getuserlist();


     $scope.userDetail = function(qid){
      usermgmservice.getUserById(qid,function(response,error){
        if(response != null){
         $scope.qData = response;

       }else
       {
         console.log(error);    
       }
     });
    };
    $scope.searchUser = function(userName){
      usermgmservice.searchUser(userName,function(response,error){
        if(response != null){
          $scope.fetchuserData = response;
        }else
        {
          console.log(error);    
        }
      });    
    }; 
    $scope.updateQuestions = function(obj){
      // alert(JSON.stringify(obj));

    }; 

// $scope.searchUser = function(userName){
//       usermgmservice.searchUser(userName,function(response,error){
//         if(response != null){
//           $scope.qData = response;
//         }else
//         {
//           console.log(error);    
//         }
//       });    
//     }; 



$scope.reset = function() {
	$scope.addQuestion();
}
$scope.deleteUser = function (id) {
	usermgmservice.deleteUser(id,function(response,error){
    //	alert("del res delData "+JSON.stringify(response));
    if(response.success== true){
    	$scope.dataDel = response;
    	$scope.getuserlist();
      alert("Are you sure to delete this User?"); 
    }else
    {
     console.log(error);    
   }
 });
};

//Update userByid

$scope.updateUser = function(userId,user){
 usermgmservice.updateUserbyId(userId,user,function(response,error){
  if(response != null){
    $scope.updateData = response;
       // alert("console"+ JSON.stringify(updateData));
       $window.location.href = '/#/dashboard/usermgm/userlist';
     }else
     {
      console.log(error);    
    }
    $scope.getuserlist();
  });
};




   //

//Download
var style = {
	sheetid: 'User Table',
	headers: true,
	caption: {
		title:'User-list',
          style:'font-size: ; color:;' // Sorry, styles do not works
        },
        style:'background:',
        column: {
         style:'font-size:'
       },
       columns: [

        // {columnid:'EmpId',title:'Employee Id'},
        {columnid:'userName',title:'User Name'},
        {columnid:'email',title:'Email Id'},
        {columnid:'mobileNo',title:'Mobile Number'},
        {columnid:'userType',title:'Type/Tech'},
        {columnid:'education',title:'Education'},
        {columnid:'address',title:'Address'},
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
       alasql('SELECT * INTO XLS("User-list.xls",?) FROM ?',[style,tableData]);       
     };


   }
 })();
