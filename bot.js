const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// Создаем бота с webhook для продакшена
const url = 'https://charm-bot.onrender.com';
const token = '7801887774:AAHhq-alI_ZBntoYHHH5uWEfcJuRb-ms3fo';

// Определяем порт один раз в начале файла
const PORT = process.env.PORT || 8080;

let bot;
if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token);
    
    // Сначала удалим старый webhook
    bot.deleteWebHook().then(() => {
        // Устанавливаем новый webhook с расширенными опциями
        return bot.setWebHook(`${url}/bot${token}`, {
            max_connections: 40,
            drop_pending_updates: true
        });
    }).then(() => {
        console.log('Webhook установлен успешно на:', `${url}/bot${token}`);
        // Проверяем информацию о webhook
        return bot.getWebHookInfo();
    }).then((info) => {
        console.log('Webhook info:', info);
    }).catch((error) => {
        console.error('Ошибка при установке webhook:', error);
    });
} else {
    bot = new TelegramBot(token, {polling: true});
}

// Добавляем парсер JSON для webhook
app.use(express.json());

// Добавим больше логирования
app.post(`/bot${token}`, (req, res) => {
    console.log('Получен webhook запрос:', req.body);
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Добавим обработку всех сообщений для отладки
bot.on('message', (msg) => {
    console.log('Получено сообщение:', msg);
});

// Простой эндпоинт для проверки
app.get('/', (req, res) => {
    res.send('Бот работает!');
});

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log('Получена команда /start от:', chatId);
    
    const keyboard = {
        reply_markup: {
            keyboard: [[{
                text: "Открыть Charm",
                web_app: {url: 'https://kitahadia.github.io/charm-webapp'}
            }]],
            resize_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'Добро пожаловать в Charm! Нажмите кнопку ниже, чтобы открыть приложение:', keyboard)
        .then(() => console.log('Сообщение отправлено успешно'))
        .catch(error => console.error('Ошибка при отправке:', error));
});

// Обработка данных от веб-приложения
bot.on('web_app_data', async (msg) => {
    try {
        const chatId = msg.chat.id;
        console.log('Получены данные от веб-приложения:', msg.web_app_data);
        
        const data = JSON.parse(msg.web_app_data.data);
        
        switch(data.action) {
            case 'order':
                await bot.sendMessage(chatId, `Заказ ${data.title} оформлен!`);
                break;
            case 'info':
                await bot.sendMessage(chatId, `Информация о ${data.title} отправлена!`);
                break;
            default:
                await bot.sendMessage(chatId, 'Получены данные от веб-приложения');
        }
    } catch (error) {
        console.error('Ошибка при обработке web_app_data:', error);
    }
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error);
});

// Запускаем express сервер на основном порту
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Бот запущен и ожидает команды...');
}).on('error', (err) => {
    console.error('Ошибка при запуске сервера:', err);
});