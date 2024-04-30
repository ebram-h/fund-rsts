<script setup>
import ProjectList from "@/components/ProjectList.vue"
import { useProjectsStore } from "@/stores/projects"
import { useUserInfoStore } from "@/stores/userInfo"
import { computed, h, ref } from "vue"
import { hideModal, showModal } from "@/utils/modalService"
import ChangeRecipientDialog from "@/components/modalContents/ChangeRecipientDialog.vue"

const userInfoStore = useUserInfoStore()

const projectsStore = useProjectsStore()

const projectsUserCanChangeRecipientOf = computed(() =>
  projectsStore.projects.filter((p) => p.recipientSpecifier === userInfoStore.userAddress)
)

const projectToChangeRecipientOf = ref(0)

async function changeRecipient(newRecipientAddress, newRecipientSpecifierAddress) {
  try {
    const projectId = projectsStore.projects.indexOf(projectToChangeRecipientOf.value)
    await userInfoStore.connectedContract.changeProjectRecipient(
      projectId,
      newRecipientAddress,
      newRecipientSpecifierAddress
    )
  } finally {
    hideModal()
  }
}

function changeRecipientBtnClicked(project) {
  projectToChangeRecipientOf.value = project
  showModal(
    `Change Recipient For "${project.title}"`,
    h(ChangeRecipientDialog, { onChangeRecipientRequested: changeRecipient })
  )
}
</script>

<template>
  <div>
    <ProjectList
      v-if="userInfoStore.isRecipientSpecifier"
      :projects="projectsUserCanChangeRecipientOf"
      ><template #default="{ project }">
        <button
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#changeRecipientModal"
          @click="changeRecipientBtnClicked(project)"
          :disabled="project.areFundsTransferred"
        >
          Change Recipient
        </button>
      </template>
    </ProjectList>
  </div>
</template>
