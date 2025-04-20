document.addEventListener("DOMContentLoaded", function () {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const contactLink = document.getElementById("contact-link");

    if (contactLink) {
        if (isAdmin) {
            contactLink.href = "../admin/admin.html";
            contactLink.textContent = "Admin Dashboard";
            console.log("✅ Link đã được cập nhật cho admin.");
        } else {
            contactLink.href = "../Contact/Contact.html";
            contactLink.textContent = "Contact Us";
            console.log("👤 Đang hiển thị link người dùng thường.");
        }
    } else {
        console.warn("⚠️ Không tìm thấy phần tử contact-link.");
    }
});