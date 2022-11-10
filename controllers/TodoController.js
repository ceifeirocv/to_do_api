/* eslint-disable prefer-const */
/* eslint-disable camelcase */
const Joi = require('joi');

const Todo = require('../models/Todo');

const re = /^\d+$/;
const schemaCreate = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(50)
    .required(),
  description: Joi.string()
    .trim()
    .min(20)
    .max(250)
    .required(),
});
const schemaUpdated = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(50),
  description: Joi.string()
    .trim()
    .min(20)
    .max(250),
  in_progress: Joi.boolean(),
});

exports.listTodos = async (req, res) => {
  const todos = await Todo.getAll();
  if (todos.error) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
  res.status(200).json(todos);
};

exports.getTodo = async (req, res) => {
  const { id } = req.params;
  if (!re.test(id)) {
    res.status(400).json({ message: 'Provide a valid Id' });
    return;
  }
  const todo = await Todo.getOne(id);
  if (!todo) {
    res.status(400).json({ message: 'Todo not found, provide a valid Id' });
    return;
  }
  if (todo.error) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
  res.status(200).json(todo);
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  if (!re.test(id)) {
    res.status(400).json({ message: 'Provide a valid Id' });
    return;
  }
  const todo = await Todo.delete(id);
  if (!todo) {
    res.status(400).json({ message: 'Todo not found, provide a valid Id' });
    return;
  }
  if (todo.error) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
  res.status(200).json({
    message: `To Do: ${todo.title} deleted`,
    todo,
  });
};

exports.updateTodo = async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Provide a Information' });
    return;
  }
  const { id } = req.params;
  if (!re.test(id)) {
    res.status(400).json({ message: 'Provide a valid Id' });
    return;
  }
  let { title, description, in_progress } = req.body;

  const todo = await Todo.getOne(id);
  if (!todo) {
    res.status(400).json({ message: 'Todo not found, provide a valid Id' });
    return;
  }
  if (todo.error) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  const { value, error } = schemaUpdated.validate({ title, description, in_progress });
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }
  if (value.title) {
    todo.title = value.title;
  }
  if (value.description) {
    todo.description = value.description;
  }
  if (value.in_progress !== undefined) {
    todo.in_progress = value.in_progress;
  }

  const updatedTodo = await Todo.update(id, todo);
  if (updatedTodo.error) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
  res.status(201).json({
    message: `To Do: ${id} updated`,
    todo: updatedTodo,
  });
};

exports.createTodo = async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Provide a Information' });
    return;
  }
  let { title, description } = req.body;

  const { value, error } = schemaCreate.validate({ title, description });
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  // if (title) {
  //   title = title.trim();
  //   if (title.length < 5 || title.length > 50) {
  //     res.status(400).json({ message: 'Title must contain 5 to 50 character' });
  //     return;
  //   }
  // } else {
  //   res.status(400).json({ message: 'Provide a Title' });
  //   return;
  // }

  // if (description) {
  //   description = description.trim();
  //   if (description.length < 20 || description.length > 250) {
  //     res.status(400).json({ message: 'Description must contain 20 to 250 character' });
  //     return;
  //   }
  // } else {
  //   res.status(400).json({ message: 'Provide a Description' });
  //   return;
  // }

  const todo = await Todo.create(value.title, value.description);
  if (todo.error) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
  res.status(201).json({
    message: `To Do: ${value.title} added to list`,
    todo,
  });
};
