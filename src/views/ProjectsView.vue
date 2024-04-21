<script setup>
import { useProjectsStore } from "@/stores/projects"
import { ethers } from "ethers"
import { computed, ref } from "vue"
import ProjectList from "../components/ProjectList.vue"
import { MinFundingAmountEth } from "@/utils/Constants"
import { minValue, required } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"
import { useUserInfoStore } from "@/stores/userInfo"

const projectsStore = useProjectsStore()
const userInfoStore = useUserInfoStore()

const filter = ref("")
const filteredProjects = computed(() => {
  if (!filter.value) return projectsStore.projects

  const filterLowerCase = filter.value.toLowerCase()

  // Possibly an address
  if (filterLowerCase.length === 42)
    return projectsStore.projects.filter(
      (p) =>
        p.recipient.toLowerCase() === filterLowerCase ||
        p.title.toLowerCase().includes(filterLowerCase) ||
        p.description.toLowerCase().includes(filterLowerCase)
    )

  return projectsStore.projects.filter(
    (p) =>
      p.title.toLowerCase().includes(filterLowerCase) ||
      p.description.toLowerCase().includes(filterLowerCase)
  )
})

const projectIndexToFund = ref(0)
const amountToSend = ref(0)

const amountValidationRule = computed(() => ({
  amountToSend: {
    required,
    minValue: minValue(MinFundingAmountEth)
  }
}))

const v$ = useVuelidate(amountValidationRule, { amountToSend })

async function sendFunds() {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  const projectId = projectsStore.projects.indexOf(filteredProjects.value[projectIndexToFund.value])
  await userInfoStore.connectedContract.fundProject(projectId, {
    value: ethers.parseEther(amountToSend.value.toString())
  })
}
</script>

<template>
  <div>
    <div class="row me-0 mb-3 g-0">
      <h1 class="col">Projects needing funds</h1>

      <div class="my-auto col-3 float-end">
        <input
          type="text"
          class="form-control"
          placeholder="Search projects and recipients..."
          aria-label="Search projects and recipients..."
          v-model="filter"
        />
      </div>
    </div>

    <ProjectList :projects="filteredProjects">
      <template #default="{ project, index }">
        <button
          class="btn btn-primary me-2"
          data-bs-toggle="modal"
          data-bs-target="#fundModal"
          @click="projectIndexToFund = index"
          :disabled="project.amountFunded == project.amountNeeded"
        >
          Fund
        </button>
      </template>
    </ProjectList>

    <div
      v-if="filteredProjects && filteredProjects.length"
      class="modal"
      tabindex="-1"
      id="fundModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Fund "{{ filteredProjects.at(projectIndexToFund).title }}"</h5>
          </div>
          <div class="modal-body">
            <div class="row g-0">
              <label class="col-auto from-label me-1" for="amountInput" style="line-height: 2.5"
                >Amount:</label
              >
              <input
                type="number"
                class="col form-control me-2"
                id="amountInput"
                :min="MinFundingAmountEth"
                v-model="amountToSend"
              />
            </div>
            <p v-if="v$.amountToSend.$error" class="form-text text-danger mb-0">
              {{ v$.amountToSend.$errors[0].$message }}
            </p>

            <button class="btn btn-primary float-end me-2 mt-2" @click="sendFunds">Send</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
