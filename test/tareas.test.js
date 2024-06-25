const supertest = require('supertest');
const app = require('../app');
const { describe, test, expect, beforeAll } = require('@jest/globals');
const db = require('../db');
const api = supertest(app);
let user;
let tarea;
let tareas = [
  {
    texto: 'limpiar',
    chequear: '0',
  },
  {
    texto: 'cocinar',
    chequear: '1',
  },
  {
    texto: 'trabajar',
    chequear: '1',
  },
];

describe('ruta tareas', () => {
  describe('crear tarea', () => {
    beforeAll(() => {
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
      INSERT INTO users (email) VALUES (?) RETURNING *
    `,
      );
      user = statementCreateUser.get('gabitodev@gmail.com');
    });
    test('crea una tarea cuando todo es correcto', async () => {
      const response = await api
        .post('/api/tareas')
        .query({ userId: user.user_id })
        .send({ texto: 'bailar', chequear: 0 })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        tarea_id: 1,
        texto: 'bailar',
        chequear: 0,
        user_id: 1,
      });
    });
  });
});
describe('eliminar contacto', () => {
  beforeAll(() => {
    // Creo un usuario
    const statementDeleteUsers = db.prepare('DELETE FROM users');
    statementDeleteUsers.run();
    const statementCreateUser = db.prepare(
      `
      INSERT INTO users (email) VALUES (?) RETURNING *
    `,
    );
    user = statementCreateUser.get('gabitodev@gmail.com');

    // Creo un contacto
    const statementDeleteTareas = db.prepare('DELETE FROM tareas');
    statementDeleteTareas.run();
    const statementCreateTarea = db.prepare(
      `
      INSERT INTO tareas (texto, chequear, user_id) VALUES (?, ?, ?) RETURNING *
    `,
    );
    tarea = statementCreateTarea.get('bailar', 0, user.user_id);
  });
  test('elimina una tarea cuando todo es correcto', async () => {
    const response = await api
      .delete(`/api/tareas/${tarea.tarea_id}`)
      .query({ userId: user.user_id })
      .expect(200)
      .expect('Content-type', /json/);
    expect(response.body).toStrictEqual({
      message: 'La tarea ha sido eliminado',
    });
  });
});

describe('actualiza una tarea', () => {
  beforeAll(() => {
    const statementDeleteUsers = db.prepare('DELETE FROM users');
    statementDeleteUsers.run();
    const statementCreateUser = db.prepare(
      `
              INSERT INTO users (email) VALUES (?) RETURNING * `,
    );
    user = statementCreateUser.get('gabitodev@gmail.com');
    const statementDeleteTareas = db.prepare('DELETE FROM tareas');
    statementDeleteTareas.run();
    const statementCreateTarea = db.prepare(
      `
                INSERT INTO tareas (texto, user_id, chequear) VALUES (?, ?, ?) RETURNING * `,
    );
    tarea = statementCreateTarea.get('Tengo que hacer la tarea',user.user_id, 1);
   
  });
 
  test('actualiza una tarea cuando todo es correcto', async () => {
    const response = await api
      .put(`/api/tareas/${tarea.tarea_id}`)
      .send({ chequear: 1 })
      .query({ userId: user.user_id })
      .expect(200)
      .expect('Content-type', /json/);
    expect(response.body).toStrictEqual({
      chequear: 1,
      tarea_id: 1,
      texto: 'Tengo que hacer la tarea',
      user_id: 1,
    })
  });
  console.log(2);
});

//OBTENER TAREA
describe('obtener las tareas', () => {
  beforeAll(() => {
    const statementDeleteUsers = db.prepare('DELETE FROM users');
    statementDeleteUsers.run();
    const statementCreateUser = db.prepare(
      `
              INSERT INTO users (email) VALUES (?) RETURNING * `,
    );
    user = statementCreateUser.get('gabitodev@gmail.com');
    const statementDeleteTareas = db.prepare('DELETE FROM tareas');
    statementDeleteTareas.run();

    tareas = tareas.map((list) => {
      const statementCreateTarea = db.prepare(
        `
                    INSERT INTO tareas (texto, chequear, user_id) VALUES (?, ?, ?) RETURNING * `,
      );
      return statementCreateTarea.get(list.texto, list.chequear, user.user_id);
    });
  });
  test('obtener todas las tarea cuando todo es correcto', async () => {
    const response = await api
      .get('/api/tareas/')
      .query({ userId: user.user_id })
      .expect(200)
      .expect('Content-type', /json/);
    expect(response.body.length).toBe(tareas.length);
  });
});


