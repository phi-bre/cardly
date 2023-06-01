<script lang="ts">
  import { fade } from 'svelte/transition';

  export let title: string;
  export let open = false;
</script>

<div
  class="flex h-12 w-full cursor-pointer select-none items-center justify-between rounded-lg p-3 px-2 text-neutral-500"
  on:click={() => (open = !open)}
>
  <div class="flex w-full items-center gap-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="h-4 w-4 transition-transform"
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
  <div transition:fade={{ duration: 100 }}>
    <slot />
  </div>
{/if}
