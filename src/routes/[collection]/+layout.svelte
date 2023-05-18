<script lang="ts">
  import { getCollectionStore } from '../../storage';
  import { setContext } from 'svelte';
  import { page } from '$app/stores';

  $: collectionStore = getCollectionStore($page.params.collection);
  $: setContext('collection', collectionStore);
</script>

<slot />
