// Handlebars Helpers

var shuffle = function (array) {
    var i = array.length, j, swap;
    while (i) {
        j = Math.floor(Math.random() * i--);
        swap = array[i];
        array[i] = array[j];
        array[j] = swap;
    }
    return array;
};

var helpers = {
    shuffle: function (array, count, options) {
        count = ( typeof count === 'number' ) ? count : 4;

        var shuffled = shuffle(array.slice(0, count)),
            result = '';

        for (var i = 0; i < shuffled.length; i++) {
            result += options.fn(shuffled[i]);
        }

        return result;
    },
    everyNth: function (context, every, options) {
        var fn = options.fn, inverse = options.inverse;
        var ret = "";
        if (context && context.length > 0) {
            for (var i = 0, j = context.length; i < j; i++) {
                var modZero = i % every === 0;
                ret = ret + i;
            }
        } else {
            ret = inverse(this);
        }
        return ret;
    },
    getDataIndex: function(array, index){
        return array[index];
    },
    getDataAtIndex: function(categoryName, catalog, index, feature, condition, name){
        var i = 0;
        var array = [];
        for(;i<catalog.length;i++){
            var catName = catalog[i].category;
            var getFeature = eval("catalog[i]"+"."+feature);
            if (catName == categoryName && getFeature != condition && name == true){
                array.push(catalog[i].name);
            }
            if (catName == categoryName && getFeature != condition && name == false){
                array.push(getFeature);
            }
            
        }
        return array[index];
    },
    eachUpTo: function(ary, max, options){
        if(!ary || ary.length == 0)
        return options.inverse(this);
        var result = [ ];
        for(var i = 0; i < max && i < ary.length; ++i)
            result.push(options.fn(ary[i]));
        return result.join('');
    },
    getDataArray: function(categoryName, catalog){
        var i = 0;
        var array = [];
        for(;i<catalog.length;i++){
            var catName = catalog[i].category;
            if (catName == categoryName){
                array.push(catalog[i]);
            }
        }
        return array;
    },
    lowercaseFirst: function(string){
        var lowercaseFirstLetter = string.charAt(0).toLowerCase() + string.slice(1);
        return lowercaseFirstLetter;
    },
    ifEquals: function(element1, element2, feature){
        var compare = eval("element1"+"."+ feature);
        var array = [];
        if(compare==element2){
            array.push(element2);
        }
        if (array.length>0){
            return array;

        }
    }
};
module.exports.register = function (Handlebars, options) {
    'use strict';

    options = options || {};

    for (var helper in helpers) {
        Handlebars.registerHelper(helper, helpers[helper]);
    }
    return this;
};
