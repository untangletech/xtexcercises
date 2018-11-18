window.Event = new Vue();


Vue.component('add-to-cart', {
 
    props: ['name', 'price','image'],
    template:`<button type="submit" class="btn add-to-cart-btn m-2 add-to-cart inline" @click = "callItem">Add to Cart</button>`,
    methods:{
        callItem() {
            let product = {names: this.name, prices:this.price, images: this.image, qtys: 1}
            this.$emit('add', product);
        }
    }
});
Vue.component('add-to-cart-small', {
    props: ['name', 'price','image'],
    template:`<button class="btn card-btn-pdp add-to-cart" :title ="name" @click = "callItemSmall">Add to Cart</button>`,
    methods:{
        callItemSmall() {
            let product = {names: this.name, prices:this.price, images: this.image, qtys: 1}
            this.$emit('add', product);
        }
    } 
});
Vue.component('mini-cart-item',{
    props: ['_name', '_price','_image', '_qty', '_obj'],
    template: `
    <div class="row mb-2"> 
    <div class="col-3">
       <img :src="_image" class="mini-cart-img inline">
    </div>
    <div class="col-4 ">
        <p class="bold white-color mini-cart-product mb-1">{{_name}}</p>
        <p class="white-color mb-1">$ {{_price}}.00</p>
        <div class="mt-2">
        <p class="bold white-color inline">QTY</p>
        <p class="inline white-color">{{_qty}}</p>
        </div>
    </div>
    <div class="col-3 text-right ml-0"><a class="inline white-color mini-cart-exit bold" @click = 'remove(_obj)' >X</a></div>
     </div>`,
     methods:{
        remove (value){
            Event.$emit('removeItems', value);
         }
     }
})
var app = new Vue({
    el: '#cart',
    data:{ 
        miniCartVisible: false,
        miniCartArray: [],
        miniCartSubtotal:0,
        totalAmount:0,
        scrollPosition:0
    },
    methods: {
        newItem(value) {
            let allow = true;
            let index = 0;
            array = this.miniCartArray
            for (;index<array.length; index++) {
                let itemName = array[index].names
                if (itemName == value.names){
                    allow = false;
                    array[index].qtys++
                    this.miniCartSubtotal += parseInt(array[index].prices)
                    this.totalAmount +=1;
                }
            } 
            if (allow == true) {
            this.miniCartArray.unshift(value)
            this.miniCartSubtotal += parseInt(value.prices)
            value.index = array.length;
            this.totalAmount += 1;
            if (array.length > 3){
                var $scrollView = $('.scroll-view');
                $scrollView.addClass('mini-cart-scroll');
            }
            } 
            this.miniCartVisible = true
           setTimeout(()=> {this.miniCartVisible = false}, 100000);
           
        }
    },
    created:function(){
        var _self = this;
        
        Event.$on('removeItems', function(value){
            if (value.qtys > 1) {
                _self.miniCartArray[value.index].qtys-= 1;
                _self.totalAmount -=1;
                _self.miniCartSubtotal -= parseInt(value.prices)
            }
            if(_self.miniCartArray.length == 1 ){
                _self.miniCartArray = []
                _self.totalAmount -=1;
                _self.miniCartSubtotal -= parseInt(value.prices)
            }
             else {
                _self.miniCartArray.splice(value.index,1); 
                _self.totalAmount-=1;
                _self.miniCartSubtotal -= parseInt(value.prices)
            }
           
        });
    }
    

})
var carts = new Vue({
    el:'#bigCart',
    data:{
       cartItems: []
    },
    created:function(){
        var _self = this;
        
        Event.$on('deleteItem', function(value){
            _self.cartItems.filter((x,i)=>{
                if (x===value){
                    if(x.qty>1){
                        x.qty-=1;
                    }
                    else{
                        _self.cartItems.splice(i,1);
                        function deleteCookie(c_name) {
                            document.cookie = c_name+'=' + ";expires=Thu, 01 Jan 1970 00:00:01 GMT ;domain=.yourdomain.com;path=/";
                            document.cookie = c_name+'=' + ";expires=Thu, 01 Jan 1970 00:00:01 GMT ;";
                        }
                        deleteCookie(_self.cartItems[i].name)
                    }
              
                }     
            })
        })
}
})
Vue.component('cart-item', {
    props: ['name', 'qty','image','price','sub','obj'],
    template:`
    <transition name="fade">
     <div class="row ml-0 mr-0 bb-grey pt-3 pb-3 mb-4">
    <div class="col-1">
        <p @click= 'erase(obj)' class ="delete-items" >X</p>
    </div>
    <div class="col-2 mini-cart-img">
        <img class="mini-cart-img" :src = "image">
    </div>
    <div class="col-3 regular-font helvetica bold">
        {{name}}
    </div>
    <div class="col-2">
        <p>
           {{price}}.00
        </p>
    </div>
    <div class="col-2">
        <div class = "qty-input"> 
            <input :placeholder = "qty" class = "qty-input-box">
        </div>
    </div>
    <div class="col-2">
        <p>{{sub}}.00</p>
    </div>
    </div>
    </transition>`,
    methods:{
        erase (value){
            let price = value.price.regular;
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
            let newSub = getCookie('subtotal');
           newSub -= price;
        document.cookie = 'subtotal='+newSub;
        $('.js-subtotal').html(newSub+'.00');
            Event.$emit('deleteItem', value);
         }
  
     }

});
