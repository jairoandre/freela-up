'use strict';

describe('Directive: addAreaCircleForm', function () {

  // load the directive's module
  beforeEach(module('zupPainelApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<add-area-circle-form></add-area-circle-form>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the addAreaCircleForm directive');
  }));
});
