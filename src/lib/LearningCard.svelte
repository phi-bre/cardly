<script lang="ts">
  import type { Answer, Card, CardAnswer } from '../interfaces';
  import { createEventDispatcher } from 'svelte';
  import { judgeOpenStyleAnswer } from '../prompt';
  import Markdown from './Markdown.svelte';
  import { local } from '../storage';

  const dispatch = createEventDispatcher();
  const IMMEDIATE_REVIEW = true; // TODO: Add to settings
  const OPEN_STYLE = true; // TODO: Add to settings
  const CORRECT_THRESHOLD = 0.95; // TODO: Add to settings

  export let card: Card;

  let cardAnswer: CardAnswer | null = null;
  let userAnswer = '';
  let hint = '';
  let loading = false;

  // TODO: Check if this needs a key (might be the same shuffle for all cards)
  $: shuffledAnswers = shuffle(card.answers);

  function shuffle<T>(array: T[]): T[] {
    return array
      .map<[number, T]>((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

  function checkAnswer() {
    if ((cardAnswer && cardAnswer.accuracy > CORRECT_THRESHOLD) || !IMMEDIATE_REVIEW) {
      dispatch('answer', cardAnswer);
      cardAnswer = null;
      userAnswer = '';
      hint = '';
    }
  }

  function answerCard(answer: Answer) {
    // TODO: Fix
    cardAnswer = {
      question: card,
      answer: answer.text,
      accuracy: answer.correct ? 1 : 0,
    };

    checkAnswer();
  }

  async function answerOpenCard() {
    if (!userAnswer) return;

    loading = true;
    ({ hint, ...cardAnswer } = await judgeOpenStyleAnswer(card, userAnswer, $local.apiKey));
    loading = false;

    checkAnswer();
  }
</script>

<p
  class="my-12 min-h-[96px] rounded-md border-2 border-neutral-200 bg-neutral-200/50 p-4 text-lg dark:border-neutral-900 dark:bg-neutral-900/50"
>
  <Markdown value={card.question} />
</p>

{#if OPEN_STYLE}
  {#key card.question}
    <textarea
      class="cardly-input mb-2 h-32"
      placeholder="Write your answer here..."
      readonly={loading || cardAnswer}
      bind:value={userAnswer}
    />

    {#if cardAnswer}
      <!--{#if cardAnswer.accuracy === 0}-->
      <!--  <p class="text-red-500">Incorrect</p>-->
      <!--{:else if cardAnswer.accuracy === CORRECT_THRESHOLD}-->
      <!--  <p class="text-teal-500">Correct</p>-->
      <!--{:else}-->
      <!--  <p class="text-yellow-500">Partially correct</p>-->
      <!--{/if}-->
      <p
        class="my-12 min-h-[96px] rounded-md border-2 border-neutral-200 bg-neutral-200/50 p-4 text-lg dark:border-neutral-900 dark:bg-neutral-900/50"
      >
        <Markdown value={hint} />
      </p>
    {/if}

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
  {/key}
{:else}
  <div class="grid gap-2 md:grid-cols-2">
    {#each shuffledAnswers as answer (answer.id)}
      <button
        class="group rounded border-2 border-dashed border-transparent bg-neutral-200 p-4 px-6 text-left text-sm font-medium transition-colors hover:bg-teal-500/10 dark:bg-neutral-700/50"
        class:!border-teal-500={cardAnswer && answer.correct}
        on:click={() => answerCard(answer)}
      >
        <Markdown
          class="prose-p:transition-duration-75 prose-p:transition-colors group-hover:prose-p:text-teal-500"
          value={answer.text}
        />
      </button>
    {/each}
  </div>
{/if}
