<script lang="ts">
  import type { AnsweredQuestion } from '../interfaces';
  import { createEventDispatcher } from 'svelte';

  const CORRET_ANSWER_INDEX = 0;
  const dispatch = createEventDispatcher();
  const isIncorrectAnswer = (answeredQuestion: AnsweredQuestion) =>
    answeredQuestion.question.a[CORRET_ANSWER_INDEX] !== answeredQuestion.answer;

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

<p class="my-4 text-lg min-h-[96px] font-semibold">
  You scored {answeredQuestions.length - incorrectlyAnsweredQuestions.length} out of {answeredQuestions.length}.
</p>

<div>
  <h2 class="my-4 text-lg font-semibold">Review</h2>
  <div class="min-h-[120px]">
    <div class="grid md:grid-cols-3 gap-2">
      <!-- Question -->
      <div class="bg-neutral-700 p-4 px-6 rounded">
        <p class="font-semibold py-1 text-xs text-left">Question</p>
        <p class="text-left">{currentAnsweredQuestion.question.q}</p>
      </div>
      <!-- Answer -->
      <div class="bg-emerald-700 p-4 px-6 rounded">
        <p class="font-semibold py-1 text-xs text-left">Correct Answer</p>
        <p class="text-left">{currentAnsweredQuestion.question.a[CORRET_ANSWER_INDEX]}</p>
      </div>
      <!-- User Answer -->
      <div class="bg-pink-800 p-4 px-6 rounded">
        <p class="font-semibold py-1 text-xs text-left">Your Answer</p>
        <p class="text-left">{currentAnsweredQuestion.answer}</p>
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
