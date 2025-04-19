import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

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

// Kiểm tra đăng nhập trước khi gửi yêu cầu
document.getElementById("care-request-form").addEventListener("submit", async (e) => {
    e.preventDefault();  // Dừng hành động mặc định của form

    // Kiểm tra người dùng đã đăng nhập chưa
    checkLogin();

    const userId = localStorage.getItem("currentUserId");
    const requestType = document.getElementById("requestType").value;
    const description = document.getElementById("description").value;

    // Kiểm tra nếu các trường dữ liệu còn trống
    if (!requestType || !description) {
        alert("Vui lòng điền đầy đủ thông tin yêu cầu!");
        return;
    }

    // Tạo idCare tự động
    const contactsRef = ref(db, 'contacts');
    const snapshot = await get(contactsRef);
    let nextId = 1000;

    if (snapshot.exists()) {
        const entries = Object.values(snapshot.val());
        const ids = entries.map(item => parseInt(item.idCare?.replace("care-", "") || 0));
        const maxId = Math.max(...ids, 999);
        nextId = maxId + 1;
    }

    // Tạo yêu cầu chăm sóc mới với các trường {userId, loại yêu cầu, nội dung, trạng thái}
    const newRequest = {
        userId: userId,
        requestType: requestType,
        description: description,
        status: "Đang xử lý",  // Trạng thái mặc định là "Đang xử lý"
        timestamp: new Date().toISOString(),  // Thời gian gửi yêu cầu
        idCare: `care-${nextId}`  // Tạo idCare tự động
    };

    // Lưu yêu cầu vào Firebase
    try {
        await set(ref(db, `contacts/${newRequest.idCare}`), newRequest);
        alert("Yêu cầu của bạn đã được gửi.");
        document.getElementById("care-request-form").reset();
        loadHistory();  // Tải lại lịch sử yêu cầu
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error); // In ra lỗi chi tiết trong console
        alert("Đã xảy ra lỗi khi gửi yêu cầu: " + error.message);  // Hiển thị lỗi cho người dùng
    }
});

// Kiểm tra người dùng đã đăng nhập hay chưa
function checkLogin() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        alert("Vui lòng đăng nhập để gửi yêu cầu!");
        window.location.href = "../html/login.html";  // Chuyển hướng tới trang đăng nhập
    }
}

// Lấy lịch sử yêu cầu của người dùng
function loadHistory() {
    const userId = localStorage.getItem("currentUserId");
    const historyBody = document.getElementById("history-body");
    const table = document.getElementById("history-table");
    const noMsg = document.getElementById("no-history-message");

    historyBody.innerHTML = "";
    table.style.display = "none";
    noMsg.style.display = "none";

    if (!userId) {
        noMsg.style.display = "block";
        return;
    }

    const contactsRef = ref(db, 'contacts');
    onValue(contactsRef, (snapshot) => {
        const data = snapshot.val();
        let hasData = false;
        historyBody.innerHTML = "";

        for (let key in data) {
            const entry = data[key];
            if (entry.userId === userId) {
                hasData = true;
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${entry.idCare}</td>
                    <td>${entry.requestType}</td>
                    <td>${new Date(entry.timestamp).toLocaleString()}</td>
                    <td>${entry.status}</td>
                `;
                historyBody.appendChild(tr);
            }
        }

        if (hasData) table.style.display = "table";
        else noMsg.style.display = "block";
    });
}
