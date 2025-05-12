import { products } from "./data/products.js";
import { formatCurrency } from "./data/utility/money.js";
import { addToCart, calculateCartQuantity, cart } from "./data/cart.js";
import { renderCartPopup } from "./cart-popup.js";
import { generateQuantityOptions, showMessage } from "./shop.js";

document.addEventListener("DOMContentLoaded", () => {
  let matchingProduct;
  let productDetailsHtml = "";
  let counter = 0;
  const url = new URL(window.location.href);
  const productId = url.searchParams.get("productId");

  //////////////////////////////////////////////////////////////////////////////////////////////////////

  if (products.length) {
    const matchingProduct = products.find((p) => p.id === productId);

    if (matchingProduct) {
      // Define maxLength based on the product category

      let maxLength = 1;
      let unit = ""; // Default unit

      if (matchingProduct.category === "vegetable") {
        maxLength = 5; 
        unit = "kg";
      } else if (["fruit", "dairy"].includes(matchingProduct.category)) {
        maxLength = 8; 
        unit = "";
      }

      const quantityOptions = generateQuantityOptions(
        matchingProduct.category,
        maxLength
      );

      // Generate product details HTML
      productDetailsHtml += `
      <section class="product-details-container">
        <section class="product-image-container">
          <img src="${matchingProduct.image}" alt="${
        matchingProduct.title
      }" id="main-image">
        </section>

        <section class="product-info-description-container">
          <div class="product-info">
            <h1>${matchingProduct.title}</h1>

            ${
              maxLength > 1
                ? `
                <div class="product-quantity-container">
                  <select class="js-option-values-${matchingProduct.id}">
                    ${quantityOptions}
                  </select>
                </div>`
                : ""
            }

            <p class="price">
              <span>Price:</span>
              $${formatCurrency(matchingProduct.price)}
            </p>
            <p class="rating">⭐⭐⭐⭐☆ (120 reviews)</p>
            <p class="description">${matchingProduct.briefDescription}</p>
            <button class="add-to-cart js-add-to-cart" data-product-id="${
              matchingProduct.id
            }">Add to Cart</button>
          </div>

          <div class="product-description">
            <h2>Description</h2>
            <p>${matchingProduct.fullDescription}</p>
          </div>
        </section>
      </section>

      <section class="related-products">
        <h2>You May Also Like</h2>
        <div class="related-items">
          <div class="slider">
            ${renderRelatedProducts(matchingProduct)}
            <button class="left-btn js-left-btn arrow"><</button>
            <button class="right-btn js-right-btn arrow">></button>
          </div>
        </div>
      </section>
    `;
    }
  }

  document.querySelector(".js-product-details-container-more").innerHTML =
    productDetailsHtml;
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  function renderRelatedProducts(matchingProduct) {
    let relatedProducts = [];
    let relatedProductsHtml = "";
    if (products.length) {
      products.forEach((product) => {
        if (product.category === matchingProduct.category) {
          if (product.id !== matchingProduct.id) {
            relatedProducts.push(product);
          }
        }
      });
    }

    if (relatedProducts && relatedProducts.length) {
      relatedProducts.forEach((relatedProduct) => {
  
        let maxQuantity = 1;
        if (relatedProduct.category === "vegetable") {
          maxQuantity = 5; 
        } else if (
          relatedProduct.category === "fruit" ||
          relatedProduct.category === "dairy"
        ) {
          maxQuantity = 8; 
        }

      
        const quantityOptions = generateQuantityOptions(
          relatedProduct.category,
          maxQuantity
        );

        // Generate the HTML for the related product
        relatedProductsHtml += `
      <div class="product-card js-product-card">
        <a href="product-details.html?productId=${
          relatedProduct.id
        }&name=${encodeURIComponent(relatedProduct.title)}">
          <img src="${relatedProduct.image}" alt="${relatedProduct.title}">
        </a>
        <div class="product-card-details">
          <h3>${relatedProduct.title}</h3>
          <div class="price-container">
            <p>${
              relatedProduct.category === "vegetable"
                ? formatCurrency(relatedProduct.price) + "/kg"
                : formatCurrency(relatedProduct.price)
            }</p>
            <div class="product-quantity-container">
              <select class="js-option-values-${relatedProduct.id}">
                ${quantityOptions}
              </select>
            </div>
          </div>
          <button class="add-to-cart js-add-to-cart" data-product-id="${
            relatedProduct.id
          }">Add to Cart</button>
        </div>
      </div>
    `;
      });
    }
    return relatedProductsHtml;
  }

  const productCards = document.querySelectorAll(".js-product-card");

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  function left() {
    if (counter > 0) {
      counter--;
    }
    slide();
    // console.log('working')
  }
  function right() {
    let maxWidth = 0;
    if (counter < 4) {
      counter++;
    }
    slide();
    // console.log("working");
    console.log("counter" + counter);
    console.log("length" + productCards.length);
  }

  function slide() {
    // console.log(productCards)
    productCards.forEach((productCard) => {
      productCard.style.transform = `translateX(-${counter * 900}px)`;
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  document.querySelector(".js-left-btn").addEventListener("click", left);
  document.querySelector(".js-right-btn").addEventListener("click", right);

  //////////////////////////////////////////////////////////////////////////////////////////////

  document.querySelectorAll(".js-add-to-cart").forEach((addItem) => {
    addItem.addEventListener("click", () => {
      const productId = addItem.dataset.productId;

      addToCart(productId);
      renderCartPopup();
      const interval = setInterval(() => {
        showMessage();
        clearInterval(interval);
      }, 1000);
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////

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
    if (cart && cart.length) {
      document.location.href = "checkout.html";
    } else {
      alert("please add some items to your cart to proceed");
    }
  });

  //////////////////////////////////////////////////////////////////////////////////

  renderCartPopup();
});





