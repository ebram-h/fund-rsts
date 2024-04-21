<script setup>
import { useUserInfoStore } from "@/stores/userInfo"

const userInfo = useUserInfoStore()
</script>

<template>
  <h1 v-if="!userInfo.loggingIn">Please login with your wallet to view the projects.</h1>

  <div v-if="userInfo.loggingIn" class="d-flex justify-content-center">
    <div class="row">
      <h2 class="col">Loading...</h2>
      <div class="spinner-border mx-auto col" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>
