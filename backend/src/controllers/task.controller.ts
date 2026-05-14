import { TaskService } from '../service/task.service'
import { TaskRepository } from '../repository/task.repository'

const taskRepo = new TaskRepository()
const taskService = new TaskService(taskRepo)

export const TaskController = {
  async getTasks({ query }: { query: any }) {
    const { status, priority, page, limit } = query
    return taskService.getTasks(status, priority, page, limit)
  },

  async getTaskById({ params }: { params: { id: string } }) {
    const { id } = params
    return taskService.getTaskById(id)
  },

  async createTask({ body }: { body: any }) {
    return taskService.createTask(body)
  },

  async updateTask({ params, body }: { params: { id: string }, body: any }) {
    const { id } = params
    return taskService.updateTask(id, body)
  },

  async deleteTask({ params }: { params: { id: string } }) {
    const { id } = params
    return taskService.deleteTask(id)
  }
}