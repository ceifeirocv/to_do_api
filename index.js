import express from 'express';
import * as dotenv from 'dotenv';

import router from './routes/todosRoutes.js';
import checkJson from './middleware/checkJson.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(checkJson)

app.use('/todos', router)

app.get('/', (req, res) => {
  res.status(200).json({"message":"ToDo API"});
})

app.use((req, res) => {
  res.status(404).json({"message":"Page not found"});
})

app.listen(PORT, () => {
  console.log(`listening on http://127.0.0.1:${PORT}`);
})