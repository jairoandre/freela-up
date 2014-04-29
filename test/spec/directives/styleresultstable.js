'use strict';

describe('Directive: styleResultsTable', function () {

  // load the directive's module
  beforeEach(module('zupPainelApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<style-results-table></style-results-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the styleResultsTable directive');
  }));
});
