import { Injectable, BadRequestException } from '@nestjs/common'
import { StatisticRepo, RevenueStatistic, BookingStatistic } from '../repo/statistic.repo'

@Injectable()
export class StatisticService {
  constructor(private readonly statisticRepo: StatisticRepo) {}

  async getRevenueStatistics(
    period: 'day' | 'week' | 'month' = 'day',
    startDate?: string,
    endDate?: string,
  ): Promise<{
    period: string
    data: RevenueStatistic[]
    summary: {
      totalRevenue: number
      totalBookings: number
      averageRevenuePerBooking: number
    }
  }> {
    // Validate period
    if (!['day', 'week', 'month'].includes(period)) {
      throw new BadRequestException('Period must be day, week, or month')
    }

    // Parse dates if provided
    let parsedStartDate: Date | undefined
    let parsedEndDate: Date | undefined

    if (startDate) {
      parsedStartDate = new Date(startDate)
      if (isNaN(parsedStartDate.getTime())) {
        throw new BadRequestException('Invalid start date format')
      }
    }

    if (endDate) {
      parsedEndDate = new Date(endDate)
      if (isNaN(parsedEndDate.getTime())) {
        throw new BadRequestException('Invalid end date format')
      }
    }

    // If no dates provided, default to last 30 days
    if (!parsedStartDate && !parsedEndDate) {
      parsedEndDate = new Date()
      parsedStartDate = new Date()
      parsedStartDate.setDate(parsedStartDate.getDate() - 30)
    }

    const data = await this.statisticRepo.getRevenueStatistics(period, parsedStartDate, parsedEndDate)

    // Calculate summary
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
    const totalBookings = data.reduce((sum, item) => sum + item.totalBookings, 0)
    const averageRevenuePerBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0

    return {
      period,
      data,
      summary: {
        totalRevenue,
        totalBookings,
        averageRevenuePerBooking: Math.round(averageRevenuePerBooking * 100) / 100,
      },
    }
  }

  async getBookingStatistics(
    startDate?: string,
    endDate?: string,
  ): Promise<{
    data: BookingStatistic[]
    summary: {
      totalBookings: number
      totalTickets: number
      averageTicketsPerBooking: number
    }
  }> {
    // Parse dates if provided
    let parsedStartDate: Date | undefined
    let parsedEndDate: Date | undefined

    if (startDate) {
      parsedStartDate = new Date(startDate)
      if (isNaN(parsedStartDate.getTime())) {
        throw new BadRequestException('Invalid start date format')
      }
    }

    if (endDate) {
      parsedEndDate = new Date(endDate)
      if (isNaN(parsedEndDate.getTime())) {
        throw new BadRequestException('Invalid end date format')
      }
    }

    // If no dates provided, default to last 30 days
    if (!parsedStartDate && !parsedEndDate) {
      parsedEndDate = new Date()
      parsedStartDate = new Date()
      parsedStartDate.setDate(parsedStartDate.getDate() - 30)
    }

    const data = await this.statisticRepo.getBookingStatistics(parsedStartDate, parsedEndDate)

    // Calculate summary
    const totalBookings = data.reduce((sum, item) => sum + item.totalBookings, 0)
    const totalTickets = data.reduce((sum, item) => sum + item.totalTickets, 0)
    const averageTicketsPerBooking = totalBookings > 0 ? totalTickets / totalBookings : 0

    return {
      data,
      summary: {
        totalBookings,
        totalTickets,
        averageTicketsPerBooking: Math.round(averageTicketsPerBooking * 100) / 100,
      },
    }
  }
}
