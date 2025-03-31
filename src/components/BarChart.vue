<script>
import { bubbleSortSteps } from '@/algorithms/bubble-sort'
import { mergeSortSteps } from '@/algorithms/merge-sort'

export default {
  props: {
    // Receiving the 'number' prop from the parent component
    number: {
      type: Number,
      required: true,
    },
    algorithmSelection: {
      type: String,
      required: true,
    },
    frame: {
      type: Number,
      required: true,
    },
    totalFrames: {
      type: Number,
      required: true,
    },
    isPlaying: {
      type: Boolean,
      required: true,
    },
    triggerReset: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      barArray: [],
      sortingSteps: [], // Store all steps of the sorting process
      initialArray: [], // Keep the initial array for resets
    }
  },
  methods: {
    bubbleSort() {
      // Generate the steps for the bubble sort algorithm
      this.sortingSteps = bubbleSortSteps(this.barArray)
      // Emit an event to update totalFrames in the parent
      this.$emit('update:totalFrames', this.sortingSteps.length)
    },
    mergeSort() {
      this.sortingSteps = mergeSortSteps(this.barArray)
      this.$emit('update:totalFrames', this.sortingSteps.length)
    },
    insertionSort() {
      // console.log('merge')
    },
    quickSort() {
      // console.log('quick')
    },
    randomBars() {
      this.barArray = []
      this.sortingSteps = [] // Clear any previous steps
      this.initialArray = [] // Clear initial array

      // Use a Set to ensure unique values
      const uniqueValues = new Set()

      // Keep generating random values until we have enough unique ones
      while (uniqueValues.size < this.number) {
        const randomValue = Math.floor(Math.random() * 100)
        uniqueValues.add(randomValue)
      }

      // Convert Set to Array
      this.barArray = Array.from(uniqueValues)

      // If we're already on a sorting algorithm, generate the steps
      switch (this.algorithmSelection) {
        case 'bubble':
          this.bubbleSort()
          break
        case 'merge':
          this.mergeSort()
          break
        case 'insertion':
          this.insertionSort()
          break
        case 'quick':
          this.quickSort()
          break
        default:
          this.bubbleSort()
          break
      }
    },
    generateBars() {
      this.randomBars()
    },
  },
  mounted() {
    this.generateBars()
  },
  watch: {
    number() {
      this.generateBars()
    },
    triggerReset() {
      console.log('reset')
      this.generateBars()
    },
    algorithmSelection(newAlgorithm, oldAlgorithm) {
      if (newAlgorithm !== oldAlgorithm) {
        switch (newAlgorithm) {
          case 'bubble':
            this.bubbleSort()
            break
          case 'merge':
            this.mergeSort()
            break
          case 'insertion':
            this.insertionSort()
            break
          case 'quick':
            this.quickSort()
            break
          default:
            this.bubbleSort()
            break
        }
      }
    },
    frame(newFrame) {
      if (
        this.isPlaying &&
        this.sortingSteps.length > 0 &&
        this.sortingSteps[newFrame] &&
        Object.keys(this.sortingSteps[newFrame]).length > 0
      ) {
        const { array, comparedIndices } = this.sortingSteps[newFrame]

        // Reset all bars to the default color
        const bars = document.getElementsByClassName('singular-bar')
        Array.from(bars).forEach((bar) => {
          bar.style.backgroundColor = 'rgb(84, 84, 236)'
        })

        // Highlight the bars being compared
        const bar1 = document.getElementById(array[comparedIndices[0]])
        const bar2 = document.getElementById(array[comparedIndices[1]])
        if (bar1) bar1.style.backgroundColor = 'red'
        if (bar2) bar2.style.backgroundColor = 'orange'

        // Update the barArray with the new values
        this.barArray = [...array]
      }
    },
  },
}
</script>

<template>
  <div id="bar-chart">
    <div
      v-for="(bar, index) in barArray"
      :key="index"
      :id="bar"
      class="singular-bar"
      :style="{ height: bar + '%' }"
    ></div>
  </div>
</template>

<style scoped>
#bar-chart {
  overflow-x: auto;
  display: flex;
  gap: 5px;
  width: 100%;
  height: 100%;
  align-items: flex-end; /* This makes the bars grow from bottom to top */
}

.singular-bar {
  flex: 1;
  width: 10px;
  background-color: rgb(84, 84, 236);
  border: 1px solid lightblue;
  border-radius: 5px;
}
</style>
