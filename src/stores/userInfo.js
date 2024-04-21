import { defineStore } from "pinia"

export const useUserInfoStore = defineStore("userInfo", {
  state: () => ({
    isOwner: false,
    isRecipient: false,
    isRecipientSpecifier: false,
    userAddress: "",
    connectedContract: null,
    loggingIn: false
  }),
  actions: {
    async initialize(signer, fundRTsts, projects) {
      this.connectedContract = fundRTsts
      const ownerAddress = await fundRTsts.owner()
      this.userAddress = await signer.getAddress()
      this.isOwner = ownerAddress == this.userAddress
      this.isRecipient = projects.some((p) => p.recipient == this.userAddress)
      this.isRecipientSpecifier = projects.some((p) => p.recipientSpecifier == this.userAddress)
    },
    clear() {
      this.isOwner = this.isRecipient = this.isRecipientSpecifier = false
      this.userAddress = ""
      this.connectedContract = null
    }
  }
})
