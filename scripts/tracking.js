import { products } from "./data/products.js";
import { renderCartPopup } from "./cart-popup.js";
import { cart } from "./data/cart.js";


document.addEventListener( 'DOMContentLoaded', () => {
    const params = new URLSearchParams( document.location.search )
    const encodedData = params.get( "data" )
    const data = JSON.parse(decodeURIComponent(encodedData))
    
    console.log( data )
    const { productId, quantity, deliveryHours } = data
    const product = products.find( product => product.id === productId )
    if (product) {
        const trackingOrderHtml = `<div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving in ${deliveryHours} Hours
        </div>

        <div class="product-info">
          ${product.title}
        </div>

        <div class="product-info">
          Quantity: ${quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
      </div>`;
        
        document.querySelector('.js-main').innerHTML= trackingOrderHtml
    } else {
        console.log("no product found!")
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const cartIcon = document.querySelector(".js-cart-icon");
    const cartPopUpContainer = document.querySelector(".js-cart-popup-container");
    cartIcon.addEventListener("click", () => {
      if (cartIcon.innerHTML === "Cart 🛒".trim()) {
        cartIcon.innerHTML = "close x";
        cartPopUpContainer.classList.add("show");
      } else {
        cartIcon.innerHTML = "Cart 🛒";
        cartPopUpContainer.classList.remove("show");
      }
    });
    
    ///////////////////////////////////////////////////////////////////////////////
    
    document.addEventListener("click", (event) => {
      if (
        cartPopUpContainer.classList.contains("show") &&
        !cartPopUpContainer.contains(event.target) &&
        !event.target.matches(".js-cart-icon") &&
        !event.target.matches(".js-cart-popup-container")
      ) {
        cartPopUpContainer.classList.remove("show");
        cartIcon.innerHTML = "Cart 🛒";
      }
    });
    
    /////////////////////////////////////////////////////////////////////////////////
    
    document.querySelector( ".js-checkout-btn" ).addEventListener( 'click', () => {
      if ( cart && cart.length ) {
          document.location.href="checkout.html"
      } else {
        alert('please add some items to your cart to proceed')
      }
      });
    
      //////////////////////////////////////////////////////////////////////////////////
    
      renderCartPopup();
    
})