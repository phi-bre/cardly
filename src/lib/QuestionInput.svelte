<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Question } from '../interfaces';
  import TopicSelection from './TopicSelection.svelte';

  const dispatch = createEventDispatcher();

  export let index: number;
  export let question: Question;
  export let topics: string[];

  function deleteQuestion() {
    if (confirm('Are you sure you want to delete this question?')) {
      dispatch('delete', index);
    }
  }
</script>

<section>
  <div class="flex items-center gap-2">
    <h2 class="my-4 text-sm font-semibold text-neutral-500">#{index}</h2>
    <button on:click={deleteQuestion}>
      <svg
        class="h-5 w-5 text-red-400"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <TopicSelection {question} {topics} />
  </div>

  <div class="grid grid-rows-4 gap-2 md:grid-cols-2">
    <textarea class="cardly-input row-span-full resize-none" bind:value={question.q} />

    {#each question.a as answer}
      <input
        type="text"
        class="cardly-input resize-none first-of-type:text-teal-500"
        bind:value={answer}
      />
    {/each}
  </div>
</section>
