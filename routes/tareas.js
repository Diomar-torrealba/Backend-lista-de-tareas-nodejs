const db = require('../db');

const tareasRouter = require('express').Router();

tareasRouter.post('/', async (request, response) => {
  try {
    // Obtener el texto y el chquear del body
    const { texto, chequear } = request.body;

    // Crear una tarea en la base de datos
    const statement = db.prepare(
      `
    INSERT INTO tareas (texto, chequear, user_id) VALUES (?, ?, ?) RETURNING *
  `,
    );
    const newUser = statement.get(texto, chequear, Number(request.query.userId));
    return response.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    console.log('error loco');
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('error sql');
      return response.status(400).json({ error: 'El email ya esta en uso' });
    }

    return response.sendStatus(400);
  }
});

//Eliminar una tarea
tareasRouter.delete('/:id', async (request, response) => {
  try {
    // eliminar una tarea
    const tareaIdToDelete = request.params.id;

    const statement = db.prepare(
      `
    DELETE FROM tareas WHERE tarea_id = ? AND user_id = ? RETURNING *
  `,
    );
    const deletetarea = statement.get(Number(tareaIdToDelete), Number(request.query.userId));

    if (!deletetarea) {
      return response.status(400).json({ message: 'la tarea no existe' });
    }
    return response.status(200).json({ message: 'La tarea ha sido eliminado' });
  } catch (error) {
    console.log(error);
    console.log('error loco');
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('error sql');
      return response.status(400).json({ error: 'El email ya esta en uso' });
    }

    return response.sendStatus(400);
  }
});

tareasRouter.put('/:id', async (request, response) => {
  try {
    //     // Obtener el nombre y el telefono del body
    const { chequear } = request.body;
    //     // Validar el nombre y telefono
    //     if (!REGEX_NAME.test(name)) {
    //       console.log('namemalo');
    //       return response.status(400).json({ error: 'El nombre es invalido.' });
    //     } else if (!REGEX_NUMBER.test(phone)) {
    //       console.log('numbermalo');
    //       return response.status(400).json({ error: 'El numero es invalido.' });
    //     }
    //     // Crear el usuario en la base de datos
    console.log(121121212112, typeof chequear);
    const statement = db.prepare(
      `
    UPDATE tareas 
    SET chequear = ?
    WHERE tarea_id = ? AND user_id = ?
    RETURNING *
  `,
    );

    const updatedtareas = statement.get(
      chequear,
      Number(request.params.id),
      Number(request.query.userId),
    );

    if (!updatedtareas) {
      console.log('ESROY ACA');
      return response.status(400).json({ message: 'La tarea no existe' });
    }
    return response.status(200).json(updatedtareas);
  } catch (error) {
    console.log(error);
    console.log('error loco');
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('error sql');
      return response.status(400).json({ error: 'El email ya esta en uso' });
    }

    return response.sendStatus(400);
  }
});

//OBTENER TAREA
tareasRouter.get('/', async (request, response) => {
  try {
    const statement = db.prepare(' SELECT * FROM tareas WHERE  user_id = ?  ');

    const tareita = statement.all(Number(request.query.userId));

    return response.status(200).json(tareita);
  } catch (error) {
    console.log(error);

    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('error sql');

      return response.status(400).json({ error: 'El email ya esta en uso' });
    }

    return response.sendStatus(400);
  }
});



module.exports = tareasRouter;
