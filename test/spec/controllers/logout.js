'use strict';

describe('Controller: LogoutCtrl', function () {

  // load the controller's module
  beforeEach(module('tracklistmeApp'));

  var LogoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LogoutCtrl = $controller('LogoutCtrl', {
      $scope: scope
    });
  }));
 });
