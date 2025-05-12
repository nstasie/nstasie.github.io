// Дані для меню
const menuItems = [
    { name: "Паста Карбонара", desc: "Паста лінгвіні, вершковий соус, бекон, спеції, пармезан, мікрогрін.", price: 150, img: "images/carbonara.png" },
    { name: "Філадельфія Боул", desc: "Поке з лососем гравлакс, огірком, томатами, едамаме, стиглим авокадо та крем-чилі.", price: 200, img: "images/bowl.png" },
    { name: "Торі рамен", desc: "Бульйон торі-рамен, куряче філе, спагеті, броколі, кукурудза, бейбі морква, зелень", price: 180, img: "images/tori.png" }
];

// Дані для кошика
let cartItems = [
    { name: "Філадельфія Боул", price: 200, quantity: 1, img: "images/bowl.png" },
    { name: "Торі рамен", price: 180, quantity: 1, img: "images/tori.png" }
];

// Дані для замовлень
let orders = [
    { orderId: "№10000", date: "04.03.2025", total: 350 }
];

// Змінна для замовлень(початкова 10000)
let lastOrderId = 10000;

// Генерація меню з циклом for і умовою if-else
const menuContainer = document.getElementById("menu-items");
for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    const article = document.createElement("article");
    article.classList.add("item");

    let titleText = item.name; 
    if (i <= 1) {
        titleText += ' (<span style="color: red">Новинка</span>)'; 
    } else {
        // Нічого не додаємо для інших елементів
    }

    article.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <h3>${titleText}</h3>
        <p>${item.desc}</p>
        <p class="price">${item.price} грн</p>
        <button class="add-to-cart">Додати в кошик</button>
    `;
    menuContainer.appendChild(article);
}

// Генерація кошика з циклом for
function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const article = document.createElement("article");
        article.classList.add("item");
        article.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-content">
                <h3>${item.name}</h3>
                <p>Кількість: <input type="number" value="${item.quantity}" min="1"></p>
                <p class="price">${item.price} грн</p>
            </div>
            <button type="button" class="remove-btn">Remove</button>
        `;
        cartContainer.appendChild(article);
    }

    // Синхронізуємо видимість кошика і текст кнопки
    if (cartItems.length > 0) {
        cartGrid.style.display = "flex";
        cartSummary.style.display = "block";
        toggleCartBtn.textContent = "Сховати кошик";
    } else {
        cartGrid.style.display = "none";
        cartSummary.style.display = "none";
        toggleCartBtn.textContent = "Показати кошик";
    }

    updateTotal();
    attachCartEventListeners();
}

// Генерація замовлень
function renderOrders() {
    const orderContainer = document.getElementById("order-items");
    orderContainer.innerHTML = "";
    let i = 0;
    while (i < orders.length) {
        const order = orders[i];
        const article = document.createElement("article");
        article.classList.add("item");

        let timerText = "Замовлення доставлено";
        if (order.timeLeft !== null && order.timeLeft > 0) {
            timerText = formatTime(order.timeLeft);
        }

        article.innerHTML = `
            <h3 class="order-title">Замовлення ${order.orderId}</h3>
            <div class="order-details">
                <p>Дата: ${order.date}</p>
                <p>Сума: ${order.total} грн</p>
                <p class="delivery-timer" data-order-id="${order.orderId}">${timerText}</p>
            </div>
        `;
        orderContainer.appendChild(article);

        const title = article.querySelector(".order-title");
        const details = article.querySelector(".order-details");
        title.addEventListener("click", () => {
            details.style.display = details.style.display === "block" ? "none" : "block";
        });
        i++;
    }
}

// Перемикання видимості кошика
const toggleCartBtn = document.getElementById("toggle-cart");
const cartGrid = document.getElementById("cart-items");
const cartSummary = document.querySelector(".cart-summary");

toggleCartBtn.addEventListener("click", () => {
    const computedDisplay = window.getComputedStyle(cartGrid).display;
    if (computedDisplay === "none" || cartGrid.style.display === "none") {
        cartGrid.style.display = "flex";
        cartSummary.style.display = "block";
        toggleCartBtn.textContent = "Сховати кошик";
    } else {
        cartGrid.style.display = "none";
        cartSummary.style.display = "none";
        toggleCartBtn.textContent = "Показати кошик";
    }
});

// Обробники для "Додати в кошик"
const addToCartButtons = document.querySelectorAll(".add-to-cart");
for (let i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", () => {
        const menuItem = menuItems[i];
        const existingItem = cartItems.find(item => item.name === menuItem.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ name: menuItem.name, price: menuItem.price, quantity: 1, img: menuItem.img });
        }
        addToCartButtons[i].style.backgroundColor = "#ccc";
        setTimeout(() => {
            addToCartButtons[i].style.backgroundColor = "rgb(120, 188, 8)";
        }, 1000);
        renderCart();
    });
}

// Оновлення суми
function updateTotal() {
    let total = 0;
    const items = document.querySelectorAll("#cart-items .item");
    items.forEach(item => {
        const price = parseInt(item.querySelector(".price").textContent.replace(" грн", ""));
        const quantity = parseInt(item.querySelector("input[type='number']").value);
        total += price * quantity;
    });
    document.getElementById("total").textContent = `${total} грн`;
    return total;
}

// Обробники для кошика
function attachCartEventListeners() {
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemName = button.closest(".item").querySelector("h3").textContent;
            const itemIndex = cartItems.findIndex(item => item.name === itemName);
            if (itemIndex !== -1) {
                cartItems.splice(itemIndex, 1);
                renderCart();
            }
        });
    });

    const quantityInputs = document.querySelectorAll("#cart-items input[type='number']");
    quantityInputs.forEach((input, index) => {
        input.addEventListener("change", () => {
            const newQuantity = parseInt(input.value);
            if (newQuantity >= 1) {
                cartItems[index].quantity = newQuantity;
            }
            updateTotal();
        });
    });
}

// Обробка форми
const orderForm = document.getElementById("order-form");
orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    
    if (phone.length < 9) {
        alert("Введіть правильний номер телефону (мін. 9 символів)");
        return;
    }

    const total = updateTotal();
    lastOrderId += 1;
    const orderId = "№" + lastOrderId;
    const date = new Date().toLocaleDateString("uk-UA");
    const newOrder = { orderId, date, total, timeLeft: 30 * 60 }; // 30 хвилин у секундах
    orders.push(newOrder);
    renderOrders();
    startDeliveryTimer(newOrder);
    
    cartItems = [];
    renderCart();
    
    orderForm.reset();
});

// Таймер доставки 
function startDeliveryTimer(order) {
    if (order.timeLeft === null || order.timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
        if (order.timeLeft > 0) {
            order.timeLeft--;
            updateOrderTimer(order);
        } else {
            clearInterval(timerInterval);
            order.timeLeft = 0;
            updateOrderTimer(order);
        }
    }, 1000);
}

// Оновлення відображення таймера для конкретного замовлення
function updateOrderTimer(order) {
    const timerElement = document.querySelector(`.delivery-timer[data-order-id="${order.orderId}"]`);
    if (timerElement) {
        timerElement.textContent = order.timeLeft > 0 ? formatTime(order.timeLeft) : "Замовлення доставлено";
    }
}

// Форматування часу 
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `Очікуваний час доставки: ${minutes}:${secs < 10 ? "0" + secs : secs}`;
}

renderCart();
renderOrders();