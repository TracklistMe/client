'use strict';

angular.module('app', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngTouch',
  'ngStorage',
  'ngCart',
  'ui.router',
  'ui.bootstrap',
  'ui.utils',
  'ui.load',
  'ui.jq',
  'smart-table',
  'htmlSortable',
  'oc.lazyLoad',
  'pascalprecht.translate',
  'satellizer',
  'angular-stripe',
  'credit-cards',
  'n3-line-chart',
]).constant("CONFIG", {
  "url": "https://tracklist.me/api",
  //"url": "http://localhost:3000",
  "imagePath": "image"
})
