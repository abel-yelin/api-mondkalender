// Moon phase types
export type MoonPhase =
  | "new_moon"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full_moon"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent";

// Position in the sky
export interface CelestialPosition {
  longitude: number;   // Ecliptic longitude in degrees
  latitude: number;    // Ecliptic latitude in degrees
  distance: number;    // Distance in AU
}

// Moon phase information
export interface MoonPhaseInfo {
  date: Date;
  phase: MoonPhase;
  phaseAngle: number;        // 0-360 degrees
  illumination: number;      // 0-100%
  isWaxing: boolean;
  moonPosition: CelestialPosition;
  sunPosition: CelestialPosition;
}

// Day info with rise/set times
export interface DayInfo {
  date: string;
  moonPhase: MoonPhase;
  phaseAngle: number;
  illumination: number;
  isWaxing: boolean;
  moonrise: string | null;
  moonset: string | null;
  sunrise: string | null;
  sunset: string | null;
  moonPosition: CelestialPosition;
  zodiacSign: string;
}

// Month data
export interface MonthData {
  year: number;
  month: number;
  days: DayInfo[];
  newMoons: Date[];
  fullMoons: Date[];
  firstQuarters: Date[];
  lastQuarters: Date[];
}
