<script>
export default {
  name: 'RangeSlider',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: false,
      default: 0,
    },
    max: {
      type: Number,
      required: false,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      required: false,
      default: null,
    },
    cssClass: {
      type: [String, Array, Object],
      default: '',
    },
    style: {
      type: [String, Object],
      default: '',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    sliderValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', Number(value))
      },
    },
  },
}
</script>

<template>
  <input
    type="range"
    v-model="sliderValue"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :id="id"
    :class="cssClass"
    :style="style"
  />
</template>
<style scoped>
input[type='range'] {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #ddd;
  -webkit-appearance: none;
  appearance: none;
}

/* Make the slider thumb bigger for standard input ranges */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px; /* Increased size from default */
  height: 20px; /* Increased size from default */
  background: #42b983;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  margin-top: -5px; /* Center vertically */
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

input[type='range']::-moz-range-thumb {
  width: 20px; /* Increased size from default */
  height: 20px; /* Increased size from default */
  background: #42b983;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

input[type='range']::-ms-thumb {
  width: 20px; /* Increased size from default */
  height: 20px; /* Increased size from default */
  background: #42b983;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

/* Style for the track */
input[type='range']::-webkit-slider-runnable-track {
  height: 10px;
  border-radius: 5px;
}

input[type='range']::-moz-range-track {
  height: 10px;
  border-radius: 5px;
}

input[type='range']::-ms-track {
  height: 10px;
  border-radius: 5px;
}

/* Keep the player progress styles unchanged */
#player-progress {
  width: 100%;
  height: 10px;
  border: 1px solid lightgray;
  border-radius: 5px;
  pointer-events: none;
  appearance: none;
  -webkit-appearance: none;
}

/* Hide the slider thumb for player progress as before */
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

/* Add hover and focus states for better UX */
input[type='range']:hover::-webkit-slider-thumb {
  background: #3aa876;
  width: 22px; /* Slightly larger on hover */
  height: 22px;
}

input[type='range']:hover::-moz-range-thumb {
  background: #3aa876;
  width: 22px; /* Slightly larger on hover */
  height: 22px;
}

input[type='range']:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.3);
}

input[type='range']:focus::-moz-range-thumb {
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.3);
}

/* Disabled state */
input[type='range']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input[type='range']:disabled::-webkit-slider-thumb {
  background: #999;
  cursor: not-allowed;
}

input[type='range']:disabled::-moz-range-thumb {
  background: #999;
  cursor: not-allowed;
}
</style>
