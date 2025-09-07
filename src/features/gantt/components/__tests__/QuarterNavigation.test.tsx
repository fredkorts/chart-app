import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuarterNavigation } from '../QuarterNavigation';
import { GANTT_NAVIGATION } from '../../constants';

describe('QuarterNavigation', () => {
  const onQuarterChange = vi.fn();
  const onViewModeChange = vi.fn();

  beforeEach(() => {
    onQuarterChange.mockClear();
    onViewModeChange.mockClear();
  });

  it('displays current quarter label', () => {
    render(
      <QuarterNavigation
        currentYear={2024}
        currentQuarter={1}
        viewMode="quarter"
        onQuarterChange={onQuarterChange}
      />
    );
    expect(screen.getByText('Q1 2024')).toBeInTheDocument();
  });

  it('calls onQuarterChange when next is clicked', () => {
    render(
      <QuarterNavigation
        currentYear={2024}
        currentQuarter={1}
        viewMode="quarter"
        onQuarterChange={onQuarterChange}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: GANTT_NAVIGATION.NEXT_QUARTER }));
    expect(onQuarterChange).toHaveBeenCalledWith(2024, 2);
  });

  it('calls onQuarterChange when previous is clicked', () => {
    render(
      <QuarterNavigation
        currentYear={2024}
        currentQuarter={1}
        viewMode="quarter"
        onQuarterChange={onQuarterChange}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: GANTT_NAVIGATION.PREVIOUS_QUARTER }));
    expect(onQuarterChange).toHaveBeenCalledWith(2023, 4);
  });

  it('switches view mode when segmented control is clicked', () => {
    render(
      <QuarterNavigation
        currentYear={2024}
        currentQuarter={1}
        viewMode="quarter"
        onQuarterChange={onQuarterChange}
        onViewModeChange={onViewModeChange}
      />
    );
    fireEvent.click(screen.getByText('Aasta'));
    expect(onViewModeChange).toHaveBeenCalledWith('year');
  });

  it('navigates to today when Today button is clicked', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 6, 1));

    render(
      <QuarterNavigation
        currentYear={2024}
        currentQuarter={1}
        viewMode="quarter"
        onQuarterChange={onQuarterChange}
        showTodayButton
      />
    );
    fireEvent.click(screen.getByText(GANTT_NAVIGATION.TODAY));
    expect(onQuarterChange).toHaveBeenCalledWith(2025, 3);

    vi.useRealTimers();
  });
});
