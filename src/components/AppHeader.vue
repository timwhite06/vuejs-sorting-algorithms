<script setup>
defineOptions({
  name: 'AppHeader',
})
import GithubIcon from './icons/GithubIcon.vue'
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./../assets/logo.svg"
      width="30"
      height="30"
    />
    <p>Timothy White - Vue JS Algorithm Sorting Project</p>
    <a href="https://github.com/timwhite06/vuejs-sorting-algorithms">
      <GithubIcon :width="32" :height="32" />
    </a>
  </header>
</template>
