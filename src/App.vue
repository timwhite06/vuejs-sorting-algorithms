<script setup>
import { onMounted, ref, watch } from 'vue'
import BarChart from './components/BarChart.vue'
import PlayButton from '@/components/icons/PlayButton.vue'
import PauseButton from '@/components/icons/PauseButton.vue'

const sliderValue = ref(30)
const algorithmSelection = ref('bubble')
const frame = ref(0)
const totalFrames = ref(0)
const isPlaying = ref(false) // Fixed typo: isPlayling -> isPlaying
const playbackSpeed = ref(10) // 1000 is 1 second
const triggerReset = ref(false)
let intervalId = null

const updateAlgorithm = (algorithm, event) => {
  algorithmSelection.value = algorithm

  // Remove the selected attribute from all buttons
  const buttons = document.querySelectorAll('.chart-control-button')
  buttons.forEach((button) => {
    button.removeAttribute('data-selected')
  })

  // Set an attribute so we can access it via CSS
  event.target.setAttribute('data-selected', 'true')
}

const playAlgorithm = () => {
  isPlaying.value = true

  let i = frame.value // Start from current frame instead of 0
  // Clear any previous interval to avoid overlaps
  if (intervalId) clearInterval(intervalId)

  intervalId = setInterval(() => {
    frame.value = i
    i++
    if (i > totalFrames.value) {
      clearInterval(intervalId)
      intervalId = null
      isPlaying.value = false
    }
  }, playbackSpeed.value)
}

const pauseAlgorithm = () => {
  isPlaying.value = false
  if (intervalId) {
    clearInterval(intervalId) // Need to clear interval when pausing
    intervalId = null
  }
}

const stopAlgorithm = () => {
  isPlaying.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  frame.value = 0
}

const resetChart = async () => {
  await stopAlgorithm()
  triggerReset.value = !triggerReset.value

  // Reset colours with null check
  const bars = document.getElementsByClassName('singular-bar')
  if (bars && bars.length > 0) {
    Array.from(bars).forEach((bar) => {
      if (bar) {
        // Additional null check for each bar
        bar.style.backgroundColor = 'rgb(84, 84, 236)'
      }
    })
  }
}

// Added function to update playback speed
const updatePlaybackSpeed = (speed) => {
  playbackSpeed.value = speed

  // If currently playing, restart the interval with new speed
  if (isPlaying.value && intervalId) {
    clearInterval(intervalId)
    playAlgorithm()
  }
}

// Added speed presets
const speedPresets = [
  { label: 'Slow', value: 250 },
  { label: 'Medium', value: 100 },
  { label: 'Fast', value: 25 },
  { label: 'Very Fast', value: 5 },
]

onMounted(() => {
  const sortingAlgo = algorithmSelection.value
  document
    .getElementById(`${sortingAlgo}-button`)
    .setAttribute('data-selected', 'true')
})

watch([frame, totalFrames], () => {
  const progress =
    totalFrames.value > 0 ? (frame.value / totalFrames.value) * 100 : 0
  const progressSlider = document.getElementById('player-progress')

  if (progressSlider) {
    progressSlider.style.background = `
    linear-gradient(90deg, rgba(170,168,201,1) 0%, rgba(0,212,255,1) 8%, rgba(31,121,9,1) 94%)`
    progressSlider.style.backgroundSize = `${progress}% 100%`
    progressSlider.style.backgroundRepeat = 'no-repeat'
  }
})

