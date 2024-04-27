<script setup>
defineProps(["percentage", "text", "secondSegmentPercentage"])
</script>

<template>
  <div class="progress-stacked position-relative">
    <div
      class="progress"
      role="progressbar"
      aria-label="Segment one"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"
      :style="{ width: percentage.toString() + '%' }"
    >
      <div class="progress-bar progress-bar-striped bg-danger"></div>
    </div>
    <div
      class="progress"
      role="progressbar"
      aria-label="Segment two"
      :aria-valuenow="secondSegmentPercentage"
      aria-valuemin="0"
      aria-valuemax="100"
      :style="{ width: secondSegmentPercentage?.toString() + '%' }"
    >
      <div class="progress-bar progress-bar-striped bg-info"></div>
    </div>
    <span
      class="my-auto position-absolute"
      style="left: 0; right: 0; text-align: center; line-height: 1.5"
    >
      {{ text }}
    </span>
  </div>
</template>
