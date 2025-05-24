const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware de validação básica
const validateTask = (req, res, next) => {
  const { title, start_datetime, end_datetime, priority_id, category_id } = req.body;
  
  if (!title || !start_datetime || !end_datetime || !priority_id || !category_id) {
    return res.status(400).json({ 
      error: 'Dados incompletos',
      required: {
        title: 'string',
        start_datetime: 'YYYY-MM-DDTHH:mm:ss',
        end_datetime: 'YYYY-MM-DDTHH:mm:ss',
        priority_id: 'number',
        category_id: 'number'
      }
    });
  }

  // Validação do formato das datas
  const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if (!datetimeRegex.test(start_datetime) || !datetimeRegex.test(end_datetime)) {
    return res.status(400).json({ 
      error: 'Formato de data e hora inválido',
      expected: 'YYYY-MM-DDTHH:mm:ss'
    });
  }

  // Validação dos IDs
  if (!Number.isInteger(Number(priority_id)) || !Number.isInteger(Number(category_id))) {
    return res.status(400).json({ 
      error: 'IDs inválidos',
      expected: 'Números inteiros'
    });
  }

  next();
};

router.use(authMiddleware); // todas as rotas abaixo exigem autenticação

// Rotas de tarefas
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', validateTask, taskController.create);
router.put('/:id', validateTask, taskController.update);
router.delete('/:id', taskController.remove);

// Rotas de prioridades e categorias
router.get('/priorities/all', taskController.getAllPriorities);
router.get('/categories/all', taskController.getAllCategories);

module.exports = router; 