import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { cart } from "./data/cart.js";

document.addEventListener( 'DOMContentLoaded', () => {
   function goBackToPreviousPage() {
     const previousPage = document.referrer;
     if (previousPage) {
       window.location.href = previousPage;
     } else {
       // If no referrer is available, redirect to a default page (e.g., homepage)
       window.location.href = "index.html";
     }
   }

   document
     .querySelector(".js-back-to-previous")
     .addEventListener("click", () => {
       goBackToPreviousPage();
     });

  renderOrderSummary();
  renderPaymentSummary();
  
 
  
  
 
  
})




