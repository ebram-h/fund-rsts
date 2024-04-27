<script setup>
import { RouterLink, RouterView } from "vue-router"
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/vue"
import { BrowserProvider, Contract } from "ethers"
import { useProjectsStore } from "./stores/projects"
import { useUserInfoStore } from "./stores/userInfo"
import fundRTstsContractAbi from "./assets/fundRTstsContractAbi.json"
import router from "./router"

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

const holesky = {
  chainId: 17000,
  name: "Holesky",
  currency: "ETH",
  exploreUrl: "https://holesky.etherscan.io/",
  rpcUrl: "https://holesky.drpc.org"
}

const metadata = {
  name: "fund-r-tsts",
  description: "Desc",
  url: "127.0.0.1:5173",
  icons: "@/assets/logo.svg"
}

const ethersConfig = defaultConfig({
  metadata,
  rpcUrl: "https://holesky.drpc.org",
  defaultChainId: 17000
})

const modal = createWeb3Modal({
  ethersConfig,
  chains: [holesky],
  projectId,
  enableAnalytics: true,
  enableOnramp: false
})

const projectsStore = useProjectsStore()
const userInfo = useUserInfoStore()

modal.subscribeProvider(async () => {
  if (!modal.getIsConnected()) {
    userInfo?.clear()
    projectsStore?.clear()
    router.push("/unauthorized")
    return
  }

  userInfo.loggingIn = true
  const walletProvider = modal.getWalletProvider()
  const ethersProvider = new BrowserProvider(walletProvider)
  const signer = await ethersProvider.getSigner()
  const fundRTsts = new Contract(contractAddress, fundRTstsContractAbi, signer)

  await projectsStore.initialize(fundRTsts)

  await userInfo.initialize(signer, fundRTsts, projectsStore.projects)

  userInfo.loggingIn = false

  router.push("/")
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container">
      <RouterLink to="/" class="navbar-brand" href="localhost:51">
        <img
          src="@/assets/logo.svg"
          alt="Logo"
          width="30"
          height="24"
          class="d-inline-block align-text-top"
        />
        <span style="color: white">Fund Rts</span>
      </RouterLink>
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
        <w3m-button />
        <button
          v-if="userInfo.isOwner || userInfo.isRecipientSpecifier"
          @click="$router.push('/dashboard')"
          class="btn btn-primary"
          style="padding: 0 5px; margin: 5px 0; border-radius: 15px"
        >
          <span style="position: relative; top: 1px">Admin</span>
          <img src="@/assets/Circle-A_red.svg" alt="Dashboard" width="30" height="30" />
        </button>
      </div>
    </div>
  </nav>

  <div class="container">
    <RouterView />
  </div>
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
  }
}
</style>
