<script lang="ts">
  export let progress: number;
</script>

<div class="bg-neutral-300 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
  <div class="bg-teal-500 h-2 rounded-full transition-all" style:width="{progress * 100}%">
    &nbsp;
  </div>
</div>
