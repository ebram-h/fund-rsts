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
        areFundsTransferred: p.areFundsTransferred
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
            areFundsTransferred: false
          })
        }
      )

      fundRTsts.on("ProjectFunded", (projectId, amountFunded) => {
        projectId = Number(projectId)
        this.projects[projectId].amountFunded += amountFunded
      })
    },
    clear() {
      this.projects = []
    }
  }
})
