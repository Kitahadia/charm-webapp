const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const { initDatabase, addUser, getAllUsers } = require('./database');
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
        // Устанавливаем новый webhook
        return bot.setWebHook(`${url}/bot${token}`);
    }).then(() => {
        console.log('Webhook установлен успешно на:', `${url}/bot${token}`);
    }).catch((error) => {
        console.error('Ошибка при установке webhook:', error);
    });
} else {
    bot = new TelegramBot(token, {polling: true});
}

// Инициализируем базу данных
initDatabase();

// После инициализации базы данных
getAllUsers().then(users => {
    console.log('Все пользователи:', users);
}).catch(err => {
    console.error('Ошибка при получении пользователей:', err);
});

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const user = {
        chat_id: msg.chat.id,
        username: msg.chat.username || 'Не указано',
        first_name: msg.chat.first_name || 'Не указано',
        last_name: msg.chat.last_name || 'Не указано'
    };
    
    // Сохраняем пользователя в базу данных
    addUser(user);
    console.log('Пользователь сохранен:', user);
});

// Обработка webhook запросов
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Запускаем express сервер на основном порту
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});