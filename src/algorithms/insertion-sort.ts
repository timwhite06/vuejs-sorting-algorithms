/**
 * This function sorts an array using the insertion sort algorithm.
 * It works by building a sorted array from left to right.
 * It compares the current element with the previous elements
 * and swaps them if necessary, until the current element
 * is in the correct position.
 * It will keep comparing the element with the previous elements
 * until it reaches the beginning of
 * the array or it finds an element
 */

import { SortStep } from './index'

function swap(arr: number[], i: number, j: number): void {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

export function insertionSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const cloned = [...arr]

  steps.push({
    array: [...cloned],
    comparedIndices: [-1, -1],
    swapped: false,
  })

  for (let i = 1; i < cloned.length; i++) {
    let j = i
    while (j > 0 && cloned[j] < cloned[j - 1]) {
      steps.push({
        array: [...cloned],
        comparedIndices: [j, j - 1],
        swapped: false,
      })

      swap(cloned, j, j - 1)

      steps.push({
        array: [...cloned],
        comparedIndices: [j, j - 1],
        swapped: true,
      })

      j--
    }
  }

  return steps
}
