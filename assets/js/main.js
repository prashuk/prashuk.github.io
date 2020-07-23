(function ($) {
  var $window = $(window),
    $body = $("body");

  breakpoints({
    xlarge: ["1141px", "1680px"],
    large: ["981px", "1140px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["321px", "480px"],
    xxsmall: [null, "320px"],
  });

  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  $(".scrolly").scrolly();
})(jQuery);
