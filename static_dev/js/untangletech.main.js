(function(window, $, main) {
  var _bindEvents = function() {
    $(".openbtn").on("click", function() {
      var type = $(this).data("sidebartype");
      var isMain = $(this).data("main");
      if (isMain) {
        $("#" + type + "Modal").modal("show");
        $(this)
          .siblings(".closebtn")
          .trigger("click");
      } else {
        $("#" + type + "Sidebar").css("width", "25%");
        $("#main > :not(.js-sidebar)").css("opacity", "0.5");
      }
    });
    $(".closebtn").on("click", function() {
      var type = $(this).data("sidebartype");
      $("#" + type + "Sidebar").css("width", "0");
      $("#main > :not(.js-sidebar)").css("opacity", "1");
    });
    $(".container").on("click", function() {
      $(".closebtn").trigger("click");
    });
    $("#postSuccessModal").on("show.bs.modal", function() {
      var modal = $(this);
      clearTimeout(modal.data("hideInterval"));
      modal.data(
        "hideInterval",
        setTimeout(function() {
          modal.modal("hide");
        }, 3000)
      );
    });
  };
  main.init = function() {
    console.log("Main function called");
    _bindEvents();
  };
  main.escapeHtml = function(text) {
    var map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return text
      .replace(/<script\b[^>]*>(.*?)<\/script>/g, "")
      .replace(/[&<>"']/g, function(m) {
        return map[m];
      });
  };
})(window, jQuery, untangletech.main);
