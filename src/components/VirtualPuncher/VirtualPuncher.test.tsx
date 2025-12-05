import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VirtualPuncher from './VirtualPuncher';

describe('VirtualPuncher', () => {
  it('renders the punch card grid with correct dimensions', () => {
    const mockOnSubmit = vi.fn();
    render(<VirtualPuncher onSubmit={mockOnSubmit} />);
    
    // Check for title (with emoji)
    expect(screen.getByText(/Virtual Punch Card/)).toBeInTheDocument();
    
    // Check for subtitle with dimensions
    expect(screen.getByText(/80 columns × 12 rows/)).toBeInTheDocument();
  });

  it('toggles punch hole state when cell is clicked', () => {
    const mockOnSubmit = vi.fn();
    render(<VirtualPuncher onSubmit={mockOnSubmit} />);
    
    // Get a cell that's not part of the demo pattern (row 11, col 50)
    const cell = screen.getByTestId('cell-11-50');
    
    // Initially should not have punched class
    expect(cell).not.toHaveClass('punched');
    
    // Click to punch
    fireEvent.click(cell);
    expect(cell).toHaveClass('punched');
    
    // Click again to unpunch
    fireEvent.click(cell);
    expect(cell).not.toHaveClass('punched');
  });

  it('clears all punch holes when Clear button is clicked', () => {
    const mockOnSubmit = vi.fn();
    render(<VirtualPuncher onSubmit={mockOnSubmit} />);
    
    // Punch a cell
    const cell = screen.getByTestId('cell-11-50');
    fireEvent.click(cell);
    expect(cell).toHaveClass('punched');
    
    // Clear the card
    const clearButton = screen.getByText(/Clear/);
    fireEvent.click(clearButton);
    
    // Cell should be unpunched
    expect(cell).not.toHaveClass('punched');
  });

  it('calls onSubmit with the punch pattern when Resurrect Code button is clicked', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<VirtualPuncher onSubmit={mockOnSubmit} />);
    
    // Clear first to have a clean slate
    const clearButton = screen.getByText(/Clear/);
    fireEvent.click(clearButton);
    
    // Punch a specific pattern
    const cell = screen.getByTestId('cell-5-10');
    fireEvent.click(cell);
    
    // Click submit
    const submitButton = screen.getByText(/RESURRECT CODE/);
    fireEvent.click(submitButton);
    
    // Check that onSubmit was called with a 12x80 grid
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    const pattern = mockOnSubmit.mock.calls[0][0];
    
    expect(pattern).toHaveLength(12); // 12 rows
    expect(pattern[0]).toHaveLength(80); // 80 columns
    expect(pattern[5][10]).toBe(true); // The cell we punched
  });

  it('accepts and displays initial pattern', () => {
    const mockOnSubmit = vi.fn();
    const initialPattern = Array.from({ length: 12 }, () => Array(80).fill(false));
    initialPattern[3][5] = true; // Punch one hole
    
    render(<VirtualPuncher onSubmit={mockOnSubmit} initialPattern={initialPattern} />);
    
    const cell = screen.getByTestId('cell-3-5');
    expect(cell).toHaveClass('punched');
  });

  it('shows loading state during submission', async () => {
    const mockOnSubmit = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<VirtualPuncher onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByText(/RESURRECT CODE/);
    fireEvent.click(submitButton);
    
    // Should show loading text
    expect(screen.getByText(/Resurrecting/)).toBeInTheDocument();
    
    // Wait for submission to complete
    await vi.waitFor(() => {
      expect(screen.getByText(/RESURRECT CODE/)).toBeInTheDocument();
    });
  });

  it('disables buttons during submission', async () => {
    const mockOnSubmit = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<VirtualPuncher onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByText(/RESURRECT CODE/);
    const clearButton = screen.getByText(/Clear/);
    
    fireEvent.click(submitButton);
    
    // Both buttons should be disabled
    expect(submitButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
    
    // Wait for submission to complete
    await vi.waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(clearButton).not.toBeDisabled();
    });
  });

  it('loads demo pattern when Load Demo button is clicked', () => {
    const mockOnSubmit = vi.fn();
    render(<VirtualPuncher onSubmit={mockOnSubmit} />);
    
    // Clear first
    const clearButton = screen.getByText(/Clear/);
    fireEvent.click(clearButton);
    
    // Load demo
    const demoButton = screen.getByText(/Load Demo/);
    fireEvent.click(demoButton);
    
    // Check that demo pattern is loaded (H in HELLO is at row 0, col 0)
    const cell = screen.getByTestId('cell-0-0');
    expect(cell).toHaveClass('punched');
  });
});
