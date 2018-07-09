angular.module('BadugaAdmin.pages.home')
.factory('dashboardService', ['$http', function($http)
{
  var dashboard = [];

  dashboard.getdashDetail = function(id,callback){
    //currently user id=1 is hardcoded, will change it further.
   //
   var dashboardData =[];
   $http({
    method: 'POST',
    url:apiUrl
  }).then(function successCallback(response) {
   dashboardData=response.data;
 //  alert("success dash response "+dashboardData);
       callback(dashboardData);
     }, function errorCallback(response) {
      callback(dashboardData);
    });
  return dashboardData;
}




return dashboard ;
}]);