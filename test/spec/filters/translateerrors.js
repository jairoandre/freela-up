'use strict';

describe('Filter: translateErrors', function () {

  // load the filter's module
  beforeEach(module('zupPainelApp'));

  // initialize a new instance of the filter before each test
  var translateErrors;
  beforeEach(inject(function ($filter) {
    translateErrors = $filter('translateErrors');
  }));

  it('should return the input prefixed with "translateErrors filter:"', function () {
    var text = 'angularjs';
    expect(translateErrors(text)).toBe('translateErrors filter: ' + text);
  });

});
