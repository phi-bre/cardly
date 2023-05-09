<script lang="ts">
  import type { Quiz } from '../interfaces';
  import { generatePrompt, patchQuizAndQuestionIds } from '../prompt';
  import { Configuration, OpenAIApi, type Model } from 'openai';
  import { local, remote } from '../storage';

  let availableModels: Model[] = [];
  let openai: OpenAIApi | null = null;
  let loadingQuizzesCount = 0;
  let modelId = '';

  $: if ($local.apiKey && $local.organization) {
    openai = new OpenAIApi(
      new Configuration({ apiKey: $local.apiKey, organization: $local.organization }),
    );
  }
  $: if (openai) getModels();

  async function getModels() {
    if (!openai) return;

    const { data } = await openai.listModels();
    availableModels = data.data.sort((a, b) => a.id.localeCompare(b.id));
    const [bestModel] = availableModels
      .filter((model) => model.id.includes('gpt'))
      .sort()
      .reverse();
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
      const quiz = patchQuizAndQuestionIds(
        JSON.parse(data.choices[0]?.message?.content || '{}') as Quiz,
      );
      // TODO: Verify quiz structure
      $remote.quizzes.push(quiz);
    } catch (e) {
      console.error(e);
    } finally {
      loadingQuizzesCount--;
    }
  }
</script>

<label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
  Generate
</label>
<div class="w-full relative mb-2">
  <input
    type="text"
    placeholder="URL like https://raw.githubusercontent.com/Seppli11/ZHAW-Summary/main/summaries/23FS/SWEN2/Extreme%20Programming.md"
    bind:value={$local.url}
    id="search"
    class="block w-full !p-4 !pr-32 text-sm rounded-lg cardly-input"
  />
  <button
    class="cardly-button absolute right-2.5 bottom-2.5"
    disabled={!modelId || !$local.url}
    on:click={generateQuiz}
  >
    Generate
  </button>
</div>

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
