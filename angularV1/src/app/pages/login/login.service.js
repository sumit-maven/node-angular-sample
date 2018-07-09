

angular.module('BadugaAdmin.login')
.factory('loginService', ['$http', function($http)
{
	var adminDetails = [];
	adminDetails.authentication = function(admin,callback) {
		var uname=admin.email;
		var password=admin.password;
		var formData={
			email: uname,
			password: password,
		};
		var apiUrl = 'http://35.154.169.9:4130/admin/adminSignin';
		var adminData = [];
		$http({
			method: 'POST',
			url: apiUrl,
			data: formData,
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function successCallback(response) {
			adminData = response.data;
			callback(adminData);
		}, function errorCallback(response) {
			callback(adminData);
		});
		return adminData;

	}

	adminDetails.forgotPass = function(email,callback) {
		var apiUrl = 'http://35.154.169.9:4130/users/resetPassword';
		var newPass = [];
		$http({
			method: 'POST',
			url: apiUrl,
			data: {email:email},
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function successCallback(response) {
			newPass = response.data;
			callback(newPass);
		}, function errorCallback(response) {
			callback(newPass);
		});
		//return newPass;
		
	}


	return adminDetails;

}
]);