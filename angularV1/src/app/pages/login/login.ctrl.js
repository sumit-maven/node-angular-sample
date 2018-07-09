(function () {
	'use strict';
	angular.module('BadugaAdmin.login')
	.controller('loginCtrl', loginCtrl, ['loginService','ngCookies']);

	function loginCtrl($scope,$window,loginService,$location,$uibModal) {
		$scope.forgotPassData=[];

		$scope.signIn= function(user){	
			var uname=user.email;
			var uname = uname.toLowerCase();
			var password=user.password;
			loginService.authentication(user,function(response, error) {
				console.log(response);
				var response=[response];
				var adminUname=response[0].email;
				var adminId = response[0].adminId
				var adminpassword=response[0].password;
				//var socialId=response[0].socialId;
				var adminRoles=response[0].roles;
				if (response != null) {
					$scope.adminData = response;
					if (uname==adminUname && password==adminpassword) {
						localStorage.setItem("UserName", uname);
						localStorage.setItem("adminId", adminId);
						localStorage.setItem("adminRoles", adminRoles);
						localStorage.password =password;
						$window.location.href = '/#/dashboard/home';
					}else{
						$scope.msg="You have entered wrong username or password."
					}
				} else {
					console.log(error);
				}

			});
		}

		$scope.open = function(page, id) {
			$uibModal.open({
				templateUrl: page,
				scope: $scope,
			// resolve: {
			// 	users: function() {
			// 		return $scope.oneAssess;
			// 	}
			// }
		});
		};

		$scope.forgotPassword=function(email){
			//alert("email "+email);
			loginService.forgotPass(email,function(response, error) {
				console.log(response);
				if (response.success!=false) {
					$scope.forgotPassData = response;
					$scope.forgotMsg="New password has been sent to your registered email-id. Please check!";
				} else {
					console.log(error);
					$scope.forgotMsg="There is some problem in sending email. Please check you email format!";
				}
			});
		}

		if (localStorage.UserName==null || localStorage.UserName==undefined) {
			$window.location.href = '/#/login';
		}
		else{
			$window.location.href = $location.absUrl();
			
		}
	}

})();
