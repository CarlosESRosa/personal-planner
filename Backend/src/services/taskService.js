const taskModel = require('../models/taskmodel');

class TaskService {
  async getAll() {
    try {
      return await taskModel.getAll();
    } catch (error) {
      throw new Error('Erro ao buscar tarefas: ' + error.message);
    }
  }

  async getById(id) {
    try {
      const task = await taskModel.getById(id);
      if (!task) {
        throw new Error('Tarefa não encontrada');
      }
      return task;
    } catch (error) {
      throw new Error('Erro ao buscar tarefa: ' + error.message);
    }
  }

  async create(taskData) {
    try {
      await this.validateTaskData(taskData);
      await this.validateIds(taskData);
      await this.validateDatetimes(taskData);
      return await taskModel.create(taskData);
    } catch (error) {
      throw new Error('Erro ao criar tarefa: ' + error.message);
    }
  }

  async update(id, taskData) {
    try {
      await this.validateTaskData(taskData);
      await this.validateIds(taskData);
      await this.validateDatetimes(taskData);
      const task = await taskModel.getById(id);
      if (!task) {
        throw new Error('Tarefa não encontrada');
      }
      return await taskModel.update(id, taskData);
    } catch (error) {
      throw new Error('Erro ao atualizar tarefa: ' + error.message);
    }
  }

  async remove(id) {
    try {
      const task = await taskModel.getById(id);
      if (!task) {
        throw new Error('Tarefa não encontrada');
      }
      return await taskModel.remove(id);
    } catch (error) {
      throw new Error('Erro ao remover tarefa: ' + error.message);
    }
  }

  async getAllPriorities() {
    try {
      return await taskModel.getAllPriorities();
    } catch (error) {
      throw new Error('Erro ao buscar prioridades: ' + error.message);
    }
  }

  async getAllCategories() {
    try {
      return await taskModel.getAllCategories();
    } catch (error) {
      throw new Error('Erro ao buscar categorias: ' + error.message);
    }
  }

  async validateTaskData(taskData) {
    if (!taskData.title) {
      throw new Error('Título é obrigatório');
    }
    if (!taskData.start_datetime) {
      throw new Error('Data e hora de início são obrigatórias');
    }
    if (!taskData.end_datetime) {
      throw new Error('Data e hora de término são obrigatórias');
    }
    if (!taskData.priority_id) {
      throw new Error('ID da prioridade é obrigatório');
    }
    if (!taskData.category_id) {
      throw new Error('ID da categoria é obrigatório');
    }
  }

  async validateIds(taskData) {
    const priorities = await taskModel.getAllPriorities();
    const categories = await taskModel.getAllCategories();

    const priorityExists = priorities.some(p => p.id === taskData.priority_id);
    const categoryExists = categories.some(c => c.id === taskData.category_id);

    if (!priorityExists) {
      throw new Error('Prioridade inválida');
    }
    if (!categoryExists) {
      throw new Error('Categoria inválida');
    }
  }

  async validateDatetimes(taskData) {
    const start = new Date(taskData.start_datetime);
    const end = new Date(taskData.end_datetime);

    if (isNaN(start.getTime())) {
      throw new Error('Data e hora de início inválidas');
    }
    if (isNaN(end.getTime())) {
      throw new Error('Data e hora de término inválidas');
    }
    if (end <= start) {
      throw new Error('Data e hora de término devem ser posteriores à data e hora de início');
    }
  }
}

module.exports = new TaskService(); 