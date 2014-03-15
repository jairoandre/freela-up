'use strict';

describe('Controller: ReportsCategoriesCtrl', function () {

  // load the controller's module
  beforeEach(module('zupPainelApp'));

  var ReportsCategoriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportsCategoriesCtrl = $controller('ReportsCategoriesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
