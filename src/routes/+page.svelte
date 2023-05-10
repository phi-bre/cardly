<script lang="ts">
  import type { Quiz, AnsweredQuestion } from '../interfaces';
  import QuestionSection from '$lib/QuestionSection.svelte';
  import ReviewSection from '$lib/ReviewSection.svelte';
  import OpenAISection from '$lib/OpenAISection.svelte';
  import QuizSection from '$lib/QuizSection.svelte';
  import { onMount } from 'svelte';
  import { remote } from '../storage';
  import QuestionInput from '$lib/QuestionInput.svelte';

  let selectedQuizzes: string[] = [];

  $: quizzes = $remote.quizzes;
  $: questions = quizzes
    .filter((quiz) => selectedQuizzes.includes(quiz.id))
    .flatMap((quiz) => quiz.questions);
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

  <div class="my-4">
    <a class="cardly-button" href="/learn">Start Learning</a>
  </div>

  <div class="flex flex-col gap-2">
    {#each questions as question, index}
      <QuestionInput {question} {index} on:delete={() => questions} />
    {:else}
      <p class="text-lg font-semibold">No questions left</p>
    {/each}
  </div>
</div>
