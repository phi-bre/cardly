<script lang="ts">
  import type { Answer, Card, CardAnswer } from '$lib/interfaces';
  import { createEventDispatcher } from 'svelte';
  import { judgeOpenStyleAnswer } from '$lib/prompt';
  import Markdown from './Markdown.svelte';
  import { credentials } from '$lib/storage';
  import { shuffle } from '$lib/helper';

  const dispatch = createEventDispatcher();
  // const IMMEDIATE_REVIEW = true; // TODO: Add to settings
  const CORRECT_THRESHOLD = 0.8; // TODO: Add to settings
  const INCORRECT_THRESHOLD = 0.4; // TODO: Add to settings
  let openStyle = !!$credentials.apiKey; // TODO: Add to settings

  export let card: Card;

  let cardAnswer: CardAnswer | null = null;
  let userAnswer = '';
  let hint = '';
  let loading = false;
  let selectedAnswers: Answer[] = [];

  // TODO: Check if this needs a key (might be the same shuffle for all cards)
  $: shuffledAnswers = shuffle(card.answers);

  function nextCard() {
    dispatch('answer', cardAnswer);
    cardAnswer = null;
    userAnswer = '';
    hint = '';
  }

  function answerCard(answer: Answer) {
    if (selectedAnswers.includes(answer)) {
      selectedAnswers = selectedAnswers.filter((a) => a !== answer);
    } else {
      selectedAnswers = [...selectedAnswers, answer];
    }
  }

  function checkAnswers() {
    const areAllCorrectCardsSelected =
      selectedAnswers.every((a) => a.correct) &&
      selectedAnswers.length === card.answers.filter((a) => a.correct).length;
    cardAnswer = {
      card: card.id,
      answer: selectedAnswers.map((a) => a.text).join(', '),
      accuracy: areAllCorrectCardsSelected ? 1 : 0,
      time: Date.now(),
    };
  }

  async function answerOpenCard() {
    if (!userAnswer) return;

    loading = true;
    ({ hint, ...cardAnswer } = await judgeOpenStyleAnswer(card, userAnswer));
    loading = false;
  }
</script>

<p
  class="my-4 min-h-[96px] rounded-md border-2 border-neutral-200 bg-neutral-200/50 p-4 text-lg dark:border-neutral-900 dark:bg-neutral-900/50"
>
  <Markdown value={card.question} />
</p>

<div class="mb-4 flex gap-2">
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
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  </button>
  <button
    class="cardly-button !p-3"
    on:click={() => (openStyle = !openStyle)}
    disabled={!$credentials.apiKey}
    title="Toggle open style question answering"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-4 w-4"
    >
      {#if openStyle}
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      {:else}
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      {/if}
    </svg>
  </button>
  <button class="cardly-button !p-3" disabled title="Reformulate this question">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-4 w-4"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  </button>
</div>

{#if openStyle}
  {#key card.question}
    <textarea
      class="cardly-input mb-2 h-32"
      placeholder="Write your answer here..."
      readonly={loading || !!cardAnswer}
      bind:value={userAnswer}
    />

    {#if cardAnswer}
      <p
        class="my-4 min-h-[96px] rounded-md border-2 border-neutral-200 bg-neutral-200/50 p-4 text-lg dark:border-neutral-900 dark:bg-neutral-900/50"
        class:!border-red-500={cardAnswer.accuracy < INCORRECT_THRESHOLD}
        class:!border-yellow-500={cardAnswer.accuracy >= INCORRECT_THRESHOLD &&
          cardAnswer.accuracy < CORRECT_THRESHOLD}
        class:!border-teal-500={cardAnswer.accuracy >= CORRECT_THRESHOLD}
      >
        <Markdown value={hint} />
      </p>
    {:else}
      <button
        class="cardly-button flex w-full items-center justify-center"
        disabled={!userAnswer || loading}
        on:click={answerOpenCard}
      >
        {#if loading}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5 animate-spin"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        {:else}
          Check
        {/if}
      </button>
    {/if}
  {/key}
{:else}
  <div class="grid gap-2 md:grid-cols-2">
    {#each shuffledAnswers as answer (answer.id)}
      <button
        class="group rounded border-2 border-dashed border-transparent bg-neutral-200 p-4 px-6 text-left text-sm font-medium transition-colors hover:bg-teal-500/10 dark:bg-neutral-700/50 [&.correct]:bg-teal-500/20"
        class:!border-teal-500={selectedAnswers.includes(answer)}
        class:correct={cardAnswer && answer.correct}
        on:click={() => answerCard(answer)}
      >
        <Markdown
          class="prose-p:transition-duration-75 prose-p:transition-colors group-hover:prose-p:text-teal-500"
          value={answer.text}
        />
      </button>
    {/each}
  </div>

  {#if !cardAnswer}
    <button
      class="cardly-button mt-2 flex w-full items-center justify-center"
      on:click={checkAnswers}
    >
      Check
    </button>
  {/if}
{/if}

{#if cardAnswer}
  <button class="cardly-button mt-2 flex w-full items-center justify-center" on:click={nextCard}>
    Next
  </button>
{/if}
