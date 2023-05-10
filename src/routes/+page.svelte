<script lang="ts">
  import type { Quiz, AnsweredQuestion } from '../interfaces';
  import OpenAISection from '$lib/OpenAISection.svelte';
  import QuestionInput from '$lib/QuestionInput.svelte';
  import NoticeCard from '$lib/NoticeCard.svelte';
  import { local, remote } from '../storage';

  $: questions = $remote.quizzes
    .filter((quiz) => $local.selectedQuizzes.includes(quiz.id))
    .flatMap((quiz) => quiz.questions);
  $: topics = [...new Set($remote.quizzes.map((quiz) => quiz.title))];
  $: canStartLearning = questions.length > 0;

  function deleteQuestion(index: number) {
    const question = questions[index];
    const quiz = $remote.quizzes.find((quiz) => quiz.questions.includes(question));
    if (!quiz) return;
    quiz.questions.splice(quiz.questions.indexOf(question), 1);
  }
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<div class="container m-auto px-8 py-4 md:py-16">
  <div class="mb-8">
    <OpenAISection />
  </div>

  <div class="my-4 flex flex-wrap items-center gap-2">
    {#each $remote.quizzes as quiz}
      <label
        class="cursor-pointer select-none rounded bg-neutral-200 p-2 px-3 text-xs font-semibold text-neutral-500 transition-colors dark:bg-neutral-700 dark:text-neutral-300 [&.selected]:bg-teal-500/20 [&.selected]:text-teal-500"
        for={quiz.id}
        class:selected={$local.selectedQuizzes.includes(quiz.id)}
      >
        <input
          class="mr-1 hidden"
          type="checkbox"
          id={quiz.id}
          bind:group={$local.selectedQuizzes}
          value={quiz.id}
        />
        <span>{quiz.title}</span>
        <!-- <button class="ml-2 text-xs text-red-500" on:click={() => removeQuiz(quiz)}> x </button> -->
      </label>
    {/each}
  </div>

  {#if canStartLearning}
    <div class="my-4 mb-8">
      <a class="cardly-button flex items-center justify-between md:max-w-xs" href="/learn">
        Start Learning
        <svg
          class="ml-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
          />
        </svg>
      </a>
    </div>
  {/if}

  <div class="flex flex-col gap-2">
    {#each questions as question, index}
      <QuestionInput {topics} {question} {index} on:delete={() => deleteQuestion(index)} />
    {:else}
      <NoticeCard>Select a topic to get started.</NoticeCard>
    {/each}
  </div>
</div>
