//CARD CAROUSEL FOR PHONE SCREENS
let $desktopCards = $(".cards-desktop");
let $phoneCarousel = $(".carousel-phone");
Respond.to([
    {
        'media': '(min-width: 768px)',
        'if': function () {
            $desktopCards.show();
        },
        'else': function(){
            $desktopCards.hide();
            $phoneCarousel.show();
        }
    }
])
//ANIMATION "BACK TO TOP"
$(document).ready(function(){
    //variables
    let $detailBtn =  $(".js-btn-details");
    let $detailContent = $(".js-detail-content");
    let $moreInfoBtn = $(".js-btn-more-info");
    let $moreInfoContent = $(".js-more-info-content");
    let $reviewBtn = $(".js-btn-reviews");
    let $reviewContent = $(".js-review-content");
    let $printScreen = $(".js-print");
    let $mySideNav = $("#mySideNav");
    let $myBody = $(".main");
    let $myFooter = $("footer");
    let $navToggle = $(".navbar-toggler");
    let $notFlyout = $("body").not(".offcanvas-collapse");
    let $offCanvas = $(".offcanvas-collapse");
    let $accountContent = $(".js-account-content");
    let $menuContent = $(".js-menu-content");
    let $headMenuButton = $(".head-menu");
    let $headAccountButton = $(".head-account");
    let $productCard = $('.js-product-card');
    let $addToCart = $(".add-to-cart");
    let $slideFor = $('.slider-for');
    let $slideNav = $('.slider-nav');
    let $goUp = $(".js-go-up");
    let $goToRev = $(".js-go-to-review");
    let $submitBtn = $("submit-btn");
    var $bodyTop = $('header');
    var $fixedCart = $(".fixedCart");
    let $arrow = $('.down-arrow');
    let $giftMessage = $('.js-gift-toggle');
    let $displayDiscount = $('.js-discount');
    let $displaySubtotal = $('.js-subtotal');
    let $displayTotal = $('.js-total');
    let $deleteItems = $('.delete-items');
    let $dropdownMenu = $('.browse');

    //scroll animation
    $goUp.click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 2000);
     });
     $goToRev.click(function(){
        scrollTo("#review-form");
     });
     //offcanvas animation
     $(function () {
        'use strict'
      
        $('[data-toggle="offcanvas"]').on('click', function () {
          $offCanvas.toggleClass('open')
        })
        $offCanvas.on("mouseleave",function(){
            if ( $offCanvas.hasClass('open')){
                $offCanvas.toggleClass('open')
            }
        }) 
      })
    
      $dropdownMenu.on('click',function(){
            $('.dropdown-menus').toggle('slow');
            $(".navbar").css("margin-bottom", "0");

      })
      
     //nav active state
    $(function() {
        $('.nav-link[href*="' + location.pathname.split("/")[1] + '"]').addClass('active-state');
      });
    $submitBtn.submit(function(e){
        return false;
    });
    //slick slider
 $slideFor.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav',
       autoplay: false
  });
  $slideNav.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    centerMode:true,
    dots: false,
    arrows:true,
    prevArrow: $('.top-arrow'),
    nextArrow: $('.bottom-arrow'),
    vertical:true,
    focusOnSelect: true
  
  });
    //Print screen
    $printScreen.on("click",function(){
        window.print();
    })
    //sidNav for mobile devices
    $(window).scroll(function() {
        if (window.scrollY > ($bodyTop.offset().top + $bodyTop.height()+ 100)) {
            $fixedCart.show();
        }else{
            $fixedCart.hide();
        }
    });
    //gift card message toggle
    $arrow.on('click',function() {
        if ($giftMessage.is(':hidden')) {
            $giftMessage.slideDown()
        }else{
            $giftMessage.slideUp()
        }
    })
    //get cookie
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    var getCookiesKeys = function() {
        var pairs = document.cookie.split(";");
        var cookies = [];
        for (var i=0; i<pairs.length; i++) {
          var pair = pairs[i].split("=");
          cookies.push(pair[0])
        //   cookies[(pair[0]+'').trim()] = unescape(pair[1]);
        }
        return cookies;
      }
      var getCookiesObj = function() {
        var pairs = document.cookie.split(";");
        var cookies = [];
        for (var i=0; i<pairs.length; i++){
          var pair = pairs[i].split("=");
          cookies[(pair[0]+'').trim()] = unescape(pair[1]);
        }
        return cookies;
      }
    //Cache data 
    
    $addToCart.on('click', function(e) {
        let productName = e.currentTarget.title
        if (getCookie(productName) != ''){
            let i = parseInt(getCookie(productName));
            i++;
            document.cookie = productName+'='+i.toString();
        }else{
            document.cookie = productName+'=1'
        }
        
    })
    //cart
    let cookiesObj = getCookiesObj();
    let cookiesArray = getCookiesKeys();
    fetch('../data/site.json')
    .then(response => response.json())
    .then(jsonResponse => 
        {   
            let qtys = 0;
            let catalog = jsonResponse.catalog;
            let allCartProducts = getProductsWithName(catalog, cookiesArray);
            allCartProducts.map(obj =>{
                let imgDir = "../../assets/images/" + obj.img
                return obj.img = imgDir
            })
            allCartProducts.map(obj=>{
                let itemName = obj.name;
                qtys = cookiesObj[itemName];
                return obj.qty = qtys
            })
            allCartProducts.map(obj=>{
                return obj.sub = (obj.qty*obj.price.regular)
            })
            let subTotal = 0
            allCartProducts.forEach(obj=>{
                subTotal += parseInt(obj.sub)
            })
            carts.cartItems = allCartProducts
            document.cookie = 'subtotal='+subTotal;
        }
    )

    function getProductsWithName(obj,name){
        let objectArray = [];
        obj.forEach(product=>{
            name.forEach(indName => {  
                if(indName.slice(-2) == product.name.slice(-2)){
                    objectArray.push(product);
                }
            })
        })
        return objectArray;
    }
    $displayDiscount.html(parseInt(getCookie('discount'))+'.00')
    $displaySubtotal.html(parseInt(getCookie('subtotal'))+'.00')
   

    // console.log($subtotal.html());
    // $displaySubtotal.html($subtotal.html());
    // $subtotal.html();
    let total = parseInt(getCookie('subtotal'))-parseInt(getCookie('discount'))
    $displayTotal.html(total.toString()+'.00')

    //filter
    let attributeLink = document.getElementsByClassName("attribute-link");
    for (var i = 0; i < attributeLink.length; i++){
        attributeLink[i].addEventListener('click', function(e){
        let targetElementText = e.currentTarget.innerHTML
        fetch('../data/site.json')
        .then(response => response.json())
        .then(jsonResponse => 
            {
            let catalog = jsonResponse.catalog
            let productsWithAttribute = getProductWithAttributes(catalog, 'Subcategory01',targetElementText);
            let productClassArray = [];
            productsWithAttribute.forEach((name)=>{
                productClassArray.push(name.slice(-2));
            })
            console.log(productClassArray)
            $productCard.hide();
            productClassArray.forEach(classValue => {
                if($productCard.hasClass(classValue)){
                    console.log("going to show"+ classValue);
                    $('.'+ classValue).show();
                }
            })
    
        });

        function getProductWithAttributes(obj,subcatName, desired)
            {
            let parsedArray = []
            obj.forEach(product => {
                // console.log(product);
                product.subcategory.forEach(subcategoryName =>{
                    // console.log(subcategoryName)
                    if (subcategoryName[subcatName]){
                        subcategoryName[subcatName].forEach(attributeObj => {
                            for (var i = 1; i < 5; i++){
                                let attributeCategory = 'attribute Category 0'+i;
                                if (attributeObj[attributeCategory]){
                                    attributeObj[attributeCategory].forEach(attributes => {
                                        if (attributes === desired) {
                                            parsedArray.push(product.name);
                                        }
                                    })
                                }
                            }

                        });
                    }
                });
            });
            return parsedArray;
        }
    
        },false)
    }
})
  function scrollTo(to){
        $('html, body').animate({
            scrollTop:  ($(to).offset().top)
        }, 2000);
}


