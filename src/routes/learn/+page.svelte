<script lang="ts">
  import type { AnsweredQuestion } from '../../interfaces';
  import QuestionSection from '$lib/QuestionSection.svelte';
  import ReviewSection from '$lib/ReviewSection.svelte';
  import ProgressBar from '$lib/ProgressBar.svelte';
  import { local } from '../../storage';

  let answeredQuestions: AnsweredQuestion[] = [];

  $: questions = $local.questions.filter((question) => )
  $: remainingQuestions = questions.filter((question) => {
    return !answeredQuestions.find(
      (answeredQuestion) => answeredQuestion.question.id === question.id,
    );
  });
  $: [currentQuestion] = remainingQuestions;

  function checkAnswer({ detail: answer }: CustomEvent<string>) {
    answeredQuestions = [...answeredQuestions, { question: currentQuestion, answer }];
  }

  function restart() {
    answeredQuestions = [];
  }
</script>

<div class="container m-auto py-4 md:py-16 px-8">
  <ProgressBar
    progress={(100 / questions.length) * (questions.length - remainingQuestions.length)}
  />

  {#if remainingQuestions.length > 0}
    <QuestionSection question={currentQuestion} on:answer={checkAnswer} />
  {:else if questions.length === 0}
    <p class="my-4 text-lg min-h-[96px] font-semibold">Select a quiz to get started.</p>
  {:else}
    <ReviewSection {answeredQuestions} on:reviewComplete={restart} />
  {/if}
</div>
