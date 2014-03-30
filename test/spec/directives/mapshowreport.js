'use strict';

describe('Directive: mapShowReport', function () {

  // load the directive's module
  beforeEach(module('zupPainelApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<map-show-report></map-show-report>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mapShowReport directive');
  }));
});
