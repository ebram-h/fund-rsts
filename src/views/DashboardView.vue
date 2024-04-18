<script setup>
import { useUserInfoStore } from "@/stores/userInfo"
import useVuelidate from "@vuelidate/core"
import { maxLength, minLength, minValue, required } from "@vuelidate/validators"
import { ethers } from "ethers"
import { reactive } from "vue"

const userInfo = useUserInfoStore()

const state = reactive({
  title: "",
  description: "",
  recipient: "",
  recipientSpecifier: "",
  amountNeeded: 0
})

const rules = {
  title: { required, minLength: minLength(3) },
  recipient: { required, minLength: minLength(42), maxLength: maxLength(42) },
  recipientSpecifier: { required },
  amountNeeded: { required, minValue: minValue(0.001) }
}

const v$ = useVuelidate(rules, state)

async function tryAddProject() {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  await userInfo.connectedContract.addProject(
    state.title,
    state.description,
    state.recipient,
    state.recipientSpecifier,
    ethers.parseEther(state.amountNeeded.toString())
  )
}
</script>

<template>
  <div>
    <div v-if="userInfo.isOwner" class="card">
      <div class="card-header">Add a Project</div>
      <div class="card-body">
        <div id="projectForm">
          <div class="mb-3">
            <label for="titleInput" class="form-label">Title</label>
            <input
              type="text"
              class="form-control"
              id="titleInput"
              v-model="state.title"
              minlength="3"
            />
            <p v-if="v$.title.$error" class="form-text text-danger">
              {{ v$.title.$errors[0].$message }}
            </p>
          </div>
          <div class="mb-3">
            <label for="descriptionInput" class="form-label">Description</label>
            <input
              type="text"
              class="form-control"
              id="descriptionInput"
              v-model="state.description"
            />
          </div>
          <div class="mb-3">
            <label for="recipientInput" class="form-label">Recipient</label>
            <div class="row g-0">
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  id="recipientInput"
                  v-model="state.recipient"
                />
              </div>
              <div class="col-auto ms-2">
                <button
                  class="ms-0 btn btn-secondary"
                  id="useMyOwnAddressRecipientBtn"
                  @click="state.recipient = userInfo.userAddress"
                >
                  Use my own address
                </button>
              </div>
            </div>
            <p v-if="v$.recipient.$error" class="form-text text-danger">
              {{ v$.recipient.$errors[0].$message }}
            </p>
          </div>
          <div class="mb-3">
            <label for="recipientSpecifierInput" class="form-label">Recipient Specifier</label>
            <div class="row g-0">
              <div class="col">
                <input
                  type="text"
                  class="form-control col-auto me-0"
                  id="recipientSpecifierInput"
                  v-model="state.recipientSpecifier"
                />
              </div>
              <div class="col-auto ms-2">
                <button
                  class="ms-0 btn btn-secondary"
                  id="useMyOwnAddressRecipientSpecBtn"
                  @click="state.recipientSpecifier = userInfo.userAddress"
                >
                  Use my own address
                </button>
              </div>
            </div>
            <p v-if="v$.recipientSpecifier.$error" class="form-text text-danger">
              {{ v$.recipientSpecifier.$errors[0].$message }}
            </p>
          </div>
          <div class="mb-3">
            <label for="amountNeededInput" class="form-label">Amount Needed (ETH)</label>
            <input
              type="number"
              class="form-control"
              id="amountNeededInput"
              v-model="state.amountNeeded"
              min="0.001"
            />
            <p v-if="v$.amountNeeded.$error" class="form-text text-danger">
              {{ v$.amountNeeded.$errors[0].$message }}
            </p>
          </div>
          <button class="btn btn-primary float-end" @click="tryAddProject()">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>
