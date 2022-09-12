"use strict";
    // Query Selector 
    const addToOrderBtn=document.querySelectorAll('.btn-order');
    const clearBtn=document.querySelector('.btn-clear');
    const orderList=document.querySelector('.order-list');
    const orderdDrinksDOM=document.querySelectorAll('.orderd-drink');
    const drinkDesription=document.querySelectorAll('.drink-description');
    const btnAddQuantity=document.querySelector('.btn-add');
    const btnMinusQuantity=document.querySelector('.btn-minus');
    const btnPayOrder=document.querySelector('.btn-payorder')
    const quantityLabel=document.querySelector('.order-tag');
    const lblTotal=document.querySelector('.order-total');
    const cofeeName=document.querySelectorAll('.tag');
    const lblTotalBill=document.querySelector('.order-total');
    let orderdDrinks=JSON.parse(localStorage.getItem('drinks'))||[];
    let Totalprice=0;


    const reduceandRemoveDrink=function(drinkdetail,buttonstatus,productdetails){
        drinkdetail.classList.add('orderd-drink-removed');
        setTimeout(()=>drinkdetail.remove(),300);
        orderdDrinks=orderdDrinks.filter((carItems)=>carItems.name!==productdetails.name);
        buttonstatus.innerText='Add to Order'
        buttonstatus.disabled=false;
        localStorage.setItem('drinks',JSON.stringify(orderdDrinks));
    }

    const generateDrinkMarkup=function(lblQuantityDOM,lblOrderPrice,productdetails,price){
        lblQuantityDOM.innerText=productdetails.quantity;
        lblOrderPrice.innerText=`₱${+price*productdetails.quantity}`;
        localStorage.setItem('drinks',JSON.stringify(orderdDrinks));

    };

    const generateMarkupOfDrinks=function(productDetails){
        return orderList.insertAdjacentHTML('afterbegin',
        `<div class="orderd-drink seven-column-equal">
        <img src="${productDetails.image}"alt="Mochaccino" class="orderd-drink-img">
        <span class="order-tag coffe-name">${productDetails.name}</span>
        <span class="order-tag order-price">${productDetails.price}</span>
        <button class="btn-quantity btn-minus">-</button>
        <span class="order-tag order-quantity">${productDetails.quantity}</span>
        <button class="btn-quantity btn-add">+</button>
        <button class="btn-quantity btn-remove">x</button>
        </div>`);
    }



    const btnControls=(drinkitem,productdetails,buttonstatus)=>{
        drinkitem.forEach((drink)=>{
            if(drink.querySelector('.coffe-name').innerText===productdetails.name){
                const price=Number(productdetails.price.slice(1));
                const lblQuantityDOM=drink.querySelector('.order-quantity');
                const lblOrderPrice=drink.querySelector('.order-price');
            
                // console.log(Totalprice=Number(lblOrderPrice.innerText.slice(1)));
                // USED for adding drink quatity 
                drink.querySelector('.btn-add').addEventListener('click',()=>{
                // console.log(Totalprice+=price);
                productdetails.quantity+=1;
                countOrderTotal();
                generateDrinkMarkup(lblQuantityDOM,lblOrderPrice,productdetails,price); 
                // addQuantity.push(Number(lblOrderPrice.innerText.slice(1)))
                // console.log(addQuantity);
                })
                 // USED for Reducing drink quatity 
                drink.querySelector('.btn-minus').addEventListener('click',()=>{
                    productdetails.quantity-=1;
                    // console.log(Totalprice-=price);
                    countOrderTotal();
                    // guard Clause to avoid negative quantity
                    if(productdetails.quantity<=0)
                        reduceandRemoveDrink(drink,buttonstatus,productdetails);
                        generateDrinkMarkup(lblQuantityDOM,lblOrderPrice,productdetails,price);
                });
                  // USED for Removing drink  in the DOM
                  drink.querySelector('.btn-remove').addEventListener('click',()=>{
                    reduceandRemoveDrink(drink,buttonstatus,productdetails);
                    countOrderTotal();
                });
                 // USED for CLearing all the drink menu in the DOM 
                clearBtn.addEventListener('click',function(){
                    reduceandRemoveDrink(drink,buttonstatus,productdetails);
                    
                });   
                btnPayOrder.addEventListener('click',function(){
                    // paypalFunction();
                    checkOut();
                });


            }
        });
    }; 

    // quantityObj.quantity=Number(lblOrderPrice.innerText.slice(1));
    // console.log(addQuantity);

    // Showing the order on the DOM 
    const addViewOrder=()=>{
        //loops on each button and listen to each click event
        addToOrderBtn.forEach(orederButtonDom=>orederButtonDom.addEventListener('click',function(){
        const productDOM=orederButtonDom.parentNode;
        const product={
            image:productDOM.querySelector('.drink-image').getAttribute('src'),
            name:productDOM.querySelector('.tag').innerHTML,
            price:productDOM.querySelector('.price').innerHTML,
            quantity:1
        };
        const isInCart=orderdDrinks.filter(carItems=>carItems.name===product.name).length>0;
        if(!isInCart){
            generateMarkupOfDrinks(product);

            orderdDrinks.push(product);
            // store date to local storage
            localStorage.setItem('drinks',JSON.stringify(orderdDrinks));
            const drinkItemDOM=document.querySelectorAll('.orderd-drink');
            orederButtonDom.disabled=true;
            btnControls(drinkItemDOM,product,orederButtonDom);
        }
        orederButtonDom.innerHTML='Orderd';
        countOrderTotal();
        // const totalArr=orderdDrinks.map((el)=>Number(el.price.slice(1)));
        // console.log(totalArr);
        // let totalAmount=totalArr.length!=0?totalArr.reduce((curr,accu)=>curr+accu):'';
        // addQuantity.push(...totalArr);
        // console.log(addQuantity);
        // console.log(totalAmount);
    }));
    };




    // Checking local storage for stored drinks
    if(orderdDrinks.length>0){
        orderdDrinks.forEach((drink)=>{
        generateMarkupOfDrinks(drink);
        addToOrderBtn.forEach((orderdButtonDOM)=>{
            const productDOM=orderdButtonDOM.parentNode;
            if(productDOM.querySelector('.tag').innerText===drink.name){
                orderdButtonDOM.innerText='Orderd';
                orderdButtonDOM.disabled=true;
                const drinkItemDOM=document.querySelectorAll('.orderd-drink');    
                btnControls(drinkItemDOM,drink,orderdButtonDOM);
            }
        })
        });
        countOrderTotal();
    }

