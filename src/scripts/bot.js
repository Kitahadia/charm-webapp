const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('YOUR_TOKEN', {polling: true});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
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
