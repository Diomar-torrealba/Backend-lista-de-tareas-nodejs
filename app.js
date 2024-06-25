const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./routes/users');
const tareasRouter = require('./routes/tareas');
const verifyUser = require('./middlewares/verifyUser');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));

// Rutas backend
app.get('/', async (request, response) => {
  return response.status(200).json({ hola: 'mundo' });
});
app.use(cors());
app.use('/api/users', usersRouter);
app.use('/api/tareas/', verifyUser, tareasRouter);

module.exports = app;
