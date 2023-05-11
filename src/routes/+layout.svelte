<script>
  import '../app.css';
  import { remote } from '../storage';

  $: collection = $remote.collection;
</script>

{#if collection.topics?.length}
  <slot />
{/if}
