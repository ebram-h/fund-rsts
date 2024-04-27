import { defineStore } from "pinia"

export const useProjectsStore = defineStore("projects", {
  state: () => ({ projects: [] }),
  actions: {
    async initialize(fundRTsts) {
      // Need to map them to new objects since those we receive are immutable and won't be tracked.
      this.projects = (await fundRTsts.getAllProjects())?.map((p) => ({
        title: p.title,
        description: p.description,
        recipient: p.recipient,
        recipientSpecifier: p.recipientSpecifier,
        amountNeeded: p.amountNeeded,
        amountFunded: p.amountFunded,
        areFundsTransferred: p.areFundsTransferred,
        pendingFundFromThisUser: 0n
      }))

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
            areFundsTransferred: false,
            pendingFundFromThisUser: 0n
          })
        }
      )

      fundRTsts.on("ProjectFunded", (projectId, amountFunded) => {
        projectId = Number(projectId)
        if (this.projects[projectId].pendingFundFromThisUser == amountFunded) {
          this.projects[projectId].pendingFundFromThisUser = 0n
        }
        this.projects[projectId].amountFunded += amountFunded
      })

      fundRTsts.on("ProjectRecipientChanged", (projectId, newRecipient, newRecipientSpecifier) => {
        projectId = Number(projectId)
        this.projects[projectId].recipient = newRecipient
        this.projects[projectId].recipientSpecifier = newRecipientSpecifier
      })
    },
    clear() {
      this.projects = []
    }
  }
})
