const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'users.db'));

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    chat_id INTEGER UNIQUE,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) {
        console.error('Ошибка при создании таблицы:', err.message);
    } else {
        console.log('Таблица users успешно создана или уже существует.');
    }
});

db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log('Все пользователи:', rows);
});

// Закрываем базу данных
db.close(); 