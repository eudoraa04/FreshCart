let cart = [];

const products = [
    {
        name: "Banana",
        price: 60,
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Apple",
        price: 120,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Carrot",
        price: 80,
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Potato",
        price: 50,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Tomato",
        price: 70,
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Orange",
        price: 90,
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Capsicum",
        price: 100,
        image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Broccoli",
        price: 110,
        image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=700&q=80"
    }
];

document.addEventListener("DOMContentLoaded", function() {

    loadCart();

    updateCart();

    changePayment();

});

function loadCart() {

    const savedCart =
        localStorage.getItem("freshCartCart");

    if (!savedCart) {
        return;
    }

    try {
        cart = JSON.parse(savedCart);
    } catch {
        cart = [];
    }
}

function saveCart() {

    localStorage.setItem(
        "freshCartCart",
        JSON.stringify(cart)
    );
}

function addToCart(index) {

    const product = products[index];

    if (!product) {
        return;
    }

    const existing =
        cart.find(
            item => item.name === product.name
        );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });

    }

    saveCart();

    updateCart();

    showToast(
        "🛒 " + product.name + " added to cart"
    );
}

function updateCart() {

    const count =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }

    renderCart();

    updateTotals();
}

function renderCart() {

    const container =
        document.getElementById("cartItems");

    if (!container) {
        return;
    }

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add some fresh products to continue.
                </p>

            </div>
        `;

        return;
    }

    container.innerHTML =
        cart.map(
            (item, index) => `

            <div class="cart-item">

                <img
                    class="cart-product-image"
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ₹${item.price} / kg
                    </p>

                </div>

                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </div>

                <strong class="cart-item-price">
                    ₹${item.price * item.quantity}
                </strong>

                <button
                    class="remove-item"
                    onclick="removeFromCart(${index})"
                >
                    🗑
                </button>

            </div>

        `
        ).join("");
}

function changeQuantity(index, amount) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {

        const name =
            cart[index].name;

        cart.splice(index, 1);

        showToast(
            "🗑 " + name + " removed"
        );
    }

    saveCart();

    updateCart();
}

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    const name =
        cart[index].name;

    cart.splice(index, 1);

    saveCart();

    updateCart();

    showToast(
        "🗑 " + name + " removed from cart"
    );
}

function getTotal() {

    return cart.reduce(
        (sum, item) =>
            sum +
            item.price *
            item.quantity,
        0
    );
}

function updateTotals() {

    const total =
        getTotal();

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );

    if (cartTotal) {
        cartTotal.textContent =
            "₹" + total;
    }

    if (checkoutTotal) {
        checkoutTotal.textContent =
            "₹" + total;
    }
}

function openCart() {

    const modal =
        document.getElementById(
            "cartModal"
        );

    if (!modal) {
        return;
    }

    modal.style.display =
        "flex";

    updateCart();
}

function closeCart() {

    const modal =
        document.getElementById(
            "cartModal"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}

function openCheckout() {

    if (cart.length === 0) {

        showToast(
            "🛒 Your cart is empty"
        );

        return;
    }

    closeCart();

    const modal =
        document.getElementById(
            "checkoutModal"
        );

    if (modal) {

        modal.style.display =
            "flex";

        updateTotals();

        changePayment();
    }
}

function closeCheckout() {

    const modal =
        document.getElementById(
            "checkoutModal"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}

function changePayment() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    const details =
        document.getElementById(
            "paymentDetails"
        );

    if (!details || !selected) {
        return;
    }

    const payment =
        selected.value;

    if (payment === "UPI") {

        details.innerHTML = `

            <div class="payment-details-box">

                <h4>📱 UPI Payment</h4>

                <p>
                    Enter your UPI ID to continue.
                </p>

                <input
                    type="text"
                    id="upiId"
                    placeholder="example@upi"
                    autocomplete="off"
                >

                <small>
                    Example: name@oksbi
                </small>

            </div>
        `;

    } else if (
        payment ===
        "Credit / Debit Card"
    ) {

        details.innerHTML = `

            <div class="payment-details-box">

                <h4>💳 Card Payment</h4>

                <input
                    type="text"
                    id="cardNumber"
                    placeholder="Card Number"
                    maxlength="19"
                    inputmode="numeric"
                >

                <div class="card-row">

                    <input
                        type="text"
                        id="cardExpiry"
                        placeholder="MM/YY"
                        maxlength="5"
                        inputmode="numeric"
                    >

                    <input
                        type="password"
                        id="cardCVV"
                        placeholder="CVV"
                        maxlength="3"
                        inputmode="numeric"
                    >

                </div>

                <input
                    type="text"
                    id="cardName"
                    placeholder="Cardholder Name"
                >

            </div>
        `;

        setupCardInputs();

    } else {

        details.innerHTML = `

            <div class="payment-details-box">

                <h4>💵 Cash on Delivery</h4>

                <p>
                    Pay when your fresh groceries
                    arrive at your doorstep.
                </p>

                <div class="cod-note">
                    ✓ No advance payment required
                </div>

            </div>
        `;
    }
}

function setupCardInputs() {

    const number =
        document.getElementById(
            "cardNumber"
        );

    if (number) {

        number.addEventListener(
            "input",
            function() {

                let value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 16);

                value =
                    value
                        .match(/.{1,4}/g)
                        ?.join(" ") || "";

                this.value =
                    value;
            }
        );
    }

    const expiry =
        document.getElementById(
            "cardExpiry"
        );

    if (expiry) {

        expiry.addEventListener(
            "input",
            function() {

                let value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 4);

                if (value.length > 2) {

                    value =
                        value.substring(0, 2)
                        + "/" +
                        value.substring(2);
                }

                this.value =
                    value;
            }
        );
    }
}

function validatePayment() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    if (!selected) {

        showToast(
            "💳 Select a payment method"
        );

        return false;
    }

    if (selected.value === "UPI") {

        const upi =
            document.getElementById(
                "upiId"
            );

        if (
            !upi ||
            !upi.value.trim()
        ) {

            showToast(
                "📱 Enter your UPI ID"
            );

            return false;
        }

        const pattern =
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

        if (
            !pattern.test(
                upi.value.trim()
            )
        ) {

            showToast(
                "❌ Enter a valid UPI ID"
            );

            return false;
        }
    }

    if (
        selected.value ===
        "Credit / Debit Card"
    ) {

        const number =
            document.getElementById(
                "cardNumber"
            );

        const expiry =
            document.getElementById(
                "cardExpiry"
            );

        const cvv =
            document.getElementById(
                "cardCVV"
            );

        const name =
            document.getElementById(
                "cardName"
            );

        if (
            !number ||
            !expiry ||
            !cvv ||
            !name
        ) {

            showToast(
                "💳 Complete your card details"
            );

            return false;
        }

        const digits =
            number.value
                .replace(/\D/g, "");

        if (digits.length !== 16) {

            showToast(
                "❌ Card number must have 16 digits"
            );

            return false;
        }

        if (
            !/^\d{2}\/\d{2}$/.test(
                expiry.value
            )
        ) {

            showToast(
                "❌ Enter expiry as MM/YY"
            );

            return false;
        }

        if (
            !/^\d{3}$/.test(
                cvv.value
            )
        ) {

            showToast(
                "❌ CVV must have 3 digits"
            );

            return false;
        }

        if (!name.value.trim()) {

            showToast(
                "👤 Enter cardholder name"
            );

            return false;
        }
    }

    return true;
}

function placeOrder() {

    if (cart.length === 0) {

        showToast(
            "🛒 Your cart is empty"
        );

        return;
    }

    const customer =
        document.getElementById(
            "customerName"
        );

    const address =
        document.getElementById(
            "address"
        );

    if (
        !customer ||
        !customer.value.trim()
    ) {

        showToast(
            "👤 Enter your full name"
        );

        customer?.focus();

        return;
    }

    if (
        !address ||
        !address.value.trim()
    ) {

        showToast(
            "📍 Enter your delivery address"
        );

        address?.focus();

        return;
    }

    if (!validatePayment()) {
        return;
    }

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;

    const total =
        getTotal();

    processPayment(
        payment,
        customer.value.trim(),
        address.value.trim(),
        total
    );
}

function processPayment(
    payment,
    customer,
    address,
    total
) {

    const button =
        document.getElementById(
            "placeOrderButton"
        );

    if (button) {

        button.disabled = true;

        button.innerHTML = `
            <span class="payment-spinner"></span>
            Processing Payment...
        `;
    }

    setTimeout(
        function() {

            if (button) {

                button.innerHTML =
                    "✓ Payment Verified";
            }

            setTimeout(
                function() {

                    completeOrder(
                        payment,
                        customer,
                        address,
                        total
                    );

                },
                700
            );

        },
        1600
    );
}

function completeOrder(
    payment,
    customer,
    address,
    total
) {

    const orderId =
        "FC" +
        Date.now()
            .toString()
            .slice(-10) +
        Math.floor(
            Math.random() * 900 + 100
        );

    const order = {

        id: orderId,

        customer: customer,

        address: address,

        payment: payment,

        total: total,

        items:
            JSON.parse(
                JSON.stringify(cart)
            ),

        status:
            "Order Placed",

        date:
            new Date().toLocaleString(
                "en-IN"
            )
    };

    let orders =
        JSON.parse(
            localStorage.getItem(
                "freshCartOrders"
            ) || "[]"
        );

    orders.push(order);

    localStorage.setItem(
        "freshCartOrders",
        JSON.stringify(orders)
    );

    localStorage.setItem(
        "freshCartLastOrder",
        JSON.stringify(order)
    );

    cart = [];

    saveCart();

    updateCart();

    closeCheckout();

    showSuccessPage(order);
}

function showSuccessPage(order) {

    const page =
        document.getElementById(
            "successPage"
        );

    if (!page) {
        return;
    }

    const date =
        new Date(order.date);

    const formattedDate =
        date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    page.innerHTML = `

        <div class="success-overlay">

            <div class="success-card">

                <button
                    class="success-close"
                    onclick="closeSuccessPage()"
                >
                    ×
                </button>

                <div class="success-circle">
                    ✓
                </div>

                <div class="success-badge">
                    🌿 FreshCart
                </div>

                <h1>
                    Order Placed Successfully!
                </h1>

                <p class="success-title">
                    Freshness is coming your way 🎉
                </p>

                <p class="success-message">
                    Thank you,
                    <strong>${order.customer}</strong>!
                    <br>
                    Your order has been confirmed.
                </p>

                <div class="order-status">

                    <div class="status-line"></div>

                    <div class="status-item active">
                        <div class="status-icon">✓</div>
                        Confirmed
                    </div>

                    <div class="status-item">
                        <div class="status-icon">📦</div>
                        Preparing
                    </div>

                    <div class="status-item">
                        <div class="status-icon">🛵</div>
                        On the Way
                    </div>

                    <div class="status-item">
                        <div class="status-icon">🏠</div>
                        Delivered
                    </div>

                </div>

                <div class="order-details">

                    <div class="detail-box">
                        <span>🧾</span>
                        <small>Order ID</small>
                        <strong>
                            ${order.id}
                        </strong>
                    </div>

                    <div class="detail-box">
                        <span>📅</span>
                        <small>Order Date</small>
                        <strong>
                            ${formattedDate}
                        </strong>
                    </div>

                    <div class="detail-box">
                        <span>💰</span>
                        <small>Total</small>
                        <strong>
                            ₹${order.total}
                        </strong>
                    </div>

                </div>

                <div class="delivery-box">

                    <div class="delivery-icon">
                        🛵
                    </div>

                    <div>
                        <strong>
                            Estimated Delivery
                        </strong>

                        <p>
                            Today • Within 30–45 minutes
                        </p>
                    </div>

                </div>

                <div class="payment-success">

                    🔒 Payment:
                    <strong>
                        ${order.payment}
                    </strong>

                    <span class="paid-badge">
                        CONFIRMED
                    </span>

                </div>

                <button
                    class="checkout-button"
                    onclick="continueShopping()"
                >
                    Continue Shopping →
                </button>

                <button
                    class="view-orders"
                    onclick="openOrders()"
                >
                    📦 View My Orders
                </button>

                <div class="success-footer">

                    <span>🥬 Fresh Quality</span>
                    <span>🚚 Fast Delivery</span>
                    <span>🔒 Secure Checkout</span>

                </div>

            </div>

        </div>
    `;

    page.style.display =
        "block";

    document.body.style.overflow =
        "hidden";
}

function closeSuccessPage() {

    const page =
        document.getElementById(
            "successPage"
        );

    if (page) {
        page.style.display =
            "none";
    }

    document.body.style.overflow =
        "auto";
}

function continueShopping() {

    closeSuccessPage();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    showToast(
        "🥬 Happy shopping with FreshCart!"
    );
}

function openOrders() {

    closeSuccessPage();

    const modal =
        document.getElementById(
            "ordersModal"
        );

    if (modal) {

        modal.style.display =
            "flex";

        renderOrders();
    }
}

function closeOrders() {

    const modal =
        document.getElementById(
            "ordersModal"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}

function renderOrders() {

    const container =
        document.getElementById(
            "ordersList"
        );

    if (!container) {
        return;
    }

    const orders =
        JSON.parse(
            localStorage.getItem(
                "freshCartOrders"
            ) || "[]"
        );

    if (orders.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    📦
                </div>

                <h3>
                    No orders yet
                </h3>

                <p>
                    Your completed orders
                    will appear here.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        orders
            .slice()
            .reverse()
            .map(
                order => `

                <div class="order-history-item">

                    <div class="order-history-top">

                        <div>

                            <h3>
                                ${order.id}
                            </h3>

                            <p>
                                ${order.date}
                            </p>

                        </div>

                        <span
                            class="order-status-badge"
                        >
                            ✓ ${order.status}
                        </span>

                    </div>

                    <p>
                        💳 ${order.payment}
                    </p>

                    <p>
                        💰 Total:
                        <strong>
                            ₹${order.total}
                        </strong>
                    </p>

                </div>
            `
            )
            .join("");
}

function showToast(message) {

    const old =
        document.querySelector(
            ".cart-toast"
        );

    if (old) {
        old.remove();
    }

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        "cart-toast";

    toast.textContent =
        message;

    document.body.appendChild(
        toast
    );

    setTimeout(
        () => {
            toast.classList.add(
                "show"
            );
        },
        50
    );

    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

            setTimeout(
                () => toast.remove(),
                300
            );

        },
        2200
    );
}

window.addEventListener(
    "click",
    function(event) {

        const cartModal =
            document.getElementById(
                "cartModal"
            );

        const checkoutModal =
            document.getElementById(
                "checkoutModal"
            );

        const ordersModal =
            document.getElementById(
                "ordersModal"
            );

        if (
            event.target ===
            cartModal
        ) {
            closeCart();
        }

        if (
            event.target ===
            checkoutModal
        ) {
            closeCheckout();
        }

        if (
            event.target ===
            ordersModal
        ) {
            closeOrders();
        }
    }
);

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeCart();

            closeCheckout();

            closeOrders();

            closeSuccessPage();
        }
    }
);