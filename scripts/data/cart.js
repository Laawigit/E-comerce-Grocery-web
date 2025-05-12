// import { deliveryOptions } from "./deliveryOptions";
import { formatCurrency } from "./utility/money.js";
// import { renderCartPopup } from "../index.js";
export let cart = JSON.parse(localStorage.getItem("cart")) || [];



export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  const matchingProduct = findMatchingProduct(productId);

  if (matchingProduct) {
    matchingProduct.quantity += addSelectedQuantity(productId);
  } else {
    cart.push({
      productId,
      quantity: addSelectedQuantity(productId),
      deliveryOptionId: "1",
    });
  }

  saveCart();
}

function addSelectedQuantity(productId) {
  let quantity = 0;

  document
    .querySelectorAll(`.js-option-values-${productId}`)
    .forEach((selection) => {
      quantity = Number(selection.value);
    });
  return quantity;
}

export function deleteFromCart(productId) {
  const updatedCart = [];
  if (cart && cart.length) {
    cart.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        updatedCart.push(cartItem);
      }
    });
  }

  cart = updatedCart;
  saveCart();
  // console.log(cart)
}

export function calculateCartQuantity(cart) {
  let cartQuantity = 0;
  if (cart) {
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
  }
  return cartQuantity;
}

export function updateCartQuantity(UpdatedQuantity, productId) {
  const matchingProduct = findMatchingProduct(productId);

  matchingProduct.quantity = UpdatedQuantity;
  saveCart();
  // console.log(cart)
}

export function findMatchingProduct(productId) {
  let matchingProduct;

  if (cart) {
    cart.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingProduct = cartItem;
      }
    });
  }

  return matchingProduct;
}

export function updateDeliveryOptionId(deliveryOptionId, productId) {
  const matchingProduct = findMatchingProduct(productId);

  if (cart && cart.length) {
    if (matchingProduct) {
      matchingProduct.deliveryOptionId = deliveryOptionId;
      saveCart();
    }
  }
  // console.log(cart)
}

export function returnCartItemsHtml(cart, products) {
  let subtotal = 0;
  let cartHtml = "";
  let matchingProduct;

  if (cart && cart.length) {
    cart.forEach((cartItem) => {
      matchingProduct = products.find(p=> p.id === cartItem.productId)

      if (matchingProduct) {
        subtotal += cartItem.quantity * matchingProduct.price;
        cartHtml += `
            <div class="cart-item js-cart-item" data-product-id = "${
              cartItem.productId
            }">
                <div class="item-img-container">
                  <img src="${matchingProduct.image}" alt="${
          matchingProduct.title
        }">
                </div>
                <div class="item-details-container">
                  <p class="item-title ">${matchingProduct.title}</p>
                  <div class="item-quantity-container">
                        <p class="item-quantity">${
                          matchingProduct.category === "vegetable"
                            ? "size: "
                            : "quantity: "
                        } ${
          matchingProduct.category === "vegetable"
            ? `<span class="cart-item-quantity js-cart-item-quantity-${cartItem.productId} ">${cartItem.quantity}</span>` +
              "/kg"
            : `<span class="cart-item-quantity js-cart-item-quantity-${cartItem.productId} ">${cartItem.quantity}</span>`
        }</p>
                        <div class="update-quantity-container">
                            <button
                             class="decrement-quantity-btn js-decrement-quantity-btn update-quantity-btn"
                             data-product-id=${cartItem.productId}
                             >-</button>
                            <button 
                            class="increment-quantity-btn js-increment-quantity-btn update-quantity-btn" 
                            data-product-id=${cartItem.productId}
                            >+</button>
                        </div>
                  </div>
                </div>
                <div class="item-price-container">
                  <p>$<span class="item-price js-item-price-${
                    cartItem.productId
                  }">${formatCurrency(
          matchingProduct.price * cartItem.quantity
        )}</span></p>
                </div>
            </div>
    `;
         document.querySelector(".js-subtotal").innerHTML = `$${formatCurrency(
           subtotal
         )}`;
      }
    });
  } else {
    cartHtml = `<p>you have no items in your cart</p>`;
  }
  
  

  return cartHtml;
}
