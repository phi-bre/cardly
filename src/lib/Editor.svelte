<script lang="ts">
  import { type Extension, Compartment } from '@codemirror/state';
  import { createEventDispatcher, onMount } from 'svelte';
  import { minimalSetup } from 'codemirror';
  import { yCollab } from 'y-codemirror.next';
  import { EditorView, placeholder as holder } from '@codemirror/view';
  import { webrtc } from '../storage';
  import { Text } from 'yjs';
  import { markdown } from '@codemirror/lang-markdown';
  import { basicDark } from 'cm6-theme-basic-dark';

  const dispatch = createEventDispatcher();

  export let text: Text;
  export let placeholder = '';
  export let extensions: Extension[] = [];
  export let wrap = true;

  let div: HTMLDivElement;
  let view: EditorView | undefined;
  let wrapping = new Compartment();

  onMount(() => {
    view = new EditorView({
      parent: div,
      doc: text.toString(),
      extensions: [
        minimalSetup,
        holder(placeholder),
        wrapping.of(wrap ? EditorView.lineWrapping : []),
        yCollab(text, webrtc.awareness),
        markdown(),
        basicDark,
        ...extensions,
      ],
      dispatch(transaction) {
        view.update([transaction]);

        if (!transaction.isUserEvent('select')) return true;
        const from = transaction.selection.ranges[0].from;
        const to = transaction.selection.ranges[0].to;
        dispatch('select', {
          from,
          to,
          value: text.toString().slice(from, to),
        });
      },
    });
    view;

    return () => view!.destroy();
  });

  $: if (view) {
    view.dispatch({
      effects: wrapping.reconfigure(wrap ? EditorView.lineWrapping : []),
    });
  }
</script>

<div class="editor overflow-hidden rounded-lg" bind:this={div} />
