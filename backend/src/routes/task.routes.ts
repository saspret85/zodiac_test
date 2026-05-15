import { Elysia, t } from 'elysia'
import { TaskController } from '../controllers/task.controller'
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskFilterSchema
} from '../utils/schemas'

export const taskRoutes = new Elysia({ prefix: '/tasks' })
  .get('/', TaskController.getTasks, {
    query: TaskFilterSchema,
    detail: {
        summary: 'Get all tasks',
        tags: ['Tasks']
    }
  })
  .get('/:id', TaskController.getTaskById, {
    params: t.Object({
        id: t.String({
            default: '59ce27f5-d4f6-434b-82dc-fa4bc0c08686',
            format: 'uuid',
            description: 'The ID of the task'
        })
    }),
    detail: {
        summary: 'Get task by ID',
        tags: ['Tasks']
    }
  })
  .post('/', async ({ body, set }) => {
    const result = await TaskController.createTask({ body });
    set.status = 201;
    return result;
  }, {
    body: CreateTaskSchema,
    detail: {
        summary: 'Create new task',
        tags: ['Tasks'],
        responses: {
            201: {
                description: 'Task created successfully',
                content: {
                    'application/json': {
                        schema: t.Object({
                            id: t.String(),
                            title: t.String(),
                            status: t.String()
                        })
                    }
                }
            }
        }
    }
  })
  .patch('/:id', TaskController.updateTask, {
    params: t.Object({
        id: t.String({
            default: '59ce27f5-d4f6-434b-82dc-fa4bc0c08686',
            format: 'uuid',
            description: 'The ID of the task'
        })
    }),
    body: UpdateTaskSchema,
    detail: {
        summary: 'Update task',
        tags: ['Tasks']
    }
  })
  .delete('/:id', TaskController.deleteTask, {
    params: t.Object({
        id: t.String({
            default: '59ce27f5-d4f6-434b-82dc-fa4bc0c08686',
            format: 'uuid',
            description: 'The ID of the task'
        })
    }),
    detail: {
        summary: 'Delete task',
        tags: ['Tasks']
    }
  })