/*jslint browser:true */
'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window',
    function($scope, $translate, $localStorage, $window) {
      // add 'ie' classes to html
      var isIE = navigator.userAgent.match(/MSIE/i);
      if (isIE) {
        angular.element($window.document.body).addClass('ie');
      }
      if (isSmartDevice($window)) {
        angular.element($window.document.body).addClass('smart');
      }
      // config
      $scope.app = {
        name: 'Tracklist.me',
        version: '0.0.4',
        // for chart colors
        color: {
          primary: '#7266ba',
          info: '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger: '#f05050',
          light: '#e8eff0',
          dark: '#3a3f51',
          black: '#1c2b36'
        },
        settings: {
          themeID: 7,
          headerFixed: true,
          asideFixed: false,
          asideFolded: true,
          asideDock: true,
          container: true
        }
      };

      $scope.app.colorArray = [];
      for (var o in $scope.app.color) {
        $scope.app.colorArray.push($scope.app.color[o]);
      }




      $scope.app.settings.themeID = 1;
      $scope.app.settings.asideFolded = true;
      $scope.app.settings.asideDock = false;
      $scope.app.settings.asideFixed = true;
      $scope.app.settings.container = true;
      $scope.app.settings.navbarCollapseColor = 'bg-white-only';
      $scope.app.settings.navbarHeaderColor = 'bg-black';
      $scope.app.settings.asideColor = 'bg-black';

      // save settings to local storage
      /*
      if (angular.isDefined($localStorage.settings)) {
          $scope.app.settings = $localStorage.settings;
      } else {
          $localStorage.settings = $scope.app.settings;
      }
      */
      $scope.$watch('app.settings', function() {
        if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = {
        isopen: false
      };
      $scope.langs = {
        en: 'English',
        de_DE: 'German',
        it_IT: 'Italian'
      };
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] ||
        $scope.langs.en;
      $scope.setLang = function(langKey) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice($window) {
        // Adapted from http://www.detectmobilebrowsers.com
        var ua = $window.navigator.userAgent ||
          $window.navigator.vendor ||
          $window.opera;
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile 
        // devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).
        test(ua);
      }

    }
  ]);
