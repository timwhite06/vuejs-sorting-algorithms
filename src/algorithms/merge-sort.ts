export interface SortStep {
  array: number[]
  comparedIndices: [number, number]
  swapped: boolean
}

function merge(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  steps: SortStep[],
): void {
  // Create temporary arrays
  const leftArr = arr.slice(left, mid + 1)
  const rightArr = arr.slice(mid + 1, right + 1)

  // Initial indices
  let i = 0
  let j = 0
  let k = left

  // Merge temp arrays back into the main array
  while (i < leftArr.length && j < rightArr.length) {
    // Add step to show comparison
    steps.push({
      array: [...arr],
      comparedIndices: [left + i, mid + 1 + j],
      swapped: false,
    })

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i]
      i++
    } else {
      arr[k] = rightArr[j]
      j++

      // Add step to show placement
      steps.push({
        array: [...arr],
        comparedIndices: [left + i, mid + 1 + j - 1],
        swapped: true,
      })
    }
    k++
  }

  // Copy remaining elements of leftArr if any
  while (i < leftArr.length) {
    arr[k] = leftArr[i]

    // Add step to show placement
    steps.push({
      array: [...arr],
      comparedIndices: [k, left + i],
      swapped: false,
    })

    i++
    k++
  }

  // Copy remaining elements of rightArr if any
  while (j < rightArr.length) {
    arr[k] = rightArr[j]

    // Add step to show placement
    steps.push({
      array: [...arr],
      comparedIndices: [k, mid + 1 + j],
      swapped: false,
    })

    j++
    k++
  }

  // Add step to show the result of the merge
  steps.push({
    array: [...arr],
    comparedIndices: [left, right],
    swapped: false,
  })
}

// For direct sorting without tracking steps
export function mergeSort(arr: number[]): number[] {
  const sorted = [...arr]
  if (sorted.length <= 1) {
    return sorted
  }

  const mid = Math.floor(sorted.length / 2)
  const left = mergeSort(sorted.slice(0, mid))
  const right = mergeSort(sorted.slice(mid))

  return mergeSortedArrays(left, right)
}

function mergeSortedArrays(left: number[], right: number[]): number[] {
  const result: number[] = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }

  return [...result, ...left.slice(leftIndex), ...right.slice(rightIndex)]
}

function mergeSortHelper(
  arr: number[],
  left: number,
  right: number,
  steps: SortStep[],
): void {
  if (left < right) {
    // Find the middle point
    const mid = Math.floor((left + right) / 2)

    // Sort first and second halves
    mergeSortHelper(arr, left, mid, steps)
    mergeSortHelper(arr, mid + 1, right, steps)

    // Merge the sorted halves
    merge(arr, left, mid, right, steps)
  }
}

export function mergeSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const cloned = [...arr]

  // Add initial state
  steps.push({
    array: [...cloned],
    comparedIndices: [-1, -1],
    swapped: false,
  })

  // Call the recursive function
  mergeSortHelper(cloned, 0, cloned.length - 1, steps)

  return steps
}