watch(algorithmSelection, () => {
  resetChart()
})
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="30"
      height="30"
    />
    <p>Vue JS Algorithm Sorting Project</p>
  </header>

  <main id="main-app">
    <div id="chart-container">
      <BarChart
        :number="Number(sliderValue)"
        :algorithmSelection="algorithmSelection"
        :isPlaying="isPlaying"
        :frame="frame"
        v-model:totalFrames="totalFrames"
        :triggerReset="triggerReset"
      />
    </div>
    <div id="chart-controls">
      <div class="player-info">
        <p>0</p>
        <input
          type="range"
          on
          v-model="sliderValue"
          :min="0"
          :max="totalFrames"
          :step="600"
          value="600"
          id="player-progress"
        />
        <p>{{ frame }}/{{ totalFrames }}</p>
      </div>

      <div id="playback-controls">
        <button
          class="chart-control-button"
          @click="playAlgorithm()"
          :disabled="isPlaying"
        >
          <PlayButton :width="20" :height="20" color="#42b983" />

          Play
        </button>
        <button
          class="chart-control-button"
          @click="pauseAlgorithm()"
          :disabled="!isPlaying"
        >
          <PauseButton :width="25" :height="25" color="#42b983" />
          Pause
        </button>

        <button class="chart-control-button reset" @click="resetChart()">
          Reset
        </button>
      </div>

      <div id="speed-controls">
        <p>Speed: {{ playbackSpeed }}ms</p>
        <div class="speed-buttons">
          <button
            v-for="preset in speedPresets"
            :key="preset.value"
            class="speed-button"
            :class="{ active: playbackSpeed === preset.value }"
            @click="updatePlaybackSpeed(preset.value)"
            :disabled="isPlaying && playbackSpeed === preset.value"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <p id="algorithm-control-title">Algorithm:</p>
      <div id="algorithm-controls">
        <button
          class="chart-control-button"
          id="bubble-button"
          @click="updateAlgorithm('bubble', $event)"
          :disabled="isPlaying && algorithmSelection !== 'bubble'"
        >
          Bubble Sort
        </button>
        <button
          class="chart-control-button"
          id="merge-button"
          @click="updateAlgorithm('merge', $event)"
          :disabled="isPlaying && algorithmSelection !== 'merge'"
        >
          Merge Sort
        </button>
        <button
          class="chart-control-button"
          id="insertion-button"
          @click="updateAlgorithm('insertion', $event)"
          :disabled="isPlaying && algorithmSelection !== 'insertion'"
        >
          Insertion Sort
        </button>
        <button
          class="chart-control-button"
          id="quick-button"
          @click="updateAlgorithm('quick', $event)"
          :disabled="isPlaying && algorithmSelection !== 'quick'"
        >
          Quick Sort
        </button>
      </div>

      <input
        type="range"
        on
        v-model="sliderValue"
        :min="10"
        :max="100"
        :step="1"
        :disabled="isPlaying"
      />
      <p>Bars: {{ sliderValue }}</p>
    </div>
  </main>
</template>

<style scoped>
header {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid lightgreen;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: white;
}

#main-app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
  padding: 10px;
}

#chart-container {
  display: flex;
  flex: 1; /* take up the remaining space */
  padding: 20px;
  border: 1px solid darkgray;
  border-radius: 10px;
}

#chart-controls {
  width: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

#playback-controls {
  width: 100%;
  display: flex;
  gap: 10px;
}

.player-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

#player-progress {
  width: 100%;
  height: 10px;
  border: 1px solid lightgray;
  border-radius: 5px;
  pointer-events: none;
  appearance: none; /* Reset default styling */
  -webkit-appearance: none; /* For Safari */
}

/* Hide the slider thumb for all browsers */
#player-progress::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  opacity: 0;
  visibility: hidden;
}

#player-progress::-moz-range-thumb {
  width: 0;
  height: 0;
  opacity: 0;
  visibility: hidden;
  border: none;
}

#player-progress::-ms-thumb {
  width: 0;
  height: 0;
  opacity: 0;
  visibility: hidden;
}

/* Optionally, you can style the track itself */
#player-progress::-webkit-slider-runnable-track {
  background: #ddd;
  border-radius: 3px;
}

#player-progress::-moz-range-track {
  background: #ddd;
  border-radius: 3px;
}

#player-progress::-ms-track {
  height: 5px;
  background: #ddd;
  border-radius: 3px;
}

#algorithm-controls {
  display: flex;
  gap: 10px;
  width: 100%;
}

.speed-buttons {
  display: flex;
  gap: 10px;
}

.speed-button {
  width: 100%;
  background-color: rgb(19, 90, 74);
  color: white;
  padding: 7px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.speed-button.active {
  background-color: rgb(91, 236, 255);
  color: black;
}

.chart-control-button {
  width: 100%;
  background-color: darkgreen;
  color: white;
  padding: 7px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.chart-control-button.reset {
  background-color: rgba(255, 0, 0, 0.498);
}

.chart-control-button[data-selected] {
  background-color: lightgreen;
  color: black;
}

.chart-control-button:disabled {
  background-color: lightgray;
  color: darkgray;
  pointer-events: none;
}

.chart-control-button:hover {
  background-color: lightgreen;
  color: black;
}
</style>
