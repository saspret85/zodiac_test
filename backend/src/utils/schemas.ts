import { t } from 'elysia'

export const TaskStatusSchema = t.Union([
  t.Literal('todo'),
  t.Literal('in_progress'),
  t.Literal('done')
])

export const TaskPrioritySchema = t.Union([
  t.Literal('low'),
  t.Literal('medium'),
  t.Literal('high')
])

export const CreateTaskSchema = t.Object({
  title: t.String({ 
    minLength: 1, 
    maxLength: 100,
    examples: ['Migrasi Database TaskFlow']
  }),
  description: t.Optional(t.String({
    examples: ['Menjalankan perintah prisma migrate dev...']
  })),
  status: t.Optional(TaskStatusSchema),
  priority: t.Optional(TaskPrioritySchema),
  dueDate: t.Optional(t.Nullable(t.String({ 
    format: 'date-time',
    examples: ['2026-05-15T09:00:00.000Z']
  })))
}, {
  examples: [{
    title: 'Migrasi Database TaskFlow',
    description: 'Menjalankan perintah prisma migrate dev untuk menambahkan tabel Category.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-05-15T09:00:00.000Z'
  }]
})

export const UpdateTaskSchema = t.Partial(CreateTaskSchema, {
  examples: [{
    title: 'Migrasi Database TaskFlow',
    description: 'Menjalankan perintah prisma migrate dev untuk menambahkan tabel Category.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-05-15T09:00:00.000Z'
  }]
})

export const TaskFilterSchema = t.Object({
  status: t.Optional(TaskStatusSchema),
  priority: t.Optional(TaskPrioritySchema),
  page: t.Optional(t.Numeric({ default: 1 })),
  limit: t.Optional(t.Numeric({ default: 10 }))
}, {
  examples: [{
    status: 'todo',
    priority: 'high',
    page: 1,
    limit: 10
  }]
})
