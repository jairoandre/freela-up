'use strict';

angular.module('zupPainelApp')

.factory('Reports', function ($resource) {
  return $resource('{base_url}/reports/categories/:id.json', { id:'@id' },
    {
      'getItemsByCategory': { url: '{base_url}/reports/:categoryId/items.json', method: 'GET', params: { categoryId:'@categoryId' } },
    });
});
