/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BadugaAdmin.pages.home')
      .controller('DashboardPopularAppCtrl', DashboardPopularAppCtrl);

  /** @ngInject */
  function DashboardPopularAppCtrl($scope, $timeout, baConfig, baUtil,popService) {
    $scope.fetchApiData=[];
    $scope.fetchusersData=[];
    $scope.fetchAttemptData=[];
    $scope.fetchAssessData=[];
    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);

     //
$scope.apiCall = function(){
  
    popService.getAllapi(function(response,error){
      if(response != null){
         
        $scope.fetchApiData = response;

      }else
      {
        console.log(error);    
      }
    });    
  }; 
  $scope.apiCall();
      //

   $scope.allUser = function(){
  
    popService.getAllUser(function(response,error){
      if(response != null){
         
        $scope.fetchusersData = response;

      }else
      {
        console.log(error);    
      }
    });    
  }; 
  $scope.allUser();

  $scope.allAttept = function(){
  
    popService.getAllattemt(function(response,error){
      if(response != null){
         
        $scope.fetchAttemptData = response;
        
      }else
      {
        console.log(error);    
      }
    });    
  }; 
  $scope.allAttept();

  $scope.allAssess = function(){
  
    popService.getAllAssess(function(response,error){
      if(response != null){
         
        $scope.fetchAssessData = response;

      }else
      {
        console.log(error);    
      }
    });    
  }; 
  $scope.allAssess();

   

  

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function loadPieCharts() {
      $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: chart.attr('rel'),
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });

      $('.refresh-data').on('click', function () {
        updatePieCharts();
      });
    }

    function updatePieCharts() {
      $('.pie-charts .chart').each(function(index, chart) {
        $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
      });
    }

    $timeout(function () {
      loadPieCharts();
      updatePieCharts();
    }, 1000);
  }
})();