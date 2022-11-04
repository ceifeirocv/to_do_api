import express from 'express';
import {v4 as uuidv4} from 'uuid';


const app = express();
const PORT = 5000;

app.use(express.json());
app.use((err, req, res, next) => {
  if (err){
    res.status(400).json({"message": "Invalid Request data"});
  } else {
    next();
  }
})

let todos = [];


app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  const todo = todos.find((todo) => todo.id === id);
  if(!todo) {
    res.status(404).json({"message":"Todo do not exist, provide a valid Id "});
    return;
  }
  res.status(200).json(todo);
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  todos = todos.filter((todo) => todo.id !== id);
  res.status(200).json(todos);
})

app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  let { title, description, in_progress} = req.body;
  const todoIndex = todos.findIndex((todo) =>todo.id === id);

  if(todoIndex === -1) {
    res.status(404).json({"message":"Todo do not exist, provide a valid Id"});
    return;
  }
  if(title){
    title = title.trim();
    if (title.length <= 5 || title.length >= 250 ){
      res.status(400).json({"message":"Title must contain 5 to 50 character"});
      return;
    }
    todos[todoIndex].title = title;
  }
  if(description){
    description = description.trim();
    if (description.length <= 20 || description.length >= 250 ){
      res.status(400).json({"message":"Description must contain 20 to 250 character"});
      return;
    }
    todos[todoIndex].description = description;
  }

  if (in_progress !== undefined){
    if (typeof in_progress != 'boolean' ){
      res.status(400).json({"message":"Status must be true or false"});
      return;
    }
    todos[todoIndex].in_progress = in_progress;
  }
  res.status(200).json({
    "message":`To Do: ${id} updated`,
    "todo" : todos[todoIndex]
  });
})


app.post('/todos', (req, res) => {
  let { title, description } = req.body;

  if(title){
    title = title.trim();
    if (title.length <= 5 || title.length >= 50 ){
      res.status(400).json({"message":"Title must contain 5 to 50 character"});
      return;
    }
  }else{
    res.status(400).json({"message":"Provide a Title"});
    return;
  }
  if (description){
    description = description.trim()
    if (description.length <= 20 || description.length >= 250){
      res.status(400).json({"message":"Description must contain 20 to 250 character"});
      return;
    }
  }else{
    res.status(400).json({"message":"Provide a Description"});
    return;
  }
  const todo = {
    "id": uuidv4(),
    "title": title,
    "description": description,
    "in_progress": true
  };
  
  todos.push(todo);
  
  res.status(201).json({
    "message":`To Do: ${title} added to list`,
    "todo" : todo
  });
});

app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

app.get('/', (req, res) => {
  res.status(200).json({"message":"ToDo API"});
});

app.use((req, res) => {
  res.status(404).json({"message":"Resourse do not exist."});
});

app.listen(PORT, () => {
  console.log(`listening on http://127.0.0.1:${PORT}`);
});