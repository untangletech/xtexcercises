
$(function(){
    $.validator.addMethod(
        "validAmount", 
        function(value, element) {
            var $selectorValue = $("js-valid-selector").val();
            if (value > 25 && $selectorValue === null) {
                return true;
            } else {
                return false;
            }
            
        }
    );
    $.validator.addMethod(
        "validDiscountCode",
        function(value,element) {
            if (value == "discount"){
                document.cookie = 'discount=200'
                return true
            }

            return false
        }
    )
    $.validator.addMethod(
        "validGiftCode",
        function(value,element) {
            if (value == "discount"){
                document.cookie = 'discount=300'
                return true
            }

            return false
        }
    )
    $(".contact-form").validate({
        rules: {
            email: {
                required: true,
                email:true
            },
            name: {
                required:true,
                lettersonly: true
            },
            phone: {
                required:true,
                phoneUS: true
            }

        },
        messages:{
            email: {
                required: "please enter an email address!",
                email: "Please enter a valid email address!"
            },
            name: {
                required: "please enter your name!",
                lettersonly: "please do not enter numbers or symbols"
            },
            phone: {
                required: "please enter your phone number!",
                phoneUS: "please enter a US phone number"

            }

        }
    })
    $(".gift-card-form").validate({
        rules: {
            name: {
                required:true,
                lettersonly: true
            },
            amount: {
                validAmount: true,
                digits:true,
                range:[1,1000]
            }
        },
        messages: {
            amount: {
                required: "please enter a valid amount!",
                digits: "Please enter digits only!",
                range:"Please enter an amount from 25 to 1000.",
                validAmount: "Please enter only one amount" 

            },
            name: {
                required: "please enter your name!",
                lettersonly: "please do not enter numbers or symbols"
            }

        }
    })
    $(".gift-code").validate({
        rules: {
            giftCode: {
                required:true,
                validGiftCode:true
            }

        },
        messages: {
            giftCode: {
                required: "please enter a code",
                validGiftCode: "please enter a valid code"
            }
        },  
        errorElement : 'div',
        errorLabelContainer: '.error-message'


    })
    $(".discount-code").validate({
        rules: {
            discountCode: {
                required: true,
                validDiscountCode: true
            }

        },
        messages: {
            discountCode: {
                required: "please enter a code",
                validDiscountCode: "please enter a valid code"
            }
        },
        errorElement: 'div',
        errorLabelContainer: '.error-message-2',
        success: function(label) {
            
        },
    })
})