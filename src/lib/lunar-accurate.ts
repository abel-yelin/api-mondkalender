import * as Astronomy from 'astronomy-engine';
import { DayInfo, MonthData, MoonPhase } from '@/types/moon';
import { getMoonPhaseInfo } from '@/services/ephemeris/swisseph-loader';

// Zodiac signs
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Get zodiac sign from ecliptic longitude
function getZodiacSign(longitude: number): string {
  const index = Math.floor(longitude / 30);
  return ZODIAC_SIGNS[index % 12];
}

// Get accurate day info with rise/set times
export async function getAccurateDayInfo(
  date: Date,
  latitude: number,
  longitude: number
): Promise<DayInfo> {
  // Use Swiss Ephemeris for moon phase
  const moonPhaseInfo = await getMoonPhaseInfo(date);

  // Use Astronomy Engine for rise/set times
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  let moonrise: string | null = null;
  let moonset: string | null = null;
  let sunrise: string | null = null;
  let sunset: string | null = null;

  try {
    // Calculate moon rise/set
    // Note: direction is 1 for rise, -1 for set
    const moonRiseResult = Astronomy.SearchRiseSet(
      Astronomy.Body.Moon,
      observer,
      1, // Rise
      new Date(startOfDay),
      1
    );
    if (moonRiseResult) {
      moonrise = moonRiseResult.date.toISOString();
    }

    const moonSetResult = Astronomy.SearchRiseSet(
      Astronomy.Body.Moon,
      observer,
      -1, // Set
      new Date(startOfDay),
      1
    );
    if (moonSetResult) {
      moonset = moonSetResult.date.toISOString();
    }

    // Calculate sun rise/set
    const sunRiseResult = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      1, // Rise
      new Date(startOfDay),
      1
    );
    if (sunRiseResult) {
      sunrise = sunRiseResult.date.toISOString();
    }

    const sunSetResult = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      -1, // Set
      new Date(startOfDay),
      1
    );
    if (sunSetResult) {
      sunset = sunSetResult.date.toISOString();
    }
  } catch (error) {
    console.warn('Error calculating rise/set times:', error);
  }

  // Get zodiac sign
  const zodiacSign = getZodiacSign(moonPhaseInfo.moonPosition.longitude);

  return {
    date: date.toISOString(),
    moonPhase: moonPhaseInfo.phase,
    phaseAngle: moonPhaseInfo.phaseAngle,
    illumination: moonPhaseInfo.illumination,
    isWaxing: moonPhaseInfo.isWaxing,
    moonrise,
    moonset,
    sunrise,
    sunset,
    moonPosition: moonPhaseInfo.moonPosition,
    zodiacSign,
  };
}

// Get accurate month data
export async function getAccurateMonthData(
  year: number,
  month: number,
  latitude: number,
  longitude: number
): Promise<MonthData> {
  const days: DayInfo[] = [];
  const newMoons: Date[] = [];
  const fullMoons: Date[] = [];
  const firstQuarters: Date[] = [];
  const lastQuarters: Date[] = [];

  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Process each day
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month, day, 12, 0, 0));
    const dayInfo = await getAccurateDayInfo(date, latitude, longitude);
    days.push(dayInfo);

    // Track special moon phases
    if (dayInfo.moonPhase === 'new_moon') {
      newMoons.push(new Date(dayInfo.date));
    } else if (dayInfo.moonPhase === 'full_moon') {
      fullMoons.push(new Date(dayInfo.date));
    } else if (dayInfo.moonPhase === 'first_quarter') {
      firstQuarters.push(new Date(dayInfo.date));
    } else if (dayInfo.moonPhase === 'last_quarter') {
      lastQuarters.push(new Date(dayInfo.date));
    }
  }

  return {
    year,
    month,
    days,
    newMoons,
    fullMoons,
    firstQuarters,
    lastQuarters,
  };
}
