<script setup>
import { computed, h, ref } from "vue"
import { ethers } from "ethers"
import ProgressBar from "./ProgressBar.vue"
import { showModal } from "@/utils/modalService"
import ProjectInfo from "./modalContents/ProjectInfo.vue"

const props = defineProps(["projects"])

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

function infoBtnClicked(project) {
  showModal(`Project "${project.title}"`, h(ProjectInfo, { project: project }))
}
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
            ethers.utils.formatEther(project.amountFunded) +
            ' / ' +
            ethers.utils.formatEther(project.amountNeeded) +
            ' funded'
          "
          class="me-2"
          :second-segment-percentage="
            (project.pendingFundFromThisUser * 100n) / project.amountNeeded
          "
        />
      </div>
      <div class="col-auto">
        <slot v-bind="{ project, index }" />
        <button class="btn btn-secondary ms-1" @click="infoBtnClicked(project)">i</button>
      </div>
    </div>
  </div>
</template>
