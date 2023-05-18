<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { fly } from 'svelte/transition';
</script>

<div class="container m-auto max-w-5xl px-8 py-4 md:py-16">
  {#key $page.url.pathname}
    <div in:fly={{ y: 50, delay: 1, duration: 250 }}>
      <slot />
    </div>
  {/key}
</div>
