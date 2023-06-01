<script lang="ts">
  import type { Topic } from '../interfaces';
  import { getTokenCount } from '../files';
  import { getContext } from 'svelte';

  // TODO: Update to new API or remove

  const collection = getContext('collection');

  export let topic: Topic;

  $: descriptionTokenCount = getTokenCount(topic.description);
  $: cardsOfTopic = $collection.cards.filter((card) => card.topics.includes(topic.id));

  async function generateCards() {
    // $remote.collection.cards.push(...(await generateCardsForTopic(topic, $local.apiKey)));
  }

  function deleteTopic() {
    if (confirm('Are you sure you want to delete this topic?')) {
      $collection.topics?.splice($collection.topics.indexOf(topic), 1); // TODO: Use ID
    }
  }
</script>

<div class="flex flex-col gap-2 pb-4">
  <div class="flex items-center gap-2">
    <input type="text" class="cardly-input" bind:value={topic.title} placeholder="Topic title" />
    <button on:click={deleteTopic}>
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
  </div>
  <textarea
    class="cardly-input h-64"
    bind:value={topic.description}
    placeholder="Topic description or summary"
  />
  <div class="flex items-center justify-end gap-4">
    <span class="text-sm text-neutral-500">{descriptionTokenCount} tokens</span>
    <button class="cardly-button" on:click={generateCards}> Generate </button>
  </div>
</div>
