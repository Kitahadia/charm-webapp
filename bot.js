const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// Создаем бота
const token = '7801887774:AAHhq-alI_ZBntoYHHH5uWEfcJuRb-ms3fo';
const bot = new TelegramBot(token, {polling: true});

// Добавляем простой веб-сервер
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Бот работает!');
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    // Создаем клавиатуру с веб-приложением
    const keyboard = {
        reply_markup: {
            keyboard: [[{
                text: "Открыть Charm",
                web_app: {url: 'https://kitahadia.github.io/charm-webapp'}
            }]],
            resize_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'Добро пожаловать в Charm! Нажмите кнопку ниже, чтобы открыть приложение:', keyboard);
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
        console.log('Получены данные от веб-приложения:', msg.web_app_data); // Добавляем лог
        
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

// Запуск бота
console.log('Бот запущен и ожидает команды...');