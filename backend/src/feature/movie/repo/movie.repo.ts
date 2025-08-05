import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../../shared/services/prisma.service'

@Injectable()
export class MovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MovieCreateInput) {
    return this.prisma.movie.create({
      data,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })
  }

  async findMany(params?: {
    skip?: number
    take?: number
    where?: Prisma.MovieWhereInput
    orderBy?: Prisma.MovieOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params || {}
    return this.prisma.movie.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })
  }

  async findUnique(where: Prisma.MovieWhereUniqueInput) {
    return this.prisma.movie.findUnique({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
  }

  async update(params: { where: Prisma.MovieWhereUniqueInput; data: Prisma.MovieUpdateInput }) {
    const { where, data } = params
    return this.prisma.movie.update({
      where,
      data,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })
  }

  async delete(where: Prisma.MovieWhereUniqueInput) {
    return this.prisma.$transaction(async (tx) => {
      await tx.movieCategory.deleteMany({
        where: { movieId: where.id },
      })

      await tx.comment.deleteMany({
        where: { movieId: where.id },
      })

      await tx.favorite.deleteMany({
        where: { movieId: where.id },
      })

      await tx.schedule.deleteMany({
        where: { movieId: where.id },
      })

      return tx.movie.delete({
        where,
      })
    })
  }

  async count(where?: Prisma.MovieWhereInput) {
    return this.prisma.movie.count({
      where,
    })
  }

  async updateMovieCategories(movieId: number, categoryIds: number[]) {
    await this.prisma.movieCategory.deleteMany({
      where: { movieId },
    })

    if (categoryIds.length > 0) {
      await this.prisma.movieCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          movieId,
          categoryId,
        })),
      })
    }
  }

  async findCategories() {
    return this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    })
  }

  async findScheduleWithTickets(movieId: number) {
    return this.prisma.schedule.findFirst({
      where: {
        movieId,
        tickets: {
          some: {},
        },
      },
    })
  }

  async countFavorites(movieId: number) {
    return this.prisma.favorite.count({
      where: { movieId },
    })
  }

  async countSchedules(movieId: number) {
    return this.prisma.schedule.count({
      where: { movieId },
    })
  }
}
