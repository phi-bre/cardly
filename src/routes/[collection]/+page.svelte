<script lang="ts">
  import EditableCard from '$lib/EditableCard.svelte';
  import NoticeCard from '$lib/NoticeCard.svelte';
  import TopicSelection from '$lib/TopicSelection.svelte';
  import { local } from '../../storage';
  import { goto } from '$app/navigation';
  import { convertFilesToString, getTokenCount } from '../../files';
  import { getContext } from 'svelte';
  import { generateCards } from '../../prompt';
  import EditableTopic from '../../lib/EditableTopic.svelte';
  import { nanoid } from 'nanoid';
  import type { PageData } from './$types';
  import TopicCard from '$lib/TopicCard.svelte';
  import Dropdown from '../../lib/Dropdown.svelte';
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { flip } from 'svelte/animate';

  export let data: PageData;

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 100,
        easing: quintOut,
        css: (t) => `
          transform: ${transform} scale(${t});
          opacity: ${t}
        `,
      };
    },
  });

  let files: FileList | null = null;
  let selectedTopicsTexts: string[] = [];
  let help =
    'Create questions about the technical details and concepts discussed in this document.';
  let examples = '';
  let text = '';
  $: text = selectedTopicsTexts.join('\n') || text;

  const collection = getContext('collection');

  $: selectedCards = $collection.cards.filter((card) => {
    if (!$local.selectedTopics.length) return true;
    return card.topics.some((cardTopicId) =>
      $local.selectedTopics.some((selectedTopicId) => selectedTopicId === cardTopicId),
    );
  });
  $: canStartLearning = selectedCards.length > 0;
  // $: fileText = files ? convertFilesToString(files).catch(console.error) : Promise.resolve('');
  // $: fileTokenCount = fileText.then(getTokenCount).catch(console.error);
  $: collectionIsSaved = !!$local.collections.find((c) => c.id === collection.id);

  async function generate() {
    console.log($local.apiKey);
    const cards = await generateCards(text, help, $local.apiKey);
    $collection.cards.push(...cards);
  }

  function rememberCollection() {
    $local.collections = [...$local.collections, { id: collection.id }];
  }

  function forgetCollection() {
    $local.collections = $local.collections.filter((c) => c.id !== collection.id);
  }

  function createTopic() {
    $collection.topics.push({ id: nanoid(), title: 'New topic', description: '' });
  }
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<main class="mb-96">
  <header class="mb-6 flex items-center justify-between">
    <a href="/">
      <h1 class="select-none text-xl font-semibold">cardly<span class="text-teal-500">.</span></h1>
    </a>

    {#if collectionIsSaved}
      <button class="cardly-button flex items-center gap-2" on:click={forgetCollection}>
        Forget collection
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="-mr-1 h-4 w-4 rotate-45 transition-transform"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    {:else}
      <button class="cardly-button flex items-center gap-2" on:click={rememberCollection}>
        Remember collection
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="-mr-1 h-4 w-4"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    {/if}
  </header>

  <div class="mb-6 flex flex-col gap-2">
    <h3 class="text-sm font-semibold text-neutral-500">Collection</h3>
    <input
      type="text"
      class="cardly-input"
      value={$collection.title}
      on:change={(e) => {
        $collection.title.delete(0, $collection.title.length);
        $collection.title.insert(0, e.target.value);
      }}
      placeholder="Title of the subject this collection is about."
    />
    <input
      class="cardly-input mb-1 w-full"
      type="text"
      placeholder="OpenAI API Key"
      bind:value={$local.apiKey}
    />
  </div>

  {#if $local.apiKey}
    <div class="my-6 flex flex-col gap-2">
      <div class="flex items-center gap-4">
        <h3 class="text-sm font-semibold text-neutral-500">Summary</h3>
        <span class="text-xs text-neutral-500">{getTokenCount(text)} tokens</span>
      </div>

      <Dropdown title="Topics">
        <div>
          {#await data.streamed.topics}
            <NoticeCard>
              <p class="flex items-center gap-4 text-sm">Loading summary topics.</p>
              <svg
                slot="icon"
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
            </NoticeCard>
          {:then topics}
            {#each topics as topic}
              <TopicCard {topic}>
                <input
                  type="checkbox"
                  class="cardly-checkbox"
                  value={topic.description}
                  bind:group={selectedTopicsTexts}
                  on:click|stopPropagation
                />
              </TopicCard>
            {/each}
          {:catch error}
            {error.message}
          {/await}
        </div>

        <!--  <div class="mb-6">-->
        <!--    <div class="mb-4 flex items-center justify-between">-->
        <!--      <h3 class="text-sm font-semibold text-neutral-500">Topics</h3>-->
        <!--      <button class="cardly-button flex items-center gap-2" on:click={createTopic}>-->
        <!--        Add-->
        <!--        <svg-->
        <!--          xmlns="http://www.w3.org/2000/svg"-->
        <!--          fill="none"-->
        <!--          viewBox="0 0 24 24"-->
        <!--          stroke-width="1.5"-->
        <!--          stroke="currentColor"-->
        <!--          class="-mr-1 h-4 w-4"-->
        <!--        >-->
        <!--          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />-->
        <!--        </svg>-->
        <!--      </button>-->
        <!--    </div>-->
        <!--    <div class="">-->
        <!--      {#each $collection.topics as topic}-->
        <!--        <EditableTopic {topic} />-->
        <!--      {:else}-->
        <!--        <NoticeCard>No topics found.</NoticeCard>-->
        <!--      {/each}-->
        <!--    </div>-->
        <!--  </div>-->
      </Dropdown>

      <textarea
        placeholder="Paste your summary text here."
        class="cardly-input"
        bind:value={text}
      />

      <!--      <div class="flex w-full items-center justify-center">-->
      <!--        <label for="upload" class="cardly-input !font-sans">-->
      <!--          <div class="flex flex-col items-center justify-center pb-6 pt-5">-->
      <!--            <svg-->
      <!--              xmlns="http://www.w3.org/2000/svg"-->
      <!--              fill="none"-->
      <!--              viewBox="0 0 24 24"-->
      <!--              stroke-width="1.5"-->
      <!--              stroke="currentColor"-->
      <!--              class="mb-4 h-6 w-6 text-teal-500"-->
      <!--            >-->
      <!--              <path-->
      <!--                stroke-linecap="round"-->
      <!--                stroke-linejoin="round"-->
      <!--                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"-->
      <!--              />-->
      <!--            </svg>-->
      <!--            <p class="mb-2 text-sm text-neutral-500 dark:text-neutral-400">-->
      <!--              <span class="font-semibold">Click to upload</span> or drag and drop-->
      <!--            </p>-->
      <!--            <p class="text-xs text-neutral-500 dark:text-neutral-400">.TXT, .MD or .PDF</p>-->
      <!--          </div>-->
      <!--          <input id="upload" type="file" directory multiple bind:files class="hidden" />-->
      <!--        </label>-->
      <!--      </div>-->

      <label
        for="generate"
        class="sr-only mb-2 text-sm font-medium text-neutral-900 dark:text-white"
      >
        Generate
      </label>
      <div class="relative mb-2 w-full">
        <textarea
          id="generate"
          bind:value={help}
          type="text"
          placeholder="Prompt to guide the question generation."
          class="cardly-input block w-full rounded-lg !p-4 !pr-32 text-sm"
        />
        <button
          class="cardly-button absolute bottom-2.5 right-2.5"
          disabled={!text}
          on:click={generate}
        >
          Generate
        </button>
      </div>
      <!--{#await fileText}-->
      <!--  <span class="text-sm text-neutral-500">Loading...</span>-->
      <!--{:then text}-->
      <!--  <textarea readonly value={text} class="cardly-input" />-->
      <!--{:catch error}-->
      <!--  <span class="text-sm text-red-500">Error: {error.message}</span>-->
      <!--{/await}-->

      <!--    <Markdown value={$local.output || ''} />-->
    </div>
  {/if}

  {#if $collection.cards.filter((c) => !$local.approvedCards.includes(c.id)).length}
    <hr
      class="my-2 border-b-2 border-t-0 border-dashed border-neutral-300 dark:border-neutral-700"
    />
    <Dropdown title="Generated Cards">
      {#each $collection.cards.filter((c) => !$local.approvedCards.includes(c.id)) as card, index (card.id)}
        <div
          in:receive={{ key: card.id }}
          out:send={{ key: card.id }}
          animate:flip={{ duration: 350 }}
        >
          <EditableCard {card} {index}>
            <button
              class="cardly-button"
              on:click={() => ($local.approvedCards = [...$local.approvedCards, card.id])}
              >Approve</button
            >
          </EditableCard>
        </div>
      {/each}
    </Dropdown>
  {/if}

  <hr class="my-2 border-b-2 border-t-0 border-dashed border-neutral-300 dark:border-neutral-700" />

  <Dropdown open>
    <div slot="title" class="flex w-full flex-col justify-between md:flex-row md:items-center">
      <h3 class="text-sm font-semibold text-neutral-500">Cards</h3>
      <div class="flex flex-col items-center gap-4 md:flex-row">
        <!--        <TopicSelection bind:group={$local.selectedTopics} topics={$collection.topics} />-->
        <button
          class="cardly-button flex w-full items-center gap-2 md:w-auto"
          on:click={() => goto(`/${collection.id}/learn`)}
          disabled={!canStartLearning}
        >
          Start Learning
          <svg
            class="-mr-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      {#each $collection.cards.filter((c) => !$local.hiddenCards.includes(c.id) && $local.approvedCards.includes(c.id)) as card, index (card.id)}
        <div
          in:receive={{ key: card.id }}
          out:send={{ key: card.id }}
          animate:flip={{ duration: 350 }}
        >
          <EditableCard {card} {index} />
        </div>
      {:else}
        <NoticeCard>No cards found.</NoticeCard>
      {/each}
    </div>
  </Dropdown>

  <hr class="my-2 border-b-2 border-t-0 border-dashed border-neutral-300 dark:border-neutral-700" />

  <Dropdown title="Hidden Cards">
    {#each $collection.cards.filter((c) => $local.hiddenCards.includes(c.id) && $local.approvedCards.includes(c.id)) as card, index (card.id)}
      <div
        in:receive={{ key: card.id }}
        out:send={{ key: card.id }}
        animate:flip={{ duration: 350 }}
      >
        <EditableCard {card} {index} />
      </div>
    {/each}
  </Dropdown>
</main>
