import { describe, it, expect } from 'vitest'
import { insertionSortSteps } from '@/algorithms/insertion-sort'
import { SortStep } from '@/algorithms/index'

describe('Insertion Sort Algorithm', () => {
  it('returns initial step with unsorted array', () => {
    const arr = [5, 3, 8, 4, 2]
    const steps = insertionSortSteps(arr)

    // First step should be the initial array with no comparisons
    expect(steps[0]).toEqual({
      array: [5, 3, 8, 4, 2],
      comparedIndices: [-1, -1],
      swapped: false,
    })
  })

  it('sorts a simple array correctly', () => {
    const arr = [5, 3, 8, 4, 2]
    const steps = insertionSortSteps(arr)

    // Check that the original array wasn't modified
    expect(arr).toEqual([5, 3, 8, 4, 2])

    // Check that final array in the last step is sorted
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([2, 3, 4, 5, 8])
  })

  it('generates correct comparison and swap steps', () => {
    const arr = [5, 3]
    const steps = insertionSortSteps(arr)

    // Should have 3 steps for [5, 3]:
    // 1. Initial state
    // 2. Comparison of 3 and 5
    // 3. Swap of 3 and 5
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
      comparedIndices: [1, 0],
      swapped: false,
    })

    // Check swap step
    expect(steps[2]).toEqual({
      array: [3, 5],
      comparedIndices: [1, 0],
      swapped: true,
    })
  })

  it('handles already sorted arrays efficiently', () => {
    const arr = [1, 2, 3, 4, 5]
    const steps = insertionSortSteps(arr)

    // For an already sorted array, insertion sort is very efficient
    // We should only have the initial step and no swaps

    // Verify we don't have any swaps
    const swapSteps = steps.filter((step) => step.swapped)
    expect(swapSteps.length).toBe(0)

    // Verify final state is still sorted
    const lastStep = steps[steps.length - 1] || steps[0] // Could be just the initial step
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5])
  })

  it('handles reverse-sorted arrays', () => {
    const arr = [5, 4, 3, 2, 1]
    const steps = insertionSortSteps(arr)

    // Verify final array is sorted
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5])

    // Reverse-sorted is worst case for insertion sort - should have many swaps
    const swapSteps = steps.filter((step) => step.swapped)
    expect(swapSteps.length).toBeGreaterThan(0)
  })

  it('handles arrays with duplicate elements', () => {
    const arr = [4, 2, 4, 1, 3]
    const steps = insertionSortSteps(arr)

    // Verify final array is sorted with duplicates preserved
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([1, 2, 3, 4, 4])
  })

  it('handles empty arrays', () => {
    const arr: number[] = []
    const steps = insertionSortSteps(arr)

    // Should just have the initial step
    expect(steps.length).toBe(1)
    expect(steps[0].array).toEqual([])
  })

  it('handles single-element arrays', () => {
    const arr = [42]
    const steps = insertionSortSteps(arr)

    // Should just have the initial step (nothing to sort)
    expect(steps.length).toBe(1)
    expect(steps[0].array).toEqual([42])
  })

  it('correctly processes each element in sequence', () => {
    // This test verifies the insertion sort processes elements left to right
    const arr = [5, 2, 4, 1, 3]
    const steps = insertionSortSteps(arr)

    // Find all steps where we're processing an actual comparison (non-initial steps)
    const processingSteps = steps.filter(
      (step) => step.comparedIndices[0] !== -1,
    )

    // First set of comparisons should involve element at index 1 (value 2)
    const firstComparisonGroup = processingSteps
      .slice(0, 2) // First comparison and its swap
      .every((step) => step.comparedIndices.includes(1))

    expect(firstComparisonGroup).toBe(true)

    // Fix: Check intermediate state in the steps array, not the original array
    // Find the state after the first element (2) has been processed (after the swap)
    const afterFirstSwap =
      steps.find((step) => step.swapped && step.comparedIndices.includes(1))
        ?.array || []

    // Verify that in this intermediate state, 2 comes before 5
    const twoBeforeFive = afterFirstSwap.indexOf(2) < afterFirstSwap.indexOf(5)
    expect(twoBeforeFive).toBe(true)
  })

  it('preserves the original input array', () => {
    const arr = [5, 3, 8, 4, 2]
    const originalArr = [...arr]
    insertionSortSteps(arr)

    // Verify the original array is untouched
    expect(arr).toEqual(originalArr)
  })

  it('makes the expected number of swaps for a reversed array', () => {
    const arr = [5, 4, 3, 2, 1]
    const steps = insertionSortSteps(arr)

    // Count actual swap steps
    const swapSteps = steps.filter((step) => step.swapped)

    // For insertion sort on a reversed array of n elements:
    // Element 1 requires 0 swaps
    // Element 2 requires 1 swap
    // Element 3 requires 2 swaps
    // Element 4 requires 3 swaps
    // Element 5 requires 4 swaps
    // Total: 0+1+2+3+4 = 10 swaps
    expect(swapSteps.length).toBe(10)
  })
})
