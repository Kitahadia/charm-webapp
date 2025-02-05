const tg = window.Telegram.WebApp;
tg.expand();
document.documentElement.setAttribute('data-theme', tg.colorScheme);
tg.onEvent('themeChanged', () => {
    document.documentElement.setAttribute('data-theme', tg.colorScheme);
}); 