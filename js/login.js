import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
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

// Khởi tạo admin trong Firebase khi cần
function initializeAdminAccount() {
    const adminRef = ref(db, 'admin');
    get(adminRef).then((snapshot) => {
        if (!snapshot.exists()) {
            // Nếu chưa có tài khoản admin, tạo tài khoản mặc định
            set(ref(db, 'admin'), {
                username: "admin",
                password: "admin123",
                adminId: "AD123456",
                sessions: {}
            }).then(() => {
                console.log("Tài khoản admin được khởi tạo");
            });
        }
    });
}

// Thực hiện khởi tạo admin khi trang được tải
initializeAdminAccount();

// Kiểm tra trạng thái đăng nhập hiện tại từ Firebase
function checkLoginStatus() {
    const sessionId = localStorage.getItem("sessionId");
    const userId = localStorage.getItem("currentUserId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    
    if (sessionId && userId) {
        // Xác định path để kiểm tra phiên đăng nhập
        const sessionPath = isAdmin ? 
            `admin/sessions/${sessionId}` : 
            `users/${userId}/sessions/${sessionId}`;
        
        const sessionRef = ref(db, sessionPath);
        
        get(sessionRef).then((snapshot) => {
            if (snapshot.exists()) {
                const sessionData = snapshot.val();
                
                // Kiểm tra phiên có hợp lệ và chưa hết hạn
                const now = new Date().getTime();
                const expirationTime = sessionData.expiresAt;
                
                if (expirationTime > now) {
                    // Phiên hợp lệ, cập nhật thời gian hoạt động
                    update(ref(db, sessionPath), {
                        lastActive: serverTimestamp()
                    });
                    
                    console.log("Phiên đăng nhập hợp lệ");
                    
                    // Nếu đã đăng nhập rồi và đang ở trang login, chuyển đến trang chính
                    if (window.location.href.includes("login.html")) {
                        window.location.href = isAdmin ? "../html/admin.html" : "../index.html";
                    }
                } else {
                    // Phiên đã hết hạn
                    logout();
                }
            } else {
                // Phiên không tồn tại
                logout();
            }
        }).catch((error) => {
            console.error("Lỗi kiểm tra phiên đăng nhập:", error);
            logout();
        });
    }
}

// Đăng xuất
function logout() {
    const sessionId = localStorage.getItem("sessionId");
    const userId = localStorage.getItem("currentUserId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    
    if (sessionId && userId) {
        // Xóa phiên khỏi Firebase
        const sessionPath = isAdmin ? 
            `admin/sessions/${sessionId}` : 
            `users/${userId}/sessions/${sessionId}`;
        
        set(ref(db, sessionPath), null)
            .then(() => {
                console.log("Đã xóa phiên đăng nhập");
            })
            .catch((error) => {
                console.error("Lỗi xóa phiên:", error);
            });
    }
    
    // Xóa thông tin từ localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("sessionId");
}

// Lưu phiên đăng nhập mới
function saveLoginSession(userId, isAdmin, expireHours = 24) {
    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = now.getTime() + (expireHours * 60 * 60 * 1000); // Tính thời gian hết hạn
    
    const sessionData = {
        deviceInfo: navigator.userAgent,
        loginTime: serverTimestamp(),
        lastActive: serverTimestamp(),
        expiresAt: expiresAt,
        ip: "unknown" // Trong thực tế bạn sẽ cần server để lấy IP người dùng
    };
    
    // Lưu thông tin phiên vào Firebase
    const sessionPath = isAdmin ? 
        `admin/sessions/${sessionId}` : 
        `users/${userId}/sessions/${sessionId}`;
    
    return set(ref(db, sessionPath), sessionData)
        .then(() => {
            // Lưu ID phiên vào localStorage
            localStorage.setItem("sessionId", sessionId);
            console.log("Đã lưu phiên đăng nhập mới");
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
            window.location.href = redirectUrl || "../index.html";
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
            showNotification("Tên người dùng và mật khẩu đã được sử dụng!", "error");
            return;
        }

        const nextId = snapshot.exists() ? Math.max(...Object.values(users).map(u => u.id || 0)) + 1 : 1;

        set(ref(db, 'users/' + username), {
            id: nextId,
            password: password,
            createdAt: serverTimestamp(),
            sessions: {}
        }).then(() => {
            // Tự động đăng nhập sau khi đăng ký
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("isAdmin", "false");
            localStorage.setItem("currentUser", username);
            localStorage.setItem("currentUserId", username);
            
            // Lưu phiên đăng nhập vào Firebase
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

// Đăng nhập
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
                            showNotification("Đăng nhập Admin thành công!", "success", true, "../admin/dashboard.html");
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

            // Lưu hoặc cập nhật thông tin người dùng
            set(ref(db, 'googleUsers/' + user.uid), userData)
                .then(() => {
                    // Lưu thông tin người dùng vào localStorage
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("isAdmin", "false");
                    localStorage.setItem("currentUser", user.email);
                    localStorage.setItem("currentUserId", user.uid);

                    // Lưu phiên đăng nhập vào Firebase
                    saveLoginSession(user.uid, false).then(() => {
                        showNotification("Đăng nhập Google thành công!", "success");

                        // Chuyển hướng 
                        setTimeout(() => {
                            if (document.referrer && !document.referrer.includes("login.html")) {
                                window.location.href = document.referrer;
                            } else {
                                window.location.href = "../index.html";
                            }
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
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;

            const userData = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                lastLogin: serverTimestamp()
            };

            set(ref(db, 'facebookUsers/' + user.uid), userData)
                .then(() => {
                    // Lưu thông tin người dùng vào localStorage
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("isAdmin", "false");
                    localStorage.setItem("currentUser", user.email);
                    localStorage.setItem("currentUserId", user.uid);

                    // Lưu phiên đăng nhập vào Firebase
                    saveLoginSession(user.uid, false).then(() => {
                        showNotification("Đăng nhập Facebook thành công!", "success");

                        // Chuyển hướng
                        setTimeout(() => {
                            if (document.referrer && !document.referrer.includes("login.html")) {
                                window.location.href = document.referrer;
                            } else {
                                window.location.href = "../index.html";
                            }
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
window.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // Thêm nút đăng xuất nếu cần
    if (!document.getElementById('logout-btn') && localStorage.getItem("isLoggedIn") === "true") {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.textContent = 'Đăng xuất';
        logoutBtn.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;';
        
        logoutBtn.addEventListener('click', function() {
            logout();
            showNotification("Đã đăng xuất thành công!", "success");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
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