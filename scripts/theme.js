const app = {
  init() {
    this.tg = window.Telegram.WebApp;
    this.initTheme();
    this.initButtons();
    this.tg.ready(); // Сообщаем Telegram, что приложение готово
  },

  initTheme() {
    // Используем тему из Telegram
    const theme = this.tg.colorScheme;
    document.documentElement.setAttribute('data-theme', theme);

    // Слушаем изменения темы
    this.tg.onEvent('themeChanged', () => {
      document.documentElement.setAttribute('data-theme', this.tg.colorScheme);
    });
  },

  initButtons() {
    // Обработчики для карточек
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('.card__title').textContent;
        this.tg.showPopup({
          title: title,
          message: 'Выберите действие',
          buttons: [
            {id: "order", type: "default", text: "Заказать"},
            {id: "cancel", type: "cancel", text: "Отмена"}
          ]
        }, (buttonId) => {
          if (buttonId === 'order') {
            this.tg.sendData(JSON.stringify({
              action: 'order',
              title: title
            }));
          }
        });
      });
    });

    // Обработчики для кнопок "Подробнее"
    document.querySelectorAll('.button').forEach(button => {
      if (button.textContent === 'Подробнее') {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const section = button.closest('.brands-section, .join-section');
          const title = section.querySelector('h2').textContent;
          this.tg.sendData(JSON.stringify({
            action: 'info',
            title: title
          }));
        });
      }
    });
  }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  app.init();
}); 