'use strict';

describe('Directive: droppableInputsArea', function () {

  // load the directive's module
  beforeEach(module('zupPainelApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<droppable-inputs-area></droppable-inputs-area>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the droppableInputsArea directive');
  }));
});
