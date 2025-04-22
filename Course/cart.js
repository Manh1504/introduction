// Biến toàn cục
let products = [];
let cart = [];
const userCartKey = 'user_cart'; // Key cố định để lưu giỏ hàng

// Khởi tạo ứng dụng
const initApp = () => {
    // 1. Load danh sách khóa học
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            
            // 2. Load giỏ hàng từ localStorage
            loadCart();
            
            // 3. Gắn sự kiện cho nút thêm vào giỏ hàng
            document.querySelectorAll('.addCart').forEach(button => {
                button.addEventListener('click', function() {
                    const card = this.closest('.card');
                    const courseTitle = card.querySelector('.title .name').textContent.trim();
                    const coursePrice = parseFloat(card.querySelector('.price').textContent.replace(/\.|đ/g, '').trim());
                    const courseImage = card.querySelector('.item img').src;
                    
                    const productId = courseTitle.toLowerCase().replace(/\s+/g, '-');
                    
                    let product = products.find(p => p.id === productId);
                    if(!product) {
                        product = {
                            id: productId,
                            name: courseTitle,
                            image: courseImage,
                            price: coursePrice
                        };
                        products.push(product);
                    }
                    
                    addToCart(product.id);
                });
            });
        })
        .catch(error => console.error('Lỗi khi tải danh sách khóa học:', error));
};

// Hàm load giỏ hàng từ localStorage
const loadCart = () => {
    const savedCart = localStorage.getItem(userCartKey);
    if(savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
};

// Thêm vào giỏ hàng
const addToCart = (product_id) => {
    if(cart.some(item => item.product_id === product_id)) {
        alert('Bạn đã thêm khóa học này vào giỏ rồi!');
        return;
    }
    
    const product = products.find(p => p.id === product_id);
    if(product) {
        cart.push({
            product_id: product_id,
            quantity: 1,
            added_at: new Date().getTime() // Thêm timestamp
        });
        
        saveCart();
        updateCartUI();
        alert('Đã thêm khóa học vào giỏ hàng!');
    }
};

// Lưu giỏ hàng vào localStorage
const saveCart = () => {
    localStorage.setItem(userCartKey, JSON.stringify(cart));
};

// Cập nhật giao diện giỏ hàng
const updateCartUI = () => {
    const cartTab = document.querySelector('.listCart');
    if(!cartTab) return;
    
    cartTab.innerHTML = cart.length === 0 ? '<p>Giỏ hàng trống</p>' : '';
    
    // Sắp xếp giỏ hàng theo thời gian thêm mới nhất
    cart.sort((a, b) => b.added_at - a.added_at);
    
    cart.forEach(item => {
        const product = products.find(p => p.id == item.product_id);
        if(product) {
            const cartItem = document.createElement('div');
            cartItem.className = 'item';
            cartItem.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="name">${product.name}</div>
                <div class="price">${product.price.toLocaleString('vi-VN')}đ</div>
                <button class="remove-btn">Xóa</button>
            `;
            cartTab.appendChild(cartItem);
            
            cartItem.querySelector('.remove-btn').addEventListener('click', () => {
                removeFromCart(product.id);
            });
        }
    });
    
    updateCartCount();
};

// Cập nhật số lượng trên icon giỏ hàng
const updateCartCount = () => {
    const cartCount = document.querySelector('.icon-cart span');
    if(cartCount) cartCount.textContent = cart.length;
};

// Xóa khóa học
const removeFromCart = (product_id) => {
    cart = cart.filter(item => item.product_id !== product_id);
    saveCart();
    updateCartUI();
};

// Khởi chạy khi trang tải xong
document.addEventListener('DOMContentLoaded', initApp);
// ===== SỰ KIỆN GIỎ HÀNG =====
// Mở giỏ hàng khi click icon
document.querySelector('.icon-cart').addEventListener('click', () => {
    document.body.classList.add('showCart');
});

// Đóng giỏ hàng khi click nút đóng
document.querySelector('.cartTab .close').addEventListener('click', () => {
    document.body.classList.remove('showCart');
});

// Đóng khi click bên ngoài giỏ hàng
document.addEventListener('click', (e) => {
    if (!e.target.closest('.cartTab') && 
        !e.target.closest('.icon-cart') &&
        document.body.classList.contains('showCart')) {
        document.body.classList.remove('showCart');
    }
});