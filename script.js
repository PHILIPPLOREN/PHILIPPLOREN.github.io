// Инициализация Telegram Web App
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.expand();
    tg.ready();
}

// Получаем элементы
const form = document.getElementById('cardForm');
const titleInput = document.getElementById('title');
const sourceInput = document.getElementById('source');
const descriptionInput = document.getElementById('description');
const resultDiv = document.getElementById('result');
const formattedTextDiv = document.getElementById('formattedText');
const copyBtn = document.getElementById('copyBtn');
const copyPlainBtn = document.getElementById('copyPlainBtn');

// Функция генерации форматированного текста
function generateFormattedText(title, source, description) {
    // Экранируем HTML для безопасности
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };
    
    const safeTitle = escapeHtml(title);
    const safeSource = escapeHtml(source);
    const safeDescription = escapeHtml(description);
    
    // Формируем HTML по шаблону
    let html = `<b>${safeTitle}</b>`;
    
    // Добавляем источник только если он указан
    if (source && source.trim() !== '') {
        html += `<i>Источник: ${safeSource}</i>`;
    }
    
    html += `\n\n<blockquote>${safeDescription}</blockquote>\n\n`;
    html += `<b>// <a href="t.me/RumorsGI">@RumorsGI</a> //</b>`;
    
    return html;
}

// Функция получения чистого текста (без HTML тегов)
function getPlainText(title, source, description) {
    let text = title;
    
    if (source && source.trim() !== '') {
        text += `Источник: ${source}`;
    }
    
    text += `\n\n${description}\n\n`;
    text += `// @RumorsGI //`;
    
    return text;
}

// Обработчик отправки формы
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const source = sourceInput.value.trim();
    const description = descriptionInput.value.trim();
    
    // Валидация
    if (!title) {
        if (tg) {
            tg.showAlert('Пожалуйста, укажите заголовок!');
        } else {
            alert('Пожалуйста, укажите заголовок!');
        }
        return;
    }
    
    if (!description) {
        if (tg) {
            tg.showAlert('Пожалуйста, укажите описание!');
        } else {
            alert('Пожалуйста, укажите описание!');
        }
        return;
    }
    
    // Генерируем форматированный текст
    const formattedHtml = generateFormattedText(title, source, description);
    formattedTextDiv.innerHTML = formattedHtml;
    resultDiv.classList.remove('hidden');
    
    // Сохраняем данные для отправки
    const data = {
        title: title,
        source: source || null,
        description: description,
        formatted: formattedHtml,
        plain: getPlainText(title, source, description)
    };
    
    // Отправляем данные в бот
    if (tg) {
        tg.sendData(JSON.stringify(data));
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

// Копирование HTML
copyBtn.addEventListener('click', function() {
    const htmlContent = formattedTextDiv.innerHTML;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(htmlContent)
            .then(() => showNotification('✅ HTML скопирован!'))
            .catch(() => fallbackCopy(htmlContent));
    } else {
        fallbackCopy(htmlContent);
    }
});

// Копирование plain text
copyPlainBtn.addEventListener('click', function() {
    const title = titleInput.value.trim();
    const source = sourceInput.value.trim();
    const description = descriptionInput.value.trim();
    const plainText = getPlainText(title, source, description);
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(plainText)
            .then(() => showNotification('✅ Текст скопирован!'))
            .catch(() => fallbackCopy(plainText));
    } else {
        fallbackCopy(plainText);
    }
});

// Резервное копирование
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showNotification('✅ Скопировано!');
    } catch (err) {
        showNotification('❌ Не удалось скопировать');
    }
    
    document.body.removeChild(textarea);
}

// Уведомления
function showNotification(message) {
    if (tg) {
        tg.showAlert(message);
    } else {
        alert(message);
    }
}

// Обработка данных от бота
if (tg) {
    tg.onEvent('mainButtonClicked', function() {
        // Действие при нажатии главной кнопки
    });
}
