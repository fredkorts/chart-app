export const TASK_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
] as const;

export const getTaskColor = (index?: number): string => {
  if (typeof index === 'number') {
    return TASK_COLORS[index % TASK_COLORS.length];
  }
  return TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)];
};

// Quarter names for display
export const QUARTER_NAMES = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

// Month names for Estonian locale
export const ESTONIAN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dets'
] as const;

// Validation messages in Estonian
export const VALIDATION_MESSAGES = {
  // Task name validation
  TASK_NAME_REQUIRED: 'Ülesande nimi on kohustuslik',
  TASK_NAME_TOO_SHORT: 'Ülesande nimi peab olema vähemalt 2 tähemärki',
  TASK_NAME_TOO_LONG: 'Ülesande nimi peab olema lühem kui 100 tähemärki',
  
  // Date validation
  START_DATE_REQUIRED: 'Alguskuupäev on kohustuslik',
  END_DATE_REQUIRED: 'Lõppkuupäev on kohustuslik',
  INVALID_DATE_FORMAT: 'Palun sisestage kuupäev formaadis PP.KK.AAAA',
  END_DATE_BEFORE_START: 'Lõppkuupäev peab olema hiljem alguskuupäevast',
  
  // Date range validation
  START_DATE_TOO_OLD: 'Alguskuupäev tundub liiga kaugel minevikus',
  END_DATE_TOO_FAR: 'Lõppkuupäev tundub liiga kaugel tulevikus',
  
  // General errors
  SAVE_TASK_FAILED: 'Ülesande salvestamine ebaõnnestus. Palun proovige uuesti.',
  DELETE_TASK_FAILED: 'Ülesande kustutamine ebaõnnestus. Palun proovige uuesti.',
  UPDATE_TASK_FAILED: 'Ülesande uuendamine ebaõnnestus. Palun proovige uuesti.',
  VALIDATION_FAILED: 'Andmete valideerimine ebaõnnestus',
  TASK_NOT_FOUND: 'Ülesannet ei leitud',
  
  // Task status
  STATUS_UPCOMING: 'Ootab',
  STATUS_IN_PROGRESS: 'Pooleli',
  STATUS_COMPLETED: 'Lõpetatud',
  
  // Duration units
  DURATION_DAY: 'päev',
  DURATION_DAYS: 'päeva',
  DURATION_WEEK: 'nädal',
  DURATION_WEEKS: 'nädalat',
  DURATION_MONTH: 'kuu',
  DURATION_MONTHS: 'kuud',
  DURATION_YEAR: 'aasta',
  DURATION_YEARS: 'aastat'
} as const;