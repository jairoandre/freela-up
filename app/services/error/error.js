'use strict';

angular
  .module('ErrorServiceModule', [
    'ErrorModalControllerModule'
  ])

  .factory('Error', function ($modal) {

    return {
      // Show a pretty modal with debug information about the error
      show: function (response) {

        $modal.open({
          templateUrl: 'modals/error/error.template.html',
          resolve: {
            response: function() {
              return response;
            }
          },
          controller: 'ErrorModalController'
        });

      }
    };

  });
