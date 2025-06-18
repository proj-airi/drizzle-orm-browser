<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { RouterLink, RouterView } from 'vue-router'

import GettingStarted from './docs/getting-started.md'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div>
    <header sticky left-0 top-0 z-10 w-full px-4 pb-0 pt-2>
      <div bg="neutral-200/50 dark:neutral-800/50" mx-auto max-w-screen-lg flex gap-2 rounded-xl p-4 backdrop-blur-md>
        <h1 flex-1 text-2xl>
          Drizzle ORM Browser Utilities
        </h1>
        <div flex flex-row items-center gap-2>
          <button text-lg outline-none @click="() => toggleDark()">
            <div v-if="isDark" i-solar:moon-stars-bold-duotone />
            <div v-else i-solar:sun-bold />
          </button>
          <a href="https://github.com/proj-airi/drizzle-orm-browser" outline-none>
            <div i-simple-icons:github />
          </a>
        </div>
      </div>
    </header>
    <div mx-auto max-w-screen-lg flex flex-col gap-2 px-4 pb-4 pt-0>
      <h2 py-2 text-xl>
        Playground
      </h2>
      <nav bg="neutral-100 dark:neutral-800" w-fit flex items-center of-hidden rounded-lg>
        <RouterLink
          to="/" px-3 py-2 bg="hover:neutral-200 dark:hover:neutral-700"
          transition="all duration-250 ease-in-out"
        >
          <h1>PGLite</h1>
        </RouterLink>
      <!-- <div bg="neutral-200 dark:neutral-600" h="1lh" w="0.5" />
      <RouterLink
        to="/microsoft" px-3 py-2 bg="hover:neutral-200 dark:hover:neutral-700"
        transition="all duration-250 ease-in-out"
      >
        <h1>2</h1>
      </RouterLink> -->
      </nav>
      <RouterView />
      <div>
        <GettingStarted />
      </div>
    </div>
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  overscroll-behavior: none;
}

html {
  background: #fff;
  transition: all 0.3s ease-in-out;
}

html.dark {
  background: #121212;
  color-scheme: dark;
}
</style>
