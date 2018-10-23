$(function () {
    $("form").each(function () {
        $(this).validate();
        $(this).find('[type="submit"]').click(function () {
            var $captcha = $(this).siblings('#recaptcha');
            var $response = grecaptcha.getResponse();

            if ($captcha.length !== 0 && $response.length === 0) {
                $('#g-recaptcha-error').removeClass('hidden');
                return false;
            }
            else {
                $(this).submit();
                return true;
            }
        });
    });
});
