import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    message: 'Moon Calendar API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      today: '/api/moon/today',
      dayInfo: '/api/moon/day-info?latitude=52.52&longitude=13.405',
      month: '/api/moon/month?year=2025&month=9',
      calendar: '/api/moon/calendar?startDate=2025-10-01&endDate=2025-10-31',
    },
    documentation: 'https://github.com/yourusername/moon-calendar-api',
  });
}
