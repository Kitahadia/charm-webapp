const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Создаем подключение к базе данных
const db = new sqlite3.Database(path.join(__dirname, 'users.db'));

// Инициализация базы данных
function initDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        chat_id INTEGER UNIQUE,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        join_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

// Добавление нового пользователя
function addUser(user) {
    const sql = `INSERT OR IGNORE INTO users (chat_id, username, first_name, last_name) 
                 VALUES (?, ?, ?, ?)`;
    db.run(sql, [user.chat_id, user.username, user.first_name, user.last_name]);
}

// Получение всех пользователей
function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

// Получение количества пользователей
function getUserCount() {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
            if (err) reject(err);
            resolve(row.count);
        });
    });
}

module.exports = {
    initDatabase,
    addUser,
    getAllUsers,
    getUserCount
}; 