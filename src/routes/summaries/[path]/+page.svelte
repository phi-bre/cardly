<script lang="ts">
  import { page } from '$app/stores';
  import Markdown from '$lib/Markdown.svelte';
  import type { Topic } from '../../../interfaces';
  import { nanoid } from 'nanoid';

  $: path = $page.params.path;

  function splitMarkdownToTopics(markdown: string): Topic[] {
    const lines = markdown.split('\n');
    let currentTopic: Topic | null = null;
    let topics: Topic[] = [];

    for (const line of lines) {
      if (line.startsWith('# ')) {
        if (currentTopic !== null) {
          topics.push(currentTopic);
        }

        currentTopic = {
          id: nanoid(),
          title: line.substring(2).trim(),
          description: '',
        };
      } else if (currentTopic !== null) {
        currentTopic.description += line + '\n';
      }
    }

    if (currentTopic !== null) {
      topics.push(currentTopic);
    }

    return topics;
  }
</script>

{#await fetch(`/summaries/${path}/summary.md`).then((r) => r.text())}
  <p>loading...</p>
{:then summary}
  <!--{JSON.stringify(extractHeadings(summary))}-->
  {#each splitMarkdownToTopics(summary) as section}
    <h1 class="my-6 text-xl font-bold text-teal-500" id={section.title}>{section.title}</h1>
    <Markdown value={section.description} />
  {/each}
  <!--  <Markdown value={summary} />-->
{:catch error}
  <p>error: {error.message}</p>
{/await}
