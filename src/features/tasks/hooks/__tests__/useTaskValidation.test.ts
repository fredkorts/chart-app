import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTaskValidation } from '../useTaskValidation'

describe('useTaskValidation', () => {
  it('should initialize with no errors', () => {
    const { result } = renderHook(() => useTaskValidation())
    expect(result.current.errors).toEqual([])
  })

  it('should validate required fields', () => {
    const { result } = renderHook(() => useTaskValidation())
    
    act(() => {
      const isValid = result.current.validateTask({})
      expect(isValid).toBe(false)
    })

    expect(result.current.errors).toHaveLength(3)
    expect(result.current.errors[0].field).toBe('name')
    expect(result.current.errors[1].field).toBe('startDate')
    expect(result.current.errors[2].field).toBe('endDate')
  })

  it('should validate date logic', () => {
    const { result } = renderHook(() => useTaskValidation())
    
    const futureDate = new Date('2023-12-31')
    const pastDate = new Date('2023-01-01')
    
    act(() => {
      const isValid = result.current.validateTask({
        name: 'Test Task',
        startDate: futureDate,
        endDate: pastDate
      })
      expect(isValid).toBe(false)
    })

    expect(result.current.errors.some(e => e.field === 'endDate')).toBe(true)
  })

  it('should clear errors', () => {
    const { result } = renderHook(() => useTaskValidation())
    
    act(() => {
      result.current.validateTask({}) // Creates errors
    })
    
    act(() => {
      result.current.clearErrors()
    })

    expect(result.current.errors).toEqual([])
  })
})