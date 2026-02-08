const API_KEY = 'c064c8d4f20e5c077a085b2e40e5005a';
const BASE_URL = 'https://gnews.io/api/v4/top-headlines?category=general&lang=he&country=il&max=10';
const appContainer = document.getElementById('app-container');
const navHome = document.getElementById('nav-home');
const navCreate = document.getElementById('nav-create');


function showHomePage() {
    appContainer.innerHTML = '<h2>טוען חדשות...</h2>';
    fetchNews();
}

function showCreatePage() {
    appContainer.innerHTML = `
        <section class="create-story">
            <h2>יצירת סיפור חדשות</h2> 
            <form id="news-form">
                <label>כותרת</label> 
                <input type="text" id="title" required>
                
                <label>שם מחבר</label>
                <input type="text" id="author" required>
                
                <label>תיאור</label> 
                <textarea id="description" required></textarea>
                
                <button type="submit">שליחה</button> 
            </form>
        </section>
    `;
}

navHome.addEventListener('click', (e) => {
    e.preventDefault();
    showHomePage();
});

navCreate.addEventListener('click', (e) => {
    e.preventDefault();
    showCreatePage();
});

showHomePage();

async function fetchNews() {


    const storageKey = 'news_cache';

    const cachedData = localStorage.getItem(storageKey);

    if (cachedData && cachedData !== "undefined") {
        try {
            const news = JSON.parse(cachedData);
            renderNewsCards(news);
            return;
        } catch (e) {
            console.log(10);
            console.error("המידע ב-LocalStorage פגום, מנקה אותו...");
            localStorage.removeItem(storageKey);
        }
    }

    console.log("מבצע פנייה ל-API...");
    try {
        const response = await fetch(`${BASE_URL}&apikey=${API_KEY}`);
        const data = await response.json();

        const articles = data.articles;

        localStorage.setItem(storageKey, JSON.stringify(articles));

        renderNewsCards(articles);
    } catch (error) {
        console.error("שגיאה בטעינת החדשות:", error);
        appContainer.innerHTML = '<p>אופס! קרתה שגיאה בטעינת הנתונים.</p>';
    }
}

function renderNewsCards(articles) {
    appContainer.innerHTML = '<section class="news-grid"></section>';
    const grid = appContainer.querySelector('.news-grid');

    articles.forEach((article, index) => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${article.image}" alt="news image">
            <div class="card-content">
                <p class="author">${article.source.name}</p>
                <h3>${article.title}</h3>
                <button class="read-more" data-index="${index}">קרא עוד</button>
            </div>
        `;

        card.querySelector('.read-more').addEventListener('click', () => {
            showExpandedNews(article);
        });

        grid.appendChild(card);
    });
}

function showExpandedNews(article) {
    console.log(article);

    appContainer.innerHTML = `
        <section class="expanded-news">
            <button id="back-btn">← חזרה לחדשות</button>
            <article>
                <img src="${article.image}" alt="main image">
                <h1>${article.title}</h1>
                <p class="author">מאת: ${article.source.name}</p>
                
                <div class="content-body">
                    <p class="description"><strong>תקציר:</strong> ${article.description || 'אין תקציר זמין'}</p>
                    <hr>
                    <p class="full-content">${article.content}</p>
                </div>
            </article>
        </section>
    `;

    document.getElementById('back-btn').addEventListener('click', () => {
        showHomePage();
    });
}

function setupCreateForm() {
    const form = document.getElementById('news-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newArticle = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            description: document.getElementById('description').value,
            urlToImage: 'https://via.placeholder.com/150',
            content: document.getElementById('description').value,
            publishedAt: new Date().toISOString()
        };

        const storageKey = 'news_cache';
        const existingNews = JSON.parse(localStorage.getItem(storageKey)) || [];

        existingNews.unshift(newArticle);

        localStorage.setItem(storageKey, JSON.stringify(existingNews));

        alert('הסיפור פורסם בהצלחה!');
        showHomePage();
    });
}