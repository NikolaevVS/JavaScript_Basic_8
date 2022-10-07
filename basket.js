"use strict";

const basketCountElement = document.querySelector('.cartIconWrap span');
const basketTotalElement = document.querySelector('.basketTotal');
const basketTotalValueElement = document.querySelector('.basketTotalValue');
const basketElement = document.querySelector('.basket');

/**
 * Обработчик открытия корзины при клике на ее значок.
 */
document.querySelector('.cartIconWrap').addEventListener('click', () => {
    basketElement.classList.toggle('hidden');
});

const basket = {};

/**
 * Обработчик клика на кнопку "Добавить в корзину" с деленированием события.
 * Событие вешается на ближайшего общего для всех кнопок предка.
 */
document.querySelector('.featuredItems').addEventListener('click', event => {
    // Проверяем, если клик был не по кнопке с селектором ".addToCart", а также
    // такого селектора не существует среди родителей элемента, по которому был
    // произведен клик, то ничего не делаем, уходим из функции.
    if (!event.target.closest('.addToCart')) {
        return;
    }
    // Получаем ближайшего родителя с классом featuredItem, в нем записаны все
    // нужные данные о продукте, получаем эти данные.
    const featuredItemElement = event.target.closest('.featuredItem');
    const id = +featuredItemElement.dataset.id;
    const name = featuredItemElement.dataset.name;
    const price = +featuredItemElement.dataset.price;
    // Добавляем в корзину продукт.
    addToCart(id, name, price);
});

/**
 * Функция добавляет продукт в корзину.
 * @param {number} id - Id продукта.
 * @param {string} name - Название продукта.
 * @param {number} price - Цена продукта.
 */
function addToCart(id, name, price) {
    // Если такого продукта еще не было добавлено в наш объект, который хранит
    // все добавленные товары, то создаем новый объект.
    if (!(id in basket)) {
        basket[id] = {id: id, name: name, price: price, count: 0};
    }
    // Добавляем в количество +1 к продукту.
    basket[id].count++;
    // Ставим новое количество добавленных товаров у значка корзины.
    basketCountElement.textContent = getTotalBasketCount().toString();
    // Ставим новую общую стоимость товаров в корзине.
    basketTotalValueElement.textContent = getTotalBasketPrice().toFixed(2);
    // Отрисовываем продукт с данным id.
    renderProductInBasket(id);
}

/**
 * Считает и возвращает количество продуктов в корзине.
 * @return {number} - Количество продуктов в корзине.
 */
function getTotalBasketCount() {
    return Object.values(basket).reduce((acc, product) => acc + product.count, 0);
}

/**
 * Считает и возвращает итоговую цену по всем добавленным продуктам.
 * @return {number} - Итоговую цену по всем добавленным продуктам.
 */
function getTotalBasketPrice() {
    return Object
        .values(basket)
        .reduce((acc, product) => acc + product.price * product.count, 0);
}

/**
 * Отрисовывает в корзину информацию о продукте.
 * @param {number} productId - Id продукта.
 */
function renderProductInBasket(productId) {
    // Получаем строку в корзине, которая отвечает за данный продукт.
    const basketRowElement = basketElement
        .querySelector(`.basketRow[data-id="${productId}"]`);
    // Если такой строки нет, то отрисовываем новую строку.
    if (!basketRowElement) {
        renderNewProductInBasket(productId);
        return;
    }

    // Получаем данные о продукте из объекта корзины, где хранятся данные о всех
    // добавленных продуктах.
    const product = basket[productId];
    // Ставим новое количество в строке продукта корзины.
    basketRowElement.querySelector('.productCount').textContent = product.count;
    // Ставим нужную итоговую цену по данному продукту в строке продукта корзины.
    basketRowElement
        .querySelector('.productTotalRow')
        .textContent = (product.price * product.count).toFixed(2);
}

/**
 * Функция отрисовывает новый товар в корзине.
 * @param {number} productId - Id товара.
 */
function renderNewProductInBasket(productId) {
    const productRow = `
    <div class="basketRow" data-id="${productId}">
      <div>${basket[productId].name}</div>
      <div>
        <span class="productCount">${basket[productId].count}</span> шт.
      </div>
      <div>$${basket[productId].price}</div>
      <div>
        $<span class="productTotalRow">${(basket[productId].price * basket[productId].count).toFixed(2)}</span>
      </div>
    </div>
    `;
    basketTotalElement.insertAdjacentHTML("beforebegin", productRow);
}