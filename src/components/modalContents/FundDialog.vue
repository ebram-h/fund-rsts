<script setup>
import { ref, computed } from "vue"
import { required, numeric, minValue } from "@vuelidate/validators"
import { MinFundingAmountEth } from "@/utils/Constants"
import useVuelidate from "@vuelidate/core"

const props = defineProps(["projectToFund", "onSendFundRequested"])

const amountToSend = ref(0)

const amountValidationRule = computed(() => ({
  amountToSend: {
    required,
    numeric,
    minValue: minValue(MinFundingAmountEth)
  }
}))

const amountInput = ref()
const sendButton = ref()

const v$ = useVuelidate(amountValidationRule, { amountToSend })

async function sendClicked() {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  amountInput.value.disabled = true
  sendButton.value.disabled = true

  try {
    await Promise.resolve(props.onSendFundRequested(amountToSend.value))
  } finally {
    amountInput.value.disabled = false
    sendButton.value.disabled = false
    amountToSend.value = 0
    v$.value.$reset()
  }
}
</script>

<template>
  <div>
    <div class="row g-0">
      <label class="col-auto from-label me-1" for="amountInput" style="line-height: 2.5">
        Amount:
      </label>
      <input
        type="number"
        class="col form-control me-2"
        id="amountInput"
        ref="amountInput"
        :min="MinFundingAmountEth"
        v-model="amountToSend"
      />
    </div>
    <p v-if="v$.amountToSend?.$error" class="form-text text-danger mb-0">
      {{ $.amountToSend.$errors[0].$message }}
    </p>

    <button ref="sendButton" class="btn btn-primary float-end me-2 mt-2" @click="sendClicked">
      Send
    </button>
  </div>
</template>
