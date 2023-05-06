<script lang="ts">
  import Question from '$lib/Question.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let selectedQuizzes: string[] = [];

  $: questions = data.quizzes
    .filter((quiz) => selectedQuizzes.includes(quiz.title))
    .flatMap((quiz) => quiz.questions);

  let index = 0;
  let correct = [];
  let wrong = [];

  function nextQuestion() {
    index++;
  }

  function checkAnswer({ detail: answer }: CustomEvent<string>) {
    if (answer === questions[index].a[0]) {
      correct.push(index);
    } else {
      wrong.push(index);
    }
    nextQuestion();
  }

  function restart() {
    index = 0;
    correct = [];
    wrong = [];
  }
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<div class="container m-auto py-16 px-8">
  <!-- <div class="mb-16">
    <input type="text" placeholder="OpenAI Organisation" />
    <input type="text" placeholder="OpenAI API Key" />
  </div> -->
  <div class="flex items-center my-4">
    {#each data.quizzes as quiz}
      <label
        class="cursor-pointer select-none bg-malibu/20 text-malibu font-semibold text-sm rounded p-2 px-3"
        for={quiz.title}
        class:!bg-shark-400={!selectedQuizzes.includes(quiz.title)}
        class:!text-shark-50={!selectedQuizzes.includes(quiz.title)}
      >
        <input class="mr-1" type="checkbox" id={quiz.title} bind:group={selectedQuizzes} value={quiz.title} />
        {quiz.title}
      </label>
    {/each}
  </div>

  <div class="bg-shark-400 rounded-full h-2 overflow-hidden">
    <div
      class="bg-malibu h-2 rounded-full transition-all"
      style:width="{(100 / questions.length) * index}%"
    >
      &nbsp;
    </div>
  </div>
  {#if index < questions.length}
    <Question question={questions[index]} on:answer={checkAnswer} />
  {:else if questions.length === 0}
    <p class="my-4 text-lg min-h-[96px] font-semibold">Select a quiz to get started.</p>
  {:else}
    <p class="my-4 text-lg min-h-[96px] font-semibold">
      You scored {correct.length} out of {questions.length}.
    </p>
    <button
      class="bg-shark-400 p-4 px-6 rounded text-left hover:bg-malibu font-bold transition-colors"
      on:click={restart}
    >
      Restart
    </button>
  {/if}
</div>
