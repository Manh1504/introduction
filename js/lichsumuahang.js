import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Cấu hình Firebase
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Gọi khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
    loadPurchaseHistory();
});

// Hàm lấy lịch sử mua hàng
function loadPurchaseHistory() {
    const username = localStorage.getItem("currentUser"); // Đảm bảo đúng key
    const container = document.getElementById("order-history");

    if (!username) {
        container.innerHTML = "Không tìm thấy tên người dùng. Hãy đăng nhập trước.";
        return;
    }

    console.log("Đang tải đơn hàng cho:", username);

    const ordersRef = ref(db, `orders/${username}`);
    get(ordersRef)
        .then(snapshot => {
            if (snapshot.exists()) {
                const orderObjects = snapshot.val(); // Object đơn hàng theo key ngẫu nhiên
                const orders = Object.values(orderObjects); // Chuyển thành mảng
                console.log("Đơn hàng lấy được:", orders);
                displayOrders(orders);
            } else {
                container.innerHTML = "Bạn chưa có đơn hàng nào.";
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu từ Firebase:", error);
            container.innerHTML = "Đã xảy ra lỗi khi lấy dữ liệu.";
        });
}

// Hàm hiển thị đơn hàng
function displayOrders(orders) {
    const container = document.getElementById("order-history");
    container.innerHTML = "";

    orders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.className = "order";

        let itemsHTML = "";
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item, index) => {
                itemsHTML += `
                    <div class="item">
                        #${index + 1}: ${item.name} - ${item.quantity} x ${item.price.toLocaleString()}đ
                    </div>`;
            });
        }

        orderDiv.innerHTML = `
            <p><strong>Ngày đặt:</strong> ${order.date || "Không rõ"}</p>
            <p><strong>ID đơn hàng:</strong> ${order.orderId}</p>
            <p><strong>Người đặt:</strong> ${order.user}</p>
            <div><strong>Sản phẩm:</strong>${itemsHTML || "Không có sản phẩm nào"}</div>
        `;

        container.appendChild(orderDiv);
    });
}
