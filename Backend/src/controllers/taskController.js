const taskService = require('../services/taskService');

class TaskController {
  async getAll(req, res) {
    try {
      const userId = req.user.id;
      console.log('Buscando todas as tarefas para o usuário:', userId);
      const tasks = await taskService.getAll(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      console.log('Buscando tarefa:', id, 'para o usuário:', userId);
      const task = await taskService.getById(id, userId);
      res.json(task);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const userId = req.user.id;
      const taskData = { ...req.body, user_id: userId };
      console.log('Criando nova tarefa para o usuário:', userId, 'dados:', taskData);
      const task = await taskService.create(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const taskData = { ...req.body, user_id: userId };
      console.log('Atualizando tarefa:', id, 'para o usuário:', userId, 'dados:', taskData);
      const task = await taskService.update(id, taskData, userId);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      console.log('Removendo tarefa:', id, 'para o usuário:', userId);
      await taskService.remove(id, userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllPriorities(req, res) {
    try {
      console.log('Buscando todas as prioridades');
      const priorities = await taskService.getAllPriorities();
      res.json(priorities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllCategories(req, res) {
    try {
      console.log('Buscando todas as categorias');
      const categories = await taskService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TaskController();
