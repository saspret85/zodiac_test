import { prisma } from '../config/prisma'

export class TaskRepository {
  async findMany(where: any, skip: number, limit: number) {
    return prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    })
  }

  async count(where: any) {
    return prisma.task.count({ where })
  }

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id }
    })
  }

  async create(data: any) {
    return prisma.task.create({ data })
  }

  async update(id: string, data: any) {
    return prisma.task.update({
      where: { id },
      data
    })
  }

  async delete(id: string) {
    return prisma.task.delete({
      where: { id }
    })
  }
}
