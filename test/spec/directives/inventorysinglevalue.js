'use strict';

describe('Directive: inventorySingleValue', function () {

  // load the directive's module
  beforeEach(module('zupPainelApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<inventory-single-value></inventory-single-value>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the inventorySingleValue directive');
  }));
});
