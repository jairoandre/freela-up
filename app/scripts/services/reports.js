'use strict';

angular.module('zupPainelApp')

.factory('Reports', function ($resource) {
  return $resource('{base_url}/reports/:id.json', { id:'@id' },
    {
      'getAllCategories': { action: '{base_url}/reports/categories.json', method: 'GET' }
    });
});
