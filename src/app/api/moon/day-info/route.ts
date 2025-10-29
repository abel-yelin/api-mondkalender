import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  // Dynamic imports to avoid loading native modules at build time
  const { getAccurateDayInfo } = await import("@/lib/lunar-accurate");
  const { getCachedData, generateMoonCacheKey } = await import("@/lib/cache");
  try {
    const searchParams = req.nextUrl.searchParams;
    const dateParam = searchParams.get("date");
    const latitudeParam = searchParams.get("latitude");
    const longitudeParam = searchParams.get("longitude");

    // Validate required parameters
    if (!latitudeParam || !longitudeParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Latitude and longitude are required",
        },
        { status: 400 }
      );
    }

    const latitude = parseFloat(latitudeParam);
    const longitude = parseFloat(longitudeParam);

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid latitude or longitude",
        },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        {
          success: false,
          error: "Latitude must be between -90 and 90, longitude between -180 and 180",
        },
        { status: 400 }
      );
    }

    // Use provided date or current date
    const date = dateParam ? new Date(dateParam) : new Date();

    // Validate date
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid date format",
        },
        { status: 400 }
      );
    }

    // Generate cache key based on date and location
    const cacheKey = generateMoonCacheKey(date, latitude, longitude);

    // Use cached data or fetch fresh data
    // TTL: 24 hours (86400 seconds) - moon data for a specific date doesn't change
    const dayInfo = await getCachedData(
      cacheKey,
      () => getAccurateDayInfo(date, latitude, longitude),
      86400
    );

    return NextResponse.json({
      success: true,
      data: dayInfo,
    });
  } catch (error) {
    console.error("Day info calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate day info",
      },
      { status: 500 }
    );
  }
}
