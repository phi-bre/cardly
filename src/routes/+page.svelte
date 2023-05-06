<script lang="ts">
  import type { Quiz } from '../interfaces';
  import Question from '$lib/Question.svelte';
  import { onMount } from 'svelte';
  import { generatePrompt } from '../prompt';
  import { Configuration, OpenAIApi } from 'openai';
  import { fly } from 'svelte/transition';

  let quizzes: Quiz[] = [];
  let selectedQuizzes: string[] = [];
  let index = 0;
  let correct = [];
  let wrong = [];
  let apiKey = '';
  let organization = '';
  let url = '';
  let modelId = '';
  let openai: OpenAIApi | null = null;

  $: questions = quizzes
    .filter((quiz) => selectedQuizzes.includes(quiz.title))
    .flatMap((quiz) => quiz.questions);

  $: if (apiKey && organization) {
    openai = new OpenAIApi(new Configuration({ apiKey, organization }));
    modelId = '';
  }

  function nextQuestion() {
    index++;
  }

  function checkAnswer({ detail: answer }: CustomEvent<string>) {
    if (answer === questions[index].a[0]) {
      correct.push(index);
    } else {
      wrong.push(index);
    }
    nextQuestion();
  }

  function restart() {
    index = 0;
    correct = [];
    wrong = [];
  }

  async function generateQuiz() {
    if (!openai) return;

    const prompt = await generatePrompt(url);
    const { data } = await openai.createChatCompletion({
      messages: [{ role: 'user', content: prompt }],
      model: modelId,
    });
    const quiz = JSON.parse(data.choices[0]?.message?.content || '{}') as Quiz;
    // TODO: Verify quiz structure
    quizzes = [...quizzes, quiz];
  }

  onMount(async () => {
    quizzes = await Promise.all(
      [
        '/quizzes/WING/4-P-Mix.md.gpt.json',
        '/quizzes/WING/Basics.md.gpt.json',
        '/quizzes/WING/Kalkulation.md.gpt.json',
        '/quizzes/WING/Markenführung.md.gpt.json',
        '/quizzes/WING/Marketing.md.gpt.json',
        '/quizzes/WING/Materialwirtschaft.md.gpt.json',
      ].map((url) => fetch(url).then((res) => res.json())),
    );
  });
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<div class="container m-auto py-4 md:py-16 px-8">
  <div class="mb-16">
    <input class="w-full mb-1" type="text" placeholder="URL" bind:value={url} />

    {#if url}
      <input
        transition:fly
        class="w-full mb-1"
        type="text"
        placeholder="OpenAI API Key"
        bind:value={apiKey}
      />
      <input
        transition:fly
        class="w-full mb-1"
        type="text"
        placeholder="OpenAI Organisation"
        bind:value={organization}
      />
    {/if}

    {#if openai}
      {#await openai.listModels()}
        Loading available models...
      {:then data}
        <select bind:value={modelId}>
          {#each data?.data?.data || [] as model}
            <option value={model.id}>{model.id}</option>
          {/each}
        </select>
        <button disabled={!modelId || !url} on:click={generateQuiz}>Generate</button>
      {/await}
    {/if}
  </div>
  <div class="flex items-center my-4 gap-2 flex-wrap">
    {#each quizzes as quiz}
      <label
        class="cursor-pointer select-none bg-malibu/20 text-malibu font-semibold text-sm rounded p-2 px-3"
        for={quiz.title}
        class:!bg-shark-400={!selectedQuizzes.includes(quiz.title)}
        class:!text-shark-50={!selectedQuizzes.includes(quiz.title)}
      >
        <input
          class="mr-1"
          type="checkbox"
          id={quiz.title}
          bind:group={selectedQuizzes}
          value={quiz.title}
        />
        {quiz.title}
      </label>
    {/each}
  </div>

  <div class="bg-shark-400 rounded-full h-2 overflow-hidden">
    <div
      class="bg-malibu h-2 rounded-full transition-all"
      style:width="{(100 / questions.length) * index}%"
    >
      &nbsp;
    </div>
  </div>
  {#if index < questions.length}
    <Question question={questions[index]} on:answer={checkAnswer} />
  {:else if questions.length === 0}
    <p class="my-4 text-lg min-h-[96px] font-semibold">Select a quiz to get started.</p>
  {:else}
    <p class="my-4 text-lg min-h-[96px] font-semibold">
      You scored {correct.length} out of {questions.length}.
    </p>
    <button
      class="bg-shark-400 p-4 px-6 rounded text-left hover:bg-malibu font-bold transition-colors"
      on:click={restart}
    >
      Restart
    </button>
  {/if}
</div>
