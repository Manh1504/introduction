import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCn9oE0KbfTnp5JD8VhuXW-y78xUFH-iRg",
    authDomain: "bai-tap-html.firebaseapp.com",
    databaseURL: "https://bai-tap-html-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bai-tap-html",
    storageBucket: "bai-tap-html.appspot.com",
    messagingSenderId: "1825688805",
    appId: "1:1825688805:web:0fea5be7f1db7f0339580c",
    measurementId: "G-0QC28N9X9M"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Gắn sự kiện cho nút CHECK OUT sau khi DOM load
document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.querySelector(".checkOut");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", handleCheckout);
    } else {
        console.log("❌ Không tìm thấy nút CHECK OUT");
    }

    // Hiển thị giỏ hàng nếu có
    const cartDisplay = document.getElementById("cartDisplay");
    const userCartKey = 'user_cart_' + localStorage.getItem("currentUser");
    const savedCart = localStorage.getItem(userCartKey);
    const cart = savedCart ? JSON.parse(savedCart) : [];

    if (cartDisplay) {
        cartDisplay.innerHTML = ''; // Clear old cart
        if (cart.length === 0) {
            cartDisplay.innerHTML = '<p>Giỏ hàng của bạn trống!</p>';
        } else {
            cart.forEach(item => {
                cartDisplay.innerHTML += `
                    <div class="cart-item">
                        <p>${item.name} - ${item.quantity} x ${item.price}</p>
                    </div>
                `;
            });
        }
    }
});

// Hàm xử lý thanh toán
const handleCheckout = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = localStorage.getItem("currentUser");

    if (!isLoggedIn || !currentUser) {
        alert("Vui lòng đăng nhập để thanh toán.");
        window.location.href = "../html/login.html";
        return;
    }

    const userCartKey = 'user_cart_' + currentUser;
    const savedCart = localStorage.getItem(userCartKey);
    const cart = savedCart ? JSON.parse(savedCart) : [];

    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }

    try {
        const response = await fetch('products.json'); // Sử dụng file JSON chứa sản phẩm
        const products = await response.json();

        const orderDetails = cart.map(item => {
            const product = products.find(p => p.id == item.product_id); // Tìm sản phẩm theo ID
            return {
                product_id: item.product_id,
                name: product?.name || 'Unknown',
                price: product?.price || 0,
                quantity: item.quantity
            };
        });

        const newOrder = {
            orderId: Date.now(),
            user: currentUser,
            items: orderDetails,
            date: new Date().toLocaleString()
        };

        // Lưu đơn hàng lên Firebase
        const userOrdersRef = ref(db, 'orders/' + currentUser);
        const newOrderRef = push(userOrdersRef);
        await set(newOrderRef, newOrder);

        // Lưu đơn hàng vào localStorage
        const userOrdersKey = 'user_orders_' + currentUser;
        const savedOrders = localStorage.getItem(userOrdersKey);
        const orders = savedOrders ? JSON.parse(savedOrders) : [];

        orders.push(newOrder);
        localStorage.setItem(userOrdersKey, JSON.stringify(orders));

        // Xóa giỏ hàng trong localStorage
        localStorage.removeItem(userCartKey);

        alert('Thanh toán thành công!');
        location.reload();

    } catch (error) {
        console.error('Lỗi khi thanh toán:', error);
        alert('Đã xảy ra lỗi khi thanh toán.');
    }
};
