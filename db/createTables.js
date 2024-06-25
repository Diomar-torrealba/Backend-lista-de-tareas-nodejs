const db = require('.');

const createUsersTable = async () => {
  const statement = db.prepare(`
  CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE
  )
  `);
  statement.run();
  console.log('Tabla de usuarios creada');
};

const createTareasTable = async () => {
  const statement = db.prepare(`
  CREATE TABLE tareas (
    tarea_id INTEGER PRIMARY KEY,
    texto TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    chequear INTERGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id)
      REFERENCES users (user_id)
      ON DELETE CASCADE
  )
  `);
  statement.run();
  console.log('Tabla de tareas creada');
};

const createTables = async () => {
  await createUsersTable();
  await createTareasTable();
};

createTables();
