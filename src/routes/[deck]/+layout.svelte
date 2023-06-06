<script lang="ts">
  import { page, navigating } from '$app/stores';
  import { synced } from '$lib/storage';
  import {fade} from 'svelte/transition';
  import NoticeCard from '../../lib/components/NoticeCard.svelte';
</script>

{#if $page.params.deck in { ...$synced.decks }}
  <slot />
{:else}
  <div>
    <NoticeCard>
      This deck does not exist.
    </NoticeCard>
  </div>
{/if}
