import { renderFurn } from "./products.js";

const homeLink = document.querySelector('a[href="#home"]');
const productsLink = document.querySelector('a[href="#products"]');
const aboutLink = document.querySelector('a[href="#about"]');
const content = document.querySelector("article.content");
const logo = document.querySelector(".header__logo");

// Завантаження сторінки
const loadPage = (url) => {
  axios
    .get("pages/" + url + ".html")
    .then((response) => {
      content.innerHTML = response.data;
      if (url === "products") {
        renderFurn(); // Виклик функції renderFurn після завантаження сторінки products.html
      }
    })
    .catch((error) => {
      console.error(error);
      content.innerHTML = "Помилка завантаження сторінки";
    });
};

const handleNavigation = (event) => {
  event.preventDefault();
  const url = event.target.getAttribute("href").substring(1);
  window.location.hash = url;
};

homeLink.addEventListener("click", handleNavigation);
productsLink.addEventListener("click", handleNavigation);
aboutLink.addEventListener("click", handleNavigation);

// Завантаження сторінки при зміні хешу
const navigateTo = async () => {
  try {
    const url = window.location.hash.substring(1);
    await loadPage(url);
  } catch (error) {
    console.error(error);
    content.innerHTML = "Помилка завантаження сторінки";
  }
};
window.addEventListener("hashchange", navigateTo);

// Перший запуск
const initialPage = window.location.hash.substring(1);
if (initialPage) {
  navigateTo(initialPage);
} else {
  navigateTo("home");
}

// клік на logo - перезапуск сторінки
logo.addEventListener("click", () => {
  window.location.reload();
});
