$(function() {
  var _cache = {
    postButton: $(".js-user__post-button"),
    postText: $(".js-user__post"),
    postAddUrl: "/posts/add"
  };
  var sleep = function(ms) {
    var start = new Date().getTime(),
      expire = start + ms;
    while (new Date().getTime() < expire) {}
    return;
  };
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
  _cache.postButton.prop("disabled", true);
  _cache.postText.keyup(function() {
    _cache.postButton.prop("disabled", this.value == "" ? true : false);
  });
  if ($("#user-story").length) {
    var userStoryTemplate = Handlebars.compile($("#user-story").html());
    _cache.postButton.click(function() {
      var options = {
        url: _cache.postAddUrl,
        type: "POST",
        data: {
          post: _cache.postText.val().replace(/<script(.*)>(.*)<\/script>/, "")
        },
        success: function(result) {
          if (result.success) {
            $(".js-user__stories-wrapper").prepend(
              userStoryTemplate({
                post: options.data.post.replace(new RegExp("\n", "g"), "<br>"),
                isActive: true
              })
            );
            $("#postSuccessModalText").html(result.infoMsg);
            $("#postSuccessModal").modal("show");
          } else {
            window.location.href = "/";
          }
        }
      };
      _cache.postText.val("");
      _cache.postButton.prop("disabled", true);
      $(".carousel-indicators li:first").trigger("click");
      $.ajax(options);
    });
    var options = {
      url: "/posts",
      type: "POST",
      success: function(result) {
        $.each(result, function(i) {
          var isActive = i === result.length - 1 ? "class='active'" : "";
          $(".c-user__stories-carousel .carousel-indicators").append(
            "<li data-target='#c-user__stories-carousel' data-slide-to='" +
              i +
              "'" +
              isActive +
              "></li>"
          );
          $(".js-user__stories-wrapper").prepend(
            userStoryTemplate({
              post: result[i].post.replace(new RegExp("\n", "g"), "<br>"),
              active: i === result.length - 1 ? "active" : ""
            })
          );
        });
      }
    };
    $.ajax(options);
  }
  $(".modal").on("show.bs.modal", function() {
    var modal = $(this);
    clearTimeout(modal.data("hideInterval"));
    modal.data(
      "hideInterval",
      setTimeout(function() {
        modal.modal("hide");
      }, 3000)
    );
  });
});
