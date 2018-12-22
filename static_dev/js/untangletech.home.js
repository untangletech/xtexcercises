(function(window, $, home) {
  var _showNLModalAndSetCookie = function() {
    $("#newsletterModal").modal("show");
    $("#newsletterModal").on("hidden.bs.modal", function() {
      var randomNumber = Math.random().toString();
      randomNumber = randomNumber.substring(2, 10);
      Cookies.set("showNL", randomNumber);
    });
  };
  home.init = function() {
    if (!Cookies.get("showNL")) {
      _showNLModalAndSetCookie();
    }
  };
})(window, jQuery, untangletech.home);
