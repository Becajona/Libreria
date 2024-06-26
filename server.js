const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3006; 

// Analizar cuerpos de solicitudes JSON
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo HTML (parar su ejecución)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Asegúrate de que aquí pones tu contraseña
  database: 'libreria'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});


// Rutas para gestionar miembros
app.get('/api/members', (req, res) => {
  db.query('SELECT * FROM Miembros', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/api/members', (req, res) => {
  const { Nombre, Apellido, Email, FechaRegistro } = req.body;
  const query = 'INSERT INTO Miembros (Nombre, Apellido, Email, FechaRegistro) VALUES (?, ?, ?, ?)';
  db.query(query, [Nombre, Apellido, Email, FechaRegistro], (err, results) => {
    if (err) throw err;
    res.status(201).send({ id: results.insertId });
  });
});

app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Email, FechaRegistro } = req.body;
  const query = 'UPDATE Miembros SET Nombre = ?, Apellido = ?, Email = ?, FechaRegistro = ? WHERE MiembroID = ?';
  db.query(query, [Nombre, Apellido, Email, FechaRegistro, id], (err, results) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});



// Ruta para eliminar un miembro por su ID
app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Miembros WHERE MiembroID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el miembro:', err);
      res.status(500).send({ message: 'Error al eliminar el miembro' });
    } else {
      console.log('Miembro eliminado correctamente');
      res.status(204).send(); // No content
    }
  });
});


///*********************************librossss******************************* */
// Rutas para gestionar libros
app.get('/api/libros', (req, res) => {
  db.query('SELECT * FROM Libros', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/api/libros', (req, res) => {
  const { Titulo, AutorID, Genero, FechaPublicacion } = req.body;
  const query = 'INSERT INTO Libros (Titulo, AutorID, Genero, FechaPublicacion) VALUES (?, ?, ?, ?)';
  db.query(query, [Titulo, AutorID, Genero, FechaPublicacion], (err, results) => {
    if (err) throw err; 
    res.status(201).send({ id: results.insertId });
  });
});

// Ruta para actualizar un libro
app.put('/api/libros/:id', (req, res) => {
  const { id } = req.params;
  const { Titulo, AutorID, Genero, FechaPublicacion } = req.body;
  const query = 'UPDATE Libros SET Titulo = ?, AutorID = ?, Genero = ?, FechaPublicacion = ? WHERE LibroID = ?';

  db.query(query, [Titulo, AutorID, Genero, FechaPublicacion, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar el libro:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.status(200).send("Libro actualizado correctamente");
  });
});

// Ruta para obtener un libro por su ID (usada para editar)
app.get('/api/libros/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Libros WHERE LibroID = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el libro:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("Libro no encontrado");
      return;
    }
    res.json(results[0]);
  });
});


app.delete('/api/libros/:id', (req, res) => {
  const { id } = req.params;

  // Primero eliminar registros relacionados en la tabla DetallePrestamos
  const deleteDetallePrestamosQuery = 'DELETE FROM DetallePrestamos WHERE LibroID = ?';
  db.query(deleteDetallePrestamosQuery, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar registros en DetallePrestamos:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }

    // Luego eliminar registros relacionados en la tabla LibrosEditoriales
    const deleteLibrosEditorialesQuery = 'DELETE FROM LibrosEditoriales WHERE LibroID = ?';
    db.query(deleteLibrosEditorialesQuery, [id], (err, result) => {
      if (err) {
        console.error("Error al eliminar registros en LibrosEditoriales:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }

      // Luego eliminar registros relacionados en la tabla LibroCategorias
      const deleteLibroCategoriasQuery = 'DELETE FROM LibroCategorias WHERE LibroID = ?';
      db.query(deleteLibroCategoriasQuery, [id], (err, result) => {
        if (err) {
          console.error("Error al eliminar registros en LibroCategorias:", err);
          res.status(500).send("Error interno del servidor");
          return;
        }

        // Finalmente eliminar el libro en sí
        const deleteLibroQuery = 'DELETE FROM Libros WHERE LibroID = ?';
        db.query(deleteLibroQuery, [id], (err, result) => {
          if (err) {
            console.error("Error al eliminar el libro:", err);
            res.status(500).send("Error interno del servidor");
            return;
          }

          // Si se eliminó correctamente el libro
          res.status(204).send(); // Envía una respuesta 204 (No Content)
        });
      });
    });
  });
});






