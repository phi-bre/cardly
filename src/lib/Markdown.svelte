<script context="module">
  import 'katex/dist/katex.min.css';
  import 'highlight.js/styles/atom-one-dark-reasonable.css';

  const promise = Promise.all([
    import('markdown-it'),
    import('markdown-it-katex'),
    import('markdown-it-highlightjs'), // TODO: Reduce bundle size
  ])
    .then((mds) => mds.map((m) => m.default))
    .then(([md, mk, mh]) =>
      md({
        html: false,
        linkify: true,
        typographer: true,
      })
        .use(mk)
        .use(mh),
    );
</script>

<script lang="ts">
  export let value = '';
</script>

<div
  class="cardly-markdown prose prose-neutral dark:prose-invert prose-code:text-teal-200 prose-code:bg-neutral-900 prose-code:rounded prose-code:p-0.5 prose-code:px-1.5 prose-code:before:content-none prose-code:after:content-none"
>
  {#await promise}
    <p>Loading...</p>
  {:then markdown}
    {@html markdown.render(value)}
  {:catch error}
    <p>{error.message}</p>
  {/await}
</div>

<style>
  :global(.cardly-markdown .hljs) {
    background-color: transparent !important;
  }
</style>
