<script lang="ts">
  import { page } from '$app/stores';
</script>

<main class="min-w-screen flex min-h-[80vh] flex-col items-center justify-center">
  <h1 class="animate-pulse text-9xl">{$page.status}</h1>
  <p class="text-2xl text-neutral-500">{$page.error?.message}</p>
</main>