/******************************************************** */










// Rutas para gestionar préstamos
app.get('/api/loans', (req, res) => {
  db.query('SELECT * FROM Prestamos', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});


app.post('/api/loans', (req, res) => {
  const { MiembroID, FechaPrestamo, FechaDevolucion, Estado } = req.body;
  const query = 'INSERT INTO Prestamos (MiembroID, FechaPrestamo, FechaDevolucion, Estado) VALUES (?, ?, ?, ?)';
  db.query(query, [MiembroID, FechaPrestamo, FechaDevolucion, Estado], (err, results) => {
    if (err) throw err;
    res.status(201).send({ id: results.insertId });
  });
});

app.put('/api/loans/:id', (req, res) => {
  const { id } = req.params;
  const { MiembroID, FechaPrestamo, FechaDevolucion, Estado } = req.body;
  const query = 'UPDATE Prestamos SET MiembroID = ?, FechaPrestamo = ?, FechaDevolucion = ?, Estado = ? WHERE PrestamoID = ?';
  db.query(query, [MiembroID, FechaPrestamo, FechaDevolucion, Estado, id], err => {
    if (err) throw err;
    res.send('Loan updated successfully.');
  });
});

app.delete('/api/loans/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Prestamos WHERE PrestamoID = ?';
  db.query(query, [id], err => {
    if (err) throw err;
    res.status(204).send();
  });
});


