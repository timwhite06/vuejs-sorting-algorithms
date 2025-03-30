<script>
export default {
  name: 'PauseButton',
  props: {
    width: {
      type: [Number, String],
      default: 64,
    },
    height: {
      type: [Number, String],
      default: 64,
    },
    color: {
      type: String,
      default: '#000000',
    },
  },
}
</script>
<template>
  <svg
    :width="`${width}px`"
    :height="`${height}px`"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <!-- Removed the white rectangle to make background transparent -->
      <path
        d="M8.5 18H9.5C10.0523 18 10.5 17.5523 10.5 17V7C10.5 6.44772 10.0523 6 9.5 6H8.5C7.94772 6 7.5 6.44772 7.5 7V17C7.5 17.5523 7.94772 18 8.5 18Z"
        :stroke="color"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M14.5 18H15.5C16.0523 18 16.5 17.5523 16.5 17V7C16.5 6.44772 16.0523 6 15.5 6H14.5C13.9477 6 13.5 6.44772 13.5 7V17C13.5 17.5523 13.9477 18 14.5 18Z"
        :stroke="color"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </g>
  </svg>
</template>
