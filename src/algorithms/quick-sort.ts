/**
 * Quick Sort
 * This algorithm works by selecting a pivot element from the array
 * and partitioning the other elements into two sub-arrays according
 * to whether they are less than or greater than the pivot.
 * The sub-arrays are then sorted recursively.
 * It is one of the most efficient sorting algorithms,
 * with an average time complexity of O(n log n).
 */

import { SortStep } from './index'

function swap(arr: number[], i: number, j: number): void {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

function partition(
  arr: number[],
  low: number,
  high: number,
  steps: SortStep[],
): number {
  const pivot = arr[high]
  let i = low - 1

  for (let j = low; j < high; j++) {
    steps.push({
      array: [...arr],
      comparedIndices: [j, high],
      swapped: false,
    })

    if (arr[j] < pivot) {
      i++
      swap(arr, i, j)
      steps.push({
        array: [...arr],
        comparedIndices: [i, j],
        swapped: true,
      })
    }
  }

  swap(arr, i + 1, high)
  steps.push({
    array: [...arr],
    comparedIndices: [i + 1, high],
    swapped: true,
  })

  return i + 1
}

function quickSortRecursive(
  arr: number[],
  low: number,
  high: number,
  steps: SortStep[],
): void {
  if (low < high) {
    const pi = partition(arr, low, high, steps)

    quickSortRecursive(arr, low, pi - 1, steps)
    quickSortRecursive(arr, pi + 1, high, steps)
  }
}

export function quickSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const cloned = [...arr]

  steps.push({
    array: [...cloned],
    comparedIndices: [-1, -1],
    swapped: false,
  })

  quickSortRecursive(cloned, 0, cloned.length - 1, steps)

  return steps
}
