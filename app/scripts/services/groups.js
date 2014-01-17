'use strict';

angular.module('zupPainelApp')

.factory('Groups', function ($resource) {
  return $resource('{base_url}/groups/:id.json', { id:'@id' },
    {
      'update': { method: 'PUT' },
      'getAll': { method: 'GET' }
    });
});
