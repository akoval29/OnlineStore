import { allFurniture } from "./furnitureDB.js";
import { productsLink } from "./script.js";

export function homeScript() {
  // змінюєм висоту bg
  function adjustTitleWrapHeight() {
    const titleWrap = document.querySelector(".home__title-wrap");
    if (titleWrap.offsetWidth) {
      const newTitleWrapHeight = titleWrap.offsetWidth / 1.9;
      titleWrap.style.height = `${newTitleWrapHeight}px`;
      window.addEventListener("resize", adjustTitleWrapHeight);
    }
  }
  adjustTitleWrapHeight();

  // Генеруємо три випадкові унікальні числа
  function generateRandomElements() {
    let randomElements = [];
    while (randomElements.length < 3) {
      let randomIndex = Math.floor(Math.random() * allFurniture.length);
      let randomElement = allFurniture[randomIndex];
      if (!randomElements.includes(randomElement)) {
        randomElements.push(randomElement);
      }
    }
    generator(randomElements);
  }
  generateRandomElements();

  // генеруєм верстку
  function generator(arr) {
    const home = document.querySelector(".home__layout");
    home.innerHTML = "";
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

  // кліки для кнопок
  const showNowBtn = document.querySelector(".home__titleBtn");
  showNowBtn.addEventListener("click", () => {
    productsLink.click();
  });
  const allProductsBtn = document.querySelector(".home__contentBtn");
  allProductsBtn.addEventListener("click", () => {
    productsLink.click();
  });
}
