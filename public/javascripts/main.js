$(function () {
    var _cache = {
        date: $(".js-birthday__wrapper .date"),
        month: $(".js-birthday__wrapper .month"),
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