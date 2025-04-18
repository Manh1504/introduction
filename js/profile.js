
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const currentUser = localStorage.getItem("currentUser");

if (isLoggedIn && currentUser) {
    const userArea = document.getElementById("userArea");
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

    const style = document.createElement('style');
    style.textContent = `
             .account {
                position: relative;
                margin-left: 10px;
            }
            .profile {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
                cursor: pointer;
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
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                visibility: hidden;
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 999;
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
                padding: 12px 16px;
                border-bottom: 1px solid #eee;
                position: relative;
                transition: background-color 0.2s ease;
                overflow: hidden; 
            }

            .menu1 ul li a {
                text-decoration: none;
                color: #333;
                display: flex;
                align-items: center;
                transition: color 0.3s ease;
                position: relative;
                z-index: 1;
            }

            

            .menu1 ul li:hover a {
                color: crimson;
            }


            .menu1 ul li:not(:last-child)::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                height: 2px;
                width: 0;
                background-color: crimson;
                transition: width 0.3s ease;
                z-index: 0;
            }

            .menu1 ul li:not(:last-child):hover::after {
                width: 100%;
            }
            .menu1 ul li:last-child {
                border-bottom: none;
            }
        `;
    document.head.appendChild(style);

    // Đăng xuất
    document.getElementById("logoutLink").addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        location.reload();
    });

    // Mở/đóng menu khi click avatar
    const profile = document.querySelector(".profile");
    const menu = document.querySelector(".menu1");

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
