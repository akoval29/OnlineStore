import { renderFurn } from "./products.js";
import { homeWorks } from "./home.js";

const homeLink = document.querySelector('a[href="#home"]');
export const productsLink = document.querySelector('a[href="#products"]');
const aboutLink = document.querySelector('a[href="#about"]');
const content = document.querySelector(".content");
const logo = document.querySelector(".header__logo");

// перший запуск
homeLink.click();

// Завантаження сторінки
const navigateTo = async () => {
  try {
    const url = window.location.hash.substring(1);
    const response = await axios.get("pages/" + url + ".html");
    content.innerHTML = response.data;
    if (url === "products") {
      renderFurn();
    }
    if (url === "home") {
      homeWorks();
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

// SIDEBAR
const headerBin = document.querySelector(".header__bin");
const sidebar = document.querySelector(".sidebar");
const sidebarItems = document.querySelector(".sidebar__items");
const closeBtn = document.querySelector(".sidebar__closeBtn");

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar--open");
});
headerBin.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar--open");
});

// SIDEBAR - отрмуєм з е.таргет дані і передаєм в карточку
document.addEventListener("click", (event) => {
  if (event.target.closest(".products__item")) {
    const productItem = event.target.closest(".products__item");
    const imageUrl = productItem
      .querySelector(".products__img")
      .getAttribute("src");
    const itemName = productItem.querySelector(".products__name").textContent;
    const price = productItem.querySelector(".products__price").textContent;
    addToCart(imageUrl, itemName, price);
  }

  if (event.target.classList.contains("sidebar__removeBtn")) {
    const sidebarItem = event.target.closest(".sidebar__item");
    sidebarItem.remove();
  }
});

// SIDEBAR - шукаєм повтори і генеруєм верстку
function addToCart(imageUrl, itemName, price) {
  itemName = itemName.substring(0, 23) + " ...";
  const altName = itemName.replace(/\s+/g, "-");
  const existingItems = sidebarItems.querySelectorAll(".sidebar__name");
  let counter = 1;

  for (let i = 0; i < existingItems.length; i++) {
    const existingItem = existingItems[i];
    if (existingItem.textContent === itemName) {
      // Якщо знайдено повтор, збільшуємо лічильник
      const counterElement =
        existingItem.parentNode.parentNode.querySelector(".sidebar__counter");
      counter = parseInt(counterElement.textContent) + 1;
      counterElement.textContent = counter;
      return; // Вихід з функції, якщо знайдено повтор
    }
  }

  let itemHTML = `
    <div class="sidebar__item">
      <div class="sidebar__img-wrap">
        <img class="sidebar__img" src=${imageUrl} alt="${altName}">
      </div>
      <div class="sidebar__info">
        <p class="sidebar__name">${itemName}</p>
        <p class="sidebar__price">${price}</p>
        <p class="sidebar__removeBtn">remove</p>
      </div>
      <div class="sidebar__countBox">
        <span class="sidebar__arrow sidebar__arrow--up"></span>
        <span class="sidebar__counter">${counter}</span>
        <span class="sidebar__arrow sidebar__arrow--down"></span>
      </div>
    </div>
  `;
  sidebarItems.innerHTML += itemHTML;
  onTotal();
}

// SIDEBAR - рахуєм вартість товару
function onTotal() {
  const sidebarItems = document.querySelectorAll(".sidebar__item");

  let totalSum = 0;
  let totalCounter = 0;

  sidebarItems.forEach((item) => {
    const priceElement = item.querySelector(".sidebar__price");
    const counterElement = item.querySelector(".sidebar__counter");

    if (priceElement && counterElement) {
      const price = parseFloat(priceElement.textContent);
      const counter = parseInt(counterElement.textContent);

      console.log(price);
      console.log(counter);

      totalSum += price * counter;
      totalCounter += counter;
    }
  });

  // Відображення загальної суми
  const amountFlag = document.querySelector(".header__counter");
  const amountNum = document.querySelector(".sidebar__total");
  if (totalSum > 0) {
    amountFlag.classList.add("header__counter--show");
  } else {
    amountFlag.classList.remove("header__counter--show");
  }

  amountNum.innerHTML = totalSum;
  amountFlag.innerHTML = totalCounter;
}

// фікс для навігації
window.addEventListener("DOMContentLoaded", navigateTo);

// клік на logo - перезапуск сторінки
logo.addEventListener("click", () => {
  window.location.reload();
});
