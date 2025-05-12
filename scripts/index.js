import { renderCartPopup } from "./cart-popup.js";
import { NoCheckOut } from "./cart-popup.js";
import { cart } from "./data/cart.js";

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
} );

///////////////////////////////////////////////////////////////////////////////

  document.addEventListener( 'click', (event) => {
    if ( cartPopUpContainer.classList.contains( 'show' )&&
      !cartPopUpContainer.contains( event.target ) &&
      !event.target.matches( '.js-cart-icon' ) &&
      !event.target.matches('.js-cart-popup-container')
  ) {
      cartPopUpContainer.classList.remove( 'show' )
      cartIcon.innerHTML = "Cart 🛒";
      
    }
  })

  /////////////////////////////////////////////////////////////////////////////////

document.querySelector( ".js-checkout-btn" ).addEventListener( 'click', () => {
  if ( cart && cart.length ) {
      document.location.href="checkout.html"
  } else {
    alert('please add some items to your cart to proceed')
  }
  });

  //////////////////////////////////////////////////////////////////////////////////
document.addEventListener( 'DOMContentLoaded', () => {
  renderCartPopup()
})
