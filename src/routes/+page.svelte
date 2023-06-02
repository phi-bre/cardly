<script lang="ts">
  import DeckCard from '$lib/DeckCard.svelte';
  import { credentials, synced } from '../storage';
  import { nanoid } from 'nanoid';
  import { goto } from '$app/navigation';
  import Dropdown from '$lib/Dropdown.svelte';
  import {SyncedText} from '@syncedstore/core';


  function addDeck() {
    const id = nanoid();
    $synced.decks[id] = {
      id: id,
      title: '',
      description: new SyncedText() as string,
      topics: [],
      cards: [],
    };
    goto(`/${id}`);
  }
</script>

<main>
  <header class="mb-6 flex items-center justify-between">
    <h1 class="select-none text-xl font-semibold">cardly<span class="text-teal-500">.</span></h1>
  </header>

  <Dropdown title="Credentials">
    <input
      class="cardly-input mb-1 w-full"
      type="text"
      placeholder="Username"
      bind:value={$credentials.username}
    />
    <input
      class="cardly-input mb-1 w-full"
      type="text"
      placeholder="Password"
      bind:value={$credentials.password}
    />
    <input
      class="cardly-input mb-1 w-full"
      type="text"
      placeholder="OpenAI API Key"
      bind:value={$credentials.apiKey}
    />

    <div class="flex justify-end">
      <button class="cardly-button" on:click={() => location.reload()}>
        Reload to apply changes
      </button>
    </div>
  </Dropdown>

  <div class="mt-8 grid gap-3 md:grid-cols-3">
    {#each Object.values($synced.decks) as deck}
      <DeckCard {deck} />
    {/each}
    <button
      class="flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-dashed font-sans text-sm font-medium text-neutral-400 transition-colors hover:border-neutral-500/60 hover:text-neutral-500 dark:border-neutral-700 dark:text-neutral-600 dark:hover:border-neutral-400/60 dark:hover:text-neutral-400"
      on:click={addDeck}
    >
      Create deck
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
