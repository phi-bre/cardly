<script lang="ts">
  import EditableCard from '$lib/components/EditableCard.svelte';
  import NoticeCard from '$lib/components/NoticeCard.svelte';
  import { credentials, synced } from '$lib/storage';
  import { goto } from '$app/navigation';
  import { getTokenCount } from '$lib/files';
  import { cardPrompt, generateCards, generateCardsStreamed } from '$lib/prompt';
  import type { PageData } from './$types';
  import Dropdown from '$lib/components/Dropdown.svelte';
  import { flip } from 'svelte/animate';
  import type { Card, Answer } from '$lib/interfaces';
  import { plop } from '$lib/transitions';
  import { page } from '$app/stores';
  import { nanoid } from 'nanoid';
  import Editor from '$lib/components/Editor.svelte';

  const [send, receive] = plop();

  export let data: PageData;

  let help =
    'Create questions in English about the technical details and concepts discussed in this document.';
  let text = '';
  let tokens = 0;
  let loading = false;
  let errors: string[] = [];
  let signal = new AbortController();
  let modelName = 'gpt-4';

  let deckId = $page.params.deck; // FIXME: Somehow params.deck changes to undefined before navigating
  $: deck = $synced.decks[deckId]!;
  $: generatedCards = deck.cards.filter((card) => !card.approved && !card.hidden);
  $: approvedCards = deck.cards.filter((card) => card.approved && !card.hidden);
  $: hiddenCards = deck.cards.filter((card) => card.approved && card.hidden);

  async function generate() {
    loading = true;

    let currentCard: Card | undefined;

    try {
      await generateCardsStreamed(text, help, modelName, signal, {
        createEmptyCard() {
          currentCard = createEmptyCard(false);
        },
        setQuestion(question) {
          currentCard.question = question;
        },
        setAnswer(index, answer) {
          currentCard.answers[index].text += answer;
        },
      });
    } catch (e) {
      errors = [e, ...errors];
    }
    loading = false;
  }

  function cancelGeneration() {
    signal.abort();
    signal = new AbortController();
    loading = false;
  }

  function summarySelect({ detail }: CustomEvent<{ value: string }>) {
    text = detail.value;
  }

  $: {
    cardPrompt.format({ help, text }).then((prompt) => {
      tokens = getTokenCount(prompt);
    });
  }

  // function createTopic() {
  //   deck.topics.push({ id: nanoid(), title: 'New topic', description: '' });
  // }

  function createEmptyCard(approved = true) {
    const id = nanoid();
    const card: Card = {
      id: id,
      question: '',
      topics: [],
      answers: [
        {
          id: nanoid(),
          correct: true,
          text: '',
        },
        {
          id: nanoid(),
          correct: false,
          text: '',
        },
        {
          id: nanoid(),
          correct: false,
          text: '',
        },
        {
          id: nanoid(),
          correct: false,
          text: '',
        },
      ],
      approved: approved,
      hidden: false,
    };
    deck.cards.unshift(card);
    return deck.cards[0]; // Careful, hacky way to get reactive state.
  }

  function deleteCard(card: Card) {
    if (confirm('Are you sure you want to delete this card?')) {
      const index = deck.cards.findIndex(({ id }) => card.id === id);
      console.log(deck.cards, card);
      deck.cards.splice(index, 1);
    }
  }

  function exportData() {
    const a = document.createElement('a');
    const blob = new Blob([JSON.stringify(deck)], { type: 'json' });
    const url = URL.createObjectURL(blob);
    const sanitzedTitle = deck.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    a.setAttribute('href', url);
    a.setAttribute('download', `cardly-${sanitzedTitle}.json`);
    a.click();
  }
</script>

<svelte:head>
  <title>{deck.title} - cardly.</title>
</svelte:head>

