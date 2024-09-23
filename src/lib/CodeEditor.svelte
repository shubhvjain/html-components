<script>
  import CodeMirror, { basicSetup } from "$lib/CodeMirror.svelte";
  import { onMount } from "svelte";
  // import * as acorn from 'acorn'; // For JS syntax checking

  export let language = ""; // default language
  export let code = ""; // initial code

  onMount(() => {
    if (typeof code != "string") {
      valid = false;
      error_message = "Invalid input. Must be a string";
      throw new Error("Invalid code. It must be a string");
    }
  });

  export let valid = true;
  let store;
  let error_message = "Invalid code";
  let validCode = "";
  // validateSyntax()
  // Syntax validation function
  function validateSyntax() {
    try {
      if (language == "json") {
        let sample_json = JSON.parse($store);
        // Assign valid code if no error
      }
      valid = true;
      code = $store;
    } catch (err) {
      valid = false; // Syntax error found
      code = $store;
    }
  }

  $: if ($store) validateSyntax();
</script>

<CodeMirror doc={code} extensions={basicSetup} bind:docStore={store} />

{code}

{#if !valid}
  <p class="text-danger">{error_message}</p>
{/if}

<style>
</style>
