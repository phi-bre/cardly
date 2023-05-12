<script lang="ts">
  export let progress: number;
</script>

<div class="h-2 overflow-hidden rounded-full bg-neutral-300 dark:bg-neutral-700">
  <div class="h-2 rounded-full bg-lime-500 transition-all" style:width="{progress * 100}%">
    &nbsp;
  </div>
</div>
