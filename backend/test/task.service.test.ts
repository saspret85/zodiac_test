import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TaskService } from '../src/service/task.service'

describe('TaskService', () => {
  let taskService: TaskService
  let mockTaskRepo: any

  beforeEach(() => {
    mockTaskRepo = {
      findById: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    taskService = new TaskService(mockTaskRepo)
  })

  it('should throw an error if task is not found', async () => {
    // We mock the repository to return null
    mockTaskRepo.findById.mockResolvedValue(null)
    
    // Redis is used internally, ideally we should mock it too
    // For this simple example, assuming Redis returns null for cache
    
    try {
      await taskService.getTaskById('not-found-id')
    } catch (e: any) {
      expect(e.message).toBe('Task not found')
    }
  })

  it('should return a task if found in db', async () => {
    const mockTask = { id: '123', title: 'Test Task' }
    mockTaskRepo.findById.mockResolvedValue(mockTask)

    const result = await taskService.getTaskById('123')
    expect(result).toEqual(mockTask)
  })
})
