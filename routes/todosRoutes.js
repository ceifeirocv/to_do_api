import { Router } from "express";
import {
  listTodos, 
  getTodo, 
  deleteTodo, 
  updateTodo, 
  createTodo
} from '../controllers/TodoController.js'

const router = Router();

router.get('/:id', getTodo )

router.delete('/:id', deleteTodo)

router.put('/:id', updateTodo)

router.post('/', createTodo);

router.get('/', listTodos);

export default router;