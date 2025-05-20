const taskService = require('../services/taskService');

class TaskController {
  async getAll(req, res) {
    try {
      const tasks = await taskService.getAll();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const task = await taskService.getById(req.params.id);
      res.json(task);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const task = await taskService.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const task = await taskService.update(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async remove(req, res) {
    try {
      await taskService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllPriorities(req, res) {
    try {
      const priorities = await taskService.getAllPriorities();
      res.json(priorities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await taskService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TaskController();
