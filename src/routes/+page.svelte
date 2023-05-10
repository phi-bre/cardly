<script lang="ts">
  import type { Card } from '../interfaces';
  import OpenAISection from '$lib/OpenAISection.svelte';
  import CardInput from '$lib/CardInput.svelte';
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

<div class="container m-auto px-8 py-4 md:py-16 lg:max-w-5xl">
  <div class="mb-8">
    <OpenAISection />
  </div>

  <div class="my-4 flex flex-wrap items-center gap-2">
    {#each topics as topic}
      <label
        class="cursor-pointer select-none rounded bg-neutral-200 p-2 px-3 text-xs font-semibold text-neutral-500 transition-colors dark:bg-neutral-700 dark:text-neutral-300 [&.selected]:bg-teal-500/20 [&.selected]:text-teal-500"
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
    {/each}
  </div>

  {#if canStartLearning}
    <div class="my-4 mb-8">
      <a class="cardly-button flex items-center justify-between md:max-w-xs" href="/learn">
        Start Learning
        <svg
          class="ml-2 h-4 w-4"
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
  {/if}

  <div class="flex flex-col gap-2">
    {#each selectedCards as card, index}
      <CardInput {card} {index} on:delete={() => deleteCard(card)} />
    {:else}
      <NoticeCard>Select a topic to get started.</NoticeCard>
    {/each}
  </div>
</div>
