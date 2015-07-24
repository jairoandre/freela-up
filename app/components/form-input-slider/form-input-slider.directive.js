'use strict';

angular.module('FormInputSliderComponentModule', [])
  .directive('formInputSlider', function () {
    return {
      restrict: 'CA',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        if (!ctrl) {
          $log.warn('Slider directive requires ngModel to be on the element');
          return;
        }

        /**
         * Add the input-slider class
         */
        angular.element(element).addClass('input-slider');

        /**
         * Create the single slider
         */
        noUiSlider.create(element[0], {
          start: 0,
          step: 1,
          connect: 'lower',
          range: {
            min: [0],
            max: [100]
          }
        });

        /*
        // Specify how UI should be updated
        ctrl.$render = function() {
          element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          scope.$evalAsync(read);
        });
        read(); // initialize

        // Write data to the model
        function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if ( attrs.stripBr && html == '<br>' ) {
            html = '';
          }
          ngModel.$setViewValue(html);
        }
        */

        console.log(element);
      }
    };
  });
