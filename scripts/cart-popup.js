import { products } from "./data/products.js";
import {
  cart,
  returnCartItemsHtml,
  addToCart,
  updateCartQuantity,
} from "./data/cart.js";
import { formatCurrency } from "./data/utility/money.js";

// let decrementQuantityBtns;
// let incrementQuantityBtns;

export function renderCartPopup() {
  function renderCartItemsHtml() {
    if (cart) {
      document.querySelector(".js-cart-items-container").innerHTML =
        returnCartItemsHtml(cart, products);
      setupEventListeners();
    } else {
      console.log("error accurred");
    }
  }

  function setupEventListeners() {
    document
      .querySelectorAll(".js-decrement-quantity-btn")
      .forEach((decrementBtn) => {
        const productId = decrementBtn.dataset.productId;
        decrementBtn.addEventListener("click", () => {
          const quantityElem = document.querySelector(
            `.js-cart-item-quantity-${productId}`
          );
          if (quantityElem) {
            let quantity = Number(quantityElem.innerHTML);
            if (quantity > 1) {
              quantity -= 1;
              updateCartQuantity(quantity, productId);
              updateCartItemDetailsOnPage(productId, quantity);
            }
            // console.log(quantity);
          }
        });
      });

    document
      .querySelectorAll(".js-increment-quantity-btn")
      .forEach((incrementBtn) => {
        const productId = incrementBtn.dataset.productId;
        incrementBtn.addEventListener("click", () => {
          const quantityElem = document.querySelector(
            `.js-cart-item-quantity-${productId}`
          );
          if (quantityElem) {
            let quantity = Number(quantityElem.innerHTML);
            if (quantity) {
              quantity += 1;
              updateCartQuantity(quantity, productId);
              updateCartItemDetailsOnPage(productId, quantity);
            }
            // console.log(quantity);
          }
        });
      });

    ///////////////////////////////////////////////////////////////////////////////////////////////

    function ReturnCartItemPrice(productId) {
      let itemPrice = 0;
      const MatchingCartItem = cart.find(
        (cartItem) => cartItem.productId === productId
      );
      const matchingProduct = products.find((p) => p.id === productId);

      if (MatchingCartItem && matchingProduct) {
        itemPrice += MatchingCartItem.quantity * matchingProduct.price;
      }
      return formatCurrency(itemPrice);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    function returnItemsTotalPrice() {
      const productMap = products.reduce((map, product) => {
        map[product.id] = product;
        return map;
      }, {});

      const subTotal = cart.reduce((sum, item) => {
        const product = productMap[item.productId];
        if (product) {
          return sum + product.price * item.quantity;
        }
        return sum;
      }, 0);

      return subTotal;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    function updateCartItemDetailsOnPage(productId, updatedQuantity) {
      const itemPrice = ReturnCartItemPrice(productId);
      const subTotal = returnItemsTotalPrice();
      const cartItemQuantityElem = document.querySelector(
        `.js-cart-item-quantity-${productId}`
      );
      const cartItemPriceElem = document.querySelector(
        `.js-item-price-${productId}`
      );

      if (cartItemPriceElem && cartItemQuantityElem) {
        if (itemPrice && updatedQuantity) {
          cartItemPriceElem.innerHTML = itemPrice;
          cartItemQuantityElem.innerHTML = updatedQuantity;
        }
      }

      if (subTotal) {
        document.querySelector(".js-subtotal").innerHTML = `$${formatCurrency(
          subTotal
        )}`;
        // console.log(subTotal)
      }
    }
  }

  renderCartItemsHtml();
}

export function NoCheckOut() {
  alert("you have no items in your cart.");
}
