<script lang="ts">
  import type { Deck } from '$lib/interfaces';
  import { synced } from '$lib/storage';

  export let deck: Deck;

  function deleteDeck() {
    if (confirm('Are you sure you want to delete this deck?')) {
      delete $synced.decks[deck.id];
    }
  }
</script>

<a
  href="/{deck.id}"
  class="rounded-lg bg-neutral-200 px-4 py-3 transition-colors hover:bg-teal-500/20 hover:text-teal-500 dark:bg-neutral-700 dark:hover:bg-teal-900 dark:hover:text-teal-500"
>
  <div class="flex justify-between">
    <h3 class="truncate text-sm font-medium">
      {#if deck.title.length}
        {deck.title}
      {:else}
        <span class="text-neutral-500">Untitled</span>
      {/if}
    </h3>
    <button on:click|preventDefault|stopPropagation={deleteDeck}>
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
