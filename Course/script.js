document.addEventListener('DOMContentLoaded', () => {
    // ==== Chế độ sáng / tối ====
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Khôi phục theme từ localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        const courseLink = document.querySelector('.nav-bar a[href="Course.html"]');
        if (courseLink) courseLink.style.color = '#AF4A92';
    }

    // Toggle theme
    themeToggle?.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const courseLink = document.querySelector('.nav-bar a[href="Course.html"]');
        if (courseLink) courseLink.style.color = body.classList.contains('light-mode') ? '#AF4A92' : '';
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    // ==== Tìm kiếm khóa học ====
    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-button");
    const courseCards = document.querySelectorAll(".courses-row .card");

    function showAllCourses() {
        courseCards.forEach(card => card.style.display = "");
    }

    function filterCourses() {
        const keyword = searchInput.value.trim().toLowerCase();

        if (keyword === "") {
            showAllCourses();
            return;
        }

        courseCards.forEach(card => {
            const nameEl = card.querySelector(".title .name");
            const courseName = nameEl ? nameEl.textContent.toLowerCase() : "";
            card.style.display = courseName.includes(keyword) ? "" : "none";
        });
    }

// ✅ Chỉ lọc khi click nút tìm kiếm
    searchBtn?.addEventListener("click", filterCourses);

// ✅ Nếu xóa toàn bộ input thì hiển thị lại toàn bộ
    searchInput?.addEventListener("input", () => {
        if (searchInput.value.trim() === "") {
            showAllCourses();
        }
    });
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const hiddenCourses = document.querySelector('.hidden-courses');

    viewMoreBtn?.addEventListener('click', function () {
        const isVisible = hiddenCourses.style.display === 'grid';
        hiddenCourses.style.display = isVisible ? 'none' : 'grid';
        this.textContent = isVisible ? 'Xem thêm khoá học' : 'Thu gọn';
    });

    // ==== Hover card hiệu ứng ====
    const hoverCards = document.querySelectorAll('.course-card, .featured-card');
    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(255, 76, 139, 0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

    // ==== Menu mobile ====
    document.querySelector('.open-menu')?.addEventListener('click', () => {
        document.querySelector('.menu')?.classList.add('active');
    });

    document.querySelector('.close-menu')?.addEventListener('click', () => {
        document.querySelector('.menu')?.classList.remove('active');
    });

    // ==== Slider auto-play ====
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide]?.classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide]?.classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
    }

    // ==== Slider kéo tay ====
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentIndex = 0;

    const slider = document.querySelector('.slider-container');

    slides.forEach((slide, index) => {
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);

        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
        slide.addEventListener('mousemove', touchMove);
    });

    window.oncontextmenu = e => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    function touchStart(index) {
        return function (event) {
            currentIndex = index;
            startPos = getPositionX(event);
            isDragging = true;
            animationID = requestAnimationFrame(animation);
        };
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        prevTranslate = currentTranslate;
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        if (slider) {
            slider.style.transform = `translateX(${currentTranslate}px)`;
        }
    }
});
