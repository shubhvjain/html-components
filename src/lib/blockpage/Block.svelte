<script>
  import { onMount } from 'svelte';
  import { EditorView,keymap } from '@codemirror/view';
  import {indentWithTab} from "@codemirror/commands"
  import { EditorState } from '@codemirror/state';
  export let content = "";
  export let onKeyDown = () => {};
  export let onContentChange = () => {};
  export let id; 
  export let bindView;  
  export let options = {}
  import { basicSetup } from 'codemirror'

  import {example} from './blocklang.js';  // Import your custom language extension

  let editor;
  let view;
  let isValid = true; // Flag for validity
  let textErrors = [];

  function validateContent(text) {
    let errors = [];
    const hasDoubleNewlines = text.includes('\n\n');
    if (hasDoubleNewlines) {
      errors.push("A block cannot have a blank line");
    }
    const isNotEmpty = text.trim() !== "";
    let validity = isNotEmpty && !hasDoubleNewlines;
    return { validity, errors }; // Valid if not empty and no double newlines
  }

  function checkValidity() {
    let v = validateContent(content);
    isValid = v.validity;
    textErrors = v.errors;
    onContentChange(content, isValid);
  }

  onMount(() => {
  //console.log(parser.parse('one 2 "three"').toString())
    view = new EditorView({
      state: EditorState.create({
        doc: content,
        extensions: [
          example(),
          basicSetup,
          EditorView.lineWrapping,
          keymap.of([indentWithTab]),
          EditorView.updateListener.of(update => {
            if (update.changes) {
              content = update.state.doc.toString(); // Update local content
            }
          })
        ]
      }),
      parent: editor
    });

    bindView(view);

    editor.addEventListener('focusout', checkValidity);
  });

  $: {
    if (view && content !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: content }
      });
    }
  }
</script>

<div bind:this={editor} id={id} class:error="{!isValid}" tabindex="0" on:keydown={onKeyDown} spellcheck="true"></div>
{#if !isValid}
  <small class="text-danger" role="alert">{textErrors.join(",")}</small>
{/if}

<style>
  .error {
    outline: 1px solid var(--bs-danger);
  }
</style>
