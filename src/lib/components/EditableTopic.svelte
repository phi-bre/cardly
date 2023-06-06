<script lang="ts">
  import type { Topic } from '$lib/interfaces';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let topic: Topic;
</script>

<div class="flex flex-col gap-2 pb-4">
  <div class="flex items-center gap-2">
    <input type="text" class="cardly-input" bind:value={topic.title} placeholder="Topic title" />
    <button on:click={() => dispatch('delete')}>
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
  <!--  <textarea-->
  <!--    class="cardly-input h-64"-->
  <!--    bind:value={topic.description}-->
  <!--    placeholder="Topic description or summary"-->
  <!--  />-->
</div>
