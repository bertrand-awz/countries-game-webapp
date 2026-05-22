<script setup lang="ts">
  import { ref } from "vue";

  import Sidebar from "./dashboard/GameDashboardSidebar.vue";
  import Navbar from "./dashboard/GameDashboardNavbar.vue";
  import DashboardContent from "./dashboard/GameDashboardMainContent.vue";

  import {
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
  } from "@heroicons/vue/24/outline";

  const sidebarOpen = ref(false);

  const navigation = [
    { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
    { name: "Team", href: "#", icon: UsersIcon, current: false },
    { name: "Projects", href: "#", icon: FolderIcon, current: false },
    { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
    { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
    { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
  ];

  const teams = [
    { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
    { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
    { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
  ];

  const userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
  ];
</script>

<template>
  <div>
    <Sidebar v-model:open="sidebarOpen" :navigation="navigation" :teams="teams" />

    <div class="lg:pl-72">
      <Navbar :user-navigation="userNavigation" @open-sidebar="sidebarOpen = true" />

      <DashboardContent>
        <!-- Ton contenu ici -->
      </DashboardContent>
    </div>
  </div>
</template>
