document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.querySelector('.checkOut');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
});
const handleCheckout = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = localStorage.getItem("currentUser");

    // ✅ Nếu chưa đăng nhập thì chuyển hướng sang trang login
    if (!isLoggedIn || !currentUser) {
        alert("Vui lòng đăng nhập để thanh toán.");
        window.location.href = "../html/login.html";
        return;
    }

    // ✅ Nếu đã đăng nhập thì tiếp tục thanh toán như bình thường
    const userCartKey = 'user_cart_' + currentUser;
    const savedCart = localStorage.getItem(userCartKey);
    const cart = savedCart ? JSON.parse(savedCart) : [];

    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }

    // Lấy danh sách sản phẩm
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const orderDetails = cart.map(item => {
                const product = products.find(p => p.id == item.product_id);
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

            console.log("Đơn hàng đã lưu:", newOrder); // Kiểm tra dữ liệu đơn hàng

            // Lưu đơn hàng vào localStorage
            let orders = JSON.parse(localStorage.getItem('orders_' + currentUser)) || [];
            orders.push(newOrder);
            localStorage.setItem('orders_' + currentUser, JSON.stringify(orders));

            // Xóa giỏ hàng sau khi thanh toán
            localStorage.removeItem(userCartKey);
            alert('Thanh toán thành công!');

            // Làm mới lại UI
            location.reload();
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            alert('Đã xảy ra lỗi khi thanh toán.');
        });
};
