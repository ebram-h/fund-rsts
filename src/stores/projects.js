import { defineStore } from "pinia"

export const useProjectsStore = defineStore("projects", {
  state: () => ({ projects: [] }),
  actions: {
    async initialize(fundRTsts) {
      this.projects = await fundRTsts.getAllProjects()
      fundRTsts.on(
        "ProjectAdded",
        // eslint-disable-next-line no-unused-vars
        (projectId, title, description, recipient, recipientSpecifier, amountNeeded) => {
          this.projects.push({
            title: title,
            description: description,
            recipient: recipient,
            recipientSpecifier: recipientSpecifier,
            amountNeeded: amountNeeded,
            amountFunded: 0n,
            areFundsTransferred: false
          })
        }
      )
    }
  }
})
