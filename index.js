import express, { json } from 'express';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';


const app = express();
const PORT = 5000;
const file = 'todo.json'


app.use(express.json());
app.use((err, req, res, next) => {
  if (err){
    res.status(400).json({"erro": 'Invalid Request data'});
  }else{
    next();
  }
})

if(!fs.existsSync(file)){
  fs.writeFileSync(file,'[]', (err) => console.log(err));
}

let todos;


app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  try {
    fs.readFile(file, 'utf8', function(err, todos) {
      if (err){
        res.status(500).json(err)
        return
      };
      todos = JSON.parse(todos)
      
      const todo = todos.find((todo) => todo.id === id);
    
      if(!todo) {
        res.status(404).json({"message":"Page not found"});
        return
      }
      res.status(200).json(todo);
    });    
  } catch (error) {
    res.status(500).json({"message": error.message});
  }
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  try {
    fs.readFile(file, 'utf8', function(err, todos) {
      if (err){
        res.status(500).json(err)
        return
      };
      todos = JSON.parse(todos)
      todos = todos.filter((todo) => todo.id !== id);
      try {
        fs.writeFileSync(file, JSON.stringify(todos))        
        res.status(200).json(todos);
      } catch (error) {
        res.status(500).json({"message": error.message});
        return
      }
    })
  } catch (error) {
    res.status(500).json({"message": error.message});
    return
  }
})
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, in_progress} = req.body;

  try {
    fs.readFile(file, 'utf8', function(err, todos) {
      if (err){
        res.status(500).json(err)
        return
      };
      todos = JSON.parse(todos)
      const todoIndex = todos.findIndex((todo) =>todo.id === id);
      
      if(todoIndex === -1) {
        res.status(404).json({"message":"Page not found"});
        return
      }
      
      if(title){
        if (title.length <= 5 || title.length > 50 ){
          res.status(400).json({"message":"Title must contain 5 to 50 character"});
          return;
        }
        todos[todoIndex].title = title;
      }
      if(description){
        if (description.length <= 20 || description.length > 50 ){
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
      try {
        fs.writeFileSync(file, JSON.stringify(todos))        
      } catch (error) {
        res.status(500).json({"message": error.message});
        return
      }
        res.status(200).json({
        "message":`To Do: ${id} updated`,
        "todo" : todos[todoIndex],
      });
    })
  } catch (error) {
    res.status(500).json({"message": error.message});
  }
})


app.post('/todos', (req, res) => {
  const { title, description } = req.body;
  
  if (!title || title.length <= 5 || title.length > 50 ){
    res.status(400).json({"message":"Title must contain 5 to 50 character"});
    return;
  }   
  if (!description || description.length <= 20 || description.length > 250){
    res.status(400).json({"message":"Description must contain 20 to 250 character"});
    return;
  }
  
  const todo = {
    "id": uuidv4(),
    "title": title,
    "description": description,
    "in_progress": true
  };
  try{
    fs.readFile(file, 'utf8', function(err, todos) {
      if (err){
        res.status(500).json(err)
        return
      };
      todos = JSON.parse(todos)
      
      todos.push(todo);
      try {
        fs.writeFileSync(file, JSON.stringify(todos));
      } catch (error) {
        res.status(500).json({"message": error.message});
      }
    }) 
    res.status(201).json({
      "message":`To Do: ${title} added to list`,
      "todo" : todos
    });
  } catch (error) {
    res.status(500).json({"message": error.message});
  }
  
  
  // console.log(todos);
  
});

app.get('/todos', (req, res) => { 
  try {
    fs.readFile(file, 'utf8', function(err, todos) {
    if (err){
      res.status(500).json(err)
      return
    };
    todos = JSON.parse(todos)
  
    res.status(200).json(todos);
    });
  } catch (error) {
    res.status(500).json({"message": error.message});
  } 
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