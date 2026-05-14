import { TaskRepository } from '../repository/task.repository'
import {AppError} from "../exceptions/app.error.ts";

const CACHE_TTL = 3600 // 1 hour

export class TaskService {
  constructor(private taskRepo: TaskRepository) {}

  async getTasks(status?: string, priority?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const where: any = {}
    if (status) where.status = status
    if (priority) where.priority = priority

    const [tasks, total] = await Promise.all([
      this.taskRepo.findMany(where, skip, limit),
      this.taskRepo.count(where)
    ])

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getTaskById(id: string) {
    const task = await this.taskRepo.findById(id)
    if (!task) {
      throw new AppError(
          404,
          'Task not found'
      )
    }

    return task
  }

  async createTask(data: any) {
    const task = await this.taskRepo.create({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    })
    
    return task
  }

  async updateTask(id: string, data: any) {
    try {
      const task = await this.taskRepo.update(id, {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate
      })

      return task
    } catch (error) {
      throw new AppError(
          404,
          'Task not found'
      )
    }
  }

  async deleteTask(id: string) {
    try {
      await this.taskRepo.delete(id)

      return { success: true }
    } catch (error) {
      throw new AppError(
          404,
          'Task not found'
      )
    }
  }
}
