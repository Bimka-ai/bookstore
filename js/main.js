// ========== ДАННЫЕ ДЛЯ МАГАЗИНА (массивы объектов) ==========
const allBooks = [
    { id: 1, title: "Мастер и Маргарита", author: "М. Булгаков", genre: "fiction", price: 450, isNew: true },
    { id: 2, title: "Гарри Поттер", author: "Дж. Роулинг", genre: "fantasy", price: 590, isNew: true },
    { id: 3, title: "Убийство в библиотеке", author: "К. Дойл", genre: "detective", price: 390, isNew: false },
    { id: 4, title: "Десять негритят", author: "А. Кристи", genre: "detective", price: 920, isNew: false },
    { id: 5, title: "Властелин колец", author: "Дж. Толкин", genre: "fantasy", price: 850, isNew: false },
    { id: 6, title: "Шерлок Холмс", author: "А. Конан Дойл", genre: "detective", price: 520, isNew: false },
    { id: 7, title: "Краткая история времени", author: "С. Хокинг", genre: "science", price: 670, isNew: true },
    { id: 8, title: "Анна Каренина", author: "Л. Толстой", genre: "fiction", price: 480, isNew: false },
    { id: 9, title: "Алые паруса", author: "А. Грин", genre: "fiction", price: 380, isNew: false },
    { id: 10, title: "Мировой порядок", author: "Г. Киссинджер", genre: "science", price: 1050, isNew: false },
    { id: 11, title: "Тёмная башня", author: "С. Кинг", genre: "fantasy", price: 550, isNew: false },
    { id: 12, title: "Тайна заброшеного дома", author: "Ф. Дениссон", genre: "detective", price: 690, isNew: true },
    { id: 13, title: "Капитанская дочка", author: "А. Пушкин", genre: "fiction", price: 600, isNew: false },
    { id: 14, title: "Химия навсегда", author: "Л. Орстрём", genre: "science", price: 900, isNew: false },
    { id: 15, title: "Герой нашего времени", author: "М. Лермонтов", genre: "fiction", price: 530, isNew: false },
];

// Глобальные переменные для фильтрации
let currentFilterGenre = null;
let currentSearchQuery = "";

// Функция фильтрации карточек (скрывает/показывает, НЕ перезаписывает)
function filterCatalog() {
    const cards = document.querySelectorAll("#catalogGrid .book-card");
    
    if (cards.length === 0) {
        console.log("Карточки не найдены. Убедитесь, что в HTML есть карточки с классом .book-card");
        return;
    }
    
    cards.forEach(card => {
        const genre = card.getAttribute("data-genre");
        const title = card.querySelector(".book-title")?.innerText.toLowerCase() || "";
        const author = card.querySelector(".book-author")?.innerText.toLowerCase() || "";
        
        let showByGenre = true;
        let showBySearch = true;
        
        if (currentFilterGenre) {
            showByGenre = genre === currentFilterGenre;
        }
        
        if (currentSearchQuery.trim() !== "") {
            const query = currentSearchQuery.trim().toLowerCase();
            showBySearch = title.includes(query) || author.includes(query);
        }
        
        if (showByGenre && showBySearch) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
    
    const visibleCards = document.querySelectorAll("#catalogGrid .book-card:not([style*='display: none'])");
    const catalogGrid = document.getElementById("catalogGrid");
    let existingMessage = document.querySelector("#no-results-message");
    
    if (visibleCards.length === 0 && cards.length > 0) {
        if (!existingMessage) {
            const message = document.createElement("p");
            message.id = "no-results-message";
            message.style.textAlign = "center";
            message.style.padding = "40px";
            message.style.color = "#33d836";
            message.innerHTML = "📚 Книги не найдены. Попробуйте другой жанр или поиск.";
            catalogGrid.appendChild(message);
        }
    } else if (existingMessage) {
        existingMessage.remove();
    }
}

// Функция для экранирования HTML (безопасность)
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

document.addEventListener("DOMContentLoaded", function() {
    // Поиск через форму
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const input = document.getElementById("searchInput");
            currentSearchQuery = input.value;
            currentFilterGenre = null;
            filterCatalog();
            document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Фильтр по жанрам
    document.querySelectorAll(".genre-link").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const genre = this.getAttribute("data-genre");
            currentFilterGenre = genre;
            currentSearchQuery = "";
            document.getElementById("searchInput").value = "";
            filterCatalog();
            document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
        });
    });

    // Добавление рецензии
    const submitBtn = document.getElementById("submitReviewBtn");
    const reviewsContainer = document.getElementById("reviewsList");

    if (submitBtn) {
        submitBtn.addEventListener("click", function() {
            const name = document.getElementById("reviewerName").value.trim();
            const book = document.getElementById("bookSelect").value;
            const rating = parseInt(document.getElementById("rating").value);
            const text = document.getElementById("reviewText").value.trim();

            if (!name || !text) {
                alert("Пожалуйста, заполните имя и текст рецензии!");
                return;
            }
            
            let stars = "";
            if (rating === 1) stars = "★☆☆☆☆";
            else if (rating === 2) stars = "★★☆☆☆";
            else if (rating === 3) stars = "★★★☆☆";
            else if (rating === 4) stars = "★★★★☆";
            else stars = "★★★★★";

            const newReview = document.createElement("article");
            newReview.classList.add("review-item");
            newReview.innerHTML = `
                <strong>${escapeHtml(name)}</strong> ${stars}<br>
                «${escapeHtml(text)}»<br>
                <small>Книга: ${escapeHtml(book)}</small>
            `;
            
            reviewsContainer.prepend(newReview);

            document.getElementById("reviewerName").value = "";
            document.getElementById("reviewText").value = "";
            document.getElementById("rating").value = 5;
            
            alert("Спасибо! Рецензия добавлена.");
        });
    }

    // Ссылка на PDF (демо)
    const pdfLink = document.getElementById("fakeFileLink");
    if (pdfLink) {
        pdfLink.addEventListener("click", function(e) {
            e.preventDefault();
            alert("В реальном проекте здесь началось бы скачивание PDF-каталога книг.");
        });
    }

    // Сброс фильтрации по клику на логотип
    const logoLink = document.querySelector(".logo h1");
    if (logoLink) {
        logoLink.style.cursor = "pointer";
        logoLink.addEventListener("click", function() {
            currentFilterGenre = null;
            currentSearchQuery = "";
            document.getElementById("searchInput").value = "";
            filterCatalog();
        });
    }
});

