import { addToOrders } from "./orders.js";


document.addEventListener( 'DOMContentLoaded', () => {
  function validateForm() {
    let isValid = true;

    // Get all input values
    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const nameOnCard = document.getElementById("nameOnCard");
    const cardNumber = document.getElementById("cardNumber");
    const expMonth = document.getElementById("expMonth");
    const expYear = document.getElementById("expYear");
    const cvv = document.getElementById("cvv");

    // Validate each field
    isValid = checkField(fullname, "error-fullname") && isValid;
    isValid = checkField(email, "error-email") && isValid;
    isValid = checkField(address, "error-address") && isValid;
    isValid = checkField(city, "error-city") && isValid;
    isValid = checkField(nameOnCard, "error-nameOnCard") && isValid;
    isValid = checkField(cardNumber, "error-cardNumber") && isValid;
    isValid = checkField(expMonth, "error-expMonth") && isValid;
    isValid = checkField(expYear, "error-expYear") && isValid;
    isValid = checkField(cvv, "error-cvv") && isValid;

    return isValid; // Prevent form submission if invalid
  }

  function checkField(input, errorId) {
    const errorElement = document.getElementById(errorId);
    if (input.value.trim() === "") {
      errorElement.style.display = "block";
      return false;
    } else {
      errorElement.style.display = "none";
      return true;
    }
  }

  const params = new URLSearchParams( window.location.search )
  const encodedData = params.get("data")
  let orderData;
  if(encodedData){
    orderData = JSON.parse(decodeURIComponent(encodedData))
  }
  

  const form = document.getElementById( 'billingForm' ).onsubmit = (event) => {
    event.preventDefault()
    validateForm()
    let paymentStatus = "paid"
    if (validateForm()) {
      const { cart, total } = orderData;
      addToOrders( total, paymentStatus );
      window.open('pilling-message.html')
    }
    
  }
 
})