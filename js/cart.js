// Biến toàn cục
let products = [];
let cart = [];
const userCartKey = 'user_cart_' + (localStorage.getItem('currentUser') || 'guest');

// Khởi tạo ứng dụng
const initApp = () => {
    // 1. Load danh sách khóa học
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            
            // 2. Load giỏ hàng từ localStorage
            const savedCart = localStorage.getItem(userCartKey);
            if(savedCart) {
                cart = JSON.parse(savedCart);
                updateCartUI();
            }
            
            // 3. Gắn sự kiện cho nút thêm vào giỏ hàng
            document.querySelectorAll('.addCart').forEach(button => {
                button.addEventListener('click', function() {
                    const courseTitle = this.closest('.course-card').querySelector('h3').textContent.trim();
                    const product = products.find(p => p.name === courseTitle);
                    
                    if(product) {
                        addToCart(product.id);
                    } else {
                        console.error('Không tìm thấy khóa học:', courseTitle);
                    }
                });
            });
        })
        .catch(error => console.error('Lỗi khi tải danh sách khóa học:', error));
};

// Thêm vào giỏ hàng (mỗi khóa học chỉ 1 lần)
const addToCart = (product_id) => {
    // Kiểm tra nếu khóa học đã có trong giỏ
    if(cart.some(item => item.product_id === product_id)) {
        alert('Bạn đã thêm khóa học này vào giỏ rồi!');
        return;
    }
    
    // Thêm khóa học mới
    cart.push({
        product_id: product_id,
        quantity: 1
    });
    
    saveCart();
    updateCartUI();
    alert('Đã thêm khóa học vào giỏ hàng!');
};

// Xóa khóa học cụ thể
const removeFromCart = (product_id) => {
    cart = cart.filter(item => item.product_id !== product_id);
    saveCart();
    updateCartUI();
};

// Lưu giỏ hàng
const saveCart = () => {
    localStorage.setItem(userCartKey, JSON.stringify(cart));
};

// Cập nhật giao diện giỏ hàng
const updateCartUI = () => {
    const cartTab = document.querySelector('.listCart');
    cartTab.innerHTML = '';
    
    cart.forEach(item => {
        const product = products.find(p => p.id == item.product_id);
        if(product) {
            const cartItem = document.createElement('div');
            cartItem.className = 'item';
            cartItem.dataset.id = product.id;
            cartItem.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="name">${product.name}</div>
                <div class="price">${product.price.toLocaleString()}đ</div>
                <button class="remove-btn">Xóa</button>
            `;
            cartTab.appendChild(cartItem);
            
            // Gắn sự kiện xóa
            cartItem.querySelector('.remove-btn').addEventListener('click', () => {
                removeFromCart(product.id);
            });
        }
    });
    
    // Cập nhật số lượng trên icon giỏ hàng
    document.querySelector('.icon-cart span').textContent = cart.length;
};

// Sự kiện mở/đóng giỏ hàng
document.querySelector('.icon-cart').addEventListener('click', () => {
    document.body.classList.toggle('showCart');
});

document.querySelector('.close').addEventListener('click', () => {
    document.body.classList.toggle('showCart');
});

// Khởi chạy ứng dụng
initApp();