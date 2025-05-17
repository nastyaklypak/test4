
const initialNews = [
    {
        id: 1,
        title: "Нова колекція срібних прикрас з аметистом",
        date: "2025-04-28T14:30:00",
        content: "Ми раді представити нашу нову колекцію срібних прикрас з аметистом! Ця колекція поєднує в собі елегантність срібла та глибокий фіолетовий колір аметисту. Кожна прикраса створена вручну нашими майстрами та має унікальний дизайн. Завітайте до нашого магазину, щоб приміряти ці неймовірні прикраси та відчути їхню магію. Акційна пропозиція: при купівлі сережок та кулона з цієї колекції, ви отримаєте знижку 15%.",
        important: true
    },
    {
        id: 2,
        title: "Знижки до 40% на золоті обручки",
        date: "2025-04-28T10:15:00",
        content: "Плануєте весілля? У нас чудова новина! До кінця травня діє спеціальна акція - знижки до 40% на золоті обручки. У нашому асортименті ви знайдете класичні моделі та сучасні дизайнерські рішення. Можливе індивідуальне гравіювання за вашим бажанням. Не пропустіть можливість придбати символ вашого кохання за привабливою ціною.",
        important: false
    },
    {
        id: 3,
        title: "Нова технологія гальванічного покриття прикрас",
        date: "2025-04-27T16:45:00",
        content: "Ми впровадили інноваційну технологію гальванічного покриття для наших ювелірних виробів! Тепер наші позолочені прикраси стали ще довговічнішими та стійкішими до щоденного носіння. Ця технологія дозволяє зберегти яскравість і блиск виробів набагато довше. Всі нові вироби з покриттям мають спеціальну позначку на бірці та комплектуються розширеною гарантією на 2 роки.",
        important: true
    },
    {
        id: 4,
        title: "Відкриття нового магазину прикрас у ТРЦ 'Мега'",
        date: "2025-04-27T09:20:00",
        content: "Раді повідомити про відкриття нашого нового магазину у ТРЦ 'Мега'! Відкриття відбудеться 15 травня о 12:00. На відвідувачів чекають приємні сюрпризи: перші 50 покупців отримають подарункові сертифікати на 500 грн, для всіх відвідувачів - розіграш ексклюзивної діамантової підвіски та фуршет. Наш консультант-гемолог проведе безкоштовну оцінку ваших коштовностей та надасть рекомендації щодо догляду за ними.",
        important: false
    },
    {
        id: 5,
        title: "Ексклюзивна колекція з коштовним камінням від відомого дизайнера",
        date: "2025-04-26T13:10:00",
        content: "Запрошуємо вас на презентацію ексклюзивної колекції прикрас з коштовним камінням від всесвітньо відомого дизайнера Марії Шевченко! Колекція 'Сяйво зірок' включає унікальні вироби з діамантами, сапфірами та смарагдами. Кожен виріб - це витвір мистецтва, створений з любов'ю та увагою до деталей. Презентація відбудеться цієї суботи о 17:00 в нашому флагманському магазині. Кількість запрошень обмежена, тому реєструйтеся заздалегідь на нашому сайті.",
        important: true
    }
];


function formatDate(dateString) {
    const date = new Date(dateString);
    
    //  (день.місяць.рік)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // (години:хвилини)
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}


function renderNewsList(news) {
    const newsListElement = document.getElementById('news-list');
    
    // Сортування новин за датою 
    const sortedNews = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));
    
   
    newsListElement.innerHTML = '';
    

    sortedNews.forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.classList.add('news-item');
        newsElement.dataset.id = newsItem.id;
        
        if (newsItem.important) {
            newsElement.classList.add('important');
        }
        
        newsElement.innerHTML = `
            <h3>${newsItem.title}</h3>
            <div class="news-item-date">${formatDate(newsItem.date)}</div>
        `;
        
       
        newsElement.addEventListener('click', () => {
            showNewsContent(newsItem);
            
           
            document.querySelectorAll('.news-item').forEach(item => {
                item.classList.remove('active');
            });
            newsElement.classList.add('active');
        
        });
        
        newsListElement.appendChild(newsElement);
    });
    
    
}


function showNewsContent(newsItem) {
    const selectedNewsElement = document.getElementById('selected-news');
    
    selectedNewsElement.innerHTML = `
        <h2 class="selected-news-title">${newsItem.title}</h2>
        <div class="selected-news-date">${formatDate(newsItem.date)}</div>
        <div class="selected-news-content">${newsItem.content}</div>
    `;
}


function fetchNews() {
    
    return new Promise((resolve) => {
        
        setTimeout(() => {
            resolve(initialNews);
        }, 500);
    });
}


const possibleNewsTitles = [
    "Тренди сезону: які прикраси будуть популярні цієї весни",
    "Нова колекція прикрас з перлами 'Морська елегантність'",
    "Майстер-клас з догляду за срібними прикрасами",
    "Знижки на ювелірні вироби з топазами",
    "Історія створення унікальної золотої брошки",
    "Як вибрати ідеальну прикрасу в подарунок",
    "Нова поставка діамантових каблучок",
    "Виставка антикварних прикрас у нашому магазині",
    "Співпраця з відомим ювелірним брендом",
    "Конкурс дизайнерів ювелірних прикрас"
];


const possibleNewsContents = [
    "Наша компанія пишається тим, що може запропонувати вам ексклюзивні ювелірні вироби найвищої якості. Ми працюємо тільки з перевіреними постачальниками та найкращими ювелірами, щоб гарантувати вам неперевершену якість та унікальний дизайн кожної прикраси.",
    "Запрошуємо вас відвідати наш оновлений шоурум, де ви зможете приміряти нові моделі прикрас у комфортній атмосфері. Наші консультанти допоможуть вам підібрати прикраси, які ідеально доповнять ваш образ та підкреслять індивідуальність.",
    "Ми підготували для вас добірку порад з догляду за ювелірними виробами. Дотримуючись цих простих рекомендацій, ви зможете зберегти блиск та красу ваших прикрас на довгі роки. Завітайте до нашого блогу, щоб дізнатися більше.",
    "Раді повідомити про початок сезонного розпродажу! Встигніть придбати омріяні прикраси зі знижками до 50%. Акція триватиме всього тиждень, тому не зволікайте. Кількість товарів обмежена.",
    "Наші ювеліри створили нову унікальну колекцію, натхненну красою природи. Кожна прикраса - це мініатюрний витвір мистецтва, який розповідає свою історію. Завітайте до нашого магазину, щоб відчути магію цих виробів."
];


function simulateNewNewsArrival() {
    const newNewsId = initialNews.length + 1;
    const currentDate = new Date();
    

    const randomTitleIndex = Math.floor(Math.random() * possibleNewsTitles.length);
    const randomContentIndex = Math.floor(Math.random() * possibleNewsContents.length);
    
    const newNews = {
        id: newNewsId,
        title: possibleNewsTitles[randomTitleIndex],
        date: currentDate.toISOString(),
        content: possibleNewsContents[randomContentIndex],
        important: Math.random() > 0.7 
    };
    
    initialNews.push(newNews);
    renderNewsList(initialNews);
}


document.addEventListener('DOMContentLoaded', () => {
    fetchNews().then(news => {
        renderNewsList(news);
    });
    
  
    setInterval(simulateNewNewsArrival, 60000);
});