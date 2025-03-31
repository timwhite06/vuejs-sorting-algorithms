import { SortStep } from './index'

function swap(arr: number[], i: number, j: number): void {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

export function bubbleSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const cloned = [...arr]

  steps.push({
    array: [...cloned],
    comparedIndices: [-1, -1],
    swapped: false,
  })

  let isSorted = false
  let counter = 0
  while (!isSorted) {
    isSorted = true
    for (let i = 0; i < cloned.length - 1 - counter; i++) {
      steps.push({
        array: [...cloned],
        comparedIndices: [i, i + 1],
        swapped: false,
      })

      if (cloned[i] > cloned[i + 1]) {
        swap(cloned, i, i + 1)
        isSorted = false
        steps.push({
          array: [...cloned],
          comparedIndices: [i, i + 1],
          swapped: true,
        })
      }
    }
    counter++
  }

  return steps
}
