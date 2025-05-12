import { orders } from "./orders.js";
import { order_items } from "./orders.js";
import { returnOrdersMap } from "./orders.js";
import { returnProductMap } from "./orders.js";
import { products } from "./data/products.js";
import { formatCurrency } from "./data/utility/money.js";
import { deliveryOptions } from "./data/deliveryOptions.js";
import { renderCartPopup } from "./cart-popup.js";
import { cart } from "./data/cart.js";

document.addEventListener("DOMContentLoaded", () => {
  let ordersGrid = document.querySelector(".js-orders-grid");
  if (!orders || orders.length === 0) {
    ordersGrid.innerHTML = `<p>No orders available</p>`;
    return;
  }
  let orderDetailsHtml = "";
  const productsMap = returnProductMap(products);

  orders.forEach((order) => {
    const orderContainer = document.createElement("div");
    orderContainer.classList.add("order-container");
    // Create Order Header
    const orderHeaderHtml = `
            <div class="order-header">
                <div class="order-header-left-section">
                    <div class="order-date">
                        <div class="order-header-label">Order Placed:</div>
                        <div>${order.orderDate}</div>
                    </div>
                    <div class="order-total">
                        <div class="order-header-label">Total:</div>
                        <div>${formatCurrency(order.totalAmount)}</div>
                    </div>
                </div>
                <div class="order-header-right-section">
                    <div class="order-header-label">Order ID:</div>
                    <div>${order.orderId}</div>
                </div>
            </div>
        `;
    orderContainer.innerHTML += orderHeaderHtml;

    // Create Order Details Grid
    const orderDetailsGrid = document.createElement("div");
    orderDetailsGrid.classList.add("order-details-grid");

    const items =
      order_items.filter((item) => item.orderId === order.orderId) || [];
    if (items.length > 0) {
      items.forEach((item) => {
        const product = productsMap[item.productId];
        const deliveryOption = deliveryOptions.find(
          (deliveryOption) => deliveryOption.id === item.deliveryOptionId
        );
        if (product) {
          orderDetailsHtml = `
                        <div class="product-image-container">
                            <img src="${product.image}" alt="${
            product.title
          }" onerror="this.src='images/default-product.png';">
                        </div>
                        <div class="product-details">
                            <div class="product-name">${product.title}</div>
                            <div class="product-delivery-date">${
                              deliveryOption.id === "4"
                                ? `<span>Pickup</span>`
                                : `Arriving in ${deliveryOption.deliveryHours} Hours`
                            }</div>
                            <div class="product-quantity">Quantity: ${
                              item.quantity
                            }</div>
                            <button class="buy-again-button button-primary">
                                <img class="buy-again-icon" src="images/icons/buy-again.png">
                                <span class="buy-again-message">Buy it again</span>
                            </button>
                        </div>
                        ${
                          item.deliveryOptionId === "4"
                            ? `<div class="product-actions">
                            <button class="track-package-button >pickup</button>
                        </div>`
                            : `<div class="product-actions">
                            <button class="track-package-button js-track-package-button button-secondary" data-product-id=${product.id} data-quantity=${item.quantity} data-delivery-hours=${deliveryOption.deliveryHours}>Track package</button>
                        </div>`
                        }
                    `;

          orderDetailsGrid.innerHTML += orderDetailsHtml;
        }
      });
    } else {
      orderDetailsGrid.innerHTML = `<p>No items found for this order.</p>`;
    }

    orderContainer.appendChild(orderDetailsGrid);
    ordersGrid.appendChild(orderContainer);
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  document.querySelectorAll(".js-track-package-button").forEach((trackBtn) => {
    trackBtn.addEventListener("click", () => {
      const productId = trackBtn.dataset.productId;
      const quantity = trackBtn.dataset.quantity;
      const deliveryHours = trackBtn.dataset.deliveryHours;
      const data = { productId, quantity, deliveryHours };
      const encodedData = encodeURIComponent(JSON.stringify(data));
      window.open(`tracking.html?data=${encodedData}`, "_self");
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  const cartIcon = document.querySelector(".js-cart-icon");
  const cartPopUpContainer = document.querySelector(".js-cart-popup-container");
  cartIcon.addEventListener("click", () => {
    console.log("working");
    if (cartIcon.innerHTML === "Cart 🛒".trim()) {
      cartIcon.innerHTML = "close x";
      cartPopUpContainer.classList.add("show");
    } else {
      cartIcon.innerHTML = "Cart 🛒";
      cartPopUpContainer.classList.remove("show");
    }
  } );
  

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

  document.querySelector(".js-checkout-btn").addEventListener("click", () => {
    if (cart && cart.length) {
      document.location.href = "checkout.html";
    } else {
      alert("please add some items to your cart to proceed");
    }
  });

  //////////////////////////////////////////////////////////////////////////////////

  renderCartPopup();

} );


