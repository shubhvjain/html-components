<script>
  import { onMount, onDestroy } from "svelte";
  import { EditorState } from "@codemirror/state";
  import { EditorView, keymap, lineNumbers } from "@codemirror/view";
  import { defaultKeymap } from "@codemirror/commands";

  export let text = ""; // Text input to the editor
  
  let editorContainer; // Container to mount CodeMirror editor
  let editorView; // Reference to the editor instance

  // Create and mount the editor when the component is mounted
  onMount(() => {
    const startState = EditorState.create({
      doc: text,
      extensions: [
        keymap.of(defaultKeymap), // Keymap for standard commands
        EditorView.editable.of(true), // Make editor editable
        EditorView.lineWrapping, // Wrap lines
        lineNumbers(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            // Update text directly when the document changes
            text = editorView.state.doc.toString(); // Update the bound text prop
          }
        })
      ]
    });

    // Initialize EditorView and mount it to the editorContainer
    editorView = new EditorView({
      state: startState,
      parent: editorContainer
    });
  });

  // Clean up the editor instance on component destroy
  onDestroy(() => {
    editorView?.destroy(); // Cleanup editor on component destroy
  });

  // Reactive statement to update the editor when the text prop changes
  $: if (editorView && editorView.state.doc.toString() !== text) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: text // Update the editor's document to reflect the new text
      }
    });
  }
</script>

<div bind:this={editorContainer}></div>

<style>
  /* Add any additional styles here */
  
</style>
