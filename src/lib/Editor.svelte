<script lang="ts">
  import { type Extension, Compartment } from '@codemirror/state';
  import { onMount } from 'svelte';
  import { clickoutside } from '$lib/use/clickoutside';
  import { minimalSetup } from 'codemirror';
  import { yCollab } from 'y-codemirror.next';
  import { EditorView, placeholder as holder } from '@codemirror/view';

  export let text: BlockText;
  export let placeholder = '';
  export let extensions: Extension[] = [];
  export let wrap = true;

  let div: HTMLDivElement;
  let view: EditorView | undefined;
  let wrapping = new Compartment();

  onMount(() => {
    view = new EditorView({
      parent: div,
      doc: $text.value,
      extensions: [
        minimalSetup,
        holder(placeholder),
        wrapping.of(wrap ? EditorView.lineWrapping : []),
        yCollab(text.y, $workspace.rtc.awareness, { undoManager: $workspace.history } as any),
        ...extensions,
      ],
    });

    return () => view!.destroy();
  });

  $: if (view) {
    view.dispatch({
      effects: wrapping.reconfigure(wrap ? EditorView.lineWrapping : []),
    });
  }
</script>

<div
  class="editor {$$restProps.class || ''}"
  bind:this={div}
  use:clickoutside
  on:clickoutside={blur}
/>
