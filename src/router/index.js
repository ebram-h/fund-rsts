import { createRouter, createWebHistory } from "vue-router"
import ProjectsView from "../views/ProjectsView.vue"
import { useUserInfoStore } from "@/stores/userInfo"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "projects",
      component: ProjectsView,
      beforeEnter: (to, from, next) => {
        if (useUserInfoStore().connectedContract) next()
        else next("/unauthorized")
      }
    },
    {
      path: "/unauthorized",
      name: "unauthorized",
      component: () => import("../views/NoAccount.vue"),
      beforeEnter: (to, from, next) => {
        if (!useUserInfoStore().connectedContract) next()
        else next("/")
      }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
      beforeEnter: (to, from, next) => {
        if (useUserInfoStore().isOwner || useUserInfoStore().isRecipientSpecifier) next()
        else next("/")
      },
      children: [
        {
          path: "addProject",
          name: "addProject",
          component: () => import("../views/dashboard/AddProjectView.vue"),
          beforeEnter: (to, from, next) => {
            if (useUserInfoStore().isOwner) next()
            else next("/")
          }
        },
        {
          path: "changeRecipient",
          name: "changeRecipient",
          component: () => import("../views/dashboard/ChangeProjectRecipientView.vue"),
          beforeEnter: (to, from, next) => {
            if (useUserInfoStore().isRecipientSpecifier) next()
            else next("/")
          }
        }
      ]
    }
  ]
})

export default router
