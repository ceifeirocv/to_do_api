import Todo from '../models/Todos.js'

//let todos = [];

export async function listTodos(req,res) {
  const todos = await Todo.getAll();
  if(todos.erro){
    res.status(500).json({"message":"Internal Server Error"});
    return
  } 
  res.status(200).json(todos);
}

export async function getTodo(req, res) {
  const id = req.params.id;
  const todo = await Todo.getOne(id);
  if(!todo) {
    res.status(404).json({"message":"Todo not found, provide a valid Id"});
    return
  }
  res.status(200).json(todo);  
}

export async function deleteTodo(req, res){
  const id = req.params.id;
  const todo = await Todo.delete(id);
  if(!todo) {
    res.status(404).json({"message":"Todo not found, provide a valid Id"});
    return;
  }
  res.status(200).json(todo);
}

export async function updateTodo(req, res){
  const id = req.params.id;
  const { title, description, in_progress} = req.body;
  const todo = await Todo.getOne(id);
  if(!todo) {
    res.status(404).json({"message":"Todo not found, provide a valid Id"});
    return;
  }

  if(title){
    if (title.length <= 5 || title.length > 50 ){
      res.status(400).json({"message":"Title must contain 5 to 50 character"});
      return;
    }
    todo.title = title;
  }
  if(description){
    if (description.length <= 20 || description.length > 250 ){
      res.status(400).json({"message":"Description must contain 20 to 250 character"});
      return;
    }
    todo.description = description;
  }

  if (in_progress !== undefined){
    if (typeof in_progress != 'boolean'){
      res.status(400).json({"message":"Status must be true or false"});
      return;
    }
    todo.in_progress = in_progress;
  }

  const updatedtodo = await Todo.update(id, todo);
  if(!updatedtodo.error) {
    res.status(404).json({"message":"Internal Server Error"});
  }
  res.status(200).json({
    "message":`To Do: ${id} updated`,
    "todo" : updatedtodo,
  });
}

export async function createTodo (req, res) {
  const { title, description } = req.body;
  
  if (!title || title.length <= 5 || title.length > 50 ){
    res.status(400).json({"message":"Title must contain 5 to 50 character"});
    return;
  }   
  if (!description || description.length <= 20 || description.length > 250){
    res.status(400).json({"message":"Description must contain 20 to 250 character"});
    return;
  }
  
  const todo = await Todo.create(title, description);
  if (todo.error) {
    res.status(500).json({"message":"Internal Server Error"});
    return
  }
  res.status(201).json({
    "message":`To Do: ${title} added to list`,
    "todo" : todo[0]
  });
}