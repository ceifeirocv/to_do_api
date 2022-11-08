/* eslint-disable no-console */
/* eslint-disable camelcase */
import db from '../config/database.js';

class Todo {
  static async getAll() {
    try {
      const todos = await db.query('SELECT * FROM todos');
      return todos.rows;
    } catch (error) {
      console.log(typeof error);
      return { error };
    }
  }

  static async getOne(id) {
    try {
      const todo = await db.query('SELECT * FROM todos WHERE id = $1', [id]);
      return todo.rows[0];
    } catch (error) {
      console.log(error);
      return { error };
    }
  }

  static async create(title, description) {
    try {
      const todo = await db.query('INSERT INTO todos(title, description) VALUES($1, $2) RETURNING *', [title, description]);
      return todo.rows[0];
    } catch (error) {
      console.log(error);
      return { error };
    }
  }

  static async delete(id) {
    try {
      const todo = await db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
      return todo.rows[0];
    } catch (error) {
      console.log(error);
      return { error };
    }
  }

  static async update(id, todo) {
    const { title, description, in_progress } = todo;
    try {
      const updatedTodo = await db.query('UPDATE todos SET title = $1, description = $2, in_progress = $3 WHERE id = $4 RETURNING *', [title, description, in_progress, id]);
      return updatedTodo.rows[0];
    } catch (error) {
      console.log(error);
      return { error };
    }
  }
}

export default Todo;
