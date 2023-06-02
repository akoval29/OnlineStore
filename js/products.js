import { allFurniture } from "./furnitureDB.js";

export function productsScript() {
  const main = document.querySelector(".products__layout");
  const btnAll = document.querySelector(".products__All");
  const btnLiving = document.querySelector(".products__LivingRoom");
  const btnHall = document.querySelector(".products__HallRoom");
  const btnBed = document.querySelector(".products__BedRoom");
  const btnBath = document.querySelector(".products__BathRoom");
  const btnDesc = document.querySelector(".products__PCDesc");
  const textInput = document.querySelector(".products__input");

  // Перший запуск
  generator(allFurniture);

  // навішуєм обробники подій на btn
  btnAll.addEventListener("click", () => {
    main.innerHTML = ""; // видалити все з main
    generator(allFurniture);
  });
  btnLiving.addEventListener("click", () => {
    onUpdate("Вітальня");
  });
  btnHall.addEventListener("click", () => {
    onUpdate("Передпокій");
  });
  btnBed.addEventListener("click", () => {
    onUpdate("Спальня");
  });
  btnBath.addEventListener("click", () => {
    onUpdate("Ванна");
  });
  btnDesc.addEventListener("click", () => {
    onUpdate("Комп'ютерні столи");
  });

  // оновлюєм сторінку кнопкою
  function onUpdate(value) {
    main.innerHTML = "";
    let arr = [];
    for (let i = 0; i < allFurniture.length; i++) {
      if (allFurniture[i].type === value) {
        arr.push(allFurniture[i]);
      }
    }
    generator(arr);
  }

  //логіка для інпута
  textInput.addEventListener("input", (event) => {
    event.preventDefault();
    const value = event.target.value;
    main.innerHTML = "";
    if (value.trim() !== "") {
      let arr = [];
      for (let i = 0; i < allFurniture.length; i++) {
        if (allFurniture[i].name.toLowerCase().includes(value.toLowerCase())) {
          arr.push(allFurniture[i]);
        }
      }
      generator(arr);
    } else {
      generator(allFurniture);
    }
  });

  //логіка для слайдера
  const slider = document.getElementById("myRange");
  const output = document.getElementById("dot");
  slider.addEventListener("input", () => {
    const value = parseInt(slider.value);
    output.innerHTML = `${value} грн.`;
    main.innerHTML = "";
    const arr = allFurniture.filter((item) => item.price <= value);
    generator(arr);
  });
  slider.dispatchEvent(new Event("input"));

  // генеруєм верстку
  function generator(arr) {
    const main = document.querySelector(".products__layout");
    for (let i = 0; i < arr.length; i++) {
      let name = arr[i].name;
      let price = arr[i].price;
      let src = arr[i].imageSrc;
      let str = `
        <div class="products__item">
          <div class="products__img-wrap">
            <img class="products__img" src=${src} alt="${name.replace(
        /\s+/g,
        "-"
      )}">
          </div>
          <div class="products__info">
              <h3 class="products__name">${name}</h3>
              <h3 class="products__price">${price} ₴</h3>
          </div>
        </div>
      `;
      main.innerHTML += str;
    }
  }
}
