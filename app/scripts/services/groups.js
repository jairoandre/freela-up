'use strict';

angular.module('zupPainelApp')

.factory('Groups', function ($resource) {
  return $resource('{base_url}/groups/:id.json', { id:'@id' },
    {
      'update': { method: 'PUT' },
      'getAll': { method: 'GET' },
      'getUsers': { url: '{base_url}/groups/:id/users.json', method: 'GET', params: { id:'@id' } },
    });
});
