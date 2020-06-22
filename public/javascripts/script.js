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

(function(window, $, formvalidation) {
  formvalidation.init = function() {
    $("form").each(function() {
      $(this).validate({
        ignore: ".ignore",
        rules: {
          password: {
            minlength: 5
          },
          confPassword: {
            minlength: 5,
            equalTo: "#signupPassword"
          }
        },
        messages: {
          password: {
            minlength: "Please enter more than 5 characters"
          },
          confPassword: {
            minlength: "Please enter more than 5 characters",
            equalTo: "Please enter the same password as above"
          }
        }
      });
      $(this)
        .find('[type="submit"]')
        .click(function() {
          var $captcha = $(this).siblings("#recaptcha");
          var $response = grecaptcha.getResponse();
          if ($captcha.length !== 0 && $response.length === 0) {
            $("#g-recaptcha-error").removeClass("hidden");
            return false;
          } else {
            $(this).submit();
            return true;
          }
        });
    });
  };
})(window, jQuery, untangletech.formvalidation);

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

(function(window, $, user) {
  var _cache = {
      postButton: $(".js-user__post-button"),
      postText: $(".js-user__post"),
      postAddUrl: "/posts/add"
    },
    _bindModalOpenonBlogClick = function() {
      $(".js-user__blog").on("click", function() {
        $("#fullBlogModal").modal("show");
        $("#fullBlogModalText").html(
          "<h1>" +
            $(this).data("heading") +
            "</h1><p>" +
            $(this).data("post") +
            "</p>"
        );
      });
    },
    _getPostDetails = function(el) {
      var postArray = el.html().match(/<[^> ]+[^>]*>[^<]*<\/[^> ]+[^>]*>/g);
      var postHeading = "";
      var post = "";
      if (postArray && postArray.length) {
        if (postArray.length >= 2) {
          postHeading = postArray[0].replace(/<\/?[^>]+(>|$)/g, "");
          post = postArray[1].replace(/<\/?[^>]+(>|$)/g, "");
        } else if (postArray.length) {
          post = postArray[1].replace(/<\/?[^>]+(>|$)/g, "");
        }
      }
      return { post: post, postHeading: postHeading };
    },
    _bindEvents = function() {
      _triggerScroll();
      $(".js-user__post-button").click(_postButtonClickHandler);
      $(".js-user__post").click(function() {
        $("#postModal").modal("show");
        var postDetails = _getPostDetails($(this));
        $(".js-modal-user__post-heading").val(postDetails.postHeading);
        $(".js-modal-user__post").val(postDetails.post);
      });
      $(".js-modal-user__post-button").click(function() {
        var post =
          "<h1>" +
          untangletech.main.escapeHtml(
            $(this)
              .siblings(".js-modal-user__post-heading")
              .val()
          ) +
          "</h1>";
        post +=
          "<div>" +
          untangletech.main.escapeHtml(
            $(this)
              .siblings(".js-modal-user__post")
              .val()
          ) +
          "</div>";
        $(".js-user__post").html(post);
        $("#postModal").modal("hide");
        $(".js-user__post-button").prop("disabled", !post);
      });
    },
    _triggerScroll = function() {
      if ($("footer").isInViewport()) {
        var postsDisplayed = [];
        var posts = $.jStorage.get("posts");
        $.each(posts, function(index, value) {
          if (index <= 5) {
            var truncPostHeading =
              value.postHeading.length > 20
                ? value.postHeading.substr(0, 19) + "..."
                : value.postHeading;
            var truncPost =
              value.post.length > 100
                ? value.post.substr(0, 99) + "..."
                : value.post;
            $(".js-user__blog-wrapper > .row").append(
              "<li class='col-lg-4 col-md-4 js-user__blog c-user__blog' data-heading='" +
                value.postHeading +
                "' data-post='" +
                value.post +
                "'><h2>" +
                truncPostHeading +
                "</h2><div>" +
                truncPost +
                "</div></li>"
            );
            postsDisplayed.push(value);
          }
        });
        posts = posts.filter(function(post) {
          return $.inArray(post, postsDisplayed) < 0;
        });
        $.jStorage.set("posts", posts);
        _bindModalOpenonBlogClick();
      }
    },
    _postButtonClickHandler = function() {
      var postDetails = _getPostDetails(_cache.postText);
      var options = {
        url: _cache.postAddUrl,
        type: "POST",
        data: {
          post: postDetails.post,
          postHeading: postDetails.postHeading
        },
        success: function(result) {
          if (result.success) {
            $("#postSuccessModalText").html(result.infoMsg);
            $("#postSuccessModal").modal("show");
            $(".js-user__post").empty();
          } else {
            window.location.href = "/forms";
          }
        }
      };
      _cache.postText.val("");
      $(".js-user__post-button").prop("disabled", true);
      $.ajax(options);
    },
    _getPostsOnLoad = function() {
      var options = {
        url: "/posts",
        type: "POST",
        success: function(results) {
          var postsDisplayed = [];
          $.each(results, function(index, value) {
            if ($("body").height() <= $(window).height()) {
              var truncPostHeading =
                value.postHeading.length > 20
                  ? value.postHeading.substr(0, 19) + "..."
                  : value.postHeading;
              var truncPost =
                value.post.length > 100
                  ? value.post.substr(0, 99) + "..."
                  : value.post;
              $(".js-user__blog-wrapper > .row").append(
                "<li class='col-lg-4 col-md-4 js-user__blog c-user__blog' data-heading='" +
                  value.postHeading +
                  "' data-post='" +
                  value.post +
                  "'><h2>" +
                  truncPostHeading +
                  "</h2><div>" +
                  truncPost +
                  "</div></li>"
              );
              postsDisplayed.push(value);
            }
          });
          var posts = results.filter(function(post) {
            return $.inArray(post, postsDisplayed) < 0;
          });
          $.jStorage.set("posts", posts);
          _bindModalOpenonBlogClick();
        }
      };
      $.ajax(options);
    };
  user.init = function() {
    _bindEvents();
    _getPostsOnLoad();
  };
})(window, jQuery, untangletech.user);

