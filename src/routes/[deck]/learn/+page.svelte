<script lang="ts">
  import type { Card, CardAnswer } from '$lib/interfaces';
  import LearningCard from '$lib/components/LearningCard.svelte';
  import ReviewSection from '$lib/components/ReviewSection.svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import NoticeCard from '$lib/components/NoticeCard.svelte';
  import { credentials, synced } from '$lib/storage';
  import { page } from '$app/stores';
  import { shouldCardBeLearned } from '$lib/learning';

  let cardAnswers: CardAnswer[] = [];
  let currentCard: Card;

  $: deck = $synced.decks[$page.params.deck]!;
  $: selectedCards = deck.cards
    .filter((card) => card.approved)
    .filter((card) => !card.hidden)
    .filter((card) =>
      shouldCardBeLearned(card, $synced.profiles[$credentials.profile || '']?.answers || []),
    );
  $: remainingQuestions = selectedCards.filter(
    (card) =>
      !cardAnswers.find((cardAnswer) => {
        return cardAnswer.card === card.id;
      }),
  );
  $: [currentCard] = remainingQuestions;
  $: progress = (1 / selectedCards.length) * (selectedCards.length - remainingQuestions.length);

  function checkAnswer({ detail: answer }: CustomEvent<CardAnswer>) {
    if (!currentCard) return;
    cardAnswers = [...cardAnswers, answer];
    $synced.profiles[$credentials.profile || ''] ??= {
      answers: [],
    };
    $synced.profiles[$credentials.profile || '']!.answers.push(answer);
  }

  function skipCard() {
    if (!currentCard) return;
    const newAnswer: CardAnswer = {
      card: currentCard.id,
      answer: '',
      accuracy: 0,
      time: Date.now(),
    }; // TODO: Do better
    cardAnswers = [...cardAnswers, newAnswer];
    // Don't add to local storage
  }

  function restart() {
    cardAnswers = [];
  }
</script>

<main>
  <div class="flex justify-between py-4">
    <a href="/{deck.id}" class="text-medium text-sm text-neutral-400">Go back</a>
    <span class="text-medium text-sm text-neutral-400"
      >{cardAnswers.length} of {selectedCards.length}</span
    >
    <button class="text-medium text-sm text-neutral-400" on:click={skipCard}>Skip</button>
  </div>
  <ProgressBar {progress} />

  {#if remainingQuestions.length > 0}
    <LearningCard card={currentCard} on:answer={checkAnswer} />
  {:else if selectedCards.length === 0}
    <NoticeCard>There are no cards to learn right now.</NoticeCard>
  {:else}
    <ReviewSection {cardAnswers} on:reviewComplete={restart} />
  {/if}
</main>
