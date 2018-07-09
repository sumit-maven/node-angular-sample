/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BadugaAdmin.pages.home')
      .controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

  /** @ngInject */
  function DashboardPieChartCtrl($scope, $timeout, baConfig, baUtil) {
    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
    $scope.charts = [ {
      color: pieColor,
      description: ' Groups Management',
      //stats: '$ 89,745',
      icon: 'money',
      url: '/#/dashboard/groupmgm/grouplist',
      img: 'group',
    }, {
      color: 'pieColor',
      description: 'Users Management',
      img: 'users',
      //stats: '178,391',
      icon: 'face',
      url: '/#/dashboard/usermgm/userlist',
    },
    {
      color: pieColor,
      description: 'SMEs Management',
      //stats: '57,820',
      icon: 'person',
      img: 'Boss-3',
      url: '/#/dashboard/smemgm/smemgmlist',
    }, {
      color: pieColor,
      description: 'Assessments',
      //stats: '32,592',
      icon: 'refresh',
      img: 'Clipboard-Plan',
      url: '/#/dashboard/assesments/assesmentslist',
    }
    // }, {
    //   color: pieColor,
    //   description: 'Profiles Setting',
    //   //stats: '32,592',
    //   icon: 'refresh',
    //   img: 'people',
    //   url: '/#/dashboard/profile',
    // }
    
    ];



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
