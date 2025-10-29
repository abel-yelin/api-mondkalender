import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Use safe loader that handles native module loading at runtime
    const { getMoonPhaseInfo } = await import("@/services/ephemeris/swisseph-loader");

    // Get timezone from query params or default to UTC
    const searchParams = req.nextUrl.searchParams;
    const timezone = searchParams.get("timezone") || "UTC";
    const dateParam = searchParams.get("date");

    // Use provided date or current date
    const date = dateParam ? new Date(dateParam) : new Date();

    // Adjust for timezone if needed
    // Note: For simplicity, we're working with UTC times
    // In production, you'd want to handle timezone conversions properly

    const moonInfo = await getMoonPhaseInfo(date);

    return NextResponse.json({
      success: true,
      data: {
        date: moonInfo.date.toISOString(),
        phase: moonInfo.phase,
        phaseAngle: moonInfo.phaseAngle,
        illumination: moonInfo.illumination,
        isWaxing: moonInfo.isWaxing,
        moonPosition: {
          longitude: moonInfo.moonPosition.longitude,
          latitude: moonInfo.moonPosition.latitude,
          distance: moonInfo.moonPosition.distance,
        },
        sunPosition: {
          longitude: moonInfo.sunPosition.longitude,
          latitude: moonInfo.sunPosition.latitude,
          distance: moonInfo.sunPosition.distance,
        },
      },
    });
  } catch (error) {
    console.error("Moon phase calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate moon phase",
      },
      { status: 500 }
    );
  }
}
