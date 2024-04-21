<script setup>
defineProps(["projects"])

import { ref } from "vue"
import { ethers } from "ethers"
import ProgressBar from "./ProgressBar.vue"

const modalProjectIndex = ref(0)
</script>

<template>
  <div v-for="(project, index) in projects" class="card mb-3" :key="index">
    <div class="card-body row g-0 d-flex" style="align-items: center">
      <span class="col-4" style="line-height: 2.9">
        {{ project.title }}
      </span>
      <div class="col">
        <ProgressBar
          :percentage="(project.amountFunded * 100n) / project.amountNeeded"
          :text="
            ethers.formatEther(project.amountFunded) +
            ' / ' +
            ethers.formatEther(project.amountNeeded) +
            ' funded'
          "
          class="me-2"
        />
      </div>
      <div class="col-auto">
        <slot v-bind="{ project, index }" />
        <button
          class="btn btn-secondary ms-1"
          data-bs-toggle="modal"
          data-bs-target="#projectInfoModal"
          @click="modalProjectIndex = index"
        >
          i
        </button>
      </div>
    </div>
  </div>

  <div v-if="projects && projects.length" class="modal" tabindex="-1" id="projectInfoModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Project {{ projects[modalProjectIndex].title }}</h5>
        </div>
        <div class="modal-body">
          <p>{{ projects[modalProjectIndex].description }}</p>
          <p>Recipient: {{ projects[modalProjectIndex].recipient }}</p>
          <p>
            Recipient Specifier:
            {{ projects[modalProjectIndex].recipientSpecifier }}
          </p>

          <p>
            Funds Transferred:
            {{ projects[modalProjectIndex].areFundsTransferred ? "Yes" : "No" }}
          </p>

          <ProgressBar
            :percentage="
              (projects[modalProjectIndex].amountFunded * 100n) /
              projects[modalProjectIndex].amountNeeded
            "
            :text="
              ethers.formatEther(projects[modalProjectIndex].amountFunded) +
              ' / ' +
              ethers.formatEther(projects[modalProjectIndex].amountNeeded) +
              ' funded'
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
