$(function() {
  var _cache = {
    postButton: $(".js-user__post-button"),
    postText: $(".js-user__post"),
    postAddUrl: "/posts/add"
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
  _cache.postButton.click(function() {
    var options = {
      url: _cache.postAddUrl,
      type: "POST",
      data: {
        post: _cache.postText.val().replace(/<script(.*)>(.*)<\/script>/, "")
      },
      success: function() {
        var template = Handlebars.compile($("#user-story").html());
        $(".js-user__stories-wrapper").append(
          template({
            post: options.data.post.replace(new RegExp("\n", "g"), "<br>")
          })
        );
      }
    };
    _cache.postText.val("");
    _cache.postButton.prop("disabled", true);
    $.ajax(options);
  });
});
