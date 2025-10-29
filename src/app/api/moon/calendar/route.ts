import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Both startDate and endDate are required",
        },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid date format",
        },
        { status: 400 }
      );
    }

    // Limit range to 60 days
    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 60) {
      return NextResponse.json(
        {
          success: false,
          error: "Date range cannot exceed 60 days",
        },
        { status: 400 }
      );
    }

    // Use safe loader that handles native module loading at runtime
    const { getMoonPhasesForRange } = await import("@/services/ephemeris/swisseph-loader");

    const moonPhases = await getMoonPhasesForRange(startDate, endDate);

    const data = moonPhases.map((info) => ({
      date: info.date.toISOString(),
      phase: info.phase,
      phaseAngle: info.phaseAngle,
      illumination: info.illumination,
      isWaxing: info.isWaxing,
      moonLongitude: info.moonPosition.longitude,
      moonLatitude: info.moonPosition.latitude,
      sunLongitude: info.sunPosition.longitude,
    }));

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error("Moon calendar calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate moon calendar",
      },
      { status: 500 }
    );
  }
}
