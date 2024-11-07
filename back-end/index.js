const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database("./database/todo-list.db", sqlite3.OPEN_READWRITE);

app.use(express.json());
app.use(cors());

// API Endpoints
app.get('/lists', (req, res) => {
  db.all('SELECT * FROM list', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.get('/tasks/:listid', (req, res) => {
  const { listid } = req.params;
  db.all('SELECT * FROM task WHERE list_id = ?', [listid], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  })
});

app.post('/list', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO list (name) VALUES (?)', [name], function (err, rows) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

app.post('/task/:listid', (req, res) => {
  // Affectation par décomposition
  const { description } = req.body;
  const { listid } = req.params;
  db.run('INSERT INTO task (description, list_id) VALUES (?, ?)', [description, listid], function (err, rows) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).json({ id: this.lastID });
    }
  })
});

app.put('/list/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.run('UPDATE list SET name = ? WHERE id = ?', [name, id], (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).json({ id, name });
    }
  });
});

app.put('/task/:id', (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  db.run('UPDATE task SET description = ? WHERE id = ?', [description, id], (err) => {
    err ? res.status(500).send(err.message) : res.status(201).json({ id: id, description: description });
  })
});

app.delete('/list/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM list WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(204).send({ id: id });
    }
  });
});

app.delete('/task/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM task WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(204).send();
    }
  });
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});