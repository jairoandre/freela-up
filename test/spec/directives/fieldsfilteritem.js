'use strict';

describe('Directive: fieldsFilterItem', function () {

  // load the directive's module
  beforeEach(module('zupPainelApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fields-filter-item></fields-filter-item>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fieldsFilterItem directive');
  }));
});
