<script lang="ts">
  import type { Question } from '../interfaces';

  export let question: Question;
  export let topics: string[] = [];
  
  let open = false;
  let search = '';

  $: searchedTopics = topics.filter((topic) => topic.toLowerCase().includes(search.toLowerCase()));
</script>

<div class="relative">
  {#if open}
    <div class="absolute top-5 left-auto z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700">
      <div class="p-3">
        <label for="input-group-search" class="sr-only">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              /></svg
            >
          </div>
          <input
            bind:value={search}
            type="text"
            class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
            placeholder="Search topic"
          />
        </div>
      </div>
      <ul class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
        {#each searchedTopics as topic}
          <li>
            <div class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
              <input
                id="checkbox-{topic}"
                type="checkbox"
                bind:group={question.topics}
                value={topic}
                class="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              />
              <label
                for="checkbox-{topic}"
                class="w-full py-2 ml-2 text-xs font-medium text-gray-900 rounded dark:text-gray-300"
              >
                {topic}
              </label>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<button
  class="hover:bg-neutral-200 rounded p-1 flex gap-1"
  type="button"
  on:click={() => (open = !open)}
>
  {#each question.topics as topic}
    <span class="text-xs p-0.5 px-2 font-medium rounded-full bg-teal-500/20 text-teal-500 truncate">
      {topic}
    </span>
  {:else}
    <span class="text-xs text-neutral-500">No topics</span>
  {/each}
</button>
