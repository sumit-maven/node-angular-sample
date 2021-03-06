(function () {
	'use strict';
	angular.module('BadugaAdmin.pages.moderator')
	.controller('moderatorCtrl', moderatorCtrl, ['moderatorService','fileUpload','Upload']);
	function moderatorCtrl($scope,moderatorService,Upload,$http,$window,$location) {
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
		//$scope.smartTablePageSize = 5;
		$scope.moderatorData=[];
		$scope.allmodsdata=[];

		$scope.updateData=[];
		$scope.correctAns;

		$scope.addModerator = function(obj){
			console.log(obj);
			moderatorService.addModerator(obj,function(response,error){
				if(response != null){
					$scope.addModerator =response;
					console.log(response);
				}else
				{
					console.log(error);    
				}
			});
		};

		$scope.getAllMods = function(){
			moderatorService.getAllMods(function(response,error){
				if(response != null){
					$scope.allmodsdata = response;
					console.log($scope.allmodsdata );
				}else
				{
					console.log(error);    
				}
			});    
		}; 
		$scope.getAllMods();
		$scope.getModById = function(mid){
			moderatorService.getModById(mid,function(response,error){
				if(response != null){
					$scope.moderatorData = [response];
					console.log(response);

				}else
				{
					console.log(error);    
				}
			});
		};
		$scope.searchUser = function(userName){
			moderatorService.searchUser(userName,function(response,error){
				if(response != null){
					$scope.fetchuserData = response;
				}else
				{
					console.log(error);    
				}
			});    
		}; 
		$scope.updateQuestions = function(obj){
			alert(JSON.stringify(obj));

		}; 

// $scope.searchUser = function(userName){
//       moderatorService.searchUser(userName,function(response,error){
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
	moderatorService.deleteUser(id,function(response,error){
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
	moderatorService.updateUserbyId(userId,user,function(response,error){
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
