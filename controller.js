"use strict";
    // Query Selector 
    const addToOrderBtn=document.querySelectorAll('.btn-order');
    const clearBtn=document.querySelector('.btn-clear');
    const orderList=document.querySelector('.order-list');
    const orderdDrinksDOM=document.querySelectorAll('.orderd-drink');
    const drinkDesription=document.querySelectorAll('.drink-description');
    const btnAddQuantity=document.querySelector('.btn-add');
    const btnMinusQuantity=document.querySelector('.btn-minus');
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
                console.log(Totalprice+=price);
                productdetails.quantity+=1;
                generateDrinkMarkup(lblQuantityDOM,lblOrderPrice,productdetails,price); 
                })
                 // USED for Reducing drink quatity 
                drink.querySelector('.btn-minus').addEventListener('click',()=>{
                    productdetails.quantity-=1;
                    console.log(Totalprice-=price);
                    // guard Clause to avoid negative quantity
                    if(productdetails.quantity<=0)
                        reduceandRemoveDrink(drink,buttonstatus,productdetails);
                        generateDrinkMarkup(lblQuantityDOM,lblOrderPrice,productdetails,price);
                });
                  // USED for Removing drink  in the DOM
                  drink.querySelector('.btn-remove').addEventListener('click',()=>{
                    reduceandRemoveDrink(drink,buttonstatus,productdetails);
                });
                 // USED for CLearing all the drink menu in the DOM 
                clearBtn.addEventListener('click',function(){
                    reduceandRemoveDrink(drink,buttonstatus,productdetails);
                });   

            }
        });
    }; 
    // Showing the order on the DOM 
    const addViewOrder=()=>{
        //loops on each button and listen to each click event
        addToOrderBtn.forEach(orederButtonDom=>orederButtonDom.addEventListener('click',function(){
        const productDOM=orederButtonDom.parentNode;
        const product={
            image:productDOM.querySelector('.drink-image').getAttribute('src'),
            name:productDOM.querySelector('.tag').innerHTML,
            price:productDOM.querySelector('.price').innerHTML,
            quantity:1.
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
        Totalprice=Number(product.price.slice(1));
        console.log(Totalprice);
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
    }
addViewOrder();