/*---------------------------------------Reseñas---------------------- */
// Endpoint para obtener los detalles de reseñas
app.get('/api/reviews', (req, res) => {
  const query = `
    SELECT 
        R.ReseñaID, 
        L.Titulo AS TituloLibro, 
        CONCAT(M.Nombre, ' ', M.Apellido) AS NombreMiembro, 
        R.Calificación, 
        R.Comentario, 
        R.Fecha
    FROM 
        Reseñas R
    JOIN 
        Libros L ON R.LibroID = L.LibroID
    JOIN 
        Miembros M ON R.MiembroID = M.MiembroID
    LIMIT 0, 25;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reviews from the database:', err);
      res.status(500).send('Error fetching reviews from the database');
      return;
    }
    res.json(results);
  });
});


// Ruta para agregar una nueva reseña
app.post('/api/reviews', (req, res) => {
  const { libroID, miembroID, calificación, comentario, fecha } = req.body;
  const query = 'INSERT INTO Reseñas (LibroID, MiembroID, Calificación, Comentario, Fecha) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [libroID, miembroID, calificación, comentario, fecha], (err, result) => {
    if (err) {
      console.error('Error adding new review:', err);
      res.status(500).send({ message: 'Error adding new review' });
    } else {
      res.status(201).send({ message: 'Review added successfully' });
    }
  });
});

// Ruta para eliminar una reseña por su ID
app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Reseñas WHERE ReseñaID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting review:', err);
      res.status(500).send({ message: 'Error deleting review' });
    } else {
      res.status(204).send(); // No content
    }
  });
});

// Ruta para actualizar una reseña por su ID
app.put('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const { libroID, miembroID, calificación, comentario, fecha } = req.body;
  const query = 'UPDATE Reseñas SET LibroID = ?, MiembroID = ?, Calificación = ?, Comentario = ?, Fecha = ? WHERE ReseñaID = ?';
  db.query(query, [libroID, miembroID, calificación, comentario, fecha, id], (err, result) => {
    if (err) {
      console.error('Error updating review:', err);
      res.status(500).send({ message: 'Error updating review' });
    } else {
      res.status(200).send({ message: 'Review updated successfully' });
    }
  });
});






// Endpoint para obtener los detalles de categorías
app.get('/api/categorias', (req, res) => {
  const query = 'SELECT * FROM Categorias';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories from the database:', err);
      res.status(500).send('Error fetching categories from the database');
      return;
    }
    res.json(results);
  });
});

// Ruta para agregar una nueva categoría
app.post('/api/categorias', (req, res) => {
  const { nombre, descripcion } = req.body;
  const query = 'INSERT INTO Categorias (Nombre, Descripcion) VALUES (?, ?)';
  db.query(query, [nombre, descripcion], (err, result) => {
    if (err) {
      console.error('Error adding new category:', err);
      res.status(500).send({ message: 'Error adding new category' });
    } else {
      res.status(201).send({ message: 'Category added successfully' });
    }
  });
});

// Ruta para eliminar una categoría por su ID
app.delete('/api/categorias/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Categorias WHERE CategoriaID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      res.status(500).send({ message: 'Error deleting category' });
    } else {
      res.status(204).send(); // No content
    }
  });
});

// Ruta para actualizar una categoría por su ID
app.put('/api/categorias/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const query = 'UPDATE Categorias SET Nombre = ?, Descripcion = ? WHERE CategoriaID = ?';
  db.query(query, [nombre, descripcion, id], (err, result) => {
    if (err) {
      console.error('Error updating category:', err);
      res.status(500).send({ message: 'Error updating category' });
    } else {
      res.status(200).send({ message: 'Category updated successfully' });
    }
  });
});




app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Reseñas WHERE ReseñaID = ?';
  db.query(query, [id], err => {
    if (err) throw err;
    res.status(204).send();
  });
});

// Endpoint para obtener los detalles de editoriales
app.get('/api/editoriales', (req, res) => {
  const query = 'SELECT * FROM Editoriales';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching editorials from the database:', err);
      res.status(500).send('Error fetching editorials from the database');
      return;
    }
    res.json(results);
  });
});

// Ruta para agregar una nueva editorial
app.post('/api/editoriales', (req, res) => {
  const { nombre, pais } = req.body;
  const query = 'INSERT INTO Editoriales (Nombre, Pais) VALUES (?, ?)';
  db.query(query, [nombre, pais], (err, result) => {
    if (err) {
      console.error('Error adding new editorial:', err);
      res.status(500).send({ message: 'Error adding new editorial' });
    } else {
      res.status(201).send({ message: 'Editorial added successfully' });
    }
  });
});

// Ruta para eliminar una editorial por su ID
app.delete('/api/editoriales/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Editoriales WHERE EditorialID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting editorial:', err);
      res.status(500).send({ message: 'Error deleting editorial' });
    } else {
      res.status(204).send(); // No content
    }
  });
});

// Ruta para actualizar una editorial por su ID
app.put('/api/editoriales/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, pais } = req.body;
  const query = 'UPDATE Editoriales SET Nombre = ?, Pais = ? WHERE EditorialID = ?';
  db.query(query, [nombre, pais, id], (err, result) => {
    if (err) {
      console.error('Error updating editorial:', err);
      res.status(500).send({ message: 'Error updating editorial' });
    } else {
      res.status(200).send({ message: 'Editorial updated successfully' });
    }
  });
});



// Ruta para obtener libroseditoriales
app.get('/api/libroseditoriales', (req, res) => {
  db.query(`
    SELECT L.Titulo AS TituloLibro, E.Nombre AS NombreEditorial
    FROM LibrosEditoriales LE
    JOIN Libros L ON LE.LibroID = L.LibroID
    JOIN Editoriales E ON LE.EditorialID = E.EditorialID;
  `, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});





// Ruta para obtener librosCategoria
app.get('/api/librocategorias', (req, res) => {
  db.query(`
    SELECT L.Titulo AS TituloLibro, C.Nombre AS NombreCategoria
    FROM LibroCategorias LC
    JOIN Libros L ON LC.LibroID = L.LibroID
    JOIN Categorias C ON LC.CategoriaID = C.CategoriaID;
  `, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Ruta para eliminar un libroCategoria
app.delete('/api/librocategorias/:libroID/:categoriaID', (req, res) => {
  const { libroID, categoriaID } = req.params;
  db.query('DELETE FROM librocategorias WHERE LibroID = ? AND CategoriaID = ?', [libroID, categoriaID], (err, result) => {
    if (err) throw err;
    res.send({ message: 'Entrada eliminada exitosamente' });
  });
});


// actualizar un libroCategoria
app.put('/api/librocategorias/:libroID/:categoriaID', (req, res) => {
  const { libroID, categoriaID } = req.params;
  const { nuevoLibroID, nuevaCategoriaID } = req.body;

  db.query('UPDATE librocategorias SET LibroID = ?, CategoriaID = ? WHERE LibroID = ? AND CategoriaID = ?', [nuevoLibroID, nuevaCategoriaID, libroID, categoriaID], (err, result) => {
    if (err) throw err;
    res.send({ message: 'Entrada actualizada exitosamente' });
  });
});



/*---------------------------------------Auores---------------------- */


// Insertar un nuevo autor
app.post('/api/autores', (req, res) => {
  const { Nombre, Apellido } = req.body;
  const query = 'INSERT INTO Autores (Nombre, Apellido) VALUES (?, ?)';
  db.query(query, [Nombre, Apellido], (err, results) => {
      if (err) {
          console.error('Error al insertar autor:', err);
          res.status(500).send('Error al insertar autor en la base de datos');
          return;
      }
      res.status(201).send({ id: results.insertId });
  });
});

// Obtener todos los autores
app.get('/api/autores', (req, res) => {
  db.query('SELECT * FROM Autores', (err, results) => {
      if (err) {
          console.error('Error al obtener autores:', err);
          res.status(500).send('Error al obtener autores de la base de datos');
          return;
      }
      res.send(results);
  });
});

// Actualizar un autor existente
app.put('/api/autores/:id', (req, res) => {
  const AutorID = req.params.id;
  const { Nombre, Apellido } = req.body;
  const query = 'UPDATE Autores SET Nombre = ?, Apellido = ? WHERE AutorID = ?';
  db.query(query, [Nombre, Apellido, AutorID], (err, results) => {
      if (err) {
          console.error('Error al actualizar autor:', err);
          res.status(500).send('Error al actualizar autor en la base de datos');
          return;
      }
      res.status(200).send('Autor actualizado correctamente');
  });
});

// Eliminar un autor existente
app.delete('/api/autores/:id', (req, res) => {
  const AutorID = req.params.id;
  const query = 'DELETE FROM Autores WHERE AutorID = ?';
  db.query(query, [AutorID], (err, results) => {
      if (err) {
          console.error('Error al eliminar autor:', err);
          res.status(500).send('Error al eliminar autor de la base de datos');
          return;
      }
      res.status(200).send('Autor eliminado correctamente');
  });
});

/***********************************************************************************/

// Endpoint para obtener los detalles de préstamos
app.get('/api/prestamos', (req, res) => {
  const query = `
    SELECT 
      p.PrestamoID, 
      CONCAT(m.Nombre, ' ', m.Apellido) AS Miembro,
      l.Titulo AS Libro,
      p.FechaPrestamo,
      p.FechaDevolucion,
      p.Estado
    FROM Prestamos p
    JOIN Miembros m ON p.MiembroID = m.MiembroID
    LEFT JOIN Libros l ON p.LibroID = l.LibroID
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
      return;
    }
    res.json(results);
  });
});

