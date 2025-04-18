document.addEventListener('DOMContentLoaded', function() {
    // Toggle chế độ sáng/tối
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Kiểm tra localStorage để lấy trạng thái theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        
        // Đảm bảo mục Course giữ màu tím
        const courseLink = document.querySelector('.nav-bar a[href="Course.html"]');
        if (courseLink) {
            courseLink.style.color = '#AF4A92';
        }
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');
        
        // Đảm bảo mục Course giữ màu tím
        const courseLink = document.querySelector('.nav-bar a[href="Course.html"]');
        if (courseLink) {
            courseLink.style.color = body.classList.contains('light-mode') ? '#AF4A92' : '';
        }
        
        // Lưu trạng thái vào localStorage
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-button");
    const courseCards = document.querySelectorAll(".courses-row .card");

    // Hiển thị tất cả các khóa học khi không có bộ lọc
    function showAllCourses() {
        courseCards.forEach(card => card.style.display = "block");
    }

    // Lọc các khóa học theo từ khóa
    function filterCourses() {
        const keyword = searchInput.value.trim().toLowerCase();

        if (keyword === "") {
            showAllCourses(); // Nếu không có từ khóa, hiển thị tất cả khóa học
            return;
        }

        courseCards.forEach(card => {
            const courseName = card.querySelector(".title .name").textContent.toLowerCase();
            card.style.display = courseName.includes(keyword) ? "block" : "none"; // Hiển thị khóa học nếu có tên chứa từ khóa
        });
    }

    // Lắng nghe sự kiện nhấn nút tìm kiếm
    searchBtn.addEventListener("click", filterCourses);

    // Nếu người dùng nhập vào ô tìm kiếm, tự động hiển thị lại tất cả khi xóa hết
    searchInput.addEventListener("input", () => {
        if (searchInput.value.trim() === "") {
            showAllCourses(); // Hiển thị lại tất cả nếu ô tìm kiếm rỗng
        }
    });

    // Xem thêm khoá học
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const hiddenCourses = document.querySelector('.hidden-courses');
    
    if (viewMoreBtn && hiddenCourses) {
        viewMoreBtn.addEventListener('click', function() {
            hiddenCourses.style.display = hiddenCourses.style.display === 'grid' ? 'none' : 'grid';
            this.textContent = hiddenCourses.style.display === 'grid' ? 'Thu gọn' : 'Xem thêm khoá học';
        });
    }
    
    // Hiệu ứng hover cho thẻ khoá học
    const courseCards = document.querySelectorAll('.course-card, .featured-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(255, 76, 139, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Menu mobile
    document.querySelector('.open-menu')?.addEventListener('click', function() {
        document.querySelector('.menu').classList.add('active');
    });
    
    document.querySelector('.close-menu')?.addEventListener('click', function() {
        document.querySelector('.menu').classList.remove('active');
    });
});
// Auto-play slider (thêm vào file script.js)
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    setInterval(nextSlide, 5000); // 5 giây/chuyển slide
});
// Trong file script.js
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let currentIndex = 0;

const slider = document.querySelector('.slider-container');
const slides = document.querySelectorAll('.slide');

// Touch events
slides.forEach((slide, index) => {
    // Touch events
    slide.addEventListener('touchstart', touchStart(index));
    slide.addEventListener('touchend', touchEnd);
    slide.addEventListener('touchmove', touchMove);
    
    // Mouse events
    slide.addEventListener('mousedown', touchStart(index));
    slide.addEventListener('mouseup', touchEnd);
    slide.addEventListener('mouseleave', touchEnd);
    slide.addEventListener('mousemove', touchMove);
});

// Disable context menu
window.oncontextmenu = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};

function touchStart(index) {
    return function(event) {
        currentIndex = index;
        startPos = getPositionX(event);
        isDragging = true;
        animationID = requestAnimationFrame(animation);
    };
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
}

function touchMove(event) {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)`;
}