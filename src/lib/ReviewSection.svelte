<script lang="ts">
  import type { AnsweredQuestion } from '../interfaces';
  import { createEventDispatcher } from 'svelte';

  const CORRECT_ANSWER_INDEX = 0;
  const dispatch = createEventDispatcher();
  const isIncorrectAnswer = (answeredQuestion: AnsweredQuestion) =>
    answeredQuestion.question.a[CORRECT_ANSWER_INDEX] !== answeredQuestion.answer;

  export let answeredQuestions: AnsweredQuestion[];

  let reviewedQuestions: AnsweredQuestion[] = [];

  $: incorrectlyAnsweredQuestions = answeredQuestions.filter(isIncorrectAnswer);
  $: reviewIsAboutToComplete = reviewedQuestions.length === incorrectlyAnsweredQuestions.length - 1;
  $: [currentAnsweredQuestion] = incorrectlyAnsweredQuestions.filter(
    (answeredQuestion) => !reviewedQuestions.includes(answeredQuestion),
  );

  function nextQuestion() {
    if (reviewIsAboutToComplete) {
      return dispatch('reviewComplete');
    }
    reviewedQuestions = [...reviewedQuestions, currentAnsweredQuestion];
  }
</script>

<p class="my-4 min-h-[96px] text-lg font-semibold">
  You scored {answeredQuestions.length - incorrectlyAnsweredQuestions.length} out of {answeredQuestions.length}.
</p>

<div>
  <h2 class="my-4 text-lg font-semibold">Review</h2>
  <div class="min-h-[120px]">
    <div class="grid gap-2 md:grid-cols-3">
      <!-- Question -->
      <div class="rounded bg-neutral-200 p-4 px-6 dark:bg-neutral-700">
        <p class="pb-2 text-xs font-semibold">Question</p>
        <p class="text-sm">{currentAnsweredQuestion.question.q}</p>
      </div>
      <!-- Answer -->
      <div class="rounded bg-neutral-200 p-4 px-6 dark:bg-neutral-700">
        <p class="pb-2 text-xs font-semibold text-emerald-500">Correct Answer</p>
        <p class="text-sm">{currentAnsweredQuestion.question.a[CORRECT_ANSWER_INDEX]}</p>
      </div>
      <!-- User Answer -->
      <div class="rounded bg-neutral-200 p-4 px-6 dark:bg-neutral-700">
        <p class="pb-2 text-xs font-semibold text-red-400">Your Answer</p>
        <p class="text-sm">{currentAnsweredQuestion.answer}</p>
      </div>
    </div>
  </div>

  <div class="mt-8">
    <button class="cardly-button" on:click={nextQuestion}>
      {reviewIsAboutToComplete ? 'Finish' : 'Next'}
    </button>
    <button class="cardly-button" on:click={() => dispatch('reviewComplete')}>Skip review</button>
  </div>
</div>
