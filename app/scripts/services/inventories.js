'use strict';

angular.module('zupPainelApp')

.factory('Inventories', function ($resource) {
  return $resource('{base_url}/inventory/categories/:id.json', { id:'@id', 'display_type': 'full' },
    {
      'getItems': { url: '{base_url}/inventory/items/:id.json', method: 'GET', params: { id:'@id' } },
      'getItem': { url: '{base_url}/inventory/categories/:categoryId/items/:id.json', method: 'GET', params: { id: '@id', categoryId: '@categoryId' } },
      'deleteItem': { url: '{base_url}/inventory/categories/:categoryId/items/:id.json', method: 'DELETE', params: { id: '@id', categoryId: '@categoryId' } }
    });
});
