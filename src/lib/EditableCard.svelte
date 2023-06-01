<script lang="ts">
  import type { Card } from '../interfaces';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let index: number;
  export let card: Card;
</script>

<section class="my-4">
  <div class="flex items-center justify-end gap-2">
    <h2 class="flex-grow-1 my-4 w-full text-sm font-semibold text-neutral-500">#{index + 1}</h2>
    <button on:click={() => dispatch('delete')}>
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
    <!--    <TopicSelection group={card.topics} topics={$collection.topics} />-->
    <button
      class="cardly-button !p-3"
      title="Don't show again"
      on:click={() => (card.hidden = !card.hidden)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="h-4 w-4"
      >
        {#if card.hidden}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        {:else}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        {/if}
      </svg>
    </button>
    <slot />
  </div>

  <div class="grid grid-rows-4 gap-2 md:grid-cols-2">
    <textarea
      class="cardly-input row-span-full resize-none max-sm:h-32"
      bind:value={card.question}
    />

    {#each card.answers as answer}
      <span class="flex items-center gap-2">
        <input type="checkbox" class="cardly-checkbox" bind:checked={answer.correct} />
        <input
          type="text"
          class="cardly-input resize-none [&.correct]:text-teal-500"
          class:correct={answer.correct}
          bind:value={answer.text}
        />
      </span>
    {/each}
    <!-- <button class="cardly-button !bg-neutral-700" on:click={() => card.answers.push({ id: nanoid(), text: '', correct: false })}>
      Add
    </button> -->
  </div>
</section>
