import {v4 as uuidv4} from 'uuid';
let todos = [];

class Todo {
  static getAll() {
    return todos;
  } 

  static getOne(id) {
    const todo = todos.find((todo) => todo.id === id);
    return todo;
  }

  static create(title, description) {
    const todo = {
      "id": uuidv4(),
      "title": title,
      "description": description,
      "in_progress": true
    };
    
    todos.push(todo);
    return todo;
  }
  static delete(id){
    todos = todos.filter((todo) => todo.id !== id);
    return todos;
  }

  static update(id, title, description, in_progress){
    const todoIndex = todos.findIndex((todo) =>todo.id === id);

    if(todoIndex === -1) {
      return false
    }
    if(title){
      todos[todoIndex].title = title;
    }
    if(description){
      todos[todoIndex].description = description;
    }
  
    if (in_progress !== undefined){
      todos[todoIndex].in_progress = in_progress;
    }
    
    return todos[todoIndex]
  }
}

export default Todo

