// Navigation strings
export const GANTT_NAVIGATION = {
  PREVIOUS_QUARTER: 'Eelmine kvartal',
  NEXT_QUARTER: 'Järgmine kvartal',
  PREVIOUS_YEAR: 'Eelmine aasta',
  NEXT_YEAR: 'Järgmine aasta',
  TODAY: 'Täna',
  QUARTER: 'Kvartal',
  YEAR: 'Aasta',
} as const;

// Action button labels
export const GANTT_ACTIONS = {
  ADD_TASK: 'Lisa ülesanne',
  VIEW_CHART: 'Vaata graafikut',
  SAVE_CHANGES: 'Salvesta muudatused',
  EDIT: 'Muuda',
  DELETE: 'Kustuta',
  CANCEL: 'Tühista',
  YES: 'Jah',
  NO: 'Ei',
} as const;

// Empty state messages
export const GANTT_EMPTY_STATE = {
  NO_TASKS_QUARTER: 'puuduvad ülesanded',
  NO_TASKS_YEAR: 'puuduvad ülesanded',
  ADD_TASKS_PROMPT: 'Lisa ülesandeid, et näha neid ajakavas.',
  EMPTY_ICON: '📅',
} as const;

// Confirmation messages
export const GANTT_CONFIRMATIONS = {
  DELETE_TASK_QUESTION: 'Kas soovite kustutada selle ülesande?',
} as const;

// Quarter formatting
export const GANTT_QUARTER_FORMAT = {
  QUARTER_PREFIX: 'Q',
  YEAR_PREFIX: 'Aasta',
  YEAR_IN: 'Aastal',
} as const;

// Accessibility labels and descriptions
export const GANTT_ACCESSIBILITY = {
  QUARTER_NAVIGATION_ARIA: 'Quarter navigation controls',
  TASK_BAR_ARIA: 'Task bar',
  TIMELINE_ARIA: 'Timeline grid',
  MONTH_HEADER_ARIA: 'Month header',
} as const;

// Task bar indicators
export const GANTT_TASK_INDICATORS = {
  CONTINUES_LEFT: '◄',
  CONTINUES_RIGHT: '►',
  PARTIAL_TASK: '*',
} as const;

// View mode options
export const GANTT_VIEW_MODES = {
  QUARTER_OPTION: 'Kvartal',
  YEAR_OPTION: 'Aasta',
} as const;

// Helper function to format quarter display
export const formatQuarterDisplay = (quarter: number, year: number, viewMode: 'quarter' | 'year'): string => {
  if (viewMode === 'quarter') {
    return `${GANTT_QUARTER_FORMAT.QUARTER_PREFIX}${quarter} ${year}`;
  }
  return `${year}`;
};

// Helper function to format empty state message
export const formatEmptyStateMessage = (year: number, quarter?: number, viewMode: 'quarter' | 'year' = 'quarter'): string => {
  if (viewMode === 'quarter' && quarter) {
    return `${GANTT_QUARTER_FORMAT.YEAR_PREFIX} ${year} ${GANTT_QUARTER_FORMAT.QUARTER_PREFIX}${quarter} ${GANTT_EMPTY_STATE.NO_TASKS_QUARTER}`;
  }
  return `${GANTT_QUARTER_FORMAT.YEAR_IN} ${year} ${GANTT_EMPTY_STATE.NO_TASKS_YEAR}`;
};
