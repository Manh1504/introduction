
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const currentUser = localStorage.getItem("currentUser");

const userArea = document.getElementById("userArea");

if (isLoggedIn && currentUser) {
    // Nếu đã đăng nhập, thay thế phần tử #userArea với thông tin tài khoản người dùng
    userArea.innerHTML = `
        <div class="account">
            <div class="profile">
                <img src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg" alt="Avatar">
            </div>
            <div class="menu1">
                <ul>
                    <div class="container">
                        <div class="icon-cart">
                            <li><a href="#"><i class="fa-solid fa-basket-shopping"></i> Giỏ hàng</a></li>
                            <span>0</span>
                        </div>
                    </div>
                    <li><a href="#"><i class="fa-solid fa-book"></i> Lịch sử mua hàng</a></li>
                    <li><a href="../html/order.html"><i class="fa-solid fa-calendar-days"></i> Lớp của tôi</a></li>
                    <li><a href="#" id="logoutLink"><i class="fa-solid fa-right-from-bracket"></i> Thoát</a></li>
                </ul>
            </div>
        </div>
    `;
} else {

}
const style = document.createElement('style');
style.textContent = `
              .account {
        position: relative;
        margin-left: 10px;
    }
    .profile {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid #fff;
    }
    .profile img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }   
    .menu1 {
        position: absolute;
        top: 50px;
        right: 0;
        width: 220px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        visibility: hidden;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 999;
        overflow: hidden;
    }   
    .menu1.active {
        visibility: visible;
        opacity: 1;
    }
    .menu1 ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .menu1 ul li {
        padding: 0;
        border-bottom: 1px solid #fff;
        transition: background-color 0.2s ease;
    }
    .menu1 ul li a {
        text-decoration: none;
        color: #333;
        display: flex;
        align-items: center;
        padding: 12px 10px;
        transition: all 0.3s ease;
        font-size: 14px;
    }
    .menu1 ul li a i {
        margin-right: 10px;
        width: 20px;
        text-align: center;
    }
    .menu1 ul li:hover a {
        color:rgb(209, 33, 130);
    }
    .menu1 ul li:last-child {
        border-bottom: none;
    }
    .icon-cart span{
      display: flex;
      font-size: 5px;
      width: 10px;
       height: 10px;
       background-color: red;
       justify-content: center;
       align-items: center;
       color: aliceblue;
       border-radius: 50%;
       position: absolute;
       top: 13%;
       right: 180px;
       z-index: 1;
    }
    
        `;
document.head.appendChild(style);

// Đăng xuất
document.getElementById("logoutLink")?.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    location.reload();  // Tải lại trang để cập nhật trạng thái
});

// Mở/đóng menu khi click vào avatar
const profile = document.querySelector(".profile");
const menu = document.querySelector(".menu1");

if (profile) {
    profile.addEventListener("click", function (e) {
        e.stopPropagation();
        menu.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
        if (!e.target.closest(".menu1") && !e.target.closest(".profile")) {
            menu.classList.remove("active");
        }
    });
}
