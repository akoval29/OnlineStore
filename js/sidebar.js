export function sidebarScript() {
  const headerBin = document.querySelector(".header__bin");
  const headerCounter = document.querySelector(".header__counter");
  const sidebar = document.querySelector(".sidebar");
  const sidebarItems = document.querySelector(".sidebar__items");
  const closeBtn = document.querySelector(".sidebar__closeBtn");
  const closeBtn2 = document.querySelector(".sidebar__title");

  // SIDEBAR - відкрити/закрити
  headerBin.addEventListener("click", () => {
    sidebar.classList.add("sidebar--open");
  });
  headerCounter.addEventListener("click", () => {
    sidebar.classList.add("sidebar--open");
  });
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("sidebar--open");
  });
  closeBtn2.addEventListener("click", () => {
    sidebar.classList.remove("sidebar--open");
  });

  // SIDEBAR - отрмуєм з е.таргет дані і передаєм в карточку
  document.addEventListener("click", (event) => {
    // сайдбар працює в середовищі HOME
    if (event.target.closest(".home__item")) {
      const productItem = event.target.closest(".home__item");
      const imageUrl = productItem
        .querySelector(".home__img")
        .getAttribute("src");
      const itemName = productItem.querySelector(".home__name").textContent;
      const price = productItem.querySelector(".home__price").textContent;
      addToCart(imageUrl, itemName, price);
    }
    // сайдбар працює в середовищі PRODUCTS
    if (event.target.closest(".products__item")) {
      const productItem = event.target.closest(".products__item");
      const imageUrl = productItem
        .querySelector(".products__img")
        .getAttribute("src");
      const itemName = productItem.querySelector(".products__name").textContent;
      const price = productItem.querySelector(".products__price").textContent;
      addToCart(imageUrl, itemName, price);
    }
    // кнопка "remove" в карточці
    // і затримка для анімації видалення
    if (event.target.classList.contains("sidebar__removeBtn")) {
      const sidebarItem = event.target.closest(".sidebar__item");
      sidebarItem.classList.add("removedItem");
      setTimeout(() => {
        sidebarItem.remove();
        onTotal();
      }, 300);
    }
    onTotal();
    saveToLocalStorage();
  });

  // SIDEBAR - шукаєм повтори і генеруєм верстку
  function addToCart(imageUrl, itemName, price, counter) {
    itemName = itemName.substring(0, 21) + " ...";
    const altName = itemName.replace(/\s+/g, "-");
    const existingItems = sidebarItems.querySelectorAll(".sidebar__name");
    if (counter === undefined) {
      counter = 1;
    }

    for (let i = 0; i < existingItems.length; i++) {
      if (existingItems[i].textContent === itemName) {
        // Якщо знайдено повтор, збільшуємо лічильник
        const counterElement =
          existingItems[i].parentNode.parentNode.querySelector(
            ".sidebar__counter"
          );
        counter = parseInt(counterElement.textContent) + 1;
        counterElement.textContent = counter;
        saveToLocalStorage(); // Зберегти в Local Storage
        return; // Вихід з функції, якщо знайдено повтор
      }
    }

    let itemHTML = `
      <div class="sidebar__item newItem">
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
    saveToLocalStorage(); // Зберегти в Local Storage
    addArrowEventListeners(); // для стрілок на товарі

    // прибираєм клас newItem для коректної роботи анімації
    const newItem = sidebarItems.querySelector(".newItem");
    setTimeout(() => {
      newItem.classList.remove("newItem");
    }, 310);
  }

  // SIDEBAR - зберегти в local storage
  function saveToLocalStorage() {
    const sidebarItems = Array.from(
      document.querySelectorAll(".sidebar__item")
    );
    const data = sidebarItems.map((item) => {
      const imageUrl = item.querySelector(".sidebar__img").getAttribute("src");
      const itemName = item.querySelector(".sidebar__name").textContent;
      const price = item.querySelector(".sidebar__price").textContent;
      const counter = item.querySelector(".sidebar__counter").textContent;
      return { imageUrl, itemName, price, counter };
    });
    localStorage.setItem("sidebarData", JSON.stringify(data));
  }

  // SIDEBAR - завантажуємо з Local Storage
  function loadFromLocalStorage() {
    const data = localStorage.getItem("sidebarData");
    if (data) {
      const items = JSON.parse(data);
      items.forEach((item) => {
        const imageUrl = item.imageUrl;
        const itemName = item.itemName;
        const price = item.price;
        const counter = item.counter;
        addToCart(imageUrl, itemName, price, counter);
      });
    }
  }

  // SIDEBAR - видалити з local storage
  function removeFromLocalStorage(itemName) {
    const data = localStorage.getItem("sidebarData");
    if (data) {
      const items = JSON.parse(data);
      const updatedItems = items.filter((item) => item.itemName !== itemName);
      localStorage.setItem("sidebarData", JSON.stringify(updatedItems));
    }
    // для корекної роботи анімації
    const itemToRemove = document.querySelector(".sidebar__item");
    itemToRemove.classList.add("removedItem");
  }

  // SIDEBAR - рахуєм кількість і вартість товару
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
        totalSum += price * counter;
        totalCounter += counter;
      }
    });
    // Відображення кількості і вартості товару
    const amountFlag = document.querySelector(".header__counter");
    const amountNum = document.querySelector(".sidebar__total");
    if (totalSum > 0) {
      amountFlag.classList.add("header__counter--show");
    } else {
      amountFlag.classList.remove("header__counter--show");
    }
    amountNum.innerHTML = `Total: ${totalSum} ₴`;
    amountFlag.innerHTML = totalCounter;
  }

  // SIDEBAR - кліки для стрілок в карточках сайдбару
  function addArrowEventListeners() {
    const arrowsUp = document.querySelectorAll(".sidebar__arrow--up");
    const arrowsDown = document.querySelectorAll(".sidebar__arrow--down");
    // SIDEBAR - збільшити кількість товару
    arrowsUp.forEach((arrowUp) => {
      arrowUp.addEventListener("click", (event) => {
        const counterElement =
          event.target.parentNode.querySelector(".sidebar__counter");
        let counter = parseInt(counterElement.textContent);
        counter++;
        counterElement.textContent = counter;
        onTotal();
        saveToLocalStorage();
      });
    });

    // SIDEBAR - зменшити кількість товару
    arrowsDown.forEach((arrowDown) => {
      arrowDown.addEventListener("click", (event) => {
        const counterElement =
          event.target.parentNode.querySelector(".sidebar__counter");
        let counter = parseInt(counterElement.textContent);
        if (counter > 1) {
          counter--;
          counterElement.textContent = counter;
          onTotal();
          saveToLocalStorage();
        }
      });
    });
  }

  // SIDEBAR - відразу рахуєм вміст sidebar (це для local storage)
  window.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    onTotal();
  });
}