<main class="mb-[60vh]">
  <header class="mb-6 flex items-center justify-between">
    <a href="/">
      <h1 class="select-none text-xl font-semibold">cardly<span class="text-teal-500">.</span></h1>
    </a>

    <button class="cardly-button !p-2" on:click={exportData}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-5 w-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    </button>
  </header>

  <div class="mb-6 flex flex-col gap-2">
    <h3 class="text-sm font-semibold text-neutral-500">Deck</h3>
    <input
      type="text"
      class="cardly-input"
      bind:value={deck.title}
      placeholder="Title of the subject this collection is about."
    />
  </div>

  {#if $credentials.apiKey}
    <Dropdown>
      <div slot="title" class="flex flex-grow items-center justify-between gap-4">
        <h3 class="text-sm font-semibold text-neutral-500">Summary</h3>
        <span
          class="w-full whitespace-nowrap text-xs text-neutral-500"
          class:text-red-500={tokens > 4000}
        >
          {tokens} tokens
        </span>
        <select bind:value={modelName} on:click|stopPropagation class="cardly-input !text-xs">
          <option value="gpt-4" selected> GPT-4 </option>
          <option value="gpt-3.5-turbo"> GPT-3.5 </option>
        </select>
      </div>
      <div class="my-6 flex flex-col gap-2">
        <Editor text={deck.description} on:select={summarySelect} />

        <!--      <Dropdown title="Topics">-->
        <!--        <div>-->
        <!--          {#await data.streamed.topics}-->
        <!--            <NoticeCard>-->
        <!--              <p class="flex items-center gap-4 text-sm">Loading summary topics.</p>-->
        <!--              <svg-->
        <!--                slot="icon"-->
        <!--                xmlns="http://www.w3.org/2000/svg"-->
        <!--                fill="none"-->
        <!--                viewBox="0 0 24 24"-->
        <!--                stroke-width="1.5"-->
        <!--                stroke="currentColor"-->
        <!--                class="h-5 w-5 animate-spin"-->
        <!--              >-->
        <!--                <path-->
        <!--                  stroke-linecap="round"-->
        <!--                  stroke-linejoin="round"-->
        <!--                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"-->
        <!--                />-->
        <!--              </svg>-->
        <!--            </NoticeCard>-->
        <!--          {:then topics}-->
        <!--            {#each topics as topic}-->
        <!--              <TopicCard {topic}>-->
        <!--                <input-->
        <!--                  type="checkbox"-->
        <!--                  class="cardly-checkbox"-->
        <!--                  value={topic.description}-->
        <!--                  bind:group={selectedTopicsTexts}-->
        <!--                  on:click|stopPropagation-->
        <!--                />-->
        <!--              </TopicCard>-->
        <!--            {/each}-->
        <!--          {:catch error}-->
        <!--            {error.message}-->
        <!--          {/await}-->
        <!--        </div>-->

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
        <!--      {#each deck.topics as topic}-->
        <!--        <EditableTopic {topic} />-->
        <!--      {:else}-->
        <!--        <NoticeCard>No topics found.</NoticeCard>-->
        <!--      {/each}-->
        <!--    </div>-->
        <!--  </div>-->
        <!--      </Dropdown>-->

        <!--      <textarea-->
        <!--        placeholder="Paste your summary text here."-->
        <!--        class="cardly-input"-->
        <!--        bind:value={text}-->
        <!--      />-->

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
            disabled={!text || tokens > 4000}
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

        {#if loading}
          <NoticeCard>
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
            <span class="flex flex-grow items-center justify-between">
              <span>Generating cards</span>
              <button class="cardly-button" on:click={cancelGeneration}> Cancel </button>
            </span>
          </NoticeCard>
        {/if}

        {#each errors as error, index}
          <NoticeCard>
            <button
              slot="icon"
              on:click={() => {
                // TODO: Clean up
                errors.splice(index, 1);
                errors = errors;
              }}
            >
              <svg
                class="h-5 w-5 min-w-[20px] text-red-400"
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
            {error}
          </NoticeCard>
        {/each}
      </div>
    </Dropdown>
  {:else}
    <NoticeCard>Provide an OpenAI API Key to generate cards.</NoticeCard>
  {/if}

  {#if generatedCards.length}
    <Dropdown title="Generated Cards" open>
      {#each generatedCards as card, index (card.id)}
        <div
          in:receive={{ key: card.id }}
          out:send={{ key: card.id }}
          animate:flip={{ duration: 350 }}
        >
          <EditableCard {card} {index} on:delete={() => deleteCard(card)}>
            <button class="cardly-button" on:click={() => (card.approved = true)}>Approve</button>
          </EditableCard>
        </div>
      {/each}
    </Dropdown>
  {/if}

  <Dropdown open>
    <div slot="title" class="flex w-full items-center justify-between">
      <h3 class="text-sm font-semibold text-neutral-500">Cards</h3>
      <div class="flex items-center gap-2">
        <!--        <TopicSelection bind:group={$local.selectedTopics} topics={deck.topics} />-->
        <button
          class="cardly-button flex items-center justify-between gap-2 !p-2.5"
          on:click|stopPropagation={() => createEmptyCard()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="h-4 w-4"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <button
          class="cardly-button flex w-full items-center justify-between gap-2"
          on:click|stopPropagation={() => goto(`/${deck.id}/learn`)}
          disabled={!approvedCards.length}
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
      {#each approvedCards as card, index (card.id)}
        <div
          in:receive={{ key: card.id }}
          out:send={{ key: card.id }}
          animate:flip={{ duration: 350 }}
        >
          <EditableCard {card} {index} on:delete={() => deleteCard(card)} />
        </div>
      {:else}
        <NoticeCard>No cards found.</NoticeCard>
      {/each}
    </div>
  </Dropdown>

  <Dropdown title="Hidden Cards">
    {#each hiddenCards as card, index (card.id)}
      <div
        in:receive={{ key: card.id }}
        out:send={{ key: card.id }}
        animate:flip={{ duration: 350 }}
      >
        <EditableCard {card} {index} on:delete={() => deleteCard(card)} />
      </div>
    {/each}
  </Dropdown>
</main>
