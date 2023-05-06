<script>
  import { createEventDispatcher } from 'svelte';

  export let question;

  const dispatch = createEventDispatcher();

  function shuffle(array) {
    return array
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

  $: shuffledAnswers = shuffle(question.a);
</script>

<p class='my-4 text-lg min-h-[96px] font-semibold'>{question.q}</p>
<div class='grid md:grid-cols-2 gap-2'>
  {#each shuffledAnswers as answer}
    <button
      class='bg-shark-400 p-4 px-6 rounded text-left hover:bg-malibu font-bold transition-colors'
      on:click={() => dispatch('answer', answer)}
    >
      {answer}
    </button>
  {/each}
</div>
