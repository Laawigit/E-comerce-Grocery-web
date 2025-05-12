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

export function renderPaymentSummary() {
  let totalItems = 0;
  let deliveryPrice = 0;
  let subTotal = 0;
  let tax = 0;
  let total = 0;
  let matchingDeliveryOption;
  let matchingProduct;

  if (cart && cart.length) {
    cart.forEach((cartItem) => {
      if (products && products.length) {
        products.forEach((product) => {
          if (product.id === cartItem.productId) {
            matchingProduct = product;
          }
        });
      }
      if (matchingProduct) {
        totalItems += matchingProduct.price * cartItem.quantity;
        // console.log(matchingProduct)
      }
    });
  }

  cart.forEach((cartItem) => {
    if (deliveryOptions && deliveryOptions.length) {
      deliveryOptions.forEach((deliveryOption) => {
        if (deliveryOption.id === cartItem.deliveryOptionId) {
          matchingDeliveryOption = deliveryOption;
        }
      });
      if (matchingDeliveryOption) {
        if (matchingDeliveryOption.price !== undefined) {
          deliveryPrice += matchingDeliveryOption.price;
        } else {
          deliveryPrice = 0
        }
      }
    }
  });

  if (totalItems) {
    subTotal += totalItems + deliveryPrice;
  }

  if (subTotal) {
    tax += subTotal * 0.1;
  }

  if (subTotal) {
    total += subTotal + tax;
  }

  const paymentHtml = `
      <h2>Payment Summary</h2>
      <div class="summary">
        <p>Total-items: <span id="total-items">$${formatCurrency(
          totalItems
        )}</span></p>
        <p>Delivery: <span id="delivery">$${formatCurrency(
          deliveryPrice
        )}</span></p>
        <p>Sub-total: <span id="Sub-total">$${formatCurrency(
          subTotal
        )}</span></p>

        <p>Tax: <span id="tax">$${formatCurrency(tax)}</span></p>
        <p><strong>Total: <span id="total">$${formatCurrency(
          total
        )}</span></strong></p>
        <button class="checkout-button js-checkout-button">Proceed to Payment</button>
      </div>
    `;

  document.querySelector(".js-payment-summary").innerHTML = paymentHtml;

  document
    .querySelector(".js-checkout-button")
    .addEventListener("click", () => {
      const orderData = { 'cart': cart, 'total': total };
      const encodedData = encodeURIComponent(JSON.stringify(orderData));

      window.open(`payment-pilling.html?data=${encodedData}`, "_self");
    });
  return total
}
