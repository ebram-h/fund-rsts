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

const projectToFund = ref(null)
const amountToSend = ref(0)

const amountValidationRule = computed(() => ({
  amountToSend: {
    required,
    minValue: minValue(MinFundingAmountEth)
  }
}))

const v$ = useVuelidate(amountValidationRule, { amountToSend })

const closeFundModalBtn = ref(null)

async function sendFunds() {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  try {
    const projectId = projectsStore.projects.indexOf(projectToFund.value)
    await userInfoStore.connectedContract.fundProject(projectId, {
      value: ethers.parseEther(amountToSend.value.toString())
    })
    projectToFund.value.pendingFundFromThisUser = ethers.parseEther(amountToSend.value.toString())
  } catch (error) {
    projectToFund.value.pendingFundFromThisUser = 0n
    console.log(error)
  }

  amountToSend.value = 0
  closeFundModalBtn.value.click()
}
</script>

<template>
  <div>
    <div class="row me-0 mb-3 g-0">
      <h1 class="col">Projects needing funds</h1>
    </div>

    <ProjectList :projects="projectsStore.projects">
      <template #default="{ project }">
        <div class="row ">
          <div class="col-auto spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Funding...</span>
          </div>
          <button
            class="col btn btn-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#fundModal"
            @click="projectToFund = project"
            :disabled="
              project.amountFunded == project.amountNeeded || project.pendingFundFromThisUser
            "
          >
            Fund
          </button>
        </div>
      </template>
    </ProjectList>

    <div class="modal" tabindex="-1" id="fundModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Fund "{{ projectToFund?.title }}"</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref="closeFundModalBtn"
            ></button>
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
