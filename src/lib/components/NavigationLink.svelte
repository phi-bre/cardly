<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';

  let route = $props<{
    icon: object;
    title: string;
    href: string;
    variant?: 'default' | 'ghost' | 'secondary';
    label?: string;
  }>();
</script>

<Tooltip.Root openDelay={0}>
  <Tooltip.Trigger asChild let:builder>
    <Button href={route.href} builders={[builder]} variant={route.variant || 'ghost'} size="icon" class="size-9">
      <svelte:component this={route.icon} class="size-5" aria-hidden="true" />
      <span class="sr-only">{route.title}</span>
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content side="right" class="flex items-center gap-4 font-semibold">
    {route.title}
    {#if route.label}
      <span class="ml-auto text-muted-foreground">
        {route.label}
      </span>
    {/if}
  </Tooltip.Content>
</Tooltip.Root>
