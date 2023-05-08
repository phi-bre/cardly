<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { Quiz } from '../interfaces';

  export let quiz: Quiz;

  let open = false;
</script>

<div id="accordion-open" data-accordion="open">
  <h2 id="accordion-open-heading-1" on:click={() => (open = !open)}>
    <button
      type="button"
      class="flex items-center justify-between w-full p-4 font-medium text-left text-neutral-500 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-800 dark:border-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      <span class="flex items-center">
        <!-- Add checkmark -->
        {quiz.title}
      </span>
      <!-- Add icon -->
    </button>
  </h2>
  {#if open}
    <div class="py-4 md:px-4 flex flex-col gap-4" transition:slide>
      {#each quiz.questions as question}
        <div class="grid md:grid-cols-2 grid-rows-4 gap-2">
          <textarea class="cardly-input resize-none row-span-full" bind:value={question.q} />

          {#each question.a as answer}
            <input type="text" class="cardly-input resize-none" bind:value={answer} />
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>
