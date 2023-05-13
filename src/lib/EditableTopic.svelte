<script lang="ts">
  import type { Topic } from '../interfaces';
  import { local, remote } from '../storage';
  import { generateCardsForTopic, getTokenCount } from '../prompt';

  export let topic: Topic;

  $: descriptionTokenCount = getTokenCount(topic.description);
  $: cardsOfTopic = $remote.collection.cards.filter((card) => card.topics.includes(topic.id));

  async function generateCards() {
    $remote.collection.cards.push(...(await generateCardsForTopic(topic, $local.apiKey)));
  }

  function deleteTopic() {
    if (confirm('Are you sure you want to delete this topic?')) {
      $remote.collection.topics?.splice($remote.collection.topics.indexOf(topic), 1); // TODO: Use ID
    }
  }

  $: console.log($local.selectedTopics);
</script>

<div class="flex flex-col gap-2 pb-4">
  <!--        <label-->
  <!--          title={topic.keywords.join(', ')}-->
  <!--          class="cursor-pointer select-none rounded bg-neutral-200 p-2 px-3 text-xs font-semibold text-neutral-500 transition-colors dark:bg-neutral-700 dark:text-neutral-300 [&.selected]:bg-lime-500/20 [&.selected]:text-lime-500"-->
  <!--          for={topic.id}-->
  <!--          class:selected={$local.selectedTopics.includes(topic.id)}-->
  <!--        >-->
  <!--          <input-->
  <!--            class="mr-1 hidden"-->
  <!--            type="checkbox"-->
  <!--            id={topic.id}-->
  <!--            bind:group={$local.selectedTopics}-->
  <!--            value={topic.id}-->
  <!--          />-->
  <!--        </label>-->
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
  <div class="flex items-center justify-between">
    <span class="text-sm text-neutral-500">{descriptionTokenCount} of 4096 tokens</span>
    <button class="cardly-button" on:click={generateCards}> Generate </button>
  </div>
  <!--        <div class="flex flex-wrap gap-2">-->
  <!--          {#each topic.keywords as keyword}-->
  <!--            <span class="cardly-tag">{keyword}</span>-->
  <!--          {/each}-->
  <!--        </div>-->
</div>
