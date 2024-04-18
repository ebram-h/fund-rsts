<script setup>
defineProps(["percentage", "text"])
</script>

<template>
  <div class="progress">
    <div
      class="progress-bar progress-bar-stripped my-auto"
      role="progressbar"
      :style="{
        width: percentage
      }"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
    <span style="margin-left: auto; margin-right: auto; line-height: 1.5">
      {{ text }}
    </span>
  </div>
</template>
