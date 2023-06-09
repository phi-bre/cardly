<script lang="ts">
  import type { Topic } from '$lib/interfaces';
  import { nanoid } from 'nanoid';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let topics: Topic[];
  export let group: string[];

  let open = false;
  let search = '';

  $: searchedTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase()),
  );
  $: selectedTopics = topics.filter((topic) => group.includes(topic.id));

  function createTopic() {
    const title = search.trim();
    const id = nanoid();
    if (!title) return;
    const topic: Topic = {
      id: id,
      title: title,
      description: '',
    };
    dispatch('create', topic);
    search = '';
  }
</script>

<div class="relative">
  {#if open}
    <div class="absolute left-auto top-5 z-10 w-60 rounded-lg bg-white shadow dark:bg-neutral-600">
      <div class="p-3">
        <label for="input-group-search" class="sr-only">Search</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              class="h-5 w-5 text-neutral-500 dark:text-neutral-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            bind:value={search}
            type="text"
            class="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 pl-10 text-sm text-neutral-900 focus:border-neutral-500 focus:ring-neutral-500 dark:border-neutral-500 dark:bg-neutral-600 dark:text-white dark:placeholder-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-500"
            placeholder="Search topic"
          />
        </div>
      </div>
      <ul class="h-48 overflow-y-auto px-3 pb-3 text-sm text-neutral-700 dark:text-neutral-200">
        {#each searchedTopics as topic}
          <li>
            <div
              class="flex items-center rounded pl-2 hover:bg-neutral-100 dark:hover:bg-neutral-600"
            >
              <input
                id="checkbox-{topic.id}"
                type="checkbox"
                checked={group.includes(topic.id)}
                on:input={() => dispatch('toggle', topic.id)}
                class="cardly-checkbox"
              />
              <label
                for="checkbox-{topic.id}"
                class="ml-2 w-full rounded py-2 text-xs font-medium text-neutral-900 dark:text-neutral-300"
              >
                {topic.title}
              </label>
            </div>
          </li>
        {:else}
          <li class="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
            <!--            <button class="max-w-full flex items-center justify-between" on:click={createTopic}>-->
            <!--              {#if search}-->
            <!--                <span class="truncate">Create "{search}"</span>-->
            <!--              {:else}-->
            <!--                <span>Create new topic</span>-->
            <!--              {/if}-->
            <!--              <svg-->
            <!--                xmlns="http://www.w3.org/2000/svg"-->
            <!--                fill="none"-->
            <!--                viewBox="0 0 24 24"-->
            <!--                stroke-width="1.5"-->
            <!--                stroke="currentColor"-->
            <!--                class="-mr-1 h-4 w-4"-->
            <!--              >-->
            <!--                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />-->
            <!--              </svg>-->
            <!--            </button>-->
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<button
  class="flex flex-nowrap gap-1 whitespace-nowrap rounded-lg p-1 transition-colors duration-200 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-700/50"
  type="button"
  on:click|stopPropagation={() => (open = !open)}
>
  <span
    class="truncate rounded-full bg-neutral-500/20 p-0.5 px-2 text-xs font-medium text-neutral-500"
  >
    {#if selectedTopics.length}
      {selectedTopics[0].title}
      {#if selectedTopics.length > 1}
        + {selectedTopics.length - 1} more
      {/if}
      <!--{#each selectedTopics as topic}-->
      <!--  <span class="truncate rounded-full bg-neutral-500/20 p-0.5 px-2 text-xs font-medium text-neutral-500">-->
      <!--    {topic.title}-->
      <!--  </span>-->
    {:else}
      No topic
    {/if}
  </span>
</button>
