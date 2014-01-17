'use strict';

describe('Service: Groups', function () {

  // load the service's module
  beforeEach(module('zupPainelApp'));

  // instantiate service
  var Groups;
  beforeEach(inject(function (_Groups_) {
    Groups = _Groups_;
  }));

  it('should do something', function () {
    expect(!!Groups).toBe(true);
  });

});
