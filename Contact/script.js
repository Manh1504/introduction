// Lấy nút chuyển đổi theme
const themeToggle = document.querySelector('.theme-toggle');

// Kiểm tra theme đã lưu trong localStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
}

// Bắt sự kiện click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    // Lưu vào localStorage
    const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
});