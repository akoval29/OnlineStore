import { allFurn } from "./furnitureDB.js";

export function renderFurn() {
  console.log(allFurn);

  const main = document.querySelector(".products__layout");
  const btnAll = document.querySelector(".products__All");
  const btnLiving = document.querySelector(".products__LivingRoom");
  const btnHall = document.querySelector(".products__HallRoom");
  const btnBed = document.querySelector(".products__BedRoom");
  const btnBath = document.querySelector(".products__BathRoom");
  const btnDesc = document.querySelector(".products__PCDesc");

  // Перший запуск
  generator(allFurn);

  // навішуєм обробники подій на btn
  btnAll.addEventListener("click", () => {
    main.innerHTML = ""; // видалити все з main
    generator(allFurn);
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
    for (let i = 0; i < allFurn.length; i++) {
      if (allFurn[i].type === value) {
        arr.push(allFurn[i]);
      }
    }
    generator(arr);
  }

  // генеруєм верстку
  function generator(arr) {
    const main = document.querySelector(".products__layout");
    if (!main) {
      console.error("Елемент '.products__layout' не знайдено");
      return;
    }

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
