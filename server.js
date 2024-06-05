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
  db.query(query, [Nombre, Apellido, Email, FechaRegistro, id], err => {
    if (err) throw err;
    res.send('Member updated successfully.');
  });
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Miembros WHERE MiembroID = ?';
  db.query(query, [id], err => {
    if (err) throw err;
    res.status(204).send();
  });
});

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

app.put('/api/libros/:id', (req, res) => {
  const { id } = req.params;
  const { Titulo, AutorID, Genero, FechaPublicacion } = req.body;
  const query = 'UPDATE Libros SET Titulo = ?, AutorID = ?, Genero = ?, FechaPublicacion = ? WHERE LibroID = ?';
  db.query(query, [Titulo, AutorID, Genero, FechaPublicacion, id], err => {
    if (err) throw err;
    res.send('Book updated successfully.');
  });
});

app.delete('/api/libros/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Libros WHERE LibroID = ?';
  db.query(query, [id], err => {
    if (err) throw err;
    res.status(204).send();
  });
});

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

// Rutas para gestionar reseñas
app.get('/api/reviews', (req, res) => {
  db.query('SELECT * FROM Reseñas', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/api/reviews', (req, res) => {
  const { LibroID, MiembroID, Calificación, Comentario, Fecha } = req.body;
  const query = 'INSERT INTO Reseñas (LibroID, MiembroID, Calificación, Comentario, Fecha) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [LibroID, MiembroID, Calificación, Comentario, Fecha], (err, results) => {
    if (err) throw err;
    res.status(201).send({ id: results.insertId });
  });
});

app.put('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const { LibroID, MiembroID, Calificación, Comentario, Fecha } = req.body;
  const query = 'UPDATE Reseñas SET LibroID = ?, MiembroID = ?, Calificación = ?, Comentario = ?, Fecha = ? WHERE ReseñaID = ?';
  db.query(query, [LibroID, MiembroID, Calificación, Comentario, Fecha, id], err => {
    if (err) throw err;
    res.send('Review updated successfully.');
  });
});




// Ruta para obtener categorías
app.get('/api/categorias', (req, res) => {
  db.query('SELECT * FROM Categorias', (err, results) => {
    if (err) throw err;
    res.send(results);
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


// Rutas para gestionar editoriales
app.get('/api/editoriales', (req, res) => {
  db.query('SELECT * FROM Editoriales', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});


// Ruta para obtener libroseditoriales
app.get('/api/libroseditoriales', (req, res) => {
  db.query('SELECT * FROM libroseditoriales', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});


// Ruta para obtener librosCategoria
app.get('/api/librocategorias', (req, res) => {
  db.query('SELECT * FROM librocategorias', (err, results) => {
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




// Insertar autores
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

// Ruta para obtener todos los autores
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


