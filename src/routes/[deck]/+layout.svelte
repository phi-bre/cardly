<script lang="ts">
  import { page, navigating } from '$app/stores';
  import { synced } from '../../storage';

  $: valid = $navigating ? !!$navigating.to.params.deck : true; // TODO: Figure out what is fucking happening here
</script>

{#if valid && $page.params.deck in $synced.decks}
  <slot />
{:else}
  <!-- TODO: redirect to 404 page -->
  <p>Deck not found</p>
{/if}
