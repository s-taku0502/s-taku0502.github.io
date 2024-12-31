// ハンバーガーメニューの開閉処理
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navItems = navLinks.querySelectorAll("li");
  
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
  
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
  });
  