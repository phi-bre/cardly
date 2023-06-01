<script lang="ts">
  import type { Card, CardAnswer } from '../../../interfaces';
  import LearningCard from '$lib/LearningCard.svelte';
  import ReviewSection from '$lib/ReviewSection.svelte';
  import ProgressBar from '$lib/ProgressBar.svelte';
  import NoticeCard from '$lib/NoticeCard.svelte';
  import { synced } from '../../../storage';
  import { page } from '$app/stores';

  let cardAnswers: CardAnswer[] = [];
  let currentQuestion: Card;

  $: deck = $synced.decks[$page.params.deck];
  $: selectedCards = deck.cards
    // .filter(card => card.answers.length > 0)
    .filter((card) => card.approved)
    .filter((card) => !card.hidden);
  $: remainingQuestions = selectedCards.filter(
    (card) =>
      !cardAnswers.find((cardAnswer) => {
        return cardAnswer.card.id === card.id;
      }),
  );
  $: [currentQuestion] = remainingQuestions;
  $: progress = (1 / selectedCards.length) * (selectedCards.length - remainingQuestions.length);

  function checkAnswer({ detail: answer }: CustomEvent<CardAnswer>) {
    if (!currentQuestion) return;
    cardAnswers = [...cardAnswers, answer];
    $synced.answers.push(answer);
  }

  function skipCard() {
    if (!currentQuestion) return;
    const newAnswer = { card: currentQuestion, answer: '', accuracy: 0 }; // TODO: Do better
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
    <span>{cardAnswers.length} / {selectedCards.length}</span>
    <button class="text-medium text-sm text-neutral-400" on:click={skipCard}>Skip</button>
  </div>
  <ProgressBar {progress} />

  {#if remainingQuestions.length > 0}
    <LearningCard card={currentQuestion} on:answer={checkAnswer} />
  {:else if selectedCards.length === 0}
    <NoticeCard>There are no cards to learn right now.</NoticeCard>
  {:else}
    <ReviewSection {cardAnswers} on:reviewComplete={restart} />
  {/if}
</main>
