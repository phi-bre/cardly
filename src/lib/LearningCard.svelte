<script lang="ts">
  import type { Card } from '../interfaces';
  import { createEventDispatcher } from 'svelte';
  import Markdown from './Markdown.svelte';

  export let card: Card;

  const dispatch = createEventDispatcher();

  function shuffle<T>(array: T[]): T[] {
    return array
      .map<[number, T]>((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

  $: shuffledAnswers = shuffle(card.answers);
</script>

<p
  class="my-4 min-h-[96px] rounded-md border-2 border-neutral-200 bg-neutral-200/50 p-4 text-lg dark:border-neutral-900 dark:bg-neutral-900/50"
>
  <Markdown value={card.question} />
</p>

<div class="grid gap-2 md:grid-cols-2">
  {#each shuffledAnswers as answer (answer.id)}
    <button
      class="group rounded border-2 border-transparent bg-neutral-200 p-4 px-6 text-left text-sm font-medium text-neutral-500 transition-colors hover:border-lime-500 dark:bg-neutral-700"
      on:click={() => dispatch('answer', answer)}
    >
      <Markdown
        class="prose-p:transition-duration-75 prose-p:transition-colors group-hover:prose-p:text-lime-500"
        value={answer.text}
      />
    </button>
  {/each}
</div>
