<script lang="ts">
  import type { Question } from '../interfaces';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let questionsToReview: Question[] = [];
  export let userAnswers: Map<Question, string>;

  $: currentQuestion = questionsToReview[0];

  // The <= is a catch-all in case we ever have less than one question remaining for some reason.
  $: reviewIsAboutToComplete = questionsToReview.length <= 1;

  function nextQuestion() {
    if (reviewIsAboutToComplete) {
      return dispatch('reviewComplete');
    }
    questionsToReview = questionsToReview.slice(1);
  }
</script>

<div>
  <h2 class="my-4 text-lg font-semibold">Review</h2>
  <div class="min-h-[120px]">
    <div class="grid md:grid-cols-3 gap-2">
      <!-- Question -->
      <div class="bg-shark-400 p-4 px-6 rounded">
        <p class="font-semibold py-1 text-xs text-left">Question</p>
        <p class="text-left">{currentQuestion.q}</p>
      </div>
      <!-- Answer -->
      <div class="bg-emerald-700 p-4 px-6 rounded">
        <p class="font-semibold py-1 text-xs text-left">Correct Answer</p>
        <p class="text-left">{currentQuestion.a[0]}</p>
      </div>
      <!-- User Answer -->
      <div class="bg-pink-800 p-4 px-6 rounded">
        <p class="font-semibold py-1 text-xs text-left">Your Answer</p>
        <p class="text-left">{userAnswers.get(currentQuestion)}</p>
      </div>
    </div>
  </div>

  <button
    class="bg-shark-400 p-4 px-6 my-4 rounded text-left hover:bg-malibu font-bold transition-colors"
    on:click={nextQuestion}
  >
    {reviewIsAboutToComplete ? 'Finish' : 'Next'}
  </button>
  <button
    class="bg-shark-400 p-4 px-6 my-4 rounded text-left hover:bg-malibu font-bold transition-colors"
    on:click={() => dispatch('reviewComplete')}
  >
    Skip review
  </button>
</div>
