import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreatePaymentDTO } from '../dto'

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPaymentsByUserId(userId: number) {
    return this.prisma.payment.findMany({
      where: {
        userId,
      },
      include: {
        bookings: {
          include: {
            bookingTickets: {
              include: {
                ticket: {
                  include: {
                    schedule: {
                      include: {
                        movie: true,
                        room: {
                          include: {
                            cinema: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findPaymentById(id: number) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        bookings: {
          include: {
            bookingTickets: {
              include: {
                ticket: {
                  include: {
                    schedule: {
                      include: {
                        movie: true,
                        room: {
                          include: {
                            cinema: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  async findTicketsByIds(ticketIds: number[]) {
    return this.prisma.ticket.findMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
      include: {
        schedule: {
          include: {
            movie: true,
            room: {
              include: {
                cinema: true,
              },
            },
          },
        },
      },
    })
  }

  async createPaymentWithBooking(userId: number, createPaymentDto: CreatePaymentDTO & { amount: number }) {
    const { method, ticketIds, amount } = createPaymentDto

    return this.prisma.$transaction(async (prisma) => {
      const payment = await prisma.payment.create({
        data: {
          userId,
          method,
          amount,
          status: 'COMPLETED',
          paidAt: new Date(),
          createdAt: new Date(),
        },
      })

      const booking = await prisma.booking.create({
        data: {
          userId,
          totalPrice: amount,
          status: 'CONFIRMED',
          paymentId: payment.id,
          createdAt: new Date(),
        },
      })

      const bookingTicketsData = ticketIds.map((ticketId) => ({
        bookingId: booking.id,
        ticketId: ticketId,
      }))

      await prisma.bookingTicket.createMany({
        data: bookingTicketsData,
      })

      await prisma.ticket.updateMany({
        where: {
          id: {
            in: ticketIds,
          },
        },
        data: {
          status: 'PAID',
        },
      })

      return { payment, booking }
    })
  }

  async getUserTotalSpent(userId: number) {
    const result = await this.prisma.payment.aggregate({
      where: {
        userId,
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    })

    return {
      totalSpent: result._sum.amount || 0,
      totalPayments: result._count || 0,
    }
  }
}
