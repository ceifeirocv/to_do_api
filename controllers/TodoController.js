import Todo from '../models/Todos.js'

//let todos = [];

export function listTodos(req,res) {
  const todos = Todo.getAll();
  res.status(200).json(todos);
}

export function getTodo(req, res) {
  const id = req.params.id;
  const todo = Todo.getOne(id);
  if(!todo) {
    res.status(404).json({"message":"Page not found"});
  }
  res.status(200).json(todo);  
}

export function deleteTodo(req, res){
  const id = req.params.id;
  const todos = Todo.delete(id);
  res.status(200).json(todos);
}

export function updateTodo(req, res){
  const id = req.params.id;
  const { title, description, in_progress} = req.body;

  if(title){
    if (title.length <= 5 || title.length > 50 ){
      res.status(400).json({"message":"Title must contain 5 to 50 character"});
      return;
    }
  }
  if(description){
    if (description.length <= 20 || description.length > 50 ){
      res.status(400).json({"message":"Description must contain 20 to 250 character"});
      return;
    }
  }

  if (in_progress !== undefined){
    if (typeof in_progress != 'boolean' ){
      res.status(400).json({"message":"Status must be true or false"});
      return;
    }
  }
  const todo = Todo.update(id, title, description, in_progress);
  if(!todo) {
    res.status(404).json({"message":"Page not found"});
  }
  res.status(200).json({
    "message":`To Do: ${id} updated`,
    "todo" : todo,
  });
}

export function createTodo (req, res) {
  const { title, description } = req.body;
  
  if (!title || title.length <= 5 || title.length > 50 ){
    res.status(400).json({"message":"Title must contain 5 to 50 character"});
    return;
  }   
  if (!description || description.length <= 20 || description.length > 250){
    res.status(400).json({"message":"Description must contain 20 to 250 character"});
    return;
  }
  
  const todo = Todo.create(title, description);
  res.status(201).json({
    "message":`To Do: ${title} added to list`,
    "todo" : todo
  });
}