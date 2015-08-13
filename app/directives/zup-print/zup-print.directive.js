/**
 * Created by Jairo on 19/07/2015.
 */
angular.module('ZupPrintDirectiveModule', [])
  .directive('zupPrint', function () {
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {

        el.bind('click', function(evt) {
          evt.preventDefault();
          print();
        });

        function removeIframe(printFrame) {
          printFrame.parentNode.removeChild(printFrame);
        }

        function print() {
          var document = window.document;
          var printFrame = document.getElementById('zupPrintFrame');
          if (printFrame) {
            removeIframe(printFrame);
          }
          printFrame = document.createElement('iframe');
          document.body.appendChild(printFrame);
          printFrame.id = 'zupPrintFrame';
          printFrame.contentWindow.document.open();
          printFrame.contentWindow.document.write('<html><head>'
            + '<style>@page {size: A4; margin: 0;}</style>'
            + '</head><body></body></html>');

          document.body.appendChild(printFrame);

          var divToPrint = document.getElementById(attrs.zupPrint);
          var cloneDiv = divToPrint.cloneNode(true);
          printFrame.contentWindow.document.body.appendChild(cloneDiv);
          printFrame.contentWindow.document.close();
          printFrame.contentWindow.print();

          setTimeout(removeIframe(printFrame), 2000);

        }

      }
    }

  }
);
