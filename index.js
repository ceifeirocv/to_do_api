import express from 'express';
import {v4 as uuidv4} from 'uuid';


const app = express();
const PORT = 5000;

app.use(express.json());

let todos = [];


app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

app.post('/todos', (req, res) => {
  const { title, description } = req.body
  
  if (!title || title.length <= 5 || title.length > 50 ){
    res.status(400).json({"message":"Title must contain 5 to 50 character"});
    return;
  }   
  if (!description || description.length <= 5 || description.length > 250){
    res.status(400).json({"message":"Description must contain 5 to 50 character"});
    return;
  }
  
  const todo = {
    "id": uuidv4(),
    "title": title,
    "descripton": description,
    "in_progress": true
  };

  todos.push(todo);

  res.status(201).json({
    "message":`To Do: ${title} added to list`,
    "todo" : todo
  });
});


app.get('/', (req, res) => {
  res.status(200).json({"message":"ToDo API"});
})

app.use((req, res) => {
  res.status(404).json({"message":"Page not found"});
})

app.listen(PORT, () => {
  console.log(`listening on http://127.0.0.1:${PORT}`);
})