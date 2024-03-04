<script lang="ts">
  import Markdown from './Markdown.svelte';
  import type { Topic } from '$lib/interfaces';
  import { fade } from 'svelte/transition';

  export let topic: Topic;
  export let selected = false;
  export let open = false;
</script>

<div
  class="sticky top-2 z-10 mb-4 flex cursor-pointer items-center justify-between rounded-lg bg-neutral-700 p-3 px-3.5 text-neutral-50 shadow"
  on:click={() => (open = !open)}
>
  <span class="flex items-center gap-3">
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
    <span class="truncate text-sm font-medium">{topic.title}</span>
  </span>
  <slot />
</div>

{#if open}
  <div transition:fade class="md:p-6">
    <Markdown class="prose-sm min-h-[120px]" value={topic.description} />
  </div>
{/if}
