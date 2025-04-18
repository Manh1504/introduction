
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
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


function showNotification(message, type = 'success', redirect = false) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.className = `notification show ${type}`;
    setTimeout(() => {
        notif.classList.remove('show');
        if (redirect) {
            window.location.href = "../index.html";
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
            password: password
        }).then(() => {
            localStorage.setItem("currentUser", username);
            showNotification("Đăng ký thành công!", "success", true);
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

    if (!username || !password) {
        showNotification("Vui lòng nhập đầy đủ thông tin!", "error");
        return;
    }

    const userRef = ref(db, 'users/' + username);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.password === password) {
                // Lưu thông tin đăng nhập
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUser", username);
                localStorage.setItem("currentUserId", userData.id);

                showNotification("Đăng nhập thành công!", "success");

                // Chuyển hướng
                setTimeout(() => {
                    if (document.referrer) {
                        window.location.href = document.referrer;
                    } else {
                        window.location.href = "../index.html";
                    }
                }, 1000);
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
                uid: user.uid
            };

            set(ref(db, 'googleUsers/' + user.uid), userData)
                .then(() => {
                    // Lưu thông tin người dùng vào localStorage
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("currentUser", user.email);
                    localStorage.setItem("currentUserId", user.uid);

                    showNotification("Đăng nhập Google thành công!", "success");

                    // Chuyển hướng 
                    setTimeout(() => {
                        if (document.referrer) {
                            window.location.href = document.referrer;
                        } else {
                            window.location.href = "../index.html";
                        }
                    }, 1000);
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
                uid: user.uid
            };

            set(ref(db, 'facebookUsers/' + user.uid), userData)
                .then(() => {
                    // Lưu thông tin người dùng vào localStorage
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("currentUser", user.email); // Hoặc tên người dùng tùy thuộc vào cách bạn lưu trữ
                    localStorage.setItem("currentUserId", user.uid);

                    showNotification("Đăng nhập Facebook thành công!", "success");

                    // Chuyển hướng như khi đăng nhập thành công
                    setTimeout(() => {
                        if (document.referrer) {
                            window.location.href = document.referrer;
                        } else {
                            window.location.href = "../index.html";
                        }
                    }, 1000);
                })
                .catch((error) => {
                    showNotification("Lỗi khi lưu dữ liệu người dùng: " + error.message, "error");
                });

        })
        .catch((error) => {
            showNotification("Đăng nhập Facebook thất bại: " + error.message, "error");
        });
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
