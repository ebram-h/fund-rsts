<script setup>
import { useUserInfoStore } from "@/stores/userInfo"
import { RouterView } from "vue-router"

const userInfoStore = useUserInfoStore()
</script>

<template>
  <div class="card">
    <ul class="nav nav-pills nav-fill">
      <li v-if="userInfoStore.isOwner" class="nav-item">
        <RouterLink
          :class="['nav-link', $route.name.toLowerCase().endsWith('addproject') ? 'active' : '']"
          to="/dashboard/addProject"
          >Add Project
        </RouterLink>
      </li>
      <li v-if="userInfoStore.isRecipientSpecifier" class="nav-item">
        <RouterLink
          :class="[
            'nav-link',
            $route.name.toLowerCase().endsWith('changerecipient') ? 'active' : ''
          ]"
          to="/dashboard/changeRecipient"
          >Change Recipient</RouterLink
        >
      </li>
    </ul>

    <RouterView class="col m-3" />
  </div>
</template>
