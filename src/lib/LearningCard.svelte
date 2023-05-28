<script lang="ts">
  import type { Answer, Card, CardAnswer } from '../interfaces';
  import { createEventDispatcher } from 'svelte';
  import Markdown from './Markdown.svelte';

  const dispatch = createEventDispatcher();
  const IMMEDIATE_REVIEW = true; // TODO: Add to settings

  export let card: Card;

  let cardAnswer: CardAnswer | null = null;

  $: shuffledAnswers = shuffle(card.answers);

  function shuffle<T>(array: T[]): T[] {
    return array
      .map<[number, T]>((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

  function answerCard(answer: Answer) {
    cardAnswer = {
      question: card,
      answer: answer.text,
      accuracy: answer.correct ? 1 : 0,
    };

    if (cardAnswer.accuracy > 0.8 || !IMMEDIATE_REVIEW) {
      dispatch('answer', cardAnswer);
      cardAnswer = null;
    }
  }
</script>

<p
  class="my-4 min-h-[96px] rounded-md border-2 border-neutral-200 bg-neutral-200/50 p-4 text-lg dark:border-neutral-900 dark:bg-neutral-900/50"
>
  <Markdown value={card.question} />
</p>

<div class="grid gap-2 md:grid-cols-2">
  {#each shuffledAnswers as answer (answer.id)}
    <button
      class="group rounded border-2 border-dashed border-transparent bg-neutral-200 p-4 px-6 text-left text-sm font-medium transition-colors hover:bg-teal-500/10 dark:bg-neutral-700/50"
      class:border-teal-500={cardAnswer && answer.correct}
      on:click={() => answerCard(answer)}
    >
      <Markdown
        class="prose-p:transition-duration-75 prose-p:transition-colors group-hover:prose-p:text-teal-500"
        value={answer.text}
      />
    </button>
  {/each}
</div>
