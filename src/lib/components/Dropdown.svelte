<script lang="ts">
  import { fade } from 'svelte/transition';

  export let title: string;
  export let open = false;
</script>

<div class="relative">
  <hr class="my-2 border-b-2 border-t-0 border-dashed border-neutral-300 dark:border-neutral-700" />
  <div
    class="sticky top-1 z-10 mb-2 flex min-h-[32px] w-full cursor-pointer select-none items-center justify-between px-1 text-neutral-500 md:px-2"
    on:click={() => (open = !open)}
  >
    <div
      class="flex w-full items-center gap-3 rounded-lg bg-neutral-100 p-3 px-2 backdrop-blur dark:bg-neutral-800/90"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="ml-2 h-4 w-4 transition-transform"
        class:rotate-180={open}
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
      <slot name="title">
        <h3 class="text-sm font-semibold">
          {title}
        </h3>
      </slot>
    </div>
  </div>

  {#if open}
    <div transition:fade|local={{ duration: 100 }}>
      <slot />
    </div>
  {/if}
</div>
