/**
 * Tasks Feature String Constants
 * 
 * Centralized string constants for the Tasks feature components.
 * All user-facing text in Estonian for consistency across the application.
 * 
 * This file contains all text strings used in the tasks feature components:
 * - Form labels and placeholders
 * - Button text and actions
 * - Modal titles and messages
 * - Notification messages
 * - Field labels and descriptions
 * - Status messages
 * 
 * Usage:
 * import { TASKS_LABELS, TASKS_ACTIONS } from '../constants';
 * 
 * Benefits:
 * - Centralized translation management
 * - Consistent terminology across components
 * - Easy maintenance and updates
 * - Type safety with const assertions
 */

// Form field labels and placeholders
export const TASKS_LABELS = {
  TASK_NAME: 'Ülesande nimi',
  START_DATE: 'Alguskuupäev',
  END_DATE: 'Lõppkuupäev',
  COLOR: 'Värv',
  DURATION: 'Kestus',
  STATUS: 'Staatus',
  TASK_ID: 'Ülesande ID',
} as const;

// Form placeholders and helper text
export const TASKS_PLACEHOLDERS = {
  ENTER_TASK_NAME: 'Sisestage ülesande nimi',
  START_DATE_PLACEHOLDER: 'Alguskuupäev',
  END_DATE_PLACEHOLDER: 'Lõppkuupäev',
  DATE_FORMAT_HELP: 'Kuupäev formaadis PP.KK.AAAA',
} as const;

// Action button labels
export const TASKS_ACTIONS = {
  ADD_TASK: 'Lisa ülesanne',
  EDIT: 'Muuda',
  DELETE: 'Kustuta',
  SAVE: 'Salvesta',
  SAVE_CHANGES: 'Salvesta muudatused',
  CANCEL: 'Tühista',
  GO_BACK: 'Mine tagasi',
  YES_DELETE: 'Jah, kustuta',
  SAVING: 'Salvestamine...',
  DELETING: 'Kustutan...',
  PROCESSING: 'Töötleb...',
} as const;

// Modal titles
export const TASKS_MODAL_TITLES = {
  TASK_DETAILS: 'Ülesande detailid',
  EDIT_TASK: 'Muuda ülesannet',
  CONFIRM_DELETE: 'Kinnita kustutamine',
  TASK: 'Ülesanne',
} as const;

// Confirmation messages
export const TASKS_CONFIRMATIONS = {
  DELETE_TASK_QUESTION: 'Kas olete kindel, et soovite kustutada ülesande',
  CANNOT_UNDO: 'Seda toimingut ei saa tagasi võtta.',
} as const;

// Notification messages
export const TASKS_NOTIFICATIONS = {
  TASK_ADDED: 'Lisasite uue ülesande',
  TASK_UPDATED: 'Muutsite ülesande',
  TASK_DELETED: 'Kustutasite ülesande',
} as const;

// Color and visual descriptions
export const TASKS_VISUAL = {
  TASK_COLOR_ARIA: 'Ülesande värv:',
} as const;

// Helper functions for dynamic messages
export const formatDeleteConfirmation = (taskName: string): string => {
  return `${TASKS_CONFIRMATIONS.DELETE_TASK_QUESTION} "${taskName}"?`;
};

export const formatTaskDeletedNotification = (taskName: string): string => {
  return `${TASKS_NOTIFICATIONS.TASK_DELETED} ${taskName}`;
};

export const formatTaskColorAria = (color: string): string => {
  return `${TASKS_VISUAL.TASK_COLOR_ARIA} ${color}`;
};
