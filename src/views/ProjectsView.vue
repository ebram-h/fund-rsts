<script setup>
import { useProjectsStore } from "@/stores/projects"
import { ethers } from "ethers"
import { computed, ref } from "vue"
import ProgressBar from "../components/ProgressBar.vue"
import { MinFundingAmountEth } from "@/utils/Constants"
import { minValue, required } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"
import { useUserInfoStore } from "@/stores/userInfo"

const projectsStore = useProjectsStore()
const userInfoStore = useUserInfoStore()

const modalProjectIndex = ref(0)

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

const projectSelectedToFund = ref(null)
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

  const projectId = projectsStore.projects.indexOf(projectSelectedToFund.value)
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
          placeholder="Filter by recipient address..."
          aria-label="Filter by recipient address..."
          v-model="filter"
        />
      </div>
    </div>

    <div v-for="(project, index) in filteredProjects" class="card mb-3" :key="index">
      <div class="card-body row g-0 d-flex" style="align-items: center">
        <span class="col-4" style="line-height: 2.9">
          {{ project.title }}
        </span>

        <div class="col">
          <ProgressBar
            :percentage="
              (filteredProjects[index].amountFunded * 100n) / filteredProjects[index].amountNeeded
            "
            :text="
              ethers.formatEther(filteredProjects[index].amountFunded) +
              ' / ' +
              ethers.formatEther(filteredProjects[index].amountNeeded) +
              ' funded'
            "
            class="me-2"
          />
        </div>
        <div class="col-auto">
          <button
            class="btn btn-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#fundModal"
            @click="projectSelectedToFund = project"
          >
            Fund
          </button>
          <button
            class="btn btn-secondary"
            data-bs-toggle="modal"
            data-bs-target="#projectInfoModal"
            @click="modalProjectIndex = index"
          >
            i
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredProjects.length" class="modal" tabindex="-1" id="projectInfoModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Project {{ filteredProjects[modalProjectIndex].title }}</h5>
          </div>
          <div class="modal-body">
            <p>{{ filteredProjects[modalProjectIndex].description }}</p>
            <p>Recipient: {{ filteredProjects[modalProjectIndex].recipient }}</p>
            <p>
              Recipient Specifier:
              {{ filteredProjects[modalProjectIndex].recipientSpecifier }}
            </p>

            <p>
              Funds Transferred:
              {{ filteredProjects[modalProjectIndex].areFundsTransferred ? "Yes" : "No" }}
            </p>

            <ProgressBar
              :percentage="
                (filteredProjects[modalProjectIndex].amountFunded * 100n) /
                filteredProjects[modalProjectIndex].amountNeeded
              "
              :text="
                ethers.formatEther(filteredProjects[modalProjectIndex].amountFunded) +
                ' / ' +
                ethers.formatEther(filteredProjects[modalProjectIndex].amountNeeded) +
                ' funded'
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="projectSelectedToFund" class="modal" tabindex="-1" id="fundModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Fund {{ projectSelectedToFund.title }}</h5>
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
