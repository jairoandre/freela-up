'use strict';

angular
  .module('FullResponseRestangularServiceModule', [])

.factory('FullResponseRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setFullResponse(true);
  });
});
