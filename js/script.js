import { homeScript } from "./home.js";
import { sidebarScript } from "./sidebar.js";
import { productsScript } from "./products.js";

const homeLink = document.querySelector('a[href="#home"]');
export const productsLink = document.querySelector('a[href="#products"]');
const aboutLink = document.querySelector('a[href="#about"]');
const content = document.querySelector(".content");
const logo = document.querySelector(".header__logo");

// перший запуск -
homeLink.click();

// Завантаження сторінки
const navigateTo = async () => {
  try {
    const url = window.location.hash.substring(1);
    const response = await axios.get("pages/" + url + ".html");
    content.innerHTML = response.data;
    if (url === "products") {
      productsScript();
    }
    if (url === "home") {
      homeScript();
    }
  } catch (error) {
    console.error(error);
  }
};
window.addEventListener("hashchange", navigateTo);

// логіка зміни хешу і кліки для цього
const handleNavigation = (event) => {
  event.preventDefault();

  if (!window.location.hash) {
    window.location.hash = "home";
  } else {
    const url = event.target.getAttribute("href").substring(1);
    window.location.hash = url;
  }
};
homeLink.addEventListener("click", handleNavigation);
productsLink.addEventListener("click", handleNavigation);
aboutLink.addEventListener("click", handleNavigation);

// перша загрузка
window.addEventListener("DOMContentLoaded", navigateTo);
sidebarScript();

// клік на logo - перезапуск сторінки
logo.addEventListener("click", () => {
  window.location.reload();
});
