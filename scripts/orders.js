import { cart } from "./data/cart.js";
import { products } from "./data/products.js";
import {deliveryOptions} from "./data/deliveryOptions.js"

export let orders = JSON.parse(localStorage.getItem("orders")) || [];

export let order_items = JSON.parse(localStorage.getItem("order_items")) || [];

function saveOrders() {
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("order_items", JSON.stringify(order_items));
}

export function addToOrders(total, paymentStatus) {
  const now = new Date();
  const currentDate = now.toLocaleString();
  let orderId = generateOrderId();
  let userId = generateUserId();
  if (total && paymentStatus === "paid") {
    let usedOrderIds = JSON.parse(localStorage.getItem("usedOrderIds")) || [];

    usedOrderIds = new Set(usedOrderIds);
    while (usedOrderIds.has(orderId)) {
      orderId = generateOrderId();
    }
    usedOrderIds.add(orderId);
    localStorage.setItem(
      "usedOrderIds",
      JSON.stringify(Array.from(usedOrderIds))
    );

    orders.unshift({
      orderId: orderId,
      userId: userId,
      totalAmount: total,
      paymentStatus: paymentStatus,
      orderDate: currentDate,
    });

    console.log(orders);
    addToOrderItems(orderId);
    saveOrders();
  }
}

export function addToOrderItems(orderId) {
  if (orderId) {
    const productsMap = returnProductMap(products);

      if (cart && cart.length>0) {
        cart.forEach( ( cartItem ) => {
            const deliveryOption = deliveryOptions.find(deliveryOption => deliveryOption.id === cartItem.deliveryOptionId)
            order_items.unshift({
              id: generateId(),
              orderId: orderId,
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              deliveryOptionId:deliveryOption.id,
              price: productsMap[cartItem.productId].price,
            });
          });
      } else {
          console.log("no cart")
      }
    console.log("order_items:", order_items);
    console.log("cart:", cart);
  }
}

function generateOrderId() {
  const timeStamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);

  return `ORDER-${timeStamp}-${randomNum}`;
}

function generateUserId() {
  const timeStamp = Date.now();
  const randomNum = Math.floor(Math.random() * 2000);
  return `USER-${timeStamp}-${randomNum}`;
}

function generateId() {
  const random = Math.floor(Math.random() * 3600);
  return `ID-${random}`;
}

export function returnOrdersMap(orders) {
  let ordersMap;
  if (orders && orders.length > 0) {
    ordersMap = orders.reduce((map, order) => {
      map[order.orderId] = order;
      return map;
    }, {});
  }
  return ordersMap;
}

export function returnProductMap(products) {
  let productsMap;
  if (products && products.length > 0) {
    productsMap = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});
  } else {
    console.log("no products");
  }

  return productsMap;
}
