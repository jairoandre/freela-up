'use strict';

describe('Service: Inventories', function () {

  // load the service's module
  beforeEach(module('zupPainelApp'));

  // instantiate service
  var Inventories;
  beforeEach(inject(function (_Inventories_) {
    Inventories = _Inventories_;
  }));

  it('should do something', function () {
    expect(!!Inventories).toBe(true);
  });

});
