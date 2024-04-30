<script setup>
import { ethers } from "ethers"
import ProgressBar from "../ProgressBar.vue"

defineProps(["project"])
</script>

<template>
  <p>{{ project.description }}</p>
  <p>Recipient: {{ project.recipient }}</p>
  <p>
    Recipient Specifier:
    {{ project.recipientSpecifier }}
  </p>

  <p>
    Funds Transferred:
    {{ project.areFundsTransferred ? "Yes" : "No" }}
  </p>

  <ProgressBar
    :percentage="(project.amountFunded * 100n) / project.amountNeeded"
    :text="
      ethers.formatEther(project.amountFunded) +
      ' / ' +
      ethers.formatEther(project.amountNeeded) +
      ' funded'
    "
  />
</template>
