import express from "express";
import { authenticateJwt, SECRET } from"../middleware/index";
import { Todo } from"../db";
const router = express.Router();

router.post('/todos', authenticateJwt, (req: express.Request, res: express.Response) => {
  // Try Zod input validation library
  const { title, description } = req.body;
  const done = false;
  const userId = req.headers["userId"];

  const newTodo = new Todo({ title, description, done, userId });

  newTodo.save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});


router.get('/todos', authenticateJwt, (req: express.Request, res: express.Response) => {
  const userId = req.headers["userId"];

  Todo.find({ userId })
    .then((todos: any) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

router.patch('/todos/:todoId/done', authenticateJwt, (req: express.Request, res: express.Response) => {
  const { todoId } = req.params;
  const userId = req.headers["userId"];

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(updatedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update todo' });
    });
});

module.exports = router;