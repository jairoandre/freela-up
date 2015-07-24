'use strict';

angular.module('FormInputSliderRangeComponentModule', [])
  .directive('formInputSliderRange', function () {
    return {
      restrict: 'CA',
      link: function(scope, element, attrs) {

        /**
         * Add the input-slider class
         */
        angular.element( element ).addClass('input-slider-range');

        /**
         * Create the single slider
         */
        noUiSlider.create(element[0], {
          start: 0,
          step: 1,
          connect: 'lower',
          range: {
            min: [ 0 ],
            max: [ 90 ]
          }
        });
      }
    };
  });
