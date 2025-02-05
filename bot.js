const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// Создаем бота с webhook для продакшена
const url = 'https://charm-bot.onrender.com';
const token = '7801887774:AAHhq-alI_ZBntoYHHH5uWEfcJuRb-ms3fo';

let bot;
if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token, {
        webHook: {
            port: process.env.PORT || 10000
        }
    });
    bot.setWebHook(`${url}/bot${token}`);
} else {
    bot = new TelegramBot(token, {polling: true});
}

// Добавляем парсер JSON для webhook
app.use(express.json());

// Обработка webhook
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
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

// Обработка команды /stop
bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Бот остановлен.');
    process.exit(); // Завершает процесс бота
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

// Запускаем сервер на порту из переменной окружения
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    console.log('Бот запущен и ожидает команды...');
}).on('error', (err) => {
    console.error('Ошибка при запуске сервера:', err);
});