<script lang="ts">
  import type { Card } from '../interfaces';
  import EditableCard from '$lib/EditableCard.svelte';
  import NoticeCard from '$lib/NoticeCard.svelte';
  import { local, remote } from '../storage';

  // TODO: Improve
  $: cards = $remote.collection.cards ||= [];
  $: topics = $remote.collection.topics ||= [];

  $: selectedCards = cards.filter((card) => {
    return card.topics.some((cardTopic) =>
      $local.selectedTopics.some((selectedTopic) => selectedTopic === cardTopic),
    );
  });
  $: canStartLearning = selectedCards.length > 0;

  function deleteCard(card: Card) {
    $remote.collection.cards?.splice($remote.collection.cards.indexOf(card), 1);
  }
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<main>
  <header class="mb-6 flex items-center justify-between">
    <h1 class="select-none text-xl font-semibold">cardly<span class="text-lime-500">.</span></h1>
    <button class="cardly-button flex items-center gap-2">
      Remember
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
  </header>

  <div class="mb-6 flex flex-col gap-2">
    <h3 class="text-sm font-semibold text-neutral-500">Collection</h3>
    <input
      type="text"
      class="cardly-input"
      placeholder="Title of the subject this collection is about."
    />
    <textarea
      class="cardly-input"
      placeholder="Description of the subject. The more information you pass in here, like an outline of the semester, the better the topic generation is at finding relevant information in the files."
    />
  </div>

  <div class="mb-6">
    <h3 class="text-sm font-semibold text-neutral-500">Files</h3>
    <OpenAISection />
  </div>

  <div class="mb-6">
    <h3 class="text-sm font-semibold text-neutral-500">Topics</h3>
    <div class="flex flex-wrap items-center gap-2">
      {#each topics as topic}
        <label
          title={topic.keywords.join(', ')}
          class="cursor-pointer select-none rounded bg-neutral-200 p-2 px-3 text-xs font-semibold text-neutral-500 transition-colors dark:bg-neutral-700 dark:text-neutral-300 [&.selected]:bg-lime-500/20 [&.selected]:text-lime-500"
          for={topic.id}
          class:selected={$local.selectedTopics.includes(topic.id)}
        >
          <input
            class="mr-1 hidden"
            type="checkbox"
            id={topic.id}
            bind:group={$local.selectedTopics}
            value={topic.id}
          />
          <span>{topic.title}</span>
        </label>
      {:else}
        <NoticeCard>No topics found.</NoticeCard>
      {/each}
    </div>
  </div>

  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-neutral-500">Cards</h3>
      <a class="cardly-button flex items-center gap-2" href="/learn">
        Start Learning
        <svg
          class="-mr-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
          />
        </svg>
      </a>
    </div>
    {#each cards as card, index}
      <EditableCard {card} {index} on:delete={() => deleteCard(card)} />
    {:else}
      <NoticeCard>Select a topic to get started.</NoticeCard>
    {/each}
  </div>
</main>
