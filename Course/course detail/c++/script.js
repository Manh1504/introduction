document.addEventListener('DOMContentLoaded', function() {
    // ===== THEME TOGGLE =====
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Kiểm tra theme từ localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    // Xử lý click toggle
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  
    // ===== STICKY SIDEBAR =====
    const rightSidebar = document.querySelector('.right-sidebar');
    const leftContent = document.querySelector('.left-content');
    const navbar = document.querySelector('nav');
    
    if (rightSidebar && leftContent && navbar) {
      const navbarHeight = navbar.offsetHeight;
      let lastScrollPosition = 0;
      
      function updateSidebarPosition() {
        const scrollPosition = window.scrollY;
        const contentHeight = leftContent.offsetHeight;
        const sidebarHeight = rightSidebar.offsetHeight;
        
        // Cập nhật vị trí sidebar
        if (scrollPosition + sidebarHeight > contentHeight + navbarHeight + 100) {
          rightSidebar.style.position = 'absolute';
          rightSidebar.style.top = `${contentHeight - sidebarHeight + 20}px`;
        } else {
          rightSidebar.style.position = 'sticky';
          rightSidebar.style.top = `${navbarHeight + 20}px`;
        }
        
        // Xử lý hiệu ứng mượt mà khi cuộn
        if (Math.abs(scrollPosition - lastScrollPosition) > 50) {
          rightSidebar.style.transition = 'transform 0.3s ease';
          rightSidebar.style.transform = scrollPosition > lastScrollPosition 
            ? 'translateY(-10px)' 
            : 'translateY(10px)';
          
          setTimeout(() => {
            rightSidebar.style.transform = '';
          }, 300);
          
          lastScrollPosition = scrollPosition;
        }
      }
      
      // Gọi hàm khi tải trang và khi scroll
      updateSidebarPosition();
      window.addEventListener('scroll', updateSidebarPosition);
      window.addEventListener('resize', updateSidebarPosition);
    }
  
    // ===== MOBILE MENU TOGGLE =====
    const openMenuBtn = document.querySelector('.open-menu');
    const closeMenuBtn = document.querySelector('.close-menu');
    const menu = document.querySelector('.menu');
    
    function toggleMenu() {
      menu.classList.toggle('active');
    }
    
    if (openMenuBtn && closeMenuBtn && menu) {
      openMenuBtn.addEventListener('click', toggleMenu);
      closeMenuBtn.addEventListener('click', toggleMenu);
      
      // Tự động đóng menu khi click bên ngoài
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !openMenuBtn.contains(e.target)) {
          menu.classList.remove('active');
        }
      });
    }
    
    // ===== HIDE MOBILE MENU ICONS ON DESKTOP =====
    function handleResponsiveMenu() {
      if (window.innerWidth > 768) {
        menu.classList.remove('active');
      }
    }
    
    window.addEventListener('resize', handleResponsiveMenu);
    handleResponsiveMenu();
  
    // ===== HOVER EFFECTS =====
    const infoCard = document.querySelector('.info-card');
    if (infoCard) {
      infoCard.addEventListener('mouseenter', () => {
        infoCard.style.transform = 'translateY(-5px)';
        infoCard.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
      });
      
      infoCard.addEventListener('mouseleave', () => {
        infoCard.style.transform = '';
        infoCard.style.boxShadow = '0 2px 10px var(--shadow-color)';
      });
    }
  });