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
