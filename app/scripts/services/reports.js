'use strict';

angular.module('zupPainelApp')

.factory('Reports', function ($resource) {
  return $resource('{base_url}/reports/:id.json', { id:'@id' },
    {
      'getAllCategories': { url: '{base_url}/reports/categories.json', method: 'GET' },
      'getItemsByCategory': { url: '{base_url}/reports/:categoryId/items.json', method: 'GET', params: { categoryId:'@categoryId' } },
    });
});
