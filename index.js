import express from 'express';
import router from './routes/todosRoutes.js';



const app = express();
const PORT = 5000;

app.use(express.json());
app.use((err, req, res, next) => {
  if (err){
    res.status(400).json({"erro": 'Invalid Request data'});
  }else{
    next();
  }
})

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