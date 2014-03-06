'use strict';

describe('Directive: mapItemsSimple', function () {

  // load the directive's module
  beforeEach(module('zupPainelApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<map-items-simple></map-items-simple>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mapItemsSimple directive');
  }));
});