// ========== ДАННЫЕ С ОПИСАНИЯМИ КНИГ ДЛЯ МОДАЛЬНОГО ОКНА ==========
const booksDetails = {
    1: {
        description: "«Мастер и Маргарита» — самый известный роман Михаила Булгакова. В книге переплетаются две сюжетные линии: пребывание дьявола в Москве 1930-х годов и история любви Мастера и Маргариты. Роман о власти, трусости, любви и вечности.",
        genreName: "Художественная литература"
    },
    2: {
        description: "«Гарри Поттер» — первая книга знаменитой серии Джоан Роулинг. Мальчик-волшебник узнаёт, что он — наследник древнего магического рода, и поступает в школу чародейства Хогвартс. Здесь он находит настоящих друзей и сталкивается с тёмным лордом Волан-де-Мортом.",
        genreName: "Фэнтези"
    },
    3: {
        description: "«Преступление и наказание» — великий роман Фёдора Достоевского. Студент Родион Раскольников совершает убийство старухи-процентщицы, пытаясь проверить свою теорию о «праве имеющих». Роман о раскаянии, искуплении и человеческой душе.",
        genreName: "Художественная литература"
    },
    4: {
        description: "«Десять негритят» — самый продаваемый детектив Агаты Кристи. Десять незнакомцев приезжают на остров, где их ждёт загадочный хозяин. Один за другим гости умирают в соответствии с детской считалкой. Кто убийца?",
        genreName: "Детектив"
    },
    5: {
        description: "«Властелин колец» — эпическая сага Дж. Р. Р. Толкина. Хоббит Фродо Бэггинс должен уничтожить Кольцо Всевластья в жерле вулкана Роковой Горы. Путешествие через Средиземье, полное опасностей, дружбы и великой битвы добра со злом.",
        genreName: "Фэнтези"
    },
    6: {
        description: "«Шерлок Холмс» — сборник детективных рассказов Артура Конан Дойла. Гениальный сыщик Шерлок Холмс и его верный друг доктор Ватсон раскрывают самые запутанные преступления в Лондоне. Логика, дедукция и неожиданные развязки.",
        genreName: "Детектив"
    },
    7: {
        description: "«Краткая история времени» — научно-популярная книга Стивена Хокинга. Автор доступно рассказывает о происхождении Вселенной, чёрных дырах, теории относительности и природе времени. Книга для всех, кто интересуется космологией.",
        genreName: "Научная литература"
    },
    8: {
        description: "«Анна Каренина» — великий роман Льва Толстого. Трагическая история любви замужней дамы Анны Карениной к блестящему офицеру Вронскому на фоне жизни дворянского общества России XIX века.",
        genreName: "Художественная литература"
    },
    9: {
        description: "«Алые паруса» — трогательная повесть Александра Грина. Девочка Ассоль живёт мечтой о принце, который приплывёт к ней на корабле с алыми парусами. И мечта обязательно сбывается, если в неё верить.",
        genreName: "Художественная литература"
    },
    10: {
        description: "«Мировой порядок» — книга Генри Киссинджера, бывшего госсекретаря США, посвящена анализу современной системы международных отношений, дипломатии и глобальных вызовов XXI века.",
        genreName: "Научная литература"
    },
    11: {
        description: "«Тёмная Башня» — культовый цикл романов Стивена Кинга. Последний стрелок Роланд Дискейн путешествует по постапокалиптическому миру в поисках Тёмной Башни — мистического центра всех миров.",
        genreName: "Фэнтези"
    },
    12: {
        description: "«Тайна заброшенного дома» — захватывающий детектив Фионы Дениссон. Главная героиня возвращается в родной город и начинает расследование странных событий, происходящих в старом особняке, где много лет назад пропал её отец.",
        genreName: "Детектив"
    },
    13: {
        description: "«Капитанская дочка» — исторический роман Александра Пушкина. Действие происходит во время восстания Пугачёва. Молодой офицёр Гринёв попадает в эпицентр событий, где проверяются на прочность честь, верность и любовь.",
        genreName: "Художественная литература"
    },
    14: {
        description: "«Химия навсегда» — книга Лины Орстрём о любви, химии и науке. Главная героиня — учёный-химик, который пытается совместить свою страсть к исследованиям с личной жизнью.",
        genreName: "Научная литература"
    },
    15: {
        description: "«Герой нашего времени» — социально-психологический роман Михаила Лермонтова. История «лишнего человека» Григория Печорина, его взаимоотношения с людьми, его поиски смысла жизни и разочарования.",
        genreName: "Художественная литература"
    }
};

