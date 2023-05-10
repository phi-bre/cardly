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

<p class="my-4 text-lg min-h-[96px] font-semibold">{question.q}</p>

<div class="grid md:grid-cols-2 gap-2">
  {#each shuffledAnswers as answer (answer)}
    <button
      class="bg-neutral-200 text-neutral-500 dark:bg-neutral-700 p-4 px-6 rounded text-left hover:bg-teal-500/25 hover:text-teal-500 font-semibold text-sm transition-colors"
      on:click={() => dispatch('answer', answer)}
    >
      {answer}
    </button>
  {/each}
</div>
