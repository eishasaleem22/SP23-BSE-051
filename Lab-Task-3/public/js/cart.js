function addToCart(id, title, price) {
  const userId = getUserId();

  if (!userId) {
    alert("Please log in to add items to your cart");
    return;
  }

  const cartKey = `cart_${userId}`;

  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  let existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ id, title, price, quantity: 1 });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartDisplay();
}

function updateCartDisplay() {
  const userId = getUserId();

  if (!userId) {
    document.getElementById("cartItems").innerHTML = "";
    document.getElementById("cartCount").textContent = "0";
    document.getElementById("cartTotal").textContent = "";
    document.getElementById("proceedToCheckout").style.display = "none";
    return;
  }

  const cartKey = `cart_${userId}`;

  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  let cartItemsContainer = document.getElementById("cartItems");
  let cartCountEl = document.getElementById("cartCount");
  let proceedToCheckoutBtn = document.getElementById("proceedToCheckout");
  let cartTotalEl = document.getElementById("cartTotal");

  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    let cartItemHTML = `
            <div class="col-md-12 mb-2">
                <div class="card">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <span>${item.title} x ${item.quantity}</span>
                        <span>$${itemTotal.toFixed(2)}</span>
                        <button onclick="removeFromCart('${
                          item.id
                        }')" class="btn btn-danger btn-sm">Remove</button>
                    </div>
                </div>
            </div>
        `;
    cartItemsContainer.innerHTML += cartItemHTML;
  });

  cartCountEl.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  proceedToCheckoutBtn.style.display = cart.length > 0 ? "block" : "none";

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

  proceedToCheckoutBtn.onclick = () => {
    let checkoutModal = new bootstrap.Modal(
      document.getElementById("checkoutModal")
    );

    let cartSummaryEl = document.getElementById("cartSummary");
    cartSummaryEl.innerHTML = cart
      .map(
        (item) =>
          `<p>${item.title} x ${item.quantity}: $${(
            item.price * item.quantity
          ).toFixed(2)}</p>`
      )
      .join("");

    checkoutModal.show();
  };
}

function removeFromCart(id) {
  const userId = getUserId();

  if (!userId) {
    alert("Please log in to manage your cart");
    return;
  }

  const cartKey = `cart_${userId}`;

  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  let productIndex = cart.findIndex((item) => item.id === id);

  if (productIndex !== -1) {
    if (cart[productIndex].quantity > 1) {
      cart[productIndex].quantity -= 1;
    } else {
      cart.splice(productIndex, 1);
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartDisplay();
  }
}

function submitOrder() {
  const userId = getUserId();

  if (!userId) {
    alert("Please log in to submit an order");
    return;
  }

  const cartKey = `cart_${userId}`;

  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  let customerName = document.getElementById("customerName").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;

  if (!customerName || !phone || !address) {
    alert("Please fill in all required fields");
    return;
  }

  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let orderData = {
    customerName,
    phone,
    address,
    total,
    products: cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  fetch("/submit-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        localStorage.removeItem(cartKey);
        updateCartDisplay();

        let checkoutModal = bootstrap.Modal.getInstance(
          document.getElementById("checkoutModal")
        );
        checkoutModal.hide();

        alert("Order placed successfully!");
      } else {
        alert(data.message || "Failed to place order");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while placing the order");
    });
}

function getUserId() {
  const userElement = document.getElementById("current-user-id");
  return userElement ? userElement.value : null;
}
document.addEventListener("DOMContentLoaded", updateCartDisplay);