// ========== ФУНКЦИИ ДЛЯ МОДАЛЬНОГО ОКНА ==========
const modal = document.getElementById("bookModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalPrice = document.getElementById("modalPrice");
const modalGenre = document.getElementById("modalGenre");
const modalDescription = document.getElementById("modalDescription");
const closeModal = document.querySelector(".close-modal");

// Функция открытия модального окна с данными книги
function openBookModal(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;
    
    const details = booksDetails[bookId] || {
        description: "Описание пока не добавлено. Приносим извинения за неудобства.",
        genreName: book.genre === "fiction" ? "Художественная литература" : 
                   book.genre === "detective" ? "Детектив" :
                   book.genre === "fantasy" ? "Фэнтези" : "Научная литература"
    };
    
    let imagePath = "";
    switch(bookId) {
        case 1: imagePath = "images/book1.jpg"; break;
        case 2: imagePath = "images/book2.jpeg"; break;
        case 3: imagePath = "images/book3.jpg"; break;
        case 4: imagePath = "images/book4.webp"; break;
        case 5: imagePath = "images/book5.jpg"; break;
        case 6: imagePath = "images/book6.png"; break;
        case 7: imagePath = "images/book7.jpg"; break;
        case 8: imagePath = "images/book2.jpg"; break;
        case 9: imagePath = "images/book8.jpg"; break;
        case 10: imagePath = "images/book10.jpg"; break;
        case 11: imagePath = "images/book11.jpg"; break;
        case 12: imagePath = "images/book12.jpg"; break;
        case 13: imagePath = "images/book13.png"; break;
        case 14: imagePath = "images/book14.jpg"; break;
        case 15: imagePath = "images/book15.webp"; break;
        default: imagePath = "images/book1.jpg";
    }
    
    modalImg.src = imagePath;
    modalImg.alt = `Обложка книги ${book.title}`;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = book.author;
    modalPrice.textContent = book.price;
    modalGenre.textContent = details.genreName;
    modalDescription.textContent = details.description;
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeBookModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

if (closeModal) {
    closeModal.addEventListener("click", closeBookModal);
}

window.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeBookModal();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && modal.style.display === "block") {
        closeBookModal();
    }
});

