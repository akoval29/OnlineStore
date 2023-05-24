import { getCountry } from "./useAPI.js";

const main = document.querySelector(".main");
const title = document.querySelector(".header__title");
const headerInput = document.querySelector(".header__input");
const headerMode = document.querySelector(".header__mode");
const countryBox = document.querySelector(".countries");
const filter = document.querySelector(".header__filter");
const target = document.querySelector(".header__target");

// отримуєм дані
document.addEventListener("DOMContentLoaded", async () => {
  const res = await getCountry();
  target.innerHTML = `All countries (${res.data.length})`;
  generator(res.data);
  onFilter(res.data);
});

// ФІЛЬТР
function onFilter(data) {
  filter.addEventListener("click", (event) => {
    event.preventDefault();

    if (event.target.textContent === "All") {
      generator(data);
      target.innerHTML = `All countries (${data.length})`;
    }

    if (event.target.classList.contains("header__subList-item")) {
      const element = event.target.textContent;
      const parent = event.target
        .closest(".header__list-item")
        .querySelector(".header__list-item-title")
        .textContent.toLowerCase();

      const newData = data.filter((country) => {
        const fieldValue = country[parent];

        if (parent === "region") {
          return fieldValue.includes(element);
        }

        if (typeof fieldValue !== "object") {
          return false;
        }

        if (parent === "currencies") {
          const currencyNames = Object.values(fieldValue).map((currency) =>
            currency.name.toLowerCase()
          );
          return currencyNames.some((name) =>
            name.includes(element.toLowerCase())
          );
        }

        if (parent === "languages") {
          return Object.values(fieldValue).includes(element);
        }
      });

      generator(newData);
      target.innerHTML = `${parent}: ${element} (${newData.length})`;
    }
  });

  // ІНПУТ
  headerInput.addEventListener("input", (event) => {
    event.preventDefault();
    const searchText = headerInput.value.toLowerCase();
    const newData = data.filter((country) => {
      return country.name.common.toLowerCase().includes(searchText);
    });
    generator(newData);
    target.innerHTML = `Input search: (${newData.length})`;
  });
}

// генерим верстку
function generator(data) {
  console.log("generator reports:");
  console.log(data);
  countryBox.innerHTML = "";

  for (let key in data) {
    let countryFlag = data[key].flags.png;
    let countryName = data[key].name.common;
    let countryCapital = data[key].capital;
    let countryRegion = data[key].region;
    let countryLang = findNestedLevels(data[key].languages).join(", ");
    let countryCurr = findNestedLevels(data[key].currencies).join(", ");
    let countryPopul = data[key].population;

    countryBox.innerHTML += `
    <div class="countries__country">
      <img
        class="countries__flag"
        src="${countryFlag}"
        alt="flag-${countryName}"
        loading="lazy" 
      />
      <div class="countries__wrap">
        <p class="countries__name">${countryName}</p>
        <p class="countries__capital">Capital: ${countryCapital}</p>
        <p class="countries__region">Region: ${countryRegion}</p>
        <p class="countries__languages">Languages: ${countryLang}</p>
        <p class="countries__currencies">Currencies: ${countryCurr}</p>
        <p class="countries__population">Population: ${countryPopul}</p>
      </div>
    </div>
    `;
  }
}
// Рекурсія для сильно nested ключів.
function findNestedLevels(obj) {
  let result = [];
  function search(obj) {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        search(obj[key]);
      } else {
        result.push(obj[key]);
      }
    }
  }
  search(obj);
  return result;
}

// тоглим тему
headerMode.addEventListener("click", () => {
  const imgDark = document.querySelector(".header__img--dark");
  const imgLight = document.querySelector(".header__img--light");
  const themeFlag = document.querySelector(".header__mode-flag");

  // тоглим тему - красим box-shadow кольором теми 1/3
  const countryBox = document.querySelectorAll(".countries__country");
  const filter = document.querySelector(".header__filter");
  const color = window
    .getComputedStyle(filter)
    .getPropertyValue("background-color");
  for (let i = 0; i < countryBox.length; i++) {
    countryBox[i].style.boxShadow = "3px 3px 7px " + "black";
  } // тоглим тему - красим box-shadow 2/3

  if (main.classList.contains("main--dark")) {
    main.classList.add("main--light");
    main.classList.remove("main--dark");
    imgDark.style.display = "block";
    imgLight.style.display = "none";
    themeFlag.innerHTML = "Dark mode";
  } else {
    main.classList.add("main--dark");
    main.classList.remove("main--light");
    imgDark.style.display = "none";
    imgLight.style.display = "block";
    themeFlag.innerHTML = "Light mode";

    for (let i = 0; i < countryBox.length; i++) {
      countryBox[i].style.boxShadow = "3px 3px 7px " + color;
    } // тоглим тему - красим box-shadow 3/3
  }
});

// помилка
export function onError() {
  headerInput.value = "ERROR";
  headerInput.style.fontWeight = "bold";
  headerInput.style.backgroundColor = "red";
  setTimeout(() => {
    headerInput.style.backgroundColor = "";
    headerInput.value = "";
  }, 1000);
}

// фокус на текстовий інпут при кліках по сторінці
main.addEventListener("click", () => {
  headerInput.focus();
});

// клік на тайтл "Where in the world" - перезапуск сторінки
title.addEventListener("click", () => {
  window.location.reload();
});
