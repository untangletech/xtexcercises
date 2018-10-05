$(function () {
    $(".g-recaptcha").rules("add", {
        required: true,
        messages: {
            required: "Required input",
        }
    });
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
    var _cache = {
        date: $(".js-dob__wrapper .date"),
        month: $(".js-dob__wrapper .month"),
    };
    _cache.month.on('change', function () {
        if (["2"].indexOf(_cache.month.children("option:selected").val()) !== -1) {
            _cache.date.children("option.gt28").hide();
        } else if (["4", "9", "11"].indexOf(_cache.month.children("option:selected").val()) !== -1) {
            _cache.date.children("option.gt28").show();
            _cache.date.children("option.gt30").hide();
        } else {
            _cache.date.children("option.gt28").show();
        }
        if (_cache.date.children("option:selected").is(":hidden")) {
            _cache.date.children().eq(0).attr("selected", "selected");
        }
    });
});