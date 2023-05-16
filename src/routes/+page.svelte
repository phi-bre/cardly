<script lang="ts">
  import CollectionCard from '$lib/CollectionCard.svelte';
  import { local } from '../storage';
  import { nanoid } from 'nanoid';
  import { goto } from '$app/navigation';

  function addCollection() {
    const id = nanoid();
    $local.collections = [...$local.collections, { id }];
    goto(`/${id}`);
  }
</script>

<main>
  <header class="mb-6 flex items-center justify-between">
    <h1 class="select-none text-xl font-semibold">cardly<span class="text-teal-500">.</span></h1>
  </header>

  <div class="grid gap-3 md:grid-cols-3">
    {#each $local.collections as localCollection}
      <CollectionCard {localCollection} />
    {/each}
    <button
      class="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed font-sans text-sm font-medium text-neutral-400 dark:border-neutral-700 dark:text-neutral-600"
      on:click={addCollection}
    >
      Create collection
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="-mr-1 h-4 w-4"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  </div>
</main>
