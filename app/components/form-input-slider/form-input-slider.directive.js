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

        var el = element[0];

        /**
         * Add the input-slider class
         */
        angular.element(el).addClass('input-slider');

        /**
         * Create the single slider
         */
        noUiSlider.create(el, {
          start: 0,
          step: 1,
          connect: 'lower',
          range: {
            min: [0],
            max: [90]
          }
        });

        ctrl.$render = function() {

          if (ctrl.$viewValue > 90) {
            el.noUiSlider.set(90);
          } else if (ctrl.$viewValue < 0) {
            el.noUiSlider.set(0);
          } else {
            el.noUiSlider.set(ctrl.$viewValue || 0);
          }

          console.log('$render', ctrl);
        };

        var value = 0;
        el.noUiSlider.on('update', function(values, handle, unencoded) {
          value = parseInt(values[0], 10) || 0;
          scope.$evalAsync(update);
        });
        update();

        function update() {
          //ctrl.$setViewValue(value);
          console.log('update', value);
        }

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
