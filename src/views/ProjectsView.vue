<script setup>
import { useProjectsStore } from "@/stores/projects"
import { h } from "vue"
import ProjectList from "../components/ProjectList.vue"
import { hideModal, showModal } from "@/utils/modalService"
import FundProject from "@/components/modalContents/FundDialog.vue"
import { ethers } from "ethers"
import { useUserInfoStore } from "@/stores/userInfo"

const projectsStore = useProjectsStore()
const userInfoStore = useUserInfoStore()

function fundButtonClicked(project) {
  showModal(
    `Fund "${project.title}"`,
    h(FundProject, {
      projectToFund: project,
      onSendFundRequested: (amount) => sendFund(project, amount)
    })
  )
}

async function sendFund(projectToFund, amountToSend) {
  projectToFund.pendingFundFromThisUser = BigInt(ethers.utils.parseEther(amountToSend.toString()))
  projectToFund.lastFundingError = ""

  try {
    const projectId = projectsStore.projects.indexOf(projectToFund)
    await userInfoStore.connectedContract.fundProject(projectId, {
      value: ethers.utils.parseEther(amountToSend.toString())
    })
    hideModal()
  } catch (error) {
    // If it succeeds the projectStore receives a notif after transaction
    // is verified and resets the values
    projectToFund.pendingFundFromThisUser = 0n
    projectToFund.lastFundingError = error
    console.error(error)
  }
}

function showFundErrorDialog(project) {
  showModal(
    "Transaction Failed",
    h("p", { style: { wordWrap: "break-word" } }, [project.lastFundingError.toString()])
  )
}
</script>

<template>
  <div>
    <div class="row me-0 mb-3 g-0">
      <h1 class="col">Those in need:</h1>
    </div>

    <ProjectList :projects="projectsStore.projects">
      <template #default="{ project }">
        <div
          v-if="!project.lastFundingError && project.pendingFundFromThisUser"
          class="col-auto spinner-border spinner-border-sm me-2"
          :style="{
            marginTop: '14px',
            visibility: project.pendingFundFromThisUser ? 'visible' : 'hidden'
          }"
          role="status"
        >
          <span class="visually-hidden">Funding...</span>
        </div>
        <button
          v-else
          class="col-auto me-2 btn btn-sm btn-danger"
          :style="{
            paddingRight: '4px',
            paddingLeft: '4px',
            paddingBottom: '6px',
            visibility: project.lastFundingError ? 'visible' : 'hidden'
          }"
          @click="showFundErrorDialog(project)"
        >
          x
        </button>

        <button
          class="col btn btn-primary me-2"
          @click="fundButtonClicked(project)"
          :disabled="
            project.amountFunded == project.amountNeeded || project.pendingFundFromThisUser
          "
        >
          Fund
        </button>
      </template>
    </ProjectList>
  </div>
</template>
