<script setup>
import { computed, ref } from "vue"
import { maxLength, minLength, required } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"

const props = defineProps(["onChangeRecipientRequested"])

const newRecipientAddressInput = ref()
const newRecipientSpecifierInput = ref()
const confirmButton = ref()

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

async function confirmClicked() {
  const isValid = v$.value.$validate()
  if (!isValid) return

  newRecipientAddressInput.value.disabled =
    newRecipientSpecifierInput.value.disabled =
    confirmButton.value.disabled =
      true

  try {
    await Promise.resolve(
      props.onChangeRecipientRequested(
        newRecipientAddress.value,
        newRecipientSpecifierAddress.value
      )
    )
  } finally {
    newRecipientAddressInput.value.disabled =
      newRecipientSpecifierInput.value.disabled =
      confirmButton.value.disabled =
        true
    newRecipientAddress.value = newRecipientSpecifierAddress.value = ""
    v$.value.$reset()
  }
}
</script>

<template>
  <div>
    <label class="from-label" for="newRecipientAddressInput" style="line-height: 2.5"
      >New Recipient's Address:</label
    >
    <input
      type="text"
      class="form-control"
      id="newRecipientAddressInput"
      ref="newRecipientAddressInput"
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
      ref="newRecipientSpecifierInput"
      minlength="42"
      maxlength="42"
      v-model="newRecipientSpecifierAddress"
    />
    <p v-if="v$.newRecipientSpecifierAddress.$error" class="form-text text-danger mb-0">
      {{ v$.newRecipientSpecifierAddress.$errors[0].$message }}
    </p>
  </div>

  <button ref="confirmButton" class="btn btn-primary float-end me-2 mt-2" @click="confirmClicked">
    Confirm
  </button>
</template>
