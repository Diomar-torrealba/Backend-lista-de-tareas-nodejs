const Database = require('better-sqlite3');
const db = new Database('tareas.db');

module.exports = db;
