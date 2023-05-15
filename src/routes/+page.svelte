<script lang="ts">
  import type { Card, Topic } from '../interfaces';
  import EditableCard from '$lib/EditableCard.svelte';
  import NoticeCard from '$lib/NoticeCard.svelte';
  import { local, remote } from '../storage';
  import { enhanceTopics } from '../prompt';
  import { nanoid } from 'nanoid';
  import EditableTopic from '../lib/EditableTopic.svelte';
  import TopicSelection from '$lib/TopicSelection.svelte';
  import { goto } from '$app/navigation';
  import { convertFilesToString, getTokenCount } from '../files';
  import Markdown from '../lib/Markdown.svelte';

  let files: FileList | null = null;

  // TODO: Improve
  $: cards = $remote.collection.cards ||= [];
  $: topics = $remote.collection.topics ||= [];

  // $: console.log($local.selectedTopics);
  // $: cards.forEach((card) => {
  //   // card.topics = card.topics || [topics[0].id];
  // });

  $: selectedCards = cards.filter((card) => {
    return card.topics.some((cardTopicId) =>
      $local.selectedTopics.some((selectedTopicId) => selectedTopicId === cardTopicId),
    );
  });
  $: canStartLearning = selectedCards.length > 0;
  $: fileText = files ? convertFilesToString(files).catch(console.error) : Promise.resolve('');
  $: fileTokenCount = fileText.then(getTokenCount).catch(console.error);

  async function generate() {
    $local.output = await enhanceTopics(
      files,
      $local.apiKey,
      $remote.collection.title,
      $remote.collection.description,
    );
    // const topics = await extractTopics(
    //   files,
    //   $local.apiKey,
    //   $remote.collection.title,
    //   $remote.collection.description,
    // );

    console.log(topics);
  }

  // function addTopic() {
  //   const topic: Topic = {
  //     id: nanoid(),
  //     title: '',
  //     description: '',
  //   };
  //   topics.push(topic);
  // }

  $: console.log($local.output);
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<main>
  <header class="mb-6 flex items-center justify-between">
    <h1 class="select-none text-xl font-semibold">cardly<span class="text-teal-500">.</span></h1>
    <button class="cardly-button flex items-center gap-2">
      Remember
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
  </header>

  <div class="mb-6 flex flex-col gap-2">
    <h3 class="text-sm font-semibold text-neutral-500">Collection</h3>
    <input
      type="text"
      class="cardly-input"
      bind:value={$remote.collection.title}
      placeholder="Title of the subject this collection is about."
    />
    <textarea
      bind:value={$remote.collection.description}
      class="cardly-input"
      placeholder="Description of the subject. The more information you pass in here, like an outline of the semester, the better the topic generation is at finding relevant information in the files."
    />
  </div>

  <div class="mb-6 flex flex-col gap-2">
    <h3 class="text-sm font-semibold text-neutral-500">Files</h3>
    <input
      class="cardly-input mb-1 w-full"
      type="text"
      placeholder="OpenAI API Key"
      bind:value={$local.apiKey}
    />
    <label for="upload" class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Generate
    </label>
    <div class="relative mb-2 w-full">
      <input
        id="upload"
        type="file"
        directory
        multiple
        bind:files
        placeholder="URL like https://raw.githubusercontent.com/Seppli11/ZHAW-Summary/main/summaries/23FS/SWEN2/Extreme%20Programming.md"
        class="cardly-input block w-full rounded-lg !p-4 !pr-32 text-sm"
      />
      <button
        class="cardly-button absolute bottom-3 right-2.5"
        disabled={!files}
        on:click={generate}
      >
        Generate
      </button>
    </div>
    {#await fileText}
      <span class="text-sm text-neutral-500">Loading...</span>
    {:then text}
      <textarea readonly value={text} class="cardly-input" />
    {:catch error}
      <span class="text-sm text-red-500">Error: {error.message}</span>
    {/await}

    <span>
      {#await fileTokenCount}
        <span class="text-sm text-neutral-500">Loading...</span>
      {:then count}
        <span class="text-sm text-neutral-500">{count} tokens</span>
      {:catch error}
        <span class="text-sm text-red-500">Error: {error.message}</span>
      {/await}
    </span>

    <Markdown value={$local.output || ''} />
  </div>

  <!--  <div class="mb-6">-->
  <!--    <div class="mb-4 flex items-center justify-between">-->
  <!--      <h3 class="text-sm font-semibold text-neutral-500">Topics</h3>-->
  <!--      <button class="cardly-button flex items-center gap-2" on:click={addTopic}>-->
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
  <!--      {#each topics as topic}-->
  <!--        <EditableTopic {topic} />-->
  <!--      {:else}-->
  <!--        <NoticeCard>No topics found.</NoticeCard>-->
  <!--      {/each}-->
  <!--    </div>-->
  <!--  </div>-->

  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-neutral-500">Cards</h3>
      <div class="flex items-center gap-4">
        <TopicSelection bind:group={$local.selectedTopics} {topics} />
        <button
          class="cardly-button flex items-center gap-2"
          on:click={() => goto('/learn')}
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
    {#each cards as card, index}
      <EditableCard {card} {index} />
    {:else}
      <NoticeCard>Select a topic to get started.</NoticeCard>
    {/each}
  </div>
</main>