addViewOrder();


{/* <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="JQJJH7KJS3W8N">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form> */}




function checkOut(){
let paypalFormHTML=`
<form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_cart">
<input type="hidden" name="upload" value="1">
<input type="hidden" name="business" value="jarreld14@gmail.com">
`
orderdDrinks.forEach((orderdDrinks,index) => {
    paypalFormHTML+=`
    <input type="hidden" name="item_name_${index}" value=${orderdDrinks.name}>
    <input type="hidden" name="amount_${index}" value=${orderdDrinks.price}>
    <input type="hidden" name="quantity_${index}" value=${orderdDrinks.quantity}>
    </form>`  
});

paypalFormHTML+=`<input type='submit" value="Paypal">
<div class="overlay"></div>
</form>`;
document.querySelector('body').insertAdjacentHTML('beforeend',paypalFormHTML)
document.getElementById("paypal-form").submit();
};


// function for adding label amount 
function countOrderTotal(){
    let orderTotal=0;
    orderdDrinks.forEach((drinItems)=>{
        orderTotal+=drinItems.quantity*Number(drinItems.price.slice(1));
    })
    lblTotal.innerText=`Total ₱: ${orderTotal}`;
    console.log(orderTotal);
}



const paypalFunction=function(){
paypal.Buttons({
    createOrder:function(data,actions){
    
        return actions.order.create({
            purchase_units:[{
                amount:{
                    value:'200'
                }
            }]
        })
    },
    onApprove:function(data,actions){
        console.log('Data:'+data);
        console.log('Action:'+actions);
        return actions.order.capture().then(function(details){
            console.log(details.payer.name.given_name);
        })
    }
   }).render("#paypal-button-container");
}



orderdDrinks.forEach((orderdDrinks,index) => {
    paypalFormHTML+=`
    <input type="hidden" name="item_name_${index}" value=${orderdDrinks.name}>
    <input type="hidden" name="amount_${index}" value=${orderdDrinks.price}>
    <input type="hidden" name="quantity_${index}" value=${orderdDrinks.quantity}>
    </form>`  
});

paypal.Buttons({
    createOrder: function(data, actions) {
      // This function sets up the details of the transaction, including the amount and line item details.
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '0.01'
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      // This function captures the funds from the transaction.
      return actions.order.capture().then(function(details) {
        // This function shows a transaction success message to your buyer.
        alert('Transaction completed by ' + details.payer.name.given_name);
      });
    }
  }).render('#paypal-button-container');
  //This function displays payment buttons on your web page.