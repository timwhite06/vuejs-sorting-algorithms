<script>
export default {
  name: 'ChartControlButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    selected: {
      type: Boolean,
      default: false,
      required: false,
    },
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button'].includes(value),
      required: false,
    },
    id: {
      type: String,
      default: null,
      required: true,
    },
  },
  computed: {
    buttonClasses() {
      return {
        'chart-control-button': true,
        reset: this.type === 'reset',
        'algorithm-button': this.type === 'algorithm',
        selected: this.selected,
      }
    },
  },
}
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :id="id"
    :data-selected="selected ? 'true' : null"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
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
  transition:
    background-color 0.2s,
    color 0.2s;
}

.chart-control-button.reset {
  background-color: rgba(255, 0, 0, 0.498);
}

.chart-control-button.selected,
.chart-control-button[data-selected='true'] {
  background-color: lightgreen;
  color: black;
}

.chart-control-button:disabled {
  background-color: lightgray;
  color: darkgray;
  pointer-events: none;
}

.chart-control-button:hover:not(:disabled) {
  background-color: lightgreen;
  color: black;
}

.chart-control-button.algorithm-button.selected {
  background-color: lightgreen;
  color: black;
  font-weight: bold;
}

#reset-chart-button {
  background-color: rgba(255, 0, 0, 0.498);
  color: white;
}
#reset-chart-button:disabled {
  background-color: rgba(255, 0, 0, 0.189);
  color: rgba(255, 255, 255, 0.416);
}
</style>