// ОБРАБОТЧИК ДЛЯ КНОПОК "ПОДРОБНЕЕ" (открывает модальное окно)
document.addEventListener("click", function(e) {
    if (e.target.classList && e.target.classList.contains("btn") && e.target.getAttribute("data-id")) {
        e.preventDefault();
        const bookId = parseInt(e.target.getAttribute("data-id"));
        openBookModal(bookId);
    }
});

// ========== МОДАЛЬНАЯ КОРЗИНА ==========
// ========== МОДАЛЬНАЯ КОРЗИНА ==========
let cart = [];

// Обновление счётчика на иконке корзины
function updateCartCount() {
    const countSpan = document.getElementById("cartCount");
    if (countSpan) {
        let total = 0;
        cart.forEach(item => total += item.qty);
        countSpan.innerText = total;
    }
}

// Добавление товара в корзину
function addToCart(bookId) {
    const book = allBooks.find(b => b.id == bookId);
    if (!book) return;
    
    const exist = cart.find(i => i.id == bookId);
    if (exist) {
        exist.qty++;
    } else {
        cart.push({ id: book.id, title: book.title, price: book.price, qty: 1 });
    }
    
    updateCartCount();
    updateCartModalContent();
    alert(`"${book.title}" добавлена в корзину`);
}

// Обновление содержимого модального окна корзины
function updateCartModalContent() {
    const container = document.getElementById("cartModalItems");
    const totalSpan = document.getElementById("cartModalTotal");
    
    if (!cart.length) {
        container.innerHTML = "Пусто";
        totalSpan.innerText = "0";
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `<div style="border-bottom:1px solid #eee; padding:8px 0;">${item.title}<br>${item.price}₽ x ${item.qty} <button class="modal-del" data-id="${item.id}" style="float:right; background:#f4c542; border:none; border-radius:5px; cursor:pointer;">✕</button></div>`;
    }).join('');
    totalSpan.innerText = total;
    
    document.querySelectorAll('.modal-del').forEach(btn => {
        btn.onclick = () => {
            cart = cart.filter(i => i.id != btn.dataset.id);
            updateCartCount();
            updateCartModalContent();
        };
    });
}

// Открытие модального окна корзины
function openCartModal() {
    updateCartModalContent();
    const cartModal = document.getElementById("cartModal");
    const cartOverlay = document.getElementById("cartOverlay");
    if (cartModal) cartModal.style.display = "block";
    if (cartOverlay) cartOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
}

// Закрытие модального окна корзины
function closeCartModal() {
    const cartModal = document.getElementById("cartModal");
    const cartOverlay = document.getElementById("cartOverlay");
    if (cartModal) cartModal.style.display = "none";
    if (cartOverlay) cartOverlay.style.display = "none";
    document.body.style.overflow = "auto";
}

// Оформление заказа
function checkout() {
    if (!cart.length) return alert("Корзина пуста!");
    alert(`Спасибо за покупку!\nСумма: ${document.getElementById("cartModalTotal").innerText} ₽`);
    cart = [];
    updateCartCount();
    updateCartModalContent();
    closeCartModal();
}

// Добавление кнопок корзины в карточки
function addCartButtonsToCards() {
    const cards = document.querySelectorAll("#catalogGrid .book-card");
    cards.forEach(card => {
        if (card.querySelector('.cart-btn')) return;
        const detailsBtn = card.querySelector(".btn[data-id]");
        if (!detailsBtn) return;
        const container = document.createElement("div");
        container.className = "btn-container";
        detailsBtn.remove();
        container.appendChild(detailsBtn);
        const cartBtn = document.createElement("button");
        cartBtn.className = "cart-btn";
        cartBtn.innerHTML = "🛒";
        cartBtn.onclick = (e) => {
            e.stopPropagation();
            addToCart(detailsBtn.getAttribute("data-id"));
        };
        container.appendChild(cartBtn);
        card.appendChild(container);
    });
}

// Привязываем события после загрузки страницы
document.addEventListener("DOMContentLoaded", function() {
    addCartButtonsToCards();
    
    const cartIcon = document.getElementById("cartIconBtn");
    if (cartIcon) cartIcon.onclick = openCartModal;
    
    const closeBtn = document.getElementById("closeCartModal");
    if (closeBtn) closeBtn.onclick = closeCartModal;
    
    const overlay = document.getElementById("cartOverlay");
    if (overlay) overlay.onclick = closeCartModal;
    
    const checkoutBtn = document.getElementById("cartModalCheckoutBtn");
    if (checkoutBtn) checkoutBtn.onclick = checkout;
});
