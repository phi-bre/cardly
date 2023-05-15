<script lang="ts">
  import type { CardAnswer } from '../interfaces';
  import { createEventDispatcher } from 'svelte';

  const CORRECT_ANSWER_INDEX = 0;
  const dispatch = createEventDispatcher();
  const isIncorrectAnswer = (cardAnswer: CardAnswer) => cardAnswer.accuracy !== 1;

  export let cardAnswers: CardAnswer[];

  let reviewedCardAnswers: CardAnswer[] = [];

  $: incorrectlyAnsweredCards = cardAnswers.filter(isIncorrectAnswer);
  $: reviewIsAboutToComplete = reviewedCardAnswers.length === incorrectlyAnsweredCards.length - 1;
  $: [currentCardAnswer] = incorrectlyAnsweredCards.filter(
    (cardAnswer) => !reviewedCardAnswers.includes(cardAnswer),
  );

  function nextCardAnswer() {
    if (reviewIsAboutToComplete) {
      return dispatch('reviewComplete');
    }
    reviewedCardAnswers = [...reviewedCardAnswers, currentCardAnswer];
  }
</script>

<p class="my-4 min-h-[96px] text-lg font-semibold">
  You scored {cardAnswers.length - incorrectlyAnsweredCards.length} out of {cardAnswers.length}.
</p>

<div>
  <h2 class="my-4 text-lg font-semibold">Review</h2>
  <div class="min-h-[120px]">
    <div class="grid gap-2 md:grid-cols-3">
      <!-- Question -->
      <div class="rounded bg-neutral-200 p-4 px-6 dark:bg-neutral-700">
        <p class="pb-2 text-xs font-semibold">Question</p>
        <p class="text-sm">{currentCardAnswer.question.question}</p>
      </div>
      <!-- Answer -->
      <div class="rounded bg-neutral-200 p-4 px-6 dark:bg-neutral-700">
        <p class="pb-2 text-xs font-semibold text-emerald-500">Correct Answer</p>
        <p class="text-sm">{currentCardAnswer.question.answers.find((answer) => answer.correct)?.text}</p>
      </div>
      <!-- User Answer -->
      <div class="rounded bg-neutral-200 p-4 px-6 dark:bg-neutral-700">
        <p class="pb-2 text-xs font-semibold text-red-400">Your Answer</p>
        <p class="text-sm">{currentCardAnswer.answer}</p>
      </div>
    </div>
  </div>

  <div class="mt-8">
    <button class="cardly-button" on:click={nextCardAnswer}>
      {reviewIsAboutToComplete ? 'Finish' : 'Next'}
    </button>
    <button class="cardly-button" on:click={() => dispatch('reviewComplete')}>Skip review</button>
  </div>
</div>
