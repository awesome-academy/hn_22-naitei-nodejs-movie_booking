import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PaymentRepository } from '../repo/payment.repo'
import { CreatePaymentDTO } from '../dto'

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async processPayment(userId: number, createPaymentDto: CreatePaymentDTO) {
    const { ticketIds, method } = createPaymentDto

    const tickets = await this.paymentRepository.findTicketsByIds(ticketIds)

    if (tickets.length !== ticketIds.length) {
      throw new NotFoundException('Some tickets not found')
    }

    const userTickets = tickets.filter((ticket) => ticket.userId === userId)
    if (userTickets.length !== tickets.length) {
      throw new ForbiddenException('You can only pay for your own tickets')
    }

    // Check if tickets are in BOOKED status (not already paid or cancelled)
    const bookableTickets = tickets.filter((ticket) => ticket.status === 'BOOKED')
    if (bookableTickets.length !== tickets.length) {
      const invalidTickets = tickets.filter((ticket) => ticket.status !== 'BOOKED')
      throw new BadRequestException(
        `Some tickets cannot be paid for. Invalid tickets: ${invalidTickets.map((t) => t.id).join(', ')}`,
      )
    }

    // Calculate total amount automatically from tickets
    const totalAmount = tickets.reduce((sum, ticket) => sum + Number(ticket.price), 0)

    // Check if any schedule has passed
    const currentTime = new Date()
    const expiredTickets = tickets.filter((ticket) => currentTime > ticket.schedule.startTime)
    if (expiredTickets.length > 0) {
      throw new BadRequestException('Cannot pay for tickets with expired schedules')
    }

    // Create payment DTO with calculated amount
    const paymentDto = {
      ...createPaymentDto,
      amount: totalAmount,
    }

    const result = await this.paymentRepository.createPaymentWithBooking(userId, paymentDto)

    return {
      message: 'Payment processed successfully',
      paymentId: result.payment.id,
      bookingId: result.booking.id,
      amount: Number(result.payment.amount),
      method: result.payment.method,
      status: result.payment.status,
      paidAt: result.payment.paidAt,
      ticketsCount: ticketIds.length,
    }
  }

  async getUserPaymentHistory(userId: number) {
    const payments = await this.paymentRepository.findPaymentsByUserId(userId)
    const stats = await this.paymentRepository.getUserTotalSpent(userId)

    return {
      payments: payments.map((payment) => ({
        id: payment.id,
        method: payment.method,
        amount: Number(payment.amount),
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        bookings: payment.bookings.map((booking) => ({
          id: booking.id,
          totalPrice: Number(booking.totalPrice),
          status: booking.status,
          tickets: booking.bookingTickets.map((bt) => ({
            id: bt.ticket.id,
            seatCode: bt.ticket.seatCode,
            price: Number(bt.ticket.price),
            status: bt.ticket.status,
            schedule: {
              id: bt.ticket.schedule.id,
              startTime: bt.ticket.schedule.startTime,
              endTime: bt.ticket.schedule.endTime,
              movie: {
                id: bt.ticket.schedule.movie.id,
                title: bt.ticket.schedule.movie.title,
                posterUrl: bt.ticket.schedule.movie.posterUrl,
              },
              room: {
                id: bt.ticket.schedule.room.id,
                name: bt.ticket.schedule.room.name,
                cinema: {
                  id: bt.ticket.schedule.room.cinema.id,
                  name: bt.ticket.schedule.room.cinema.name,
                  location: bt.ticket.schedule.room.cinema.location,
                },
              },
            },
          })),
        })),
      })),
      stats: {
        totalSpent: stats.totalSpent,
        totalPayments: stats.totalPayments,
      },
    }
  }

  async getPaymentById(paymentId: number, userId: number) {
    const payment = await this.paymentRepository.findPaymentById(paymentId)

    if (!payment) {
      throw new NotFoundException('Payment not found')
    }

    if (payment.userId !== userId) {
      throw new ForbiddenException('You can only view your own payments')
    }

    return {
      id: payment.id,
      method: payment.method,
      amount: Number(payment.amount),
      status: payment.status,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      bookings: payment.bookings.map((booking) => ({
        id: booking.id,
        totalPrice: Number(booking.totalPrice),
        status: booking.status,
        tickets: booking.bookingTickets.map((bt) => ({
          id: bt.ticket.id,
          seatCode: bt.ticket.seatCode,
          price: Number(bt.ticket.price),
          status: bt.ticket.status,
          schedule: {
            id: bt.ticket.schedule.id,
            startTime: bt.ticket.schedule.startTime,
            endTime: bt.ticket.schedule.endTime,
            movie: {
              id: bt.ticket.schedule.movie.id,
              title: bt.ticket.schedule.movie.title,
              posterUrl: bt.ticket.schedule.movie.posterUrl,
            },
            room: {
              id: bt.ticket.schedule.room.id,
              name: bt.ticket.schedule.room.name,
              cinema: {
                id: bt.ticket.schedule.room.cinema.id,
                name: bt.ticket.schedule.room.cinema.name,
                location: bt.ticket.schedule.room.cinema.location,
              },
            },
          },
        })),
      })),
    }
  }
}
