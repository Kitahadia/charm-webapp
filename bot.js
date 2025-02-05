const TelegramBot = require('node-telegram-bot-api');

// Создаем бота (токен перенесите в защищенный конфиг)
const bot = new TelegramBot('7801887774:AAHhq-alI_ZBntoYHHH5uWEfcJuRb-ms3fo', {polling: true});

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    // Создаем клавиатуру с веб-приложением
    const keyboard = {
        reply_markup: {
            keyboard: [[{
                text: "Открыть Charm",
                web_app: {url: 'https://your-domain.com'} // Замените на ваш домен
            }]],
            resize_keyboard: true
        }
    };
    
    bot.sendMessage(chatId, 'Добро пожаловать в Charm! Нажмите кнопку ниже, чтобы открыть приложение:', keyboard);
});

// Обработка данных от веб-приложения
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app_data.data);
    
    // Обработка различных действий
    switch(data.action) {
        case 'order':
            bot.sendMessage(chatId, `Заказ ${data.title} оформлен!`);
            break;
        case 'info':
            bot.sendMessage(chatId, `Информация о ${data.title} отправлена!`);
            break;
        default:
            bot.sendMessage(chatId, 'Получены данные от веб-приложения');
    }
}); 

// Запуск бота
bot.on('polling_error', (error) => { console.error(error); });