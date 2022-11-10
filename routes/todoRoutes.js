const { Router } = require('express');
const {
  listTodos,
  getTodo,
  deleteTodo,
  updateTodo,
  createTodo,
} = require('../controllers/TodoController');

const router = Router();

router.get('/:id', getTodo);

router.delete('/:id', deleteTodo);

router.put('/:id', updateTodo);

router.post('/', createTodo);

router.get('/', listTodos);

module.exports = router;
