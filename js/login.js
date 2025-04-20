import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get, update, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Tạo ID phiên duy nhất
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const sessionId = localStorage.getItem("sessionId");
    const userId = localStorage.getItem("currentUserId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (sessionId && userId) {
        const sessionPath = isAdmin ? `admin/sessions/${sessionId}` : `users/${userId}/sessions/${sessionId}`;
        const sessionRef = ref(db, sessionPath);

        get(sessionRef).then((snapshot) => {
            if (snapshot.exists()) {
                const sessionData = snapshot.val();
                const now = new Date().getTime();
                const expirationTime = sessionData.expiresAt;

                if (expirationTime > now) {
                    update(ref(db, sessionPath), { lastActive: serverTimestamp() });
                    console.log("Phiên đăng nhập hợp lệ");

                    // Kiểm tra nếu không phải trang đăng nhập và signup thì mới chuyển hướng
                    if ((window.location.href.includes("login.html") || window.location.href.includes("signup.html"))) {
                        return; // Đừng thực hiện điều hướng nếu đã ở trang login hoặc signup
                    }

                    if (isAdmin) {
                        window.location.href = "../html/admin.html";
                    } else {
                        window.location.href = "../index-background.html";
                    }
                } else {
                    logout();  // Nếu phiên hết hạn, đăng xuất
                }
            } else {
                logout();  // Nếu session không tồn tại, đăng xuất
            }
        }).catch(() => {
            logout();  // Nếu có lỗi trong việc lấy session, đăng xuất
        });
    }
}

// Đăng xuất
function logout() {
    const sessionId = localStorage.getItem("sessionId");
    const userId = localStorage.getItem("currentUserId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (sessionId && userId) {
        const sessionPath = isAdmin ? `admin/sessions/${sessionId}` : `users/${userId}/sessions/${sessionId}`;
        set(ref(db, sessionPath), null);
    }

    localStorage.clear();
    window.location.href = "../login.html"; // Điều hướng về trang đăng nhập
}

// Lưu phiên đăng nhập mới
function saveLoginSession(userId, isAdmin, expireHours = 24) {
    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = now.getTime() + (expireHours * 60 * 60 * 1000);

    const sessionData = {
        deviceInfo: navigator.userAgent,
        loginTime: serverTimestamp(),
        lastActive: serverTimestamp(),
        expiresAt: expiresAt,
        ip: "unknown"
    };

    const sessionPath = isAdmin ? `admin/sessions/${sessionId}` : `users/${userId}/sessions/${sessionId}`;

    return set(ref(db, sessionPath), sessionData)
        .then(() => {
            localStorage.setItem("sessionId", sessionId);
            return sessionId;
        });
}

function showNotification(message, type = 'success', redirect = false, redirectUrl = "") {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.className = `notification show ${type}`;
    setTimeout(() => {
        notif.classList.remove('show');
        if (redirect) {
            window.location.href = redirectUrl || "../index-background.html";
        }
    }, 2500);
}

