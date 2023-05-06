<script lang="ts">
  import type { Quiz } from '../interfaces';
  import Question from '$lib/Question.svelte';
  import { generatePrompt } from '../prompt';
  import { Configuration, OpenAIApi, type Model } from 'openai';
  import { local, remote } from '../storage';

  let selectedQuizzes: string[] = [];
  let index = 0;
  let correct = [];
  let wrong = [];
  let availableModels: Model[] = [];
  let modelId = '';
  let openai: OpenAIApi | null = null;
  let loadingQuizzesCount = 0;

  $: questions = $remote.quizzes
    .filter((quiz) => selectedQuizzes.includes(quiz.title))
    .flatMap((quiz) => quiz.questions);

  $: if ($local.apiKey && $local.organization) {
    openai = new OpenAIApi(
      new Configuration({ apiKey: $local.apiKey, organization: $local.organization }),
    );
  }

  $: if (openai) getModels();
  $: console.log(modelId);

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

  async function getModels() {
    if (!openai) return;

    const { data } = await openai.listModels();
    availableModels = data.data.sort((a, b) => a.id.localeCompare(b.id));
    const [bestModel] = availableModels.filter((model) => model.id.includes('gpt'));
    modelId = bestModel.id;
  }

  async function generateQuiz() {
    if (!openai) return;

    loadingQuizzesCount++;

    const prompt = await generatePrompt($local.url);
    const { data } = await openai.createChatCompletion({
      messages: [{ role: 'user', content: prompt }],
      model: modelId,
    });

    console.log(data);

    try {
      const quiz = JSON.parse(data.choices[0]?.message?.content || '{}') as Quiz;
      // TODO: Verify quiz structure
      $remote.quizzes.push(quiz);
    } catch (e) {
      console.error(e);
    } finally {
      loadingQuizzesCount--;
    }
  }

  // onMount(async () => {
  //   quizzes = await Promise.all(
  //     [
  //       '/quizzes/WING/4-P-Mix.md.gpt.json',
  //       '/quizzes/WING/Basics.md.gpt.json',
  //       '/quizzes/WING/Kalkulation.md.gpt.json',
  //       '/quizzes/WING/Markenführung.md.gpt.json',
  //       '/quizzes/WING/Marketing.md.gpt.json',
  //       '/quizzes/WING/Materialwirtschaft.md.gpt.json',
  //     ].map((url) => fetch(url).then((res) => res.json())),
  //   );
  // });
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<div class="container m-auto py-4 md:py-16 px-8">
  <div class="mb-16">
    <input
      class="cardly-input w-full mb-1"
      type="text"
      placeholder="URL like https://raw.githubusercontent.com/Seppli11/ZHAW-Summary/main/summaries/23FS/SWEN2/Extreme%20Programming.md"
      bind:value={$local.url}
    />

    {#if $local.url}
      <input
        class="cardly-input w-full mb-1"
        type="text"
        placeholder="OpenAI API Key"
        bind:value={$local.apiKey}
      />
      <input
        class="cardly-input w-full mb-1"
        type="text"
        placeholder="OpenAI Organisation"
        bind:value={$local.organization}
      />

      {#if openai}
        <div class="flex gap-1">
          <select class="cardly-input w-1/2" bind:value={modelId}>
            {#each availableModels as model}
              <option value={model.id}>{model.id}</option>
            {/each}
            <option value="">Choose model</option>
          </select>
          <button
            class="cardly-button w-1/2"
            disabled={!modelId || !$local.url}
            on:click={generateQuiz}
          >
            Generate
          </button>
        </div>
      {/if}
    {/if}

    {#if loadingQuizzesCount > 0}
      <div class="flex justify-between p-1">
        <p class="text-sm text-gray-400">
          Loading {loadingQuizzesCount} quiz{loadingQuizzesCount > 1 || loadingQuizzesCount === 0
            ? 'zes'
            : ''}...
        </p>
        <svg
          class="fill-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          width="24"
          viewBox="0 96 960 960"
        >
          <path
            d="M196 725q-20-36-28-72.5t-8-74.5q0-131 94.5-225.5T480 258h43l-80-80 39-39 149 149-149 149-40-40 79-79h-41q-107 0-183.5 76.5T220 578q0 29 5.5 55t13.5 49l-43 43Zm280 291L327 867l149-149 39 39-80 80h45q107 0 183.5-76.5T740 577q0-29-5-55t-15-49l43-43q20 36 28.5 72.5T800 577q0 131-94.5 225.5T480 897h-45l80 80-39 39Z"
          />
        </svg>
      </div>
    {/if}
  </div>
  <div class="flex items-center my-4 gap-2 flex-wrap">
    {#each $remote.quizzes as quiz}
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
