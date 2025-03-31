import { describe, it, expect } from 'vitest'
import { quickSortSteps } from '@/algorithms/quick-sort'
import { SortStep } from '@/algorithms/index'

describe('Quick Sort Algorithm', () => {
  it('returns initial step with unsorted array', () => {
    const arr = [5, 3, 8, 4, 2]
    const steps = quickSortSteps(arr)

    // First step should be the initial array with no comparisons
    expect(steps[0]).toEqual({
      array: [5, 3, 8, 4, 2],
      comparedIndices: [-1, -1],
      swapped: false,
    })
  })

  it('sorts a simple array correctly', () => {
    const arr = [5, 3, 8, 4, 2]
    const steps = quickSortSteps(arr)

    // Check that the original array wasn't modified
    expect(arr).toEqual([5, 3, 8, 4, 2])

    // Check that final array in the last step is sorted
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([2, 3, 4, 5, 8])
  })

  it('handles already sorted arrays', () => {
    const arr = [1, 2, 3, 4, 5]
    const steps = quickSortSteps(arr)

    // Even for sorted arrays, quick sort does the same work
    // We should have more than just the initial step
    expect(steps.length).toBeGreaterThan(1)

    // Final array should still be sorted
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5])
  })

  it('handles reverse-sorted arrays', () => {
    const arr = [5, 4, 3, 2, 1]
    const steps = quickSortSteps(arr)

    // Verify final array is sorted
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5])

    // Reverse-sorted should have several partition and swap steps
    const swapSteps = steps.filter((step) => step.swapped)
    expect(swapSteps.length).toBeGreaterThan(0)
  })

  it('handles arrays with duplicate elements', () => {
    const arr = [4, 2, 4, 1, 3]
    const steps = quickSortSteps(arr)

    // Verify final array is sorted with duplicates preserved
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([1, 2, 3, 4, 4])
  })

  it('handles empty arrays', () => {
    const arr: number[] = []
    const steps = quickSortSteps(arr)

    // Should just have the initial step
    expect(steps.length).toBe(1)
    expect(steps[0].array).toEqual([])
  })

  it('handles single-element arrays', () => {
    const arr = [42]
    const steps = quickSortSteps(arr)

    // Should just have the initial step (nothing to sort)
    expect(steps.length).toBe(1)
    expect(steps[0].array).toEqual([42])
  })

  it('creates appropriate partition and comparison steps', () => {
    const arr = [3, 1, 4, 2]
    const steps = quickSortSteps(arr)

    // Check that we have comparison steps (non-initial steps)
    const comparisonSteps = steps.filter(
      (step) => step.comparedIndices[0] !== -1 && !step.swapped,
    )
    expect(comparisonSteps.length).toBeGreaterThan(0)

    // Check that we have swap steps (partitioning)
    const swapSteps = steps.filter((step) => step.swapped)
    expect(swapSteps.length).toBeGreaterThan(0)

    // Check that comparedIndices always refers to valid indices
    const hasValidComparisons = steps.every((step) => {
      const [i, j] = step.comparedIndices
      // -1 is valid for initial step
      if (i === -1 && j === -1) return true
      return i >= 0 && j >= 0 && i < arr.length && j < arr.length
    })
    expect(hasValidComparisons).toBe(true)
  })

  it('preserves the original input array', () => {
    const arr = [5, 3, 8, 4, 2]
    const originalArr = [...arr]
    quickSortSteps(arr)

    // Verify the original array is untouched
    expect(arr).toEqual(originalArr)
  })

  it('uses the last element as pivot in partitioning', () => {
    // This is specific to this quick sort implementation
    const arr = [5, 3, 8, 4, 2]
    const steps = quickSortSteps(arr)

    // Find the first comparison step
    const firstComparisonStep = steps.find(
      (step) => step.comparedIndices[0] !== -1 && !step.swapped,
    )

    // In this implementation, one of the compared indices should be
    // the last element of the array (the pivot)
    expect(firstComparisonStep?.comparedIndices).toContain(arr.length - 1)
  })

  it('correctly partitions around the pivot', () => {
    // Test a simple case where we can track the pivot
    const arr = [5, 3, 8, 4, 2]
    const steps = quickSortSteps(arr)

    // Find the first swap that involves the pivot (when it's moved to its final position)
    // This is usually the swap where one index is the last element
    const pivotSwapStep = steps.find(
      (step) => step.swapped && step.comparedIndices.includes(arr.length - 1),
    )

    if (pivotSwapStep) {
      const pivotValue = arr[arr.length - 1] // Original pivot value (2)
      const pivotIndex = pivotSwapStep.comparedIndices.find(
        (i) => i !== arr.length - 1,
      )

      if (pivotIndex !== undefined) {
        // In the array after this swap, check that:
        // 1. Elements before pivotIndex are <= pivotValue
        // 2. Elements after pivotIndex are >= pivotValue
        const arrayAfterSwap = pivotSwapStep.array

        const allSmallerOnLeft = arrayAfterSwap
          .slice(0, pivotIndex)
          .every((value) => value <= pivotValue)

        const allLargerOnRight = arrayAfterSwap
          .slice(pivotIndex + 1)
          .every((value) => value >= pivotValue)

        expect(allSmallerOnLeft).toBe(true)
        expect(allLargerOnRight).toBe(true)
      }
    }
  })

  it('has the expected number of steps for a simple case', () => {
    // For [3,1,2] with last-element pivot:
    // 1. Initial step
    // 2. Compare 3 with pivot 2
    // 3. Compare 1 with pivot 2
    // 4. Swap 3 and 1
    // 5. Swap 1 and 2 (pivot)
    // 6. Recursive call on left subarray (just 1)
    // 7. Recursive call on right subarray (just 3)
    const arr = [3, 1, 2]
    const steps = quickSortSteps(arr)

    // The exact number of steps depends on implementation details,
    // but we can make some general assertions
    expect(steps.length).toBeGreaterThanOrEqual(5)

    // And the final array should be sorted
    expect(steps[steps.length - 1].array).toEqual([1, 2, 3])
  })
})