// Ruta para agregar un nuevo préstamo
app.post('/api/prestamos', (req, res) => {
  const { miembroID, libroID, fechaPrestamo, fechaDevolucion, estado } = req.body;
  const query = 'INSERT INTO Prestamos (MiembroID, LibroID, FechaPrestamo, FechaDevolucion, Estado) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [miembroID, libroID, fechaPrestamo, fechaDevolucion, estado], (err, result) => {
    if (err) {
      console.error('Error adding new prestamo:', err);
      res.status(500).send({ message: 'Error adding new prestamo' });
    } else {
      res.status(201).send({ message: 'Prestamo added successfully' });
    }
  });
});

// Ruta para eliminar un préstamo por su ID
app.delete('/api/prestamos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Prestamos WHERE PrestamoID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting prestamo:', err);
      res.status(500).send({ message: 'Error deleting prestamo' });
    } else {
      res.status(204).send(); // No content
    }
  });
});



// Ruta para actualizar un préstamo por su ID
app.put('/api/prestamos/:id', (req, res) => {
  const { id } = req.params;
  const { miembroID, libroID, fechaPrestamo, fechaDevolucion, estado } = req.body;
  const query = `
    UPDATE Prestamos 
    SET MiembroID = ?, LibroID = ?, FechaPrestamo = ?, FechaDevolucion = ?, Estado = ?
    WHERE PrestamoID = ?
  `;
  db.query(query, [miembroID, libroID, fechaPrestamo, fechaDevolucion, estado, id], (err, result) => {
    if (err) {
      console.error('Error updating prestamo:', err);
      res.status(500).send({ message: 'Error updating prestamo' });
    } else {
      res.status(200).send({ message: 'Prestamo updated successfully' });
    }
  });
});