(function(window, $, wall) {
  var _bindEvents = function() {
      $(window).scroll(_triggerScroll);
    },
    _bindModalOpenonBlogClick = function() {
      $(".js-user-wall__blog").on("click", function() {
        $("#fullBlogModal").modal("show");
        $("#fullBlogModalText").html(
          "<h1>" +
            $(this).data("heading") +
            "</h1><p>" +
            $(this).data("post") +
            "</p>"
        );
      });
    },
    _triggerScroll = function() {
      if ($("footer").isInViewport()) {
        var postsDisplayed = [];
        var posts = $.jStorage.get("wallPosts");
        $.each(posts, function(index, value) {
          if (index <= 5) {
            var truncPostHeading =
              value.postHeading.length > 20
                ? value.postHeading.substr(0, 19) + "..."
                : value.postHeading;
            var truncPost =
              value.post.length > 100
                ? value.post.substr(0, 99) + "..."
                : value.post;
            $(".js-user-wall__blog-wrapper > .row").append(
              "<li class='col-lg-4 col-md-4 js-user-wall__blog c-user-wall__blog' data-heading='" +
                value.postHeading +
                "' data-post='" +
                value.post +
                "'><h2>" +
                truncPostHeading +
                "</h2><div>" +
                truncPost +
                "</div></li>"
            );
            postsDisplayed.push(value);
          }
        });
        posts = posts.filter(function(post) {
          return $.inArray(post, postsDisplayed) < 0;
        });
        $.jStorage.set("wallPosts", posts);
        _bindModalOpenonBlogClick();
      }
    },
    _getPostsOnLoad = function() {
      var userId = $(".js-user-wall__blog-wrapper").data("userid");
      $.jStorage.set("userId", userId);
      var wallOptions = {
        url: "/users/" + userId + "/posts",
        type: "POST",
        success: function(results) {
          var postsDisplayed = [];
          $.each(results, function(index, value) {
            if ($("body").height() <= $(window).height()) {
              var truncPostHeading =
                value.postHeading.length > 20
                  ? value.postHeading.substr(0, 19) + "..."
                  : value.postHeading;
              var truncPost =
                value.post.length > 100
                  ? value.post.substr(0, 99) + "..."
                  : value.post;
              $(".js-user-wall__blog-wrapper > .row").append(
                "<li class='col-lg-4 col-md-4 js-user-wall__blog c-user-wall__blog' data-heading='" +
                  value.postHeading +
                  "' data-post='" +
                  value.post +
                  "'><h2>" +
                  truncPostHeading +
                  "</h2><div>" +
                  truncPost +
                  "</div></li>"
              );
              postsDisplayed.push(value);
            }
          });
          var posts = results.filter(function(post) {
            return $.inArray(post, postsDisplayed) < 0;
          });
          $.jStorage.set("wallPosts", posts);
          _bindModalOpenonBlogClick();
        }
      };
      $.ajax(wallOptions);
    };
  wall.init = function() {
    console.log("Wall function");
    _getPostsOnLoad();
    _bindEvents();
  };
})(window, jQuery, untangletech.wall);
