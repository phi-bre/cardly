<script lang="ts">
  import type { CardAnswer } from '$lib/interfaces';
  import { createEventDispatcher } from 'svelte';
  import { synced } from '$lib/storage';
  import { page } from '$app/stores';

  const dispatch = createEventDispatcher();
  const isIncorrectAnswer = (cardAnswer: CardAnswer) => {
    console.log(cardAnswer.accuracy);
    return cardAnswer.accuracy !== 1;
  };

  export let cardAnswers: CardAnswer[];

  let currentCardAnswerIndex = 0;

  $: incorrectlyAnsweredCards = cardAnswers.filter(isIncorrectAnswer);
  $: reviewIsAboutToComplete = currentCardAnswerIndex >= incorrectlyAnsweredCards.length - 1;
  $: currentCardAnswer = incorrectlyAnsweredCards[currentCardAnswerIndex];
  $: currentCard = $synced.decks[$page.params.deck]?.cards.find(
    (card) => card.id === currentCardAnswer?.card,
  )!;

  function nextCardAnswer() {
    if (reviewIsAboutToComplete) {
      return dispatch('reviewComplete');
    }
    currentCardAnswerIndex++;
  }
</script>

<p class="my-4 min-h-[96px] text-lg font-semibold">
  You scored {cardAnswers.length - incorrectlyAnsweredCards.length} out of {cardAnswers.length}.
</p>

<div>
  <h2 class="my-4 text-lg font-semibold">Review</h2>

  {#if currentCard}
    <div class="min-h-[120px]">
      <div class="grid gap-2 md:grid-cols-3">
        <!-- Question -->
        <div class="rounded bg-neutral-200 p-4 px-6 dark:bg-neutral-700">
          <p class="pb-2 text-xs font-semibold">Question</p>
          <p class="text-sm">{currentCard.question}</p>
        </div>
        <!-- Answer -->
        <div class="rounded bg-neutral-200 p-4 px-6 dark:bg-neutral-700">
          <p class="pb-2 text-xs font-semibold text-emerald-500">Correct Answer</p>
          <p class="text-sm">
            {currentCard.answers.find((answer) => answer.correct)?.text}
          </p>
        </div>
        <!-- User Answer -->
        <div class="rounded bg-neutral-200 p-4 px-6 dark:bg-neutral-700">
          <p class="pb-2 text-xs font-semibold text-red-400">Your Answer</p>
          <p class="text-sm">{currentCardAnswer.answer}</p>
        </div>
      </div>
    </div>
  {/if}

  <div class="mt-8">
    <button class="cardly-button" on:click={nextCardAnswer}>
      {reviewIsAboutToComplete ? 'Finish' : 'Next'}
    </button>
    {#if !reviewIsAboutToComplete}
      <button class="cardly-button" on:click={() => dispatch('reviewComplete')}>Skip review</button>
    {/if}
  </div>
</div>
