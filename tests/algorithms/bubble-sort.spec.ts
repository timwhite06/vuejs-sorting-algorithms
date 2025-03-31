import { describe, it, expect } from 'vitest'
import { bubbleSortSteps } from '@/algorithms/bubble-sort'
import { SortStep } from '@/algorithms/index'

describe('Bubble Sort Algorithm', () => {
  it('returns initial step with unsorted array', () => {
    const arr = [5, 3, 8, 4, 2]
    const steps = bubbleSortSteps(arr)

    // First step should be the initial array with no comparisons
    expect(steps[0]).toEqual({
      array: [5, 3, 8, 4, 2],
      comparedIndices: [-1, -1],
      swapped: false,
    })
  })

  it('sorts a simple array correctly', () => {
    const arr = [5, 3, 8, 4, 2]
    const steps = bubbleSortSteps(arr)

    // Check that the original array wasn't modified
    expect(arr).toEqual([5, 3, 8, 4, 2])

    // Check that final array in the last step is sorted
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([2, 3, 4, 5, 8])
  })

  it('generates correct comparison steps', () => {
    const arr = [5, 3]
    const steps = bubbleSortSteps(arr)

    // Should have 3 steps for [5, 3]:
    // 1. Initial state
    // 2. Comparison of 5 and 3
    // 3. Swap of 5 and 3
    expect(steps.length).toBe(3)

    // Check initial step
    expect(steps[0]).toEqual({
      array: [5, 3],
      comparedIndices: [-1, -1],
      swapped: false,
    })

    // Check comparison step
    expect(steps[1]).toEqual({
      array: [5, 3],
      comparedIndices: [0, 1],
      swapped: false,
    })

    // Check swap step
    expect(steps[2]).toEqual({
      array: [3, 5],
      comparedIndices: [0, 1],
      swapped: true,
    })
  })

  it('handles already sorted arrays efficiently', () => {
    const arr = [1, 2, 3, 4, 5]
    const steps = bubbleSortSteps(arr)

    // For an already sorted array, we should have:
    // 1. Initial step
    // + n-1 comparison steps (no swaps)
    // Total: n steps (where n is array length)

    // Verify we don't have any swaps
    const swapSteps = steps.filter((step) => step.swapped)
    expect(swapSteps.length).toBe(0)

    // Verify final state is still sorted
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5])
  })

  it('handles reverse-sorted arrays', () => {
    const arr = [5, 4, 3, 2, 1]
    const steps = bubbleSortSteps(arr)

    // Verify final array is sorted
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5])

    // Reverse-sorted is worst case - should have many swaps
    const swapSteps = steps.filter((step) => step.swapped)
    expect(swapSteps.length).toBeGreaterThan(0)
  })

  it('handles arrays with duplicate elements', () => {
    const arr = [4, 2, 4, 1, 3]
    const steps = bubbleSortSteps(arr)

    // Verify final array is sorted with duplicates preserved
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([1, 2, 3, 4, 4])
  })

  it('handles empty arrays', () => {
    const arr: number[] = []
    const steps = bubbleSortSteps(arr)

    // Should just have the initial step
    expect(steps.length).toBe(1)
    expect(steps[0].array).toEqual([])
  })

  it('handles single-element arrays', () => {
    const arr = [42]
    const steps = bubbleSortSteps(arr)

    // Should just have the initial step (nothing to sort)
    expect(steps.length).toBe(1)
    expect(steps[0].array).toEqual([42])
  })

  it('performs the expected number of comparisons', () => {
    const arr = [5, 4, 3, 2, 1]
    const steps = bubbleSortSteps(arr)

    // Count actual comparison steps (exclude initial and swap steps)
    const comparisonSteps = steps.filter(
      (step) => step.comparedIndices[0] !== -1 && !step.swapped,
    )

    // For bubble sort, we expect n-1 + n-2 + ... + 1 comparison steps
    // For n=5, that's 4+3+2+1 = 10 comparisons
    // We're optimising with the counter though, so it might be fewer

    // Just verify we're not doing excessive comparisons
    expect(comparisonSteps.length).toBeLessThanOrEqual(10)
  })

  it('preserves the original input array', () => {
    const arr = [5, 3, 8, 4, 2]
    const originalArr = [...arr]
    bubbleSortSteps(arr)

    // Verify the original array is untouched
    expect(arr).toEqual(originalArr)
  })
})
