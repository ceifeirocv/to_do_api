import Todo from '../models/Todos.js'

const re = /^\d+$/;


export async function listTodos(req,res) {
  const todos = await Todo.getAll();
  if(todos.error){
    res.status(500).json({"message":"Internal Server Error"});
    return;
  } 
  res.status(200).json(todos);
}

export async function getTodo(req, res) {
  const id = req.params.id;
  if(!re.test(id)){
    res.status(400).json({"message":"Todo not found, provide a valid Id"});
    return;
  };
  const todo = await Todo.getOne(id);
  if(!todo) {
    res.status(400).json({"message":"Todo not found, provide a valid Id"});
    return;
  }
  if(todo.error){
    res.status(500).json({"message":"Internal Server Error"});
    return;
  } 
  res.status(200).json(todo);  
}

export async function deleteTodo(req, res){
  const id = req.params.id;
  if(!re.test(id)){
    res.status(400).json({"message":"Todo not found, provide a valid Id"});
    return;
  };
  const todo = await Todo.delete(id);
  if(!todo) {
    res.status(400).json({"message":"Todo not found, provide a valid Id"});
    return;
  }
  if(todo.error){
    res.status(500).json({"message":"Internal Server Error"});
    return;
  } 
  res.status(200).json({
    "message":`To Do: ${todo.title} deleted`,
    "todo" : todo
  });
}

export async function updateTodo(req, res){
  const id = req.params.id;
  if(!re.test(id)){
    res.status(400).json({"message":"Todo not found, provide a valid Id"});
    return;
  };
  let { title, description, in_progress} = req.body;
  const todo = await Todo.getOne(id);
  if(!todo) {
    res.status(400).json({"message":"Todo not found, provide a valid Id"});
    return;
  }
  if(todo.error){
    res.status(500).json({"message":"Internal Server Error"});
    return
  } 

  if(title){
    title = title.trim();
    if (title.length <= 5 || title.length >= 50 ){
      res.status(400).json({"message":"Title must contain 5 to 50 character"});
      return;
    }
    todo.title = title;
  }
  if(description){
    description = description.trim();
    if (description.length <= 20 || description.length >= 250 ){
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
  if(updatedtodo.error) {
    res.status(500).json({"message":"Internal Server Error"});
    return;
  }
  res.status(200).json({
    "message":`To Do: ${id} updated`,
    "todo" : updatedtodo,
  });
}

export async function createTodo (req, res) {
  let { title, description } = req.body;
  
  if(title){
    title = title.trim();
    if (title.length <= 5 || title.length >= 50 ){
      res.status(400).json({"message":"Title must contain 5 to 50 character"});
      return;
    }
  } else {
    res.status(400).json({"message":"Provide a Title"});
    return;
  }
  
  if (description){
    description = description.trim();
    if (description.length <= 20 || description.length >= 250){
      res.status(400).json({"message":"Description must contain 20 to 250 character"});
      return;
    }
  } else {
    res.status(400).json({"message":"Provide a Description"});
    return;
  } 
  const todo = await Todo.create(title, description);
  if (todo.error) {
    res.status(500).json({"message":"Internal Server Error"});
    return
  }
  res.status(201).json({
    "message":`To Do: ${title} added to list`,
    "todo" : todo
  });
}