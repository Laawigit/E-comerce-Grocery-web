import { products } from "../data/products.js";
import {
  cart,
  findMatchingProduct,
  updateCartQuantity,
  deleteFromCart,
  saveCart,
  updateDeliveryOptionId,
} from "../data/cart.js";
import { deliveryOptions, getDeliveryPrice } from "../data/deliveryOptions.js";
import { formatCurrency } from "../data/utility/money.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartItemsHtml = "";
  let matchingProduct;
  ///////////////////////////////////////////////
  if (cart && cart.length) {
    // console.log('found')
    cart.forEach((cartItem) => {
      products.forEach((product) => {
        if (cartItem.productId === product.id) {
          matchingProduct = product;
        }
      });
      if (matchingProduct) {
        cartItemsHtml += `
             <div class="cart-item js-cart-item-${matchingProduct.id}">
             <div class="cart-item-inner-container">
              ${
                renderDeliveryHours(cartItem.deliveryOptionId) === "" ? (
                  `<p>dear customer you can come pickup your orders now.</p>`
                ) : (
                  `<p>
                    Your orders will arrive in ${renderDeliveryHours(cartItem.deliveryOptionId)}Hours
                  </p>`
                )
              }
              <div class="cart-item-inner">
               <div class="img-container">
                       <img src="${matchingProduct.image}" alt="${
          matchingProduct.title
        }">
               </div>
                <div class="cart-item-details">
                     <div>
                  <p class="title-item">${matchingProduct.title}</p>
                  <span class="price-item">$${formatCurrency(
                    matchingProduct.price * cartItem.quantity +
                      getDeliveryPrice(cartItem.deliveryOptionId)
                  )}</span>
                        </div>

                      <div>
                        <span >
                        quantity: <span class="cart-item-quantity-container js-cart-item-quantity-container-${
                          matchingProduct.id
                        }">${
          matchingProduct.category === "vegetable"
            ? cartItem.quantity + "kg"
            : cartItem.quantity
        }</span>
                        </span>
                        <span
                        class="update-cart-item-btn js-update-cart-item-btn"
                        data-product-id="${matchingProduct.id}"
                        >Update</span>
                        <span
                        class="delete-cart-item-btn js-delete-cart-item-btn"
                        data-product-id="${matchingProduct.id}"

                        >Delete</span>
                        </div>
              </div>

              </div>
            
             </div>
             <!-- Delivery-options -->
            <div class="delivery-options-container">
                <p>Choose a Delivery option:</p>
                ${deliveryOptionsHtml(cartItem.deliveryOptionId)}
            </div>
         </div>  `;

        document.querySelector(".cart-items").innerHTML = cartItemsHtml;
      }
    });

    /////////////////////////////////////////////////

    function deliveryOptionsHtml(deliveryOptionId) {
      // console.log(deliveryOptionId)
      let html = "";
      deliveryOptions.forEach((deliveryOption) => {
        html += `
            <div class="delivery-option">
              <input
                type="radio"
                class="delivery-option-input js-delivery-option-input"
               ${deliveryOptionId === deliveryOption.id ? "checked" : ""}
                name="delivery-option-${matchingProduct.id}"
                data-product-id = "${matchingProduct.id}"
                data-delivery-id = "${deliveryOption.id}"
              />    
            <div class="delivery-time-price-container">
              ${
                Object.keys(deliveryOption).length === 3
                  ? `<div class="delivery-option-time">${
                      deliveryOption.deliveryHours
                        ? deliveryOption.deliveryHours
                        : null
                    }Hours</div>
            <div class="delivery-option-price">${
              deliveryOption.price === 0
                ? "free -"
                : "$" + formatCurrency(deliveryOption.price)
            }- shipping</div> `
                  : `<p class="pickup">pickup</p>`
              }
          </div>
            </div > 
          `;
      } );
      
      return html;
    }

    //////////////////////////////////////////////////

    function renderDeliveryHours(id) {
      let deliveryHrs;
      deliveryOptions.forEach((deliveryOption) => {
        if ( deliveryOption.id === id ) {
          if (deliveryOption.deliveryHours !== undefined && deliveryOption.price !== undefined) {
              deliveryHrs = deliveryOption.deliveryHours;
            
          } else {
            deliveryHrs = ''
          }
        }
      });
      // console.log(id);

      return deliveryHrs;
    }
  }
  ///////////////////////////////////////////////

  document
    .querySelectorAll(".js-delete-cart-item-btn")
    .forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        const productId = deleteButton.dataset.productId;
        deleteFromCart(productId);
        const cartItemContainer = document.querySelector(
          `.js-cart-item-${productId}`
        );
        cartItemContainer.remove();
        renderPaymentSummary();
      });
    });

  //////////////////////////////////////////////////

  document
    .querySelectorAll(".js-update-cart-item-btn")
    .forEach((updateButton) => {
      updateButton.addEventListener("click", () => {
        const productId = updateButton.dataset.productId;

        // Select the quantity container for this product
        const quantityContainer = document.querySelector(
          `.js-cart-item-quantity-container-${productId}`
        );

        // Check if the button is currently in "update" or "save" state
        if (updateButton.innerHTML.trim() === "Update") {
          // Change button text to "Save"
          updateButton.innerHTML = "Save";

          // Replace the quantity text with an input field
          quantityContainer.innerHTML = `
        <input type="number" 
               class="update-cart-item-quantity-input js-update-cart-item-quantity-input" 
        />
      `;
        } else if (updateButton.innerHTML.trim() === "Save") {
          // Retrieve the value from the input field
          const inputField = quantityContainer.querySelector(
            ".js-update-cart-item-quantity-input"
          );

          if (inputField) {
            const newQuantity = Number(inputField.value);
            if (typeof newQuantity === "number" && newQuantity > 0) {
              console.log(newQuantity);

              // Restore the original view (text instead of input field)
              quantityContainer.textContent = newQuantity;
              updateCartQuantity(newQuantity, productId);
              // Reset the button text back to "Update"
              updateButton.innerHTML = "Update";
              renderOrderSummary();
              renderPaymentSummary();
            } else if (typeof newQuantity !== "number" || newQuantity < 1) {
              alert("please provide a valid quantity");
            } else if (!newQuantity) {
              renderOrderSummary();
              renderPaymentSummary();
            }
          }
        }
      });
    });
  ///////////////////////////////////////////////////////////////////////////////

  document
    .querySelectorAll(".js-delivery-option-input")
    .forEach((deliveryOptionInput) => {
      deliveryOptionInput.addEventListener("click", () => {
        const productId = deliveryOptionInput.dataset.productId;
        const deliveryId = deliveryOptionInput.dataset.deliveryId;

        updateDeliveryOptionId(deliveryId, productId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  // console.log( cart );
  return cart
}
