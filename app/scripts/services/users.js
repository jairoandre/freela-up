'use strict';

angular.module('zupPainelApp')

.factory('Users', function ($resource) {
  return $resource('{base_url}/users/:id.json', { id:'@id' },
    {
      'update': { method: 'PUT' },
      'getAll': { method: 'GET' },
    });
});
