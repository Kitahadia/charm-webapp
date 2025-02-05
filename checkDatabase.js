const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'users.db'), (err) => {
    if (err) {
        console.error('Ошибка при открытии базы данных:', err.message);
    } else {
        console.log('База данных успешно открыта.');
    }
});

db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log(rows);
});

// Закрываем базу данных
db.close(); 