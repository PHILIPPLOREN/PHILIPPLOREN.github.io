// Инициализация Telegram Web App
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.expand(); // Разворачиваем приложение на весь экран
    tg.ready();  // Сообщаем Telegram, что приложение готово
}

// Получаем элементы
const form = document.getElementById('cardForm');
const titleInput = document.getElementById('title');
const sourceInput = document.getElementById('source');
const descriptionInput = document.getElementById('description');
const resultDiv = document.getElementById('result');
const cardDiv = document.getElementById('card');
const copyBtn = document.getElementById('copyBtn');

// Функция создания карточки
function createCard(title, source, description) {
    // Экранируем HTML для безопасности
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    const safeTitle = escapeHtml(title);
    const safeSource = escapeHtml(source);
    const safeDescription = escapeHtml(description);

    return `
        <div class="card-title">${safeTitle}</div>
        <div class="card-source">📌 Источник: ${safeSource}</div>
        <div class="card-description">${safeDescription}</div>
    `;
}

// Обработчик отправки формы
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const source = sourceInput.value.trim();
    const description = descriptionInput.value.trim();

    // Валидация
    if (!title || !source || !description) {
        if (tg) {
            tg.showAlert('Пожалуйста, заполните все поля!');
        } else {
            alert('Пожалуйста, заполните все поля!');
        }
        return;
    }

    // Создаем карточку
    cardDiv.innerHTML = createCard(title, source, description);
    resultDiv.classList.remove('hidden');

    // Отправляем данные в Telegram бот (если нужно)
    if (tg) {
        tg.sendData(JSON.stringify({
            title: title,
            source: source,
            description: description
        }));
    }

    // Показываем уведомление
    if (tg) {
        tg.showPopup({
            title: '✅ Готово!',
            message: 'Карточка успешно создана',
            buttons: [{ type: 'ok' }]
        });
    }
});

// Копирование карточки в буфер обмена
copyBtn.addEventListener('click', function () {
    const cardText = cardDiv.textContent.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cardText)
            .then(() => {
                if (tg) {
                    tg.showAlert('📋 Карточка скопирована!');
                } else {
                    alert('📋 Карточка скопирована!');
                }
            })
            .catch(() => {
                fallbackCopy(cardText);
            });
    } else {
        fallbackCopy(cardText);
    }
});

// Резервный способ копирования
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        if (tg) {
            tg.showAlert('📋 Карточка скопирована!');
        } else {
            alert('📋 Карточка скопирована!');
        }
    } catch (err) {
        if (tg) {
            tg.showAlert('Не удалось скопировать');
        } else {
            alert('Не удалось скопировать');
        }
    }

    document.body.removeChild(textarea);
}

// Обработка данных от бота (если нужно)
if (tg) {
    tg.onEvent('mainButtonClicked', function () {
        // Обработка нажатия главной кнопки
    });
}
