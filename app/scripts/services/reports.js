'use strict';

angular.module('zupPainelApp')

.factory('Reports', function ($resource) {
  return $resource('{base_url}/reports/:id.json', { id:'@id' },
    {
      'getAllCategories': { action: '{base_url}/reports/categories.json', method: 'GET' },
      'getItemsByCategory': { action: '{base_url}/:categoryId/items.json', method: 'GET', params: { categoryId:'@categoryId' } },
    });
});
