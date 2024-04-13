<script setup>
import { RouterView } from "vue-router"
import { ref } from "vue"

console.log(window.ethereum)
// console.log()

const connected = ref(window.ethereum === "true")

console.log(connected)

async function tryConnect() {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
  console.log(accounts)
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img
          src="@/assets/logo.svg"
          alt="Logo"
          width="30"
          height="24"
          class="d-inline-block align-text-top"
        />
        <span style="color: white">TerrorFund</span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
        <button v-if="!connected" @click="tryConnect()" class="btn btn-primary">
          Connect Wallet
        </button>
      </div>
    </div>
  </nav>

  <RouterView />
</template>

<style scoped>
nav {
  background: linear-gradient(
    90deg,
    rgba(126, 23, 14, 1) 0%,
    rgba(90, 27, 22, 1) 45%,
    rgba(173, 15, 6, 1) 100%
  );
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>
