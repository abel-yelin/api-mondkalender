import * as swisseph from 'swisseph';
import { MoonPhase, MoonPhaseInfo, CelestialPosition } from '@/types/moon';

// Initialize Swiss Ephemeris
let isInitialized = false;

function initializeSwisseph() {
  if (!isInitialized) {
    // Set ephemeris path (will use built-in data if not set)
    swisseph.swe_set_ephe_path(__dirname);
    isInitialized = true;
  }
}

// Convert Date to Julian Day
function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
}

// Get celestial body position
function getBodyPosition(julianDay: number, body: number): CelestialPosition {
  const flag = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;
  const result = swisseph.swe_calc_ut(julianDay, body, flag);

  if (result.rflag < 0) {
    throw new Error(`Failed to calculate position for body ${body}`);
  }

  return {
    longitude: result.longitude,
    latitude: result.latitude,
    distance: result.distance,
  };
}

// Determine moon phase from angle
function getMoonPhaseFromAngle(angle: number, isWaxing: boolean): MoonPhase {
  if (angle < 22.5 || angle >= 337.5) return "new_moon";
  if (angle < 67.5) return "waxing_crescent";
  if (angle < 112.5) return "first_quarter";
  if (angle < 157.5) return "waxing_gibbous";
  if (angle < 202.5) return "full_moon";
  if (angle < 247.5) return "waning_gibbous";
  if (angle < 292.5) return "last_quarter";
  return "waning_crescent";
}

// Get moon phase information for a specific date
export async function getMoonPhaseInfo(date: Date): Promise<MoonPhaseInfo> {
  initializeSwisseph();

  const julianDay = dateToJulianDay(date);

  // Get Moon position
  const moonPosition = getBodyPosition(julianDay, swisseph.SE_MOON);

  // Get Sun position
  const sunPosition = getBodyPosition(julianDay, swisseph.SE_SUN);

  // Calculate phase angle (difference in longitude)
  let phaseAngle = moonPosition.longitude - sunPosition.longitude;
  if (phaseAngle < 0) phaseAngle += 360;
  if (phaseAngle > 360) phaseAngle -= 360;

  // Calculate illumination
  const illumination = (1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2 * 100;

  // Determine if waxing or waning
  const isWaxing = phaseAngle < 180;

  // Get phase name
  const phase = getMoonPhaseFromAngle(phaseAngle, isWaxing);

  return {
    date,
    phase,
    phaseAngle,
    illumination,
    isWaxing,
    moonPosition,
    sunPosition,
  };
}

// Get moon phases for a date range
export async function getMoonPhasesForRange(
  startDate: Date,
  endDate: Date
): Promise<MoonPhaseInfo[]> {
  initializeSwisseph();

  const results: MoonPhaseInfo[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const moonInfo = await getMoonPhaseInfo(new Date(currentDate));
    results.push(moonInfo);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return results;
}

// Clean up resources
export function cleanup() {
  if (isInitialized) {
    swisseph.swe_close();
    isInitialized = false;
  }
}
