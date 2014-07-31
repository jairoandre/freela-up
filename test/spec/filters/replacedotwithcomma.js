'use strict';

describe('Filter: replaceDotWithComma', function () {

  // load the filter's module
  beforeEach(module('zupPainelApp'));

  // initialize a new instance of the filter before each test
  var replaceDotWithComma;
  beforeEach(inject(function ($filter) {
    replaceDotWithComma = $filter('replaceDotWithComma');
  }));

  it('should return the input prefixed with "replaceDotWithComma filter:"', function () {
    var text = 'angularjs';
    expect(replaceDotWithComma(text)).toBe('replaceDotWithComma filter: ' + text);
  });

});
