<script setup>
import { onMounted, ref, watch } from 'vue'
import BarChart from '@/components/BarChart.vue'
import PlayButton from '@/components/icons/PlayButton.vue'
import PauseButton from '@/components/icons/PauseButton.vue'
import RangeSlider from '@/components/RangeSlider.vue'
import ChartControlButton from '@/components/ChartControlButton.vue'
import GithubIcon from '@/components/icons/GithubIcon.vue'
import { useTimer } from '@/hooks/useTimer'

const sliderValue = ref(30)
const algorithmSelection = ref('bubble')
const frame = ref(0)
const totalFrames = ref(0)
const isPlaying = ref(false) // Fixed typo: isPlayling -> isPlaying
const playbackSpeed = ref(10) // 1000 is 1 second
const triggerReset = ref(false)
let intervalId = null

const timer = useTimer()

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

// Simplified playAlgorithm with cleaner timer handling
const playAlgorithm = async () => {
  if (frame.value === totalFrames.value) await resetChart()
  isPlaying.value = true

  // Reset timer only if starting from beginning
  if (frame.value === 0) {
    timer.reset()
  }

  // Start/resume timer
  timer.start()

  let i = frame.value
  // Clear any previous interval to avoid overlaps
  if (intervalId) clearInterval(intervalId)

  intervalId = setInterval(() => {
    frame.value = i
    i++
    if (i > totalFrames.value) {
      clearInterval(intervalId)
      intervalId = null
      isPlaying.value = false
      timer.pause()
    }
  }, playbackSpeed.value)
}

// Much cleaner pauseAlgorithm
const pauseAlgorithm = () => {
  isPlaying.value = false

  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }

  timer.pause()
}

// Cleaner stopAlgorithm
const stopAlgorithm = () => {
  isPlaying.value = false

  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }

  frame.value = 0
  timer.reset()
}

const resetChart = async () => {
  await stopAlgorithm() // This now also resets the timer
  triggerReset.value = !triggerReset.value

  // Reset colors with null check
  const bars = document.getElementsByClassName('singular-bar')
  if (bars && bars.length > 0) {
    Array.from(bars).forEach((bar) => {
      if (bar) {
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
  const button = document.getElementById(`${sortingAlgo}-button`)
  if (button) button.setAttribute('data-selected', 'true')
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

  if (frame.value === totalFrames.value) {
    timer.pause()
  }
})

watch(sliderValue, () => {
  // Reset the elapsed frames and timer when the slider value changes
  frame.value = 0
  timer.reset()
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
    <p>Timothy White - Vue JS Algorithm Sorting Project</p>
    <a href="https://github.com/timwhite06/vuejs-sorting-algorithms">
      <GithubIcon :width="32" :height="32" />
    </a>
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
      <div class="init-player-info">
        <p>Time: {{ timer.formattedTime }}</p>
        <p>Frame / Total frames:</p>
      </div>
      <div class="player-info">
        <p>0</p>
        <RangeSlider
          v-model="sliderValue"
          :min="0"
          :max="totalFrames"
          :disabled="isPlaying"
          id="player-progress"
          class="range-slider"
        />

        <p>{{ frame }}/{{ totalFrames }}</p>
      </div>

      <div id="playback-controls">
        <ChartControlButton
          id="play-algo-button"
          @click="playAlgorithm()"
          :disabled="isPlaying"
        >
          <PlayButton :width="20" :height="20" color="#42b983" />
          Play
        </ChartControlButton>
        <ChartControlButton
          id="stop-algo-button"
          @click="pauseAlgorithm()"
          :disabled="!isPlaying"
        >
          <PauseButton :width="25" :height="25" color="#42b983" />
          Pause
        </ChartControlButton>
        <ChartControlButton id="reset-chart-button" @click="resetChart()">
          Reset
        </ChartControlButton>
      </div>

      <p id="algorithm-control-title">Algorithm:</p>
      <div id="algorithm-controls">
        <ChartControlButton
          id="bubble-button"
          @click="updateAlgorithm('bubble', $event)"
          :disabled="isPlaying && algorithmSelection !== 'bubble'"
          :selected="algorithmSelection === 'bubble'"
        >
          Bubble Sort
        </ChartControlButton>

        <ChartControlButton
          id="merge-button"
          @click="updateAlgorithm('merge', $event)"
          :disabled="isPlaying && algorithmSelection !== 'merge'"
          :selected="algorithmSelection === 'merge'"
        >
          Merge Sort
        </ChartControlButton>

        <ChartControlButton
          id="insertion-button"
          @click="updateAlgorithm('insertion', $event)"
          :disabled="isPlaying && algorithmSelection !== 'insertion'"
          :selected="algorithmSelection === 'insertion'"
        >
          Insertion Sort
        </ChartControlButton>

        <ChartControlButton
          id="quick-button"
          @click="updateAlgorithm('quick', $event)"
          :disabled="isPlaying && algorithmSelection !== 'quick'"
          :selected="algorithmSelection === 'quick'"
        >
          Quick Sort
        </ChartControlButton>
      </div>
      <p>Bars: {{ sliderValue }}</p>
      <RangeSlider
        v-model="sliderValue"
        :min="10"
        :max="100"
        :step="1"
        :disabled="isPlaying"
      />
      <div id="speed-controls">
        <p>Speed per frame: {{ playbackSpeed }}ms</p>
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
  flex: 1; /* take up the remaining space */
  padding: 20px;
  border: 1px solid darkgray;
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

#chart-controls {
  width: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

/* Use min-width so that this is only applied on laptops/bigger devices */
@media (min-width: 700px) {
  #main-app {
    flex-direction: row;
    justify-content: start;
    align-items: start;
    padding: 30px;
    gap: 30px;
  }
  #chart-container {
    flex: 1;
    order: 2;
    overflow-x: auto;
  }
  #chart-controls {
    width: 300px;
    order: 1;
  }
}
@media (min-width: 1300px) {
  #main-app {
    flex-direction: column;
  }
  #chart-container {
    flex: 1;
    order: 1;
  }
  #chart-controls {
    order: 2;
    width: 100%;
  }
}

#playback-controls {
  width: 100%;
  display: flex;
  gap: 10px;
}

.init-player-info {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.player-info {
  display: flex;
  gap: 10px;
  align-items: center;
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
</style>
