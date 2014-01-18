'use strict';

describe('Directive: hackSidebarHeight', function () {

  // load the directive's module
  beforeEach(module('zupPainelApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<hack-sidebar-height></hack-sidebar-height>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the hackSidebarHeight directive');
  }));
});