// Đăng ký
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        showNotification("Mật khẩu không khớp!", "error");
        return;
    }

    const usersRef = ref(db, 'users');
    get(usersRef).then((snapshot) => {
        const users = snapshot.exists() ? snapshot.val() : {};
        let isDuplicate = false;
        for (const [key, value] of Object.entries(users)) {
            if (key === username && value.password === password) {
                isDuplicate = true;
                break;
            }
        }

        if (isDuplicate) {
            showNotification("Tên người dùng đã được sử dụng!", "error");
            return;
        }

        const nextId = snapshot.exists() ? Math.max(...Object.values(users).map(u => u.id || 0)) + 1 : 1;

        set(ref(db, 'users/' + username), {
            id: nextId,
            password: password,
            createdAt: serverTimestamp(),
            sessions: {}
        }).then(() => {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("isAdmin", "false");
            localStorage.setItem("currentUser", username);
            localStorage.setItem("currentUserId", username);

            saveLoginSession(username, false).then(() => {
                showNotification("Đăng ký thành công!", "success", true);
            });
        }).catch((error) => {
            showNotification("Đăng ký thất bại: " + error.message, "error");
        });
    }).catch((error) => {
        showNotification("Lỗi khi lấy thông tin người dùng: " + error.message, "error");
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa và thay đổi liên kết nếu là admin
    if (localStorage.getItem("isLoggedIn") === "true" && localStorage.getItem("isAdmin") === "true") {
        // Nếu đã đăng nhập và là admin, thay đổi liên kết Contact Us thành Admin Dashboard
        const contactLink = document.getElementById('contact-link');
        if (contactLink) {
            contactLink.textContent = "Admin Dashboard";  // Thay đổi văn bản
            contactLink.href = "../admin/admin.html";  // Thay đổi URL
        }
    }

    // Đăng nhập admin và thay đổi liên kết khi đăng nhập
    document.getElementById('login-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const adminId = document.getElementById('admin-id') ? document.getElementById('admin-id').value.trim() : "";

        if (!username || !password) {
            showNotification("Vui lòng nhập đầy đủ thông tin!", "error");
            return;
        }

        // Kiểm tra nếu là admin login
        if (username === "admin") {
            // Nếu trường admin-id chưa hiển thị, hiển thị nó
            if (!document.getElementById('admin-id')) {
                const adminIdField = document.createElement('div');
                adminIdField.className = 'input-box';
                adminIdField.innerHTML = `
                    <i class="fas fa-id-badge"></i>
                    <input type="text" id="admin-id" placeholder="Nhập ID admin" required />
                `;

                // Chèn trường ID vào trước nút đăng nhập
                const buttonBox = document.querySelector('#login-form .button.input-box');
                buttonBox.parentNode.insertBefore(adminIdField, buttonBox);

                showNotification("Vui lòng nhập ID admin", "info");
                return;
            }

            // Kiểm tra đăng nhập admin
            if (adminId) {
                const adminRef = ref(db, 'admin');
                get(adminRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const adminData = snapshot.val();
                        if (adminData.username === username &&
                            adminData.password === password &&
                            adminData.adminId === adminId) {

                            // Đăng nhập admin thành công
                            localStorage.setItem("isLoggedIn", "true");
                            localStorage.setItem("isAdmin", "true");
                            localStorage.setItem("currentUser", "admin");
                            localStorage.setItem("currentUserId", "admin");

                            // Lưu phiên đăng nhập admin vào Firebase
                            saveLoginSession("admin", true).then(() => {
                                showNotification("Đăng nhập Admin thành công!", "success", true, "../index-background.html");

                            });
                        } else {
                            showNotification("Thông tin admin không chính xác!", "error");
                        }
                    } else {
                        showNotification("Không tìm thấy tài khoản admin!", "error");
                    }
                }).catch((error) => {
                    console.error("Lỗi đăng nhập admin:", error);
                    showNotification("Đã xảy ra lỗi khi đăng nhập admin.", "error");
                });
                return;
            }
        }

        // Đăng nhập người dùng thông thường
        const userRef = ref(db, 'users/' + username);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.password === password) {
                    // Lưu thông tin đăng nhập
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("isAdmin", "false");
                    localStorage.setItem("currentUser", username);
                    localStorage.setItem("currentUserId", username);

                    // Lưu phiên đăng nhập vào Firebase
                    saveLoginSession(username, false).then(() => {
                        showNotification("Đăng nhập thành công!", "success");

                        // Chuyển hướng
                        setTimeout(() => {
                            if (document.referrer && !document.referrer.includes("login.html")) {
                                window.location.href = document.referrer;
                            } else {
                                window.location.href = "../index.html";
                            }
                        }, 1000);
                    });
                } else {
                    showNotification("Mật khẩu không chính xác!", "error");
                }
            } else {
                showNotification("Tên đăng nhập không tồn tại!", "error");
            }
        }).catch((error) => {
            console.error("Lỗi đăng nhập:", error);
            showNotification("Đã xảy ra lỗi khi đăng nhập.", "error");
        });
    });
});



// Đăng nhập Google
document.getElementById("google-login-btn").addEventListener("click", function () {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            const user = result.user;
            const userData = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                lastLogin: serverTimestamp()
            };

            set(ref(db, 'googleUsers/' + user.uid), userData)
                .then(() => {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("isAdmin", "false");
                    localStorage.setItem("currentUser", user.email);
                    localStorage.setItem("currentUserId", user.uid);

                    saveLoginSession(user.uid, false).then(() => {
                        showNotification("Đăng nhập Google thành công!", "success");
                        setTimeout(() => {
                            window.location.href = "../index-background.html";
                        }, 1000);
                    });
                })
                .catch((error) => {
                    showNotification("Lỗi khi lưu dữ liệu người dùng: " + error.message, "error");
                });
        })
        .catch((error) => {
            showNotification("Đăng nhập Google thất bại: " + error.message, "error");
        });
});

// Đăng nhập Facebook
document.getElementById("facebook-login-btn").addEventListener("click", function (event) {
    event.preventDefault();
    signInWithPopup(auth, facebookProvider)
        .then((result) => {
            const user = result.user;
            const userData = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                lastLogin: serverTimestamp()
            };

            set(ref(db, 'facebookUsers/' + user.uid), userData)
                .then(() => {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("isAdmin", "false");
                    localStorage.setItem("currentUser", user.email);
                    localStorage.setItem("currentUserId", user.uid);

                    saveLoginSession(user.uid, false).then(() => {
                        showNotification("Đăng nhập Facebook thành công!", "success");
                        setTimeout(() => {
                            window.location.href = "../index-background.html";
                        }, 1000);
                    });
                })
                .catch((error) => {
                    showNotification("Lỗi khi lưu dữ liệu người dùng: " + error.message, "error");
                });
        })
        .catch((error) => {
            showNotification("Đăng nhập Facebook thất bại: " + error.message, "error");
        });
});

// Kiểm tra trạng thái đăng nhập khi trang được tải
window.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();

    // Tránh kiểm tra nếu người dùng đã đăng nhập và đang ở trang chính
    if (localStorage.getItem("isLoggedIn") === "true" && (window.location.href.includes("login.html") || window.location.href.includes("signup.html"))) {
        return; // Không thực hiện kiểm tra nếu đã đăng nhập
    }

    if (!document.getElementById('logout-btn') && localStorage.getItem("isLoggedIn") === "true") {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.textContent = 'Đăng xuất';
        logoutBtn.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;';
        logoutBtn.addEventListener('click', function () {
            logout();
            showNotification("Đã đăng xuất thành công!", "success");
        });
        document.body.appendChild(logoutBtn);
    }
});

document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function () {
        const input = document.querySelector(this.getAttribute('toggle'));
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});