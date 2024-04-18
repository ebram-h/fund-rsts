<script setup>
import { useProjectsStore } from "@/stores/projects"
import { ethers } from "ethers"
import { computed, ref } from "vue"
import ProgressBar from "../components/ProgressBar.vue"
import { MinProjectAmountEth } from "@/utils/Constants"
import { minValue, required } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"
import { useUserInfoStore } from "@/stores/userInfo"

const projectsStore = useProjectsStore()
const userInfoStore = useUserInfoStore()

const modalProjectIndex = ref(0)

const projectSelectedToFund = ref(0)
const amountToSend = ref(0)

const amountValidationRule = computed(() => ({
  amountToSend: {
    required,
    minValue: minValue(MinProjectAmountEth)
  }
}))

const v$ = useVuelidate(amountValidationRule, { amountToSend })

async function sendFunds() {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  await userInfoStore.connectedContract.fundProject(projectSelectedToFund.value, {
    value: ethers.parseEther(amountToSend.value.toString())
  })
}
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
              (projectsStore.projects[index].amountFunded * 100n) /
              projectsStore.projects[index].amountNeeded
            "
            :text="
              ethers.formatEther(projectsStore.projects[index].amountFunded) +
              ' / ' +
              ethers.formatEther(projectsStore.projects[index].amountNeeded) +
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
            @click="projectSelectedToFund = index"
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

    <div class="modal" tabindex="-1" id="projectInfoModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Project {{ projectsStore.projects[modalProjectIndex].title }}
            </h5>
          </div>
          <div class="modal-body">
            <p>{{ projectsStore.projects[modalProjectIndex].description }}</p>
            <p>Recipient: {{ projectsStore.projects[modalProjectIndex].recipient }}</p>
            <p>
              Recipient Specifier:
              {{ projectsStore.projects[modalProjectIndex].recipientSpecifier }}
            </p>

            <p>
              Funds Transferred:
              {{ projectsStore.projects[modalProjectIndex].areFundsTransferred ? "Yes" : "No" }}
            </p>

            <ProgressBar
              :percentage="
                (projectsStore.projects[modalProjectIndex].amountFunded * 100n) /
                projectsStore.projects[modalProjectIndex].amountNeeded
              "
              :text="
                ethers.formatEther(projectsStore.projects[modalProjectIndex].amountFunded) +
                ' / ' +
                ethers.formatEther(projectsStore.projects[modalProjectIndex].amountNeeded) +
                ' funded'
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div class="modal" tabindex="-1" id="fundModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Fund {{ projectsStore.projects[modalProjectIndex].title }}</h5>
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
                :min="MinProjectAmountEth"
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
