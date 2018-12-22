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
