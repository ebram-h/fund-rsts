<script setup>
import { useProjectsStore } from "@/stores/projects"
import { ethers } from "ethers"
import { ref } from "vue"
import ProgressBar from "../components/ProgressBar.vue"

const projectsStore = useProjectsStore()

const modalProjectId = ref(0)
</script>

<template>
  <div>
    <h1>Projects needing funds</h1>

    <div v-for="(project, index) in projectsStore.projects" class="card mb-3" :key="project">
      <div class="card-body row g-0 d-flex" style="align-items: center">
        <span class="col-4" style="line-height: 2.9">
          {{ project.title }}
        </span>

        <div class="col">
          <ProgressBar
            :percentage="
              projectsStore.projects[modalProjectId].amountFunded /
              projectsStore.projects[modalProjectId].amountNeeded
            "
            :text="
              ethers.formatEther(projectsStore.projects[modalProjectId].amountFunded) +
              ' / ' +
              ethers.formatEther(projectsStore.projects[modalProjectId].amountNeeded) +
              ' funded'
            "
            class="me-2"
          />
        </div>
        <div class="col-auto">
          <button class="btn btn-primary me-2">Fund</button>
          <button
            class="btn btn-secondary"
            data-bs-toggle="modal"
            data-bs-target="#projectInfoModal"
            @click="modalProjectId = index"
          >
            i
          </button>
        </div>
      </div>
    </div>

    <div class="modal" tabindex="-1" id="projectInfoModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Project {{ projectsStore.projects[modalProjectId].title }}</h5>
          </div>
          <div class="modal-body">
            <p>{{ projectsStore.projects[modalProjectId].description }}</p>
            <p>Recipient: {{ projectsStore.projects[modalProjectId].recipient }}</p>
            <p>
              Recipient Specifier: {{ projectsStore.projects[modalProjectId].recipientSpecifier }}
            </p>

            <p>
              Funds Transferred:
              {{ projectsStore.projects[modalProjectId].areFundsTransferred ? "Yes" : "No" }}
            </p>

            <ProgressBar
              :percentage="
                projectsStore.projects[modalProjectId].amountFunded /
                projectsStore.projects[modalProjectId].amountNeeded
              "
              :text="
                ethers.formatEther(projectsStore.projects[modalProjectId].amountFunded) +
                ' / ' +
                ethers.formatEther(projectsStore.projects[modalProjectId].amountNeeded) +
                ' funded'
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
