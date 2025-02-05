const TelegramBot = require('node-telegram-bot-api');

// Используем токен из переменных окружения
const token = process.env.BOT_TOKEN || '7801887774:AAHhq-alI_ZBntoYHHH5uWEfcJuRb-ms3fo';
const bot = new TelegramBot(token, {polling: true});

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        console.log('Получена команда /start от:', chatId); // Добавляем лог
        
        const keyboard = {
            reply_markup: {
                keyboard: [[{
                    text: "Открыть Charm",
                    web_app: {url: 'https://kitahadia.github.io/charm-webapp'}
                }]],
                resize_keyboard: true
            }
        };
        
        await bot.sendMessage(chatId, 'Добро пожаловать в Charm! Нажмите кнопку ниже, чтобы открыть приложение:', keyboard);
        console.log('Сообщение отправлено успешно'); // Добавляем лог
    } catch (error) {
        console.error('Ошибка при обработке /start:', error);
    }
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

// Показываем, что бот запущен
console.log('Бот запущен и ожидает команды...');