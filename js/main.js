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
    { id: 10, title: "Мировой порядок", author: "Г. Кисссинджер", genre: "science", price: 1050, isNew: false },
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

    // Обработчик для кнопок "Подробнее"
    document.addEventListener("click", function(e) {
        if (e.target.classList && e.target.classList.contains("btn") && e.target.getAttribute("data-id")) {
            e.preventDefault();
            alert("Книга добавлена в корзину (демо-режим). Спасибо за покупки!");
        }
    });

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
