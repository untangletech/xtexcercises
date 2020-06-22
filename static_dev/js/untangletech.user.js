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
