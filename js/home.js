import { allFurn } from "./furnitureDB.js";
import { productsLink } from "./script.js";

export function homeWorks() {
  // змінюєм висоту

  if (window.location.hash === "#home") {
    adjustTitleWrapHeight();
  } else {
    window.removeEventListener("resize", adjustTitleWrapHeight);
  }

  function adjustTitleWrapHeight() {
    const titleWrap = document.querySelector(".home__title-wrap");

    if (titleWrap.offsetWidth) {
      const newTitleWrapHeight = titleWrap.offsetWidth / 1.9;
      titleWrap.style.height = `${newTitleWrapHeight}px`;
      window.addEventListener("resize", adjustTitleWrapHeight);
    }
  }

  // Генеруємо три випадкові числа
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // Функція для генерації випадкових елементів бази даних
  function generateRandomElements() {
    var randomElements = [];
    var allFurnLength = allFurn.length;

    for (var i = 0; i < 3; i++) {
      var randomIndex = getRandomNumber(0, allFurnLength - 1);
      randomElements.push(allFurn[randomIndex]);
    }

    generator(randomElements);
  }

  // генеруєм верстку
  function generator(arr) {
    const home = document.querySelector(".home__layout");
    home.innerHTML = "";
    if (!home) {
      console.error("Елемент '.home__layout' не знайдено");
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      let name = arr[i].name;
      let price = arr[i].price;
      let src = arr[i].imageSrc;
      let str = `
        <div class="home__item">
          <div class="home__img-wrap">
            <img class="home__img" src=${src} alt="${name.replace(
        /\s+/g,
        "-"
      )}">
          </div>
          <div class="home__info">
              <h3 class="home__name">${name}</h3>
              <h3 class="home__price">${price} ₴</h3>
          </div>
        </div>
      `;
      home.innerHTML += str;
    }
  }
  generateRandomElements();

  // онкліки для кнопок
  const showNowBtn = document.querySelector(".home__titleBtn");
  showNowBtn.addEventListener("click", () => {
    productsLink.click();
  });

  const allProductsBtn = document.querySelector(".home__contentBtn");
  allProductsBtn.addEventListener("click", () => {
    productsLink.click();
  });
}
