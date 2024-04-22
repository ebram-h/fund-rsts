<script setup>
const props = defineProps(["projects"])

import { computed, ref } from "vue"
import { ethers } from "ethers"
import ProgressBar from "./ProgressBar.vue"

const modalProjectIndex = ref(0)

const hideFullyFunded = ref(false)
const filter = ref("")

const filteredProjects = computed(() => {
  if (!filter.value && !hideFullyFunded.value) return props.projects

  const filterLowerCase = filter.value.toLowerCase()

  const hideFullyFundedPredicate = hideFullyFunded.value
    ? (p) => p.amountFunded < p.amountNeeded
    : () => true

  // Possibly an address
  if (filterLowerCase.length === 42)
    return props.projects.filter(
      (p) =>
        (p.recipient.toLowerCase() === filterLowerCase ||
          p.title.toLowerCase().includes(filterLowerCase) ||
          p.description.toLowerCase().includes(filterLowerCase)) &&
        hideFullyFundedPredicate(p)
    )

  return props.projects.filter(
    (p) =>
      (p.title.toLowerCase().includes(filterLowerCase) ||
        p.description.toLowerCase().includes(filterLowerCase)) &&
      hideFullyFundedPredicate(p)
  )
})
</script>

<template>
  <div class="row mb-3">
    <div class="col my-auto">
      <input
        type="text"
        class="form-control col"
        placeholder="Search projects and recipients..."
        aria-label="Search projects and recipients..."
        v-model="filter"
      />
    </div>

    <div class="form-check col-auto my-auto">
      <input
        type="checkbox"
        class="form-check-input"
        id="hideFundedChk"
        v-model="hideFullyFunded"
      />
      <label class="form-check-label" for="hideFundedChk">Hide Fully Funded</label>
    </div>
  </div>

  <div v-for="(project, index) in filteredProjects" class="card mb-3" :key="index">
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
