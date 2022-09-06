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
    let orderdDrinks=JSON.parse(localStorage.getItem('drinks'))||[];

    const reduceandRemoveDrink=function(drinkdetail,buttonstatus,productdetails){
        drinkdetail.classList.add('orderd-drink-removed');
        setTimeout(()=>drinkdetail.remove(),300);
        orderdDrinks=orderdDrinks.filter((carItems)=>carItems.name!==productdetails.name);
        buttonstatus.innerText='Add to Order'
        buttonstatus.disabled=false;
    }
    const clearOrder=function(){
        orderdDrinksDOM.forEach((drink)=>console.log(drink));
    }
    clearBtn.addEventListener('click',clearOrder);



    const generateDrinkMarkup=function(lblQuantityDOM,lblOrderPrice,productdetails,price){
        lblQuantityDOM.innerText=productdetails.quantity;
        lblOrderPrice.innerText=`₱${+price*productdetails.quantity}`;
        localStorage.setItem('drinks',JSON.stringify(orderdDrinks));
    };

    const addQuantity=(drinkitem,productdetails,buttonstatus)=>{
        drinkitem.forEach((drink)=>{
            if(drink.querySelector('.coffe-name').innerText===productdetails.name){
                const price=productdetails.price.slice(1);
                const lblQuantityDOM=drink.querySelector('.order-quantity');
                const lblOrderPrice=drink.querySelector('.order-price');
                // USED for adding drink quatity 
                drink.querySelector('.btn-add').addEventListener('click',()=>{
                productdetails.quantity+=1;
                lblQuantityDOM.innerText=productdetails.quantity;
                lblOrderPrice.innerText=`₱${+price*productdetails.quantity}`;
                localStorage.setItem('drinks',JSON.stringify(orderdDrinks));
                })
                 // USED for Reducing drink quatity 
                drink.querySelector('.btn-minus').addEventListener('click',()=>{
                    productdetails.quantity-=1;
                    // guard Clause to avoid negative quantity
                    if(productdetails.quantity<=0)
                        reduceandRemoveDrink(drink,buttonstatus,productdetails);
                        generateDrinkMarkup(lblQuantityDOM,lblOrderPrice,productdetails,price);
                });
                  // USED for Removing drink  
                  drink.querySelector('.btn-remove').addEventListener('click',()=>{
                    reduceandRemoveDrink(drink,buttonstatus,productdetails);
                    generateDrinkMarkup(lblQuantityDOM,lblOrderPrice,productdetails,price); 
                });
                clearBtn.addEventListener('click',function(){
                    drink.classList.add('orderd-drink-removed');
                    setTimeout(()=>drink.remove(),300);
                    buttonstatus.innerText='Add to Order'
                    buttonstatus.disabled=false;
                });         
            }
        });
    }; 

    const addViewOrder=()=>{
        //loops on each button and listen to each click event
        addToOrderBtn.forEach(orederButtonDom=>orederButtonDom.addEventListener('click',function(){
        const productDOM=orederButtonDom.parentNode;
        console.log(productDOM);
        const product={
            image:productDOM.querySelector('.drink-image').getAttribute('src'),
            name:productDOM.querySelector('.tag').innerHTML,
            price:productDOM.querySelector('.price').innerHTML,
            quantity:1.
        };
        const isInCart=orderdDrinks.filter(carItems=>carItems.name===product.name).length>0;
        if(!isInCart){
            orderList.insertAdjacentHTML('afterbegin',
            `<div class="orderd-drink seven-column-equal">
            <img src="${product.image}"alt="Mochaccino" class="orderd-drink-img">
            <span class="order-tag coffe-name">${product.name}</span>
            <span class="order-tag order-price">${product.price}</span>
            <button class="btn-quantity btn-minus">-</button>
            <span class="order-tag order-quantity">${product.quantity}</span>
            <button class="btn-quantity btn-add">+</button>
            <button class="btn-quantity btn-remove">x</button>
            </div>`); 
            orderdDrinks.push(product);
            // store date to local storage
            localStorage.setItem('drinks',JSON.stringify(orderdDrinks));
            const drinkItemDOM=document.querySelectorAll('.orderd-drink');
            orederButtonDom.disabled=true;
            console.log(drinkItemDOM);
            addQuantity(drinkItemDOM,product,orederButtonDom);
        }
        orederButtonDom.innerHTML='Orderd';
    }));
    };


    if(orderdDrinks.length>0){
        orderdDrinks.forEach((drink)=>{
        orderList.insertAdjacentHTML('afterbegin',
        `<div class="orderd-drink seven-column-equal">
        <img src="${drink.image}"alt="Mochaccino" class="orderd-drink-img">
        <span class="order-tag coffe-name">${drink.name}</span>
        <span class="order-tag order-price">${drink.price}</span>
        <button class="btn-quantity btn-minus">-</button>
        <span class="order-tag order-quantity">${drink.quantity}</span>
        <button class="btn-quantity btn-add">+</button>
        <button class="btn-quantity btn-remove">x</button>
        </div>`);
        addToOrderBtn.forEach((orderdButtonDOM)=>{
            const productDOM=orderdButtonDOM.parentNode;
            if(productDOM.querySelector('.tag').innerText===drink.name){
                orderdButtonDOM.innerText='Orderd';
                orderdButtonDOM.disabled=true;
                const drinkItemDOM=document.querySelectorAll('.orderd-drink');    
                addQuantity(drinkItemDOM,drink,orderdButtonDOM);
  
            }
        })
        });
    }
addViewOrder();


