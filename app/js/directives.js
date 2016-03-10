(function(angular) {

  'use strict';

  /* Directives */

  angular
  	.module('reddimgurDirectives', [])
  	.directive('errSrc', function() {
      return {
        link: function(scope, element, card) {
          element.bind('error', function() {
            if (card.src != card.errSrc) {
              card.$set('src', card.errSrc);
            }
          });
        }
      };
    });
})(angular);