$(function() {
  var _cache = {
    postButton: $(".js-user__post-button"),
    postText: $(".js-user__post"),
    postAddUrl: "/posts/add"
  };
  $("form").each(function() {
    $(this).validate();
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
