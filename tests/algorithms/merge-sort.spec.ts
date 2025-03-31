import { describe, it, expect } from 'vitest'
import { mergeSortSteps, mergeSort } from '@/algorithms/merge-sort'
import { SortStep } from '@/algorithms/index'

describe('Merge Sort Algorithm', () => {
  describe('mergeSort (direct sorting)', () => {
    it('sorts an empty array', () => {
      expect(mergeSort([])).toEqual([])
    })

    it('sorts a single element array', () => {
      expect(mergeSort([42])).toEqual([42])
    })

    it('sorts a small array correctly', () => {
      expect(mergeSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8])
    })

    it('sorts an already sorted array', () => {
      expect(mergeSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('sorts a reverse-sorted array', () => {
      expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('handles duplicate values', () => {
      expect(mergeSort([3, 1, 4, 1, 5, 9, 2, 6, 5])).toEqual([
        1, 1, 2, 3, 4, 5, 5, 6, 9,
      ])
    })
  })

  describe('mergeSortSteps (visualisation steps)', () => {
    it('returns initial step with unsorted array', () => {
      const arr = [5, 3, 8, 4, 2]
      const steps = mergeSortSteps(arr)

      // First step should be the initial array with no comparisons
      expect(steps[0]).toEqual({
        array: [5, 3, 8, 4, 2],
        comparedIndices: [-1, -1],
        swapped: false,
      })
    })

    it('sorts a simple array correctly', () => {
      const arr = [5, 3, 8, 4, 2]
      const steps = mergeSortSteps(arr)

      // Check that the original array wasn't modified
      expect(arr).toEqual([5, 3, 8, 4, 2])

      // Check that final array in the last step is sorted
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([2, 3, 4, 5, 8])
    })

    it('handles empty arrays', () => {
      const arr: number[] = []
      const steps = mergeSortSteps(arr)

      // Should just have the initial step
      expect(steps.length).toBe(1)
      expect(steps[0].array).toEqual([])
    })

    it('handles single-element arrays', () => {
      const arr = [42]
      const steps = mergeSortSteps(arr)

      // Should just have the initial step (nothing to sort)
      expect(steps.length).toBe(1)
      expect(steps[0].array).toEqual([42])
    })

    it('preserves the original input array', () => {
      const arr = [5, 3, 8, 4, 2]
      const originalArr = [...arr]
      mergeSortSteps(arr)

      // Verify the original array is untouched
      expect(arr).toEqual(originalArr)
    })

    it('creates appropriate comparison steps', () => {
      const arr = [3, 1, 4, 2]
      const steps = mergeSortSteps(arr)

      // Check that we have comparison steps (non-initial steps)
      const comparisonSteps = steps.filter(
        (step) =>
          step.comparedIndices[0] !== -1 && step.comparedIndices[1] !== -1,
      )
      expect(comparisonSteps.length).toBeGreaterThan(0)

      // The steps should include comparison indices
      const hasValidComparisons = comparisonSteps.every((step) => {
        const [i, j] = step.comparedIndices
        return i >= 0 && j >= 0 && i < arr.length && j < arr.length
      })
      expect(hasValidComparisons).toBe(true)
    })

    it('includes merge operation steps', () => {
      const arr = [3, 1, 4, 2]
      const steps = mergeSortSteps(arr)

      // Check for steps marked as swapped (merges)
      const mergeSteps = steps.filter((step) => step.swapped)
      expect(mergeSteps.length).toBeGreaterThan(0)
    })

    it('handles already sorted arrays', () => {
      const arr = [1, 2, 3, 4, 5]
      const steps = mergeSortSteps(arr)

      // Even for sorted arrays, merge sort does the same work
      // We should have more than just the initial step
      expect(steps.length).toBeGreaterThan(1)

      // Final array should still be sorted
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 4, 5])
    })

    it('handles reverse-sorted arrays', () => {
      const arr = [5, 4, 3, 2, 1]
      const steps = mergeSortSteps(arr)

      // Check the final array is sorted
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 4, 5])
    })

    it('creates expected number of steps for small arrays', () => {
      // For merge sort, we can calculate the minimum number of steps needed
      // based on the number of merges required

      // Test with a 2-element array (should have at least 3 steps: initial + comparison + merge)
      const stepsFor2 = mergeSortSteps([2, 1])
      expect(stepsFor2.length).toBeGreaterThanOrEqual(3)

      // Test with a 4-element array
      const stepsFor4 = mergeSortSteps([4, 3, 2, 1])
      expect(stepsFor4.length).toBeGreaterThan(stepsFor2.length)
    })

    it('has intermediate steps with partially sorted subarrays', () => {
      const arr = [5, 2, 4, 1, 3]
      const steps = mergeSortSteps(arr)

      // Find steps where parts of the array are sorted
      // We can't easily predict the exact step, so we'll check if there exists a step
      // where some subarray is sorted while the whole array isn't yet sorted

      const partialSortSteps = steps.filter((step) => {
        const array = step.array
        // Avoid the initial and final steps
        if (
          array.join(',') === arr.join(',') ||
          array.join(',') === [1, 2, 3, 4, 5].join(',')
        ) {
          return false
        }

        // Look for sorted subarrays of length at least 2
        for (let i = 0; i < array.length - 1; i++) {
          if (array[i] < array[i + 1]) {
            return true
          }
        }

        return false
      })

      expect(partialSortSteps.length).toBeGreaterThan(0)
    })
  })
})
