import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from '../Textarea';

describe('Textarea', () => {
  it('renders with label', () => {
    render(<Textarea label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Textarea label="Test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('displays helper text when no error', () => {
    render(<Textarea label="Test" helperText="Enter your description" />);
    expect(screen.getByText('Enter your description')).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(
      <Textarea 
        label="Test" 
        error="Error message" 
        helperText="Helper text"
      />
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies disabled state', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:bg-gray-50');
  });

  it('sets aria-invalid when error exists', () => {
    render(<Textarea error="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies resize classes correctly', () => {
    const { rerender } = render(<Textarea resize="none" />);
    expect(screen.getByRole('textbox')).toHaveClass('resize-none');

    rerender(<Textarea resize="both" />);
    expect(screen.getByRole('textbox')).toHaveClass('resize');
  });

  it('sets default rows', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
  });

  it('allows custom rows', () => {
    render(<Textarea rows={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });
});
