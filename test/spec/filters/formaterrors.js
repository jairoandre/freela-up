'use strict';

describe('Filter: formatErrors', function () {

  // load the filter's module
  beforeEach(module('zupPainelApp'));

  // initialize a new instance of the filter before each test
  var formatErrors;
  beforeEach(inject(function ($filter) {
    formatErrors = $filter('formatErrors');
  }));

  it('should return the input prefixed with "formatErrors filter:"', function () {
    var text = 'angularjs';
    expect(formatErrors(text)).toBe('formatErrors filter: ' + text);
  });

});
