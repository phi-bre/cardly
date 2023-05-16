<script lang="ts">
  import { getCollectionStore, local, type LocalCollection } from '../storage';
  import type { Writable } from 'svelte/store';
  import type { Collection } from '../interfaces';

  export let localCollection: LocalCollection;

  let collection: Writable<Collection>;

  $: collection = getCollectionStore(localCollection.id);
  $: console.log('collection', $collection.title.toString()); // TODO: Why is title not populated until subscribed twice?

  function forgetCollection() {
    if (confirm('Are you sure you want to forget this collection?')) {
      $local.collections = $local.collections.filter((c) => c.id !== localCollection.id);
    }
  }
</script>

<a href="/{localCollection.id}" class="rounded-lg bg-neutral-200 px-4 py-3 dark:bg-neutral-700">
  <div class="flex justify-between">
    <h3 class="truncate text-sm font-medium">
      {#if $collection.title.length}
        {$collection.title.toString()}
      {:else}
        <span class="text-neutral-500">Untitled</span>
      {/if}
    </h3>
    <button on:click|preventDefault|stopPropagation={forgetCollection}>
      <svg
        class="h-5 w-5 text-red-400"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</a>
