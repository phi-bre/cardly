<script lang="ts">
  import type { Card, CardAnswer } from '$lib/interfaces';
  import LearningCard from '$lib/components/LearningCard.svelte';
  import ReviewSection from '$lib/components/ReviewSection.svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import NoticeCard from '$lib/components/NoticeCard.svelte';
  import { credentials, synced, selectedTopics } from '$lib/storage';
  import { page } from '$app/stores';
  import { shouldCardBeLearned } from '$lib/learning';
  import { onMount } from 'svelte';
  import { shuffle } from '../../../lib/helper';

  let cardAnswers: CardAnswer[] = [];
  let selectedCards: Card[] = [];
  let currentCardIndex = 0;

  $: deck = $synced.decks[$page.params.deck]!;
  $: currentCard = selectedCards[currentCardIndex];
  $: progress = (1 / selectedCards.length) * currentCardIndex;

  function checkAnswer({ detail: answer }: CustomEvent<CardAnswer>) {
    if (!currentCard) return;
    cardAnswers = [...cardAnswers, answer];
    currentCardIndex++;
    $synced.profiles[$credentials.profile || ''] ??= {
      answers: [],
    };
    $synced.profiles[$credentials.profile || '']!.answers.push(answer);
  }

  function skipCard() {
    if (!currentCard) return;
    currentCardIndex++;
  }

  function restart() {
    cardAnswers = [];
    currentCardIndex = 0;
  }

  onMount(() => {
    selectedCards = shuffle([
      ...deck.cards
        .filter((card) => card.approved)
        .filter((card) => !card.hidden)
        .filter((card) =>
          $selectedTopics.length
            ? card.topics.filter((topic) => $selectedTopics.includes(topic)).length > 0
            : true,
        )
        .filter((card) =>
          shouldCardBeLearned(card, $synced.profiles[$credentials.profile || '']?.answers || []),
        ),
    ]);
  });
</script>

<svelte:head>
  <title>{deck.title} (learn) - cardly.</title>
</svelte:head>

<main>
  <div class="flex justify-between py-4">
    <a href="/{deck.id}" class="text-medium text-sm text-neutral-400">Go back</a>
    <span class="text-medium text-sm text-neutral-400">
      {currentCardIndex} of {selectedCards.length}
    </span>
    <button class="text-medium text-sm text-neutral-400" on:click={skipCard}>Skip</button>
  </div>
  <ProgressBar {progress} />

  {#if currentCardIndex < selectedCards.length}
    {#key currentCardIndex}
      <LearningCard card={selectedCards[currentCardIndex]} topics={deck.topics} on:answer={checkAnswer} on:hide={skipCard} />
    {/key}
  {:else if selectedCards.length === 0}
    <NoticeCard>There are no cards to learn right now.</NoticeCard>
  {:else}
    <ReviewSection {cardAnswers} on:reviewComplete={restart} />
  {/if}
</main>
