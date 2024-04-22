<script setup>
import ProjectList from "@/components/ProjectList.vue"
import { useProjectsStore } from "@/stores/projects"
import { useUserInfoStore } from "@/stores/userInfo"
import { computed, ref } from "vue"
import { maxLength, minLength, required } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"

const userInfoStore = useUserInfoStore()

const projectsStore = useProjectsStore()

const projectsUserCanChangeRecipientOf = computed(() =>
  projectsStore.projects.filter((p) => p.recipientSpecifier === userInfoStore.userAddress)
)

const projectToChangeRecipientOf = ref(0)
const newRecipientAddress = ref("")
const newRecipientSpecifierAddress = ref("")

const validationRules = computed(() => ({
  newRecipientAddress: {
    required,
    minlength: minLength(42),
    maxlength: maxLength(42)
  },
  newRecipientSpecifierAddress: {
    required,
    minlength: minLength(42),
    maxlength: maxLength(42)
  }
}))

const v$ = useVuelidate(validationRules, { newRecipientAddress, newRecipientSpecifierAddress })

async function changeRecipient() {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  const projectId = projectsStore.projects.indexOf(projectToChangeRecipientOf.value)
  await userInfoStore.connectedContract.changeProjectRecipient(
    projectId,
    newRecipientAddress.value,
    newRecipientSpecifierAddress.value
  )
}
</script>

<template>
  <div v-if="userInfoStore.isRecipientSpecifier">
    <ProjectList :projects="projectsUserCanChangeRecipientOf"
      ><template #default="{ project }">
        <button
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#changeRecipientModal"
          @click="projectToChangeRecipientOf = project"
          :disabled="project.areFundsTransferred"
        >
          Change Recipient
        </button>
      </template>
    </ProjectList>

    <div class="modal" tabindex="-1" id="changeRecipientModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Change Recipient For "{{ projectToChangeRecipientOf?.title }}"
            </h5>
          </div>
          <div class="modal-body">
            <div class="">
              <label class="from-label" for="newRecipientAddressInput" style="line-height: 2.5"
                >New Recipient's Address:</label
              >
              <input
                type="text"
                class="form-control"
                id="newRecipientAddressInput"
                minlength="42"
                maxlength="42"
                v-model="newRecipientAddress"
              />
              <p v-if="v$.newRecipientAddress.$error" class="form-text text-danger mb-0">
                {{ v$.newRecipientAddress.$errors[0].$message }}
              </p>
            </div>

            <div class="">
              <label class="from-label" for="newRecipientSpecifierInput" style="line-height: 2.5"
                >New Recipient Specifier's Address:</label
              >
              <input
                type="text"
                class="form-control"
                id="newRecipientSpecifierInput"
                minlength="42"
                maxlength="42"
                v-model="newRecipientSpecifierAddress"
              />
              <p v-if="v$.newRecipientSpecifierAddress.$error" class="form-text text-danger mb-0">
                {{ v$.newRecipientSpecifierAddress.$errors[0].$message }}
              </p>
            </div>

            <button class="btn btn-primary float-end me-2 mt-2" @click="changeRecipient">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
