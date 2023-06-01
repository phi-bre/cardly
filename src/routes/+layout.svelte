<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { fly } from 'svelte/transition';
</script>

<div class="container m-auto max-w-5xl px-3 py-4 md:px-8 md:py-16">
  <slot />
</div>
