'use strict';

describe('Directive: inventoryCreateValue', function () {

  // load the directive's module
  beforeEach(module('zupPainelApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<inventory-create-value></inventory-create-value>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the inventoryCreateValue directive');
  }));
});