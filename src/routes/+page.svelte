<script lang="ts">
  import DeckCard from '$lib/components/DeckCard.svelte';
  import { credentials, exportDoc, importDoc, synced } from '$lib/storage';
  import { nanoid } from 'nanoid';
  import { goto } from '$app/navigation';
  import Dropdown from '$lib/components/Dropdown.svelte';
  import { SyncedText } from '@syncedstore/core';
  import { onMount } from 'svelte';
  import NoticeCard from '$lib/components/NoticeCard.svelte';

  let username = $credentials.username;
  let password = $credentials.password;
  let profile = $credentials.profile;
  let apiKey = $credentials.apiKey;

  $: console.log(JSON.stringify($synced.profiles));

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

  function exportData() {
    const a = document.createElement('a');
    const blob = new Blob([exportDoc()]);
    const url = URL.createObjectURL(blob);

    a.setAttribute('href', url);
    a.setAttribute('download', `cardly.vec`);
    a.click();
  }

  function save() {
    $credentials.username = username;
    $credentials.password = password;
    $credentials.profile = profile;
    $credentials.apiKey = apiKey;
    location.reload();
  }

  onMount(() => {
    fetch('/cardly.vec')
      .then((response) => response.arrayBuffer())
      .then((response) => importDoc(new Uint8Array(response)))
      .catch(() => console.warn('No data to import'));
  });
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<main>
  <header class="mb-6 flex items-center justify-between">
    <a href="/">
      <h1 class="select-none text-xl font-semibold">cardly<span class="text-teal-500">.</span></h1>
    </a>
  </header>

  <Dropdown title="Credentials">
    <label class="ml-3 text-xs text-neutral-500" for="username">Workspace</label>
    <input
      id="username"
      class="cardly-input mb-1 w-full"
      type="text"
      placeholder="Username"
      bind:value={username}
    />
    <label class="ml-3 text-xs text-neutral-500" for="password">Password</label>
    <input
      id="password"
      class="cardly-input mb-1 w-full"
      type="text"
      placeholder="Password"
      bind:value={password}
    />
    <label class="ml-3 text-xs text-neutral-500" for="profile">Profile</label>
    <input
      id="profile"
      class="cardly-input mb-1 w-full"
      type="text"
      placeholder="Profile"
      bind:value={profile}
    />
    <label class="ml-3 text-xs text-neutral-500" for="apiKey">OpenAI API Key</label>
    <input
      id="apiKey"
      class="cardly-input mb-1 w-full"
      type="text"
      placeholder="OpenAI API Key"
      bind:value={apiKey}
    />

    <NoticeCard>
      Your OpenAI account must have access to the <code>GPT-4</code> API.
    </NoticeCard>

    <div class="mt-2 flex justify-end gap-2">
      <button class="cardly-button !p-2" on:click={exportData}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </button>
      <button class="cardly-button" on:click={save}> Save & Reload </button>
    </div>
  </Dropdown>

  <Dropdown title="Decks" open>
    <div class="mt-4 grid gap-3 md:grid-cols-3">
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
  </Dropdown>
</main>
