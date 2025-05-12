import { products } from "./data/products.js";
import {
  cart,
  addToCart,
  updateCartQuantity,
  calculateCartQuantity,
} from "./data/cart.js";
import { formatCurrency } from "./data/utility/money.js";
import { renderCartPopup } from "./cart-popup.js";


  export function generateQuantityOptions(category, maxQuantity) {
    let unit = ""; // Default unit
    if (category === "vegetable") {
      unit = "kg"; // Vegetables are in kg
    }

    // Generate options dynamically based on maxQuantity
    return Array.from({ length: maxQuantity }, (_, i) => {
      const value = i + 1;
      return `<option value="${value}">${value}${unit}</option>`;
    }).join("");
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

    export function showMessage() {
    const message = document.querySelector(".js-added-message");
    message.innerHTML = `<p>You now have ${calculateCartQuantity(
      cart
    )} items in your cart</p>`;
    message.classList.add("active");

    setTimeout(() => {
      message.classList.remove("active");
    }, 3000);
  }

  ///////////////////////////////////////////////////////////////////////////////

 

document.addEventListener( "DOMContentLoaded", () => {
  let limit = 20;


  // Generate Products Grid
  function renderProducts() {
    renderCartPopup();

    // Initialize the product cards HTML
    let productCardHTML = "";

    // Loop through the products
    products.slice(0, limit).forEach((product) => {
      // Generate quantity selector based on category
      let quantitySelector = "";
      if (
        product.category === "vegetable" ||
        product.category === "fruit" ||
        product.category === "dairy"
      ) {
        const maxQuantity = product.category === "vegetable" ? 5 : 8;
        const quantityOptions = generateQuantityOptions(
          product.category,
          maxQuantity
        );
        quantitySelector = `
        <div class="product-quantity-container">
          <select class="js-option-values-${product.id}">
             ${quantityOptions}
          </select>
        </div>`;
      }

      // Generate product card HTML
      productCardHTML += `
      <div class="product-card">
        <a href="product-details.html?productId=${
          product.id
        }&name=${encodeURIComponent(product.title)}">
          <img src="${product.image}" alt="${product.title}">
        </a>
        <div class="product-card-details">
          <h3>${product.title}</h3>
          <div class="price-container">
            <p>${
              product.category === "vegetable"
                ? formatCurrency(product.price) + "/kg"
                : formatCurrency(product.price)
            }</p>
            ${quantitySelector}
          </div>
          <button class="add-to-cart js-add-to-cart" data-product-id="${
            product.id
          }">Add to Cart</button>
        </div>
      </div>`;
    });

    // Update the product grid with all product cards
    const productGrid = document.querySelector(".product-grid");
    if (productGrid) productGrid.innerHTML = productCardHTML;

    // Add event listener for "Add to Cart" buttons using event delegation
    productGrid.addEventListener("click", (event) => {
      const addItem = event.target.closest(".js-add-to-cart");
      if (addItem) {
        const productId = addItem.dataset.productId;
        addToCart(productId);
        renderCartPopup();

        // Show a message after adding the product
        const interval = setInterval(() => {
          showMessage();
          clearInterval(interval);
        }, 1000);
      }
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Search Popup Logic
  const searchIcon = document.getElementById("search-icon");
  const searchContainer = document.querySelector(".search-container");
  const searchPopup = document.getElementById("search-popup");
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");

  // Show the search popup when search icon is clicked
  searchIcon.addEventListener("click", () => {
    searchPopup.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Close the search popup when clicking outside or on the search button
  document.addEventListener("click", (event) => {
    if (
      searchPopup.classList.contains("active") &&
      !searchContainer.contains(event.target) &&
      !event.target.matches("#search-icon") &&
      !event.target.matches("#search-button") &&
      !event.target.matches("#search-input")
    ) {
      searchPopup.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // Handle the search button click (perform search logic)
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      alert(`Searching for: ${query}`); // Replace with your actual search logic
    }
    searchPopup.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  /////////////////////////////////////////////////////////////////////////////
 const showMoreBtn = document.querySelector(".js-show-more-btn");

  showMoreBtn.addEventListener("click", () => {
    limit += 20;
    if (limit >= products.length) {
      showMoreBtn.disabled = true;
    }
    renderProducts();
  });

  ///////////////////////////////////////////////////////////////////////////////

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

  /////////////////////////////////////////////////////////////////////////////////

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
    if (cart.length) {
      document.location.href = "checkout.html";
    } else {
      alert("please add some items to your cart to proceed");
    }
  });

  //////////////////////////////////////////////////////////////////////////////////

  renderProducts();
} );






