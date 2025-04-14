fetch("../html/menu.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("header-container").innerHTML = html;

        const menu = document.getElementById("menu");
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const currentUser = localStorage.getItem("currentUser");

        if (isLoggedIn === "true" && currentUser) {
            menu.innerHTML = `
                <a href="../index.html">Trang chủ</a>
                <a href="#">Người đóng góp</a>
                <a href="#">Giỏ hàng</a>
                <span>Xin chào, <strong>${currentUser}</strong></span>
                <a href="#" id="logoutBtn">Đăng xuất</a>
            `;
            document.getElementById("logoutBtn").addEventListener("click", () => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                window.location.href = "đăng nhập.html";
            });
        } else {
            menu.innerHTML = `
                <a href="../index.html">Trang chủ</a>
                <a href="#">Người đóng góp</a>
                <a href="#">Giỏ hàng</a>
                <a href="../html/đăng%20nhập.html">Đăng nhập</a>
                <a href="../html/đăng%20ký.html">Đăng ký</a>
            `;
        }
    });
