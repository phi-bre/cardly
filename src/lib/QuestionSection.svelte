<script context="module">
  import md from 'markdown-it';
  import mk from 'markdown-it-katex';

  const markdown = md({
    html: false,
    linkify: true,
    typographer: true,
  });

  markdown.use(mk);
</script>

<script lang="ts">
  import type { Question } from '../interfaces';
  import { createEventDispatcher } from 'svelte';

  export let question: Question;

  const dispatch = createEventDispatcher();

  function shuffle<T>(array: T[]): T[] {
    return array
      .map<[number, T]>((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

  $: shuffledAnswers = shuffle(question.a);
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css" />
</svelte:head>

<p class="my-4 min-h-[96px] text-lg font-semibold">
  {@html markdown.render(question.q)}
</p>

<div class="grid gap-2 md:grid-cols-2">
  {#each shuffledAnswers as answer (answer)}
    <button
      class="rounded bg-neutral-200 p-4 px-6 text-left text-sm font-semibold text-neutral-500 transition-colors hover:bg-teal-500/25 hover:text-teal-500 dark:bg-neutral-700"
      on:click={() => dispatch('answer', answer)}
    >
      {answer}
    </button>
  {/each}
</div>
