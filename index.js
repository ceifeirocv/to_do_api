/* eslint-disable no-console */
const express = require('express');
require('dotenv').config();

const router = require('./routes/todoRoutes');
const checkJson = require('./middleware/checkJson');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(checkJson);

app.use('/todos', router);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'ToDo API' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Resourse do not exist.' });
});

app.listen(PORT, () => {
  console.log(`listening on http://127.0.0.1:${PORT}`);
});
