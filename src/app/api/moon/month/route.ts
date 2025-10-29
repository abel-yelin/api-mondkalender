import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/moon/month
 *
 * Get accurate month data for lunar calendar
 *
 * Query parameters:
 * - year: Year (required)
 * - month: Month (0-11, required)
 * - location: Location name (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const location = searchParams.get("location");

    if (!year || !month) {
      return NextResponse.json(
        {
          success: false,
          error: "Year and month parameters are required",
        },
        { status: 400 }
      );
    }

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid year or month parameters",
        },
        { status: 400 }
      );
    }

    // For now, use default coordinates (Berlin) if no location provided
    const latitude = 52.52;
    const longitude = 13.405;

    // Dynamic import to avoid loading native module at build time
    const { getAccurateMonthData } = await import("@/lib/lunar-accurate");
    const monthData = await getAccurateMonthData(yearNum, monthNum, latitude, longitude);

    return NextResponse.json({
      success: true,
      data: monthData,
    });
  } catch (error) {
    console.error("Moon month API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch month data",
      },
      { status: 500 }
    );
  }
}
