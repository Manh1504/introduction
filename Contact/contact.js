import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

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

// Hiển thị toast
function showToast(message, type = "success") {
    const toast = document.getElementById("toast-notification");
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.classList.add("hidden");
        }, 300); // Đợi hiệu ứng biến mất rồi mới ẩn
    }, 3000);
}

// Kiểm tra đăng nhập
function checkLogin() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "../html/login.html";
        throw new Error("Chưa đăng nhập"); // Ngăn submit nếu chưa đăng nhập
    }
}

// Gửi yêu cầu chăm sóc
document.getElementById("care-request-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        checkLogin(); // Check trước

        const userId = localStorage.getItem("currentUserId");
        const requestType = document.getElementById("requestType").value;
        const description = document.getElementById("description").value;

        if (!requestType || !description) {
            showToast("Vui lòng điền đầy đủ thông tin!", "error");
            return;
        }

        // Tạo id tự động
        const contactsRef = ref(db, 'contacts');
        const snapshot = await get(contactsRef);
        let nextId = 1000;

        if (snapshot.exists()) {
            const entries = Object.values(snapshot.val());
            const ids = entries.map(item => parseInt(item.idCare?.replace("care-", "") || 0));
            const maxId = Math.max(...ids, 999);
            nextId = maxId + 1;
        }

        const newRequest = {
            idCare: `care-${nextId}`,
            userId,
            requestType,
            description,
            status: "Đang xử lý",
            timestamp: new Date().toISOString()
        };

        await set(ref(db, `contacts/${newRequest.idCare}`), newRequest);
        showToast("Gửi yêu cầu thành công!", "success");
        document.getElementById("care-request-form").reset();

    } catch (error) {
        if (error.message !== "Chưa đăng nhập") {
            console.error("Lỗi gửi yêu cầu:", error);
            showToast("Gửi yêu cầu thất bại!", "error");
        }
    }
});
