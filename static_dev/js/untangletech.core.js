var untangletech = untangletech || {};
(function(window, $, untangletech) {
  "use strict";
  if (!$) return false;

  untangletech.home = {};
  untangletech.formvalidation = {};
  untangletech.main = {};
  untangletech.user = {};
  untangletech.wall = {};

  $.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  };
  var initializeModule = function() {
    untangletech.main.init();
    untangletech.formvalidation.init();
    untangletech.home.init();
    if ($(".js-user-wall__blog-wrapper").length) {
      untangletech.wall.init();
    }
    if ($(".js-user__blog-wrapper").length) {
      untangletech.user.init();
    }
  };
  untangletech.init = function() {
    initializeModule();
  };
})(window, jQuery, untangletech);
