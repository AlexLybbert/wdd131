const yearSpan = document.getElementById("year");
const modifiedSpan = document.getElementById("lastModified");
const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

yearSpan.textContent = new Date().getFullYear();
modifiedSpan.textContent = document.lastModified;

menuButton.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    menuButton.textContent = navMenu.classList.contains("open") ? "✖" : "☰";
});
