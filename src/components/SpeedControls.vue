<script>
export default {
  props: {
    playbackSpeed: {
      type: Number,
      required: true,
    },
    isPlaying: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      // Speed presets
      speedPresets: [
        { label: 'Slow', value: 250 },
        { label: 'Medium', value: 100 },
        { label: 'Fast', value: 25 },
        { label: 'Very Fast', value: 5 },
      ],
    }
  },
  methods: {
    // Update playback speed method
    updatePlaybackSpeed(speed) {
      this.$emit('update:playbackSpeed', speed)
    },
  },
}
</script>

<template>
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
</template>

<style scoped>
#speed-controls {
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

.speed-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
