<script setup>
defineProps(["percentage", "text"])
</script>

<template>
  <div class="progress position-relative">
    <div
      class="progress-bar progress-bar-stripped"
      role="progressbar"
      :style="{ width: percentage.toString() + '%' }"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
    <span
      class="my-auto position-absolute"
      style="left: 0; right: 0; text-align: center; line-height: 1.5"
    >
      {{ text }}
    </span>
  </div>
</template>
