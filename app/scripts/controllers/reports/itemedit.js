'use strict';

angular.module('zupPainelApp')

.controller('ReportsItemEditCtrl', function ($scope, Restangular, $routeParams, $q, $modal, FileUploader) {
  $scope.uploader = new FileUploader();

  var categoriesPromise = Restangular.all('reports').all('categories').getList();

  categoriesPromise.then(function(response) {
    $scope.categories = response.data;
  });

  $scope.selectCategory = function(categoryData) {
    $scope.categoryData = categoryData;
  };
});
