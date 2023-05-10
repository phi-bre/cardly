<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Question } from '../interfaces';

  const dispatch = createEventDispatcher();

  export let index: number;
  export let question: Question;
</script>

<section>
  <div class="flex gap-4 items-center">
    <h2 class="my-4 text-sm font-semibold text-neutral-500">#{index}</h2>
    <button class="text-red-500" on:click={() => dispatch('delete')}>Delete</button>
  </div>

  <div class="grid md:grid-cols-2 grid-rows-4 gap-2">
    <textarea class="cardly-input resize-none row-span-full" bind:value={question.q} />

    {#each question.a as answer}
      <input type="text" class="cardly-input resize-none" bind:value={answer} />
    {/each}
  </div>
</section>
