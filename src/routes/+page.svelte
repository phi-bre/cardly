<script lang="ts">
  import type { Quiz, AnsweredQuestion } from '../interfaces';
  import QuestionSection from '$lib/QuestionSection.svelte';
  import ReviewSection from '$lib/ReviewSection.svelte';
  import OpenAISection from '$lib/OpenAISection.svelte';
  import { onMount } from 'svelte';
  import { remote } from '../storage';

  let selectedQuizzes: string[] = [];
  let fallbackQuizzes: Quiz[] = []; // TODO: Remove
  let answeredQuestions: AnsweredQuestion[] = [];

  $: quizzes = [...fallbackQuizzes, ...$remote.quizzes];
  $: questions = quizzes
    .filter((quiz) => selectedQuizzes.includes(quiz.id))
    .flatMap((quiz) => quiz.questions);
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

  onMount(async () => {
    fallbackQuizzes = await Promise.all(
      [
        '/quizzes/WING/4-P-Mix.md.gpt.json',
        '/quizzes/WING/Basics.md.gpt.json',
        '/quizzes/WING/Kalkulation.md.gpt.json',
        '/quizzes/WING/Markenführung.md.gpt.json',
        '/quizzes/WING/Marketing.md.gpt.json',
        '/quizzes/WING/Materialwirtschaft.md.gpt.json',
      ].map((url) => fetch(url).then((res) => res.json())),
    );
  });
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<div class="container m-auto py-4 md:py-16 px-8">
  <div class="mb-16">
    <OpenAISection />
  </div>

  <div class="flex items-center my-4 gap-2 flex-wrap">
    {#each quizzes as quiz}
      <label
        class="cursor-pointer select-none bg-teal-500/20 text-teal-500 font-semibold text-sm rounded p-2 px-3"
        for={quiz.id}
        class:!bg-neutral-700={!selectedQuizzes.includes(quiz.id)}
        class:!text-neutral-500={!selectedQuizzes.includes(quiz.id)}
      >
        <input
          class="mr-1"
          type="checkbox"
          id={quiz.id}
          bind:group={selectedQuizzes}
          value={quiz.id}
        />
        <span>{quiz.title}</span>
        <!-- <button class="ml-2 text-xs text-red-500" on:click={() => removeQuiz(quiz)}> x </button> -->
      </label>
    {/each}
  </div>

  <div class="bg-neutral-700 rounded-full h-2 overflow-hidden">
    <div
      class="bg-teal-500 h-2 rounded-full transition-all"
      style:width="{(100 / questions.length) * (questions.length - remainingQuestions.length)}%"
    >
      &nbsp;
    </div>
  </div>
  {#if remainingQuestions.length > 0}
    <QuestionSection question={currentQuestion} on:answer={checkAnswer} />
  {:else if questions.length === 0}
    <p class="my-4 text-lg min-h-[96px] font-semibold">Select a quiz to get started.</p>
  {:else}
    <ReviewSection {answeredQuestions} on:reviewComplete={restart} />
  {/if}
</div>
