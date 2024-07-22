<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion';
  import { LandPlot, Layers, LibraryBig, Settings, Wallet } from '$lib/icons';
  import NavigationLink from '$lib/components/NavigationLink.svelte';
  import { Separator } from '$lib/components/ui/separator';
</script>

<div class="mx-auto flex max-w-7xl">
  <nav
    class="flex flex-col items-center gap-1 p-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
  >
    <NavigationLink variant="default" icon={Layers} title="Home" href="/" />
    <Separator class="mt-2" />
    <NavigationLink icon={LibraryBig} title="Library" href="/library" />
    <NavigationLink icon={LandPlot} title="Start Learning" href="/learning" />
    <Separator />
    <NavigationLink icon={Wallet} title="Billing" href="/billing" />
    <NavigationLink icon={Settings} title="Settings" href="/settings" />
  </nav>

  <div class="h-screen">
    <Separator orientation="vertical" class="block" />
  </div>

  <Accordion.Root class="w-full sm:max-w-[70%]">
    <Accordion.Item value="item-1">
      <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
      <Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Trigger>Is it styled?</Accordion.Trigger>
      <Accordion.Content>
        Yes. It comes with default styles that matches the other components' aesthetic.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.Trigger>Is it animated?</Accordion.Trigger>
      <Accordion.Content>Yes. It's animated by default, but you can disable it if you prefer.</Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</div>
