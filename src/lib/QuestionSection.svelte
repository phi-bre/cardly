<script lang="ts">
  import type { Question } from '../interfaces';
  import { createEventDispatcher } from 'svelte';
  import Markdown from './Markdown.svelte';
  import { Configuration, OpenAIApi } from 'openai';
  import { local } from '../storage';

  const openai = new OpenAIApi(
    new Configuration({ apiKey: $local.apiKey, organization: $local.organization }),
  );

  export let question: Question;

  const dispatch = createEventDispatcher();

  function shuffle<T>(array: T[]): T[] {
    return array
      .map<[number, T]>((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

  $: shuffledAnswers = shuffle(question.a);

  let value: string = '';
  let explanation = null;

  async function submit() {
    console.log(value);

    // TODO: Pass entire context
    // TODO: Maybe just provide a simple hint first before marking the answer as wrong
    const messages = [
      { role: 'system', content: `Question: "${question.q}"` },
      { role: 'system', content: `Real answer: "${question.a[0]}"` },
      {
        role: 'user',
        content: value,
      },
      {
        role: 'system',
        content:
          'Use the following JSON structure with the accuracy of the statement on a scale from 0 to 1 and a hint on why the answer is wrong (in case it is), hinting towards the real answer.',
      },
      { role: 'system', content: '{ "accuracy": ..., "hint": "..." }' },
    ];
    console.log(messages);

    const { data } = await openai.createChatCompletion({
      messages: [
        {
          role: 'user',
          content: `
            QUESTION: """${question.q}"""
            ANSWER: """${question.a[0]}"""
            USER ANSWER: """${value}"""

            Provide a valid JSON response with the "accuracy" of the user answer compared to the actual answer on a scale from 0 to 1 
            and a "hint" on why the answer is wrong (in case it is), hinting towards the real answer. No other output.
          `,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    const json = data.choices[0]?.message?.content;
    console.log(json);
    explanation = JSON.parse(json || '{}');

    if (explanation.accuracy > 0.75) {
      dispatch('answer', question.a[0]);
    }
  }
</script>

<p
  class="my-4 min-h-[96px] rounded-md border-2 border-neutral-200 bg-neutral-200/50 p-4 text-lg dark:border-neutral-900 dark:bg-neutral-900/50"
>
  <Markdown value={question.q} />
</p>

<div class="grid gap-2 md:grid-cols-2">
  {#each shuffledAnswers as answer (answer)}
    <button
      class="group rounded border-2 border-transparent bg-neutral-200 p-4 px-6 text-left text-sm font-medium text-neutral-500 transition-colors hover:border-teal-500 dark:bg-neutral-700"
      on:click={() => dispatch('answer', answer)}
    >
      <Markdown
        class="prose-p:transition-duration-75 prose-p:transition-colors group-hover:prose-p:text-teal-500"
        value={answer}
      />
    </button>
  {/each}
  <!-- {#key question.q}
    <textarea class="cardly-input" bind:value />
    <button class="cardly-button" on:click={submit}>check</button>
    {#if explanation}
      <p class="text-left">{explanation.hint}</p>
      <p class="text-left">{explanation.accuracy}</p>
      {#if explanation.accuracy > 0.5}
        <p class="text-left">Correct!</p>
      {:else}
        <p class="text-left">Wrong!</p>
      {/if}
    {/if}
  {/key} -->
</div>